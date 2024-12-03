import { STKPushRequest, STKPushResponse, DarajaAuthResponse, TransactionType } from '@/types/mpesa';
import { logger } from '@/lib/logger';

class MpesaService {
  private readonly consumerKey: string;
  private readonly consumerSecret: string;
  private readonly passKey: string;
  private readonly shortCode: string;
  private readonly baseUrl: string;
  private readonly callbackUrl: string;

  constructor() {
    this.consumerKey = process.env.DARAJA_CONSUMER_KEY || '';
    this.consumerSecret = process.env.DARAJA_CONSUMER_SECRET || '';
    this.passKey = process.env.DARAJA_PASS_KEY || '';
    this.shortCode = process.env.DARAJA_BUSINESS_SHORT_CODE || '';
    this.baseUrl = process.env.DARAJA_API_URL || 'https://sandbox.safaricom.co.ke';
    this.callbackUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/mpesa/callback`;

    // Validate configuration
    this.validateConfig();
  }

  private validateConfig() {
    if (!this.consumerKey || !this.consumerSecret) {
      throw new Error('Consumer key and secret are required');
    }
    if (!this.passKey) {
      throw new Error('Pass key is required');
    }
    if (!this.shortCode || !/^\d{5,7}$/.test(this.shortCode)) {
      throw new Error('Valid business short code is required (5-7 digits)');
    }
  }

  private async getAuthToken(): Promise<string> {
    try {
      logger.debug('Getting auth token');
      
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await fetch(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      logger.debug('Auth response received', data);

      if (!response.ok || !data.access_token) {
        logger.error('Auth failed', {
          status: response.status,
          data
        });
        throw new Error('Failed to get auth token');
      }

      return data.access_token;
    } catch (error) {
      logger.error('Error getting auth token:', error);
      throw error;
    }
  }

  private generateTimestamp(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  private generatePassword(timestamp: string): string {
    const data = `${this.shortCode}${this.passKey}${timestamp}`;
    return Buffer.from(data).toString('base64');
  }

  private validatePhoneNumber(phoneNumber: string): string {
    let cleaned = phoneNumber.replace(/[^0-9]/g, '');
    
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('+254')) {
      cleaned = cleaned.substring(1);
    } else if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }

    if (!/^254[17]\d{8}$/.test(cleaned)) {
      throw new Error('Invalid phone number format. Must be a valid Safaricom number.');
    }

    return cleaned;
  }

  public async initiateSTKPush(data: STKPushRequest): Promise<STKPushResponse> {
    try {
      const token = await this.getAuthToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);
      const phoneNumber = this.validatePhoneNumber(data.phoneNumber);

      logger.info('Initiating STK push', {
        amount: data.amount,
        phoneNumber
      });

      const requestBody = {
        BusinessShortCode: this.shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(data.amount),
        PartyA: phoneNumber,
        PartyB: this.shortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: this.callbackUrl,
        AccountReference: "Test",
        TransactionDesc: "Payment of X"
      };

      logger.debug('STK push request', requestBody);

      const response = await fetch(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();
      logger.debug('STK push response received', responseData);

      if (!response.ok) {
        logger.error('STK push failed', {
          status: response.status,
          statusText: response.statusText,
          error: responseData
        });
        throw new Error(responseData.errorMessage || 'Failed to initiate payment');
      }

      logger.info('STK push initiated successfully', responseData);
      return responseData as STKPushResponse;
    } catch (error) {
      logger.error('Error initiating STK push:', error);
      throw error;
    }
  }

  public async checkTransactionStatus(checkoutRequestId: string): Promise<any> {
    try {
      const token = await this.getAuthToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      logger.debug('Checking transaction status', { checkoutRequestId });

      const requestBody = {
        BusinessShortCode: this.shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await fetch(`${this.baseUrl}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();
      logger.debug('Status check response received', responseData);

      if (responseData.errorCode === '500.001.1001') {
        return {
          ResultCode: 'PENDING',
          ResultDesc: responseData.errorMessage
        };
      }

      if (!response.ok) {
        logger.error('Status check failed', {
          status: response.status,
          statusText: response.statusText,
          error: responseData
        });
        throw new Error(responseData.errorMessage || 'Failed to check transaction status');
      }

      logger.info('Transaction status received', responseData);
      return responseData;
    } catch (error) {
      logger.error('Error checking transaction status:', error);
      throw error;
    }
  }
}

export const mpesaService = new MpesaService(); 