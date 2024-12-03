import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import type { CallbackResponse } from '@/types/mpesa';

export async function POST(request: Request) {
  try {
    const body = await request.json() as CallbackResponse;
    
    logger.info('M-PESA Callback received', body);

    const { stkCallback } = body.Body;
    const { ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    // Process the callback based on the result code
    if (ResultCode === 0) {
      // Successful transaction
      const metadata = CallbackMetadata?.Item.reduce((acc: Record<string, any>, item) => {
        acc[item.Name] = item.Value;
        return acc;
      }, {});

      logger.info('Transaction successful', {
        ...metadata,
        ResultDesc,
      });

      // Here you would typically:
      // 1. Update your database with the transaction details
      // 2. Send notifications to the user
      // 3. Update your application state
    } else {
      // Failed transaction
      logger.warn('Transaction failed', {
        ResultCode,
        ResultDesc,
      });
    }
    
    // Always respond with success to acknowledge receipt
    return NextResponse.json(
      { ResultCode: 0, ResultDesc: 'Callback processed successfully' },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Error processing M-PESA callback:', error);
    // Still return success to acknowledge receipt
    return NextResponse.json(
      { ResultCode: 0, ResultDesc: 'Callback received' },
      { status: 200 }
    );
  }
} 