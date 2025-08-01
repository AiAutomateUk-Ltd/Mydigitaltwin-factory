import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { products } from '../stripe-config';

interface Subscription {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
}

export default function SubscriptionStatus() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('subscription_status, price_id, current_period_end, cancel_at_period_end')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (err) {
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return null;
  }

  if (!subscription || subscription.subscription_status === 'not_started') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">No Active Subscription</h3>
            <p className="mt-1 text-sm text-yellow-700">
              You don't have an active subscription. Browse our products to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const product = products.find(p => p.priceId === subscription.price_id);
  const isActive = subscription.subscription_status === 'active';
  const isPastDue = subscription.subscription_status === 'past_due';
  const isCanceled = subscription.subscription_status === 'canceled';

  const getStatusColor = () => {
    if (isActive) return 'green';
    if (isPastDue) return 'yellow';
    if (isCanceled) return 'red';
    return 'gray';
  };

  const getStatusText = () => {
    if (isActive) return 'Active';
    if (isPastDue) return 'Past Due';
    if (isCanceled) return 'Canceled';
    return subscription.subscription_status.replace('_', ' ').toUpperCase();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className={`border rounded-md p-4 ${
      isActive ? 'bg-green-50 border-green-200' : 
      isPastDue ? 'bg-yellow-50 border-yellow-200' : 
      'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {product?.name || 'Unknown Product'}
          </h3>
          <div className="mt-1 flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              getStatusColor() === 'green' ? 'bg-green-100 text-green-800' :
              getStatusColor() === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
              getStatusColor() === 'red' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {getStatusText()}
            </span>
            {subscription.cancel_at_period_end && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Canceling
              </span>
            )}
          </div>
        </div>
      </div>
      
      {subscription.current_period_end && (
        <div className="mt-3 text-sm text-gray-600">
          {subscription.cancel_at_period_end ? 'Expires' : 'Renews'} on {formatDate(subscription.current_period_end)}
        </div>
      )}
    </div>
  );
}