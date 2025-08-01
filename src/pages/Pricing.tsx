import { products } from '../stripe-config';
import ProductCard from '../components/ProductCard';
import SubscriptionStatus from '../components/SubscriptionStatus';
import { useAuth } from '../hooks/useAuth';

export default function Pricing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Select the perfect plan for your digital twin and MetaHuman creation needs
          </p>
        </div>

        {user && (
          <div className="mt-8 max-w-2xl mx-auto">
            <SubscriptionStatus />
          </div>
        )}

        <div className="mt-12 grid gap-8 lg:grid-cols-1 max-w-2xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.priceId} product={product} />
          ))}
        </div>

        {!user && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </a>
              {' or '}
              <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                create an account
              </a>
              {' to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}