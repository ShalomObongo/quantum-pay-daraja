'use client';

import { useState } from 'react';
import { PaymentForm } from '@/components/PaymentForm';
import { TransactionStatus } from '@/components/TransactionStatus';
import { logger } from '@/lib/logger';
import type { STKPushResponse } from '@/types/mpesa';
import Image from 'next/image';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handlePayment = async (formData: {
    amount: number;
    phoneNumber: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      logger.info('Initiating payment', formData);

      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json() as STKPushResponse;
      
      logger.info('Payment initiated', data);

      if (response.ok && data.ResponseCode === '0') {
        setCheckoutRequestId(data.CheckoutRequestID);
      } else {
        throw new Error(data.ResponseDescription || data.errorMessage || 'Failed to initiate payment');
      }
    } catch (error) {
      logger.error('Payment initiation failed', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusClose = () => {
    setCheckoutRequestId(null);
    setError(null);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-full glass-morphism hover:scale-110 transition-transform"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative">
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-6xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-gradient">
                  Quantum Pay
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the future of payments with our seamless M-PESA integration
              </p>
            </div>

            <div className="max-w-md mx-auto relative">
              {error && (
                <div className="absolute -top-12 inset-x-0 glass-morphism p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <div className="glass-morphism rounded-2xl overflow-hidden">
                <div className="bg-primary/10 px-6 py-8 md:p-10">
                  <h2 className="text-2xl font-bold text-center">Make a Payment</h2>
                  <p className="mt-2 text-muted-foreground text-center">
                    Enter your details below to initiate a secure M-PESA payment
                  </p>
                </div>

                <PaymentForm onSubmit={handlePayment} isLoading={isLoading} />
              </div>

              <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>Powered by</p>
                <div className="mt-2 flex justify-center space-x-4 items-center">
                  <span className="font-semibold">M-PESA</span>
                  <span className="text-2xl text-muted-foreground/30">×</span>
                  <span className="font-semibold">Quantum Pay</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {checkoutRequestId && (
          <TransactionStatus
            checkoutRequestId={checkoutRequestId}
            onClose={handleStatusClose}
          />
        )}

        {/* Developer Credit */}
        <div className="fixed bottom-4 right-4 flex items-center space-x-3 glass-morphism rounded-full p-2 pr-4">
          <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-primary">
            <Image
              src="/ProfilePic.png"
              alt="Shalom Obongo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium">
            Developed by <span className="text-primary">Shalom</span>
          </span>
        </div>
      </div>
    </main>
  );
}
