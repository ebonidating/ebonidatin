import Link from 'next/link';

export const metadata = {
  title: 'Advertise With Us - Reach Black Community',
  description: 'Reach thousands of engaged Black singles with targeted advertising on Eboni Dating.',
};

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Advertise to an Engaged Community
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with thousands of active Black singles looking for products and services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Monthly Users</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">70%</div>
              <div className="text-gray-600">Daily Active Rate</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">2M+</div>
              <div className="text-gray-600">Monthly Impressions</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90">
              Contact us to discuss advertising opportunities.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium h-12 rounded-md px-8 bg-white text-amber-600 hover:bg-amber-50"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
