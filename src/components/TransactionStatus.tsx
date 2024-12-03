import { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';

interface TransactionStatusProps {
  checkoutRequestId: string;
  onClose: () => void;
}

export function TransactionStatus({ checkoutRequestId, onClose }: TransactionStatusProps) {
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [message, setMessage] = useState('Processing your payment...');
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    let pollCount = 0;
    const maxPolls = 12; // Maximum number of polling attempts (1 minute)
    const pollInterval = 5000; // Poll every 5 seconds
    let pollTimer: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        logger.debug('Polling transaction status', { checkoutRequestId, pollCount });
        
        const response = await fetch(`/api/mpesa/status/${checkoutRequestId}`);
        const data = await response.json();

        logger.info('Transaction status response received', data);

        // Handle different M-PESA response codes
        switch (data.ResultCode) {
          case '0':
            setStatus('success');
            setMessage('Payment completed successfully!');
            setIsPolling(false);
            break;
          case '1037':
            setStatus('failed');
            setMessage('Unable to reach your phone. Please ensure your phone is on and try again.');
            setIsPolling(false);
            break;
          case '1032':
            setStatus('failed');
            setMessage('Transaction was cancelled.');
            setIsPolling(false);
            break;
          case '1':
            setStatus('failed');
            setMessage('Insufficient funds in your M-PESA account.');
            setIsPolling(false);
            break;
          case 'PENDING':
            // Keep polling if transaction is still processing
            setMessage('Please check your phone and enter M-PESA PIN when prompted...');
            if (pollCount >= maxPolls) {
              setStatus('failed');
              setMessage('Transaction timed out. Please try again.');
              setIsPolling(false);
            }
            break;
          default:
            // Continue polling if within maxPolls
            if (pollCount >= maxPolls) {
              setStatus('failed');
              setMessage('Transaction timed out. Please try again.');
              setIsPolling(false);
            }
        }

        pollCount++;
      } catch (error) {
        logger.error('Error checking transaction status', error);
        if (pollCount >= maxPolls) {
          setStatus('failed');
          setMessage('Failed to check transaction status. Please try again.');
          setIsPolling(false);
        }
      }
    };

    // Start polling
    if (isPolling) {
      pollTimer = setInterval(checkStatus, pollInterval);
      checkStatus(); // Initial check
    }

    return () => {
      if (pollTimer) {
        clearInterval(pollTimer);
      }
    };
  }, [checkoutRequestId, isPolling]);

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: (
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'text-green-500',
          title: 'Payment Successful',
          buttonText: 'Done'
        };
      case 'failed':
        return {
          icon: (
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'text-red-500',
          title: 'Payment Failed',
          buttonText: 'Try Again'
        };
      default:
        return {
          icon: (
            <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ),
          color: 'text-primary',
          title: 'Processing Payment',
          buttonText: 'Please Wait'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity flex items-center justify-center z-50">
      <div className="relative transform overflow-hidden rounded-2xl bg-card p-6 text-center shadow-2xl transition-all sm:p-8 w-full max-w-md mx-4">
        {/* Background glow effect */}
        <div className={`absolute inset-0 pointer-events-none ${config.color} opacity-5 blur-2xl`} />
        
        {/* Content */}
        <div className="relative">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${config.color} bg-opacity-10`}>
            {config.icon}
          </div>
          
          <h3 className="mt-4 text-xl font-semibold text-foreground">
            {config.title}
          </h3>
          
          <p className="mt-2 text-muted-foreground">
            {message}
          </p>

          {status === 'pending' && (
            <div className="mt-6 space-y-2">
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-1/2 animate-progress"></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Waiting for your confirmation...
              </p>
            </div>
          )}

          {!isPolling && (
            <button
              onClick={onClose}
              className={`mt-6 w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                status === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {config.buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 