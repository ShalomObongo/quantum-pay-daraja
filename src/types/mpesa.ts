export type TransactionType = 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';

export interface STKPushRequest {
  amount: number;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
  transactionType?: TransactionType;
}

export interface STKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface CallbackResponse {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

export interface TransactionStatus {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: string;
  ResultDesc: string;
}

export interface DarajaAuthResponse {
  access_token: string;
  expires_in: string;
} 