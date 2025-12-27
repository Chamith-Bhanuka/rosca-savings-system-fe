import { useState } from 'react';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  X,
  Lock,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  confirmStripePayment,
  getClientSecret,
} from '../services/payment.service.ts';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ groupId, cycle, amount, onSuccess, isDark }: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    try {
      const data = await getClientSecret(groupId, cycle);

      if (data.requiresPayment === false) {
        onSuccess();
        return;
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          await confirmStripePayment(groupId, cycle, result.paymentIntent.id);
          onSuccess();
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Server Error');
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: isDark ? '#f2f0ea' : '#32325d',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: isDark ? '#6b7280' : '#aab7c4',
        },
        iconColor: isDark ? '#d4a574' : '#635bff',
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Payment Details */}
      <div className="space-y-4">
        <div
          className={`flex items-center justify-between pb-4 border-b ${
            isDark ? 'border-white/10' : 'border-gray-200'
          }`}
        >
          <span
            className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Total due
          </span>
          <span
            className={`text-2xl font-semibold ${
              isDark ? 'text-[#d4a574]' : 'text-gray-900'
            }`}
          >
            LKR {amount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Contribution for Cycle {cycle}
          </span>
          <span
            className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            LKR {amount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Card Information */}
      <div className="space-y-3">
        <label className="block">
          <span
            className={`text-sm font-medium mb-2 block ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Card information
          </span>
          <div
            className={`border rounded-md p-3 transition-all ${
              isDark
                ? 'bg-white/5 border-white/10 hover:border-[#d4a574]/50 focus-within:border-[#d4a574] focus-within:ring-1 focus-within:ring-[#d4a574]'
                : 'bg-white border-gray-300 hover:border-gray-400 focus-within:border-[#635bff] focus-within:ring-1 focus-within:ring-[#635bff]'
            }`}
          >
            <CardElement options={cardElementOptions} />
          </div>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className={`rounded-md p-3 border ${
            isDark
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-start gap-2">
            <AlertCircle
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`}
            />
            <span
              className={`text-sm ${isDark ? 'text-red-400' : 'text-red-800'}`}
            >
              {error}
            </span>
          </div>
        </div>
      )}

      {/* Pay Button */}
      <button
        onClick={handleSubmit}
        disabled={!stripe || processing}
        className={`w-full py-3 px-4 rounded-md font-semibold text-base transition-all flex items-center justify-center gap-2 ${
          !stripe || processing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isDark
              ? 'bg-gradient-to-r from-[#d4a574] to-[#a3784e] text-white hover:shadow-lg'
              : 'bg-[#635bff] hover:bg-[#5469d4] text-white shadow-sm'
        }`}
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay LKR {amount.toLocaleString()}
          </>
        )}
      </button>

      {/* Security Indicators */}
      <div className="space-y-3 pt-2">
        <div
          className={`flex items-center justify-center gap-2 text-xs ${
            isDark ? 'text-gray-500' : 'text-gray-500'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Payments are secure and encrypted</span>
        </div>

        <div
          className={`flex items-center justify-center gap-4 text-xs ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`}
        >
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            <span>PCI DSS</span>
          </div>
          <span>•</span>
          <span>SSL Encrypted</span>
        </div>

        {/* Powered by Stripe */}
        <div
          className={`text-center pt-3 border-t ${
            isDark ? 'border-white/10' : 'border-gray-200'
          }`}
        >
          <span
            className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
          >
            Powered by{' '}
            <span className="font-semibold text-[#635bff]">Stripe</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export const PaymentModal = (props: any) => {
  const theme = useSelector((state: any) => state.theme.value);
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-md rounded-lg shadow-2xl relative ${
          isDark ? 'bg-[#1a110d] border border-white/10' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? 'border-white/10' : 'border-gray-200'
          }`}
        >
          <div>
            <h2
              className={`text-lg font-semibold ${
                isDark ? 'text-[#d4a574]' : 'text-gray-900'
              }`}
            >
              Complete your payment
            </h2>
            <p
              className={`text-sm mt-0.5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Secure checkout powered by Stripe
            </p>
          </div>
          <button
            onClick={props.onClose}
            className={`p-2 rounded-md transition-colors ${
              isDark
                ? 'hover:bg-white/10 text-gray-400 hover:text-gray-300'
                : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Elements stripe={stripePromise}>
            <CheckoutForm {...props} isDark={isDark} />
          </Elements>
        </div>
      </div>
    </div>
  );
};
