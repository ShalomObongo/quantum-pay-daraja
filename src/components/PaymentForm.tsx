import { useState } from 'react';
import { logger } from '@/lib/logger';

interface PaymentFormProps {
  onSubmit: (data: {
    amount: number;
    phoneNumber: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export function PaymentForm({ onSubmit, isLoading }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^(?:\+254|0|254)?[17]\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid Safaricom number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logger.debug('Form submission attempted', formData);

    if (!validateForm()) {
      logger.warn('Form validation failed', { errors });
      return;
    }

    try {
      // Format phone number to include country code
      const formattedPhoneNumber = formData.phoneNumber.replace(/^(?:\+254|0|254)?(\d{9})$/, '254$1');
      
      await onSubmit({
        amount: Number(formData.amount),
        phoneNumber: formattedPhoneNumber,
      });
      
      // Reset form on successful submission
      setFormData({
        amount: '',
        phoneNumber: '',
      });
      
      logger.info('Payment form submitted successfully');
    } catch (error) {
      logger.error('Error submitting payment form', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-2 text-foreground">
            Amount (KES)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-muted-foreground text-sm">KES</span>
            </div>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={`block w-full pl-12 pr-4 py-3 bg-transparent border ${
                errors.amount ? 'border-red-500' : 'border-border'
              } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors placeholder:text-muted-foreground/50`}
              placeholder="0.00"
              min="1"
              step="any"
            />
          </div>
          {errors.amount && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.amount}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2 text-foreground">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-muted-foreground text-sm">+254</span>
            </div>
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className={`block w-full pl-16 pr-4 py-3 bg-transparent border ${
                errors.phoneNumber ? 'border-red-500' : 'border-border'
              } rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors placeholder:text-muted-foreground/50`}
              placeholder="712345678"
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.phoneNumber}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`relative w-full flex justify-center items-center px-6 py-3 text-base font-medium rounded-lg text-white overflow-hidden transition-all duration-300 ${
          isLoading
            ? 'bg-muted cursor-not-allowed'
            : 'bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transform hover:scale-[1.02]'
        }`}
      >
        <div className="relative z-10 flex items-center">
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isLoading ? 'Processing...' : 'Pay with M-PESA'}
        </div>
        {!isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        )}
      </button>
    </form>
  );
} 