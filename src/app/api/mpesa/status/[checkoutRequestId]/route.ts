import { NextResponse } from 'next/server';
import { mpesaService } from '@/lib/mpesa';

export async function GET(
  request: Request,
  context: { params: { checkoutRequestId: string } }
) {
  try {
    const params = await Promise.resolve(context.params);
    const checkoutRequestId = params.checkoutRequestId;

    if (!checkoutRequestId) {
      return NextResponse.json(
        { error: 'Checkout request ID is required' },
        { status: 400 }
      );
    }

    const response = await mpesaService.checkTransactionStatus(checkoutRequestId);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check transaction status' },
      { status: 500 }
    );
  }
} 