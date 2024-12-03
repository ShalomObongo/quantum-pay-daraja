import { NextResponse } from 'next/server';
import { mpesaService } from '@/lib/mpesa';
import { STKPushRequest } from '@/types/mpesa';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json() as STKPushRequest;

    // Validate request body
    if (!body.amount || !body.phoneNumber) {
      logger.warn('Invalid request body', body);
      return NextResponse.json(
        { error: 'Amount and phone number are required' },
        { status: 400 }
      );
    }

    if (body.amount < 1) {
      logger.warn('Invalid amount', { amount: body.amount });
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    try {
      const response = await mpesaService.initiateSTKPush({
        ...body,
        amount: Math.round(body.amount), // Ensure whole numbers
        accountReference: body.accountReference || 'QuantumPay',
        transactionDesc: body.transactionDesc || 'Payment',
      });

      logger.info('STK push successful', response);
      return NextResponse.json(response);
    } catch (error: any) {
      logger.error('STK Push error:', error);
      return NextResponse.json(
        { 
          error: error.message || 'Failed to initiate payment',
          details: error.response || null
        },
        { status: error.status || 500 }
      );
    }
  } catch (error) {
    logger.error('Request processing error:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
} 