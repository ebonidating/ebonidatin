export function MembershipPlansSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["Messaging", "Video Calls", "Basic Support", "Limited Matches"],
      cta: "Get Started"
    },
    {
      name: "Plus", 
      price: "$19",
      period: "/month",
      features: ["Unlimited Messaging", "Video Calls", "Priority Support", "More Matches"],
      cta: "Try Plus",
      popular: true
    },
    {
      name: "Premium",
      price: "$29", 
      period: "/month",
      features: ["Everything in Plus", "VIP Support", "Unlimited Matches", "Advanced Features"],
      cta: "Go Premium"
    }
  ];

  return (
    <section className="w-full max-w-[100vw] overflow-hidden py-12 sm:py-16 bg-white">
      <div className="w-full max-w-[100vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 break-words">
            Membership Plans
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`rounded-xl border-2 p-4 sm:p-6 relative ${
                plan.popular ? 'border-amber-500 bg-amber-50 shadow-lg' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-amber-600">{plan.price}</span>
                  {plan.period && <span className="text-gray-600">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <span className="text-amber-500">✓</span>
                    <span className="text-gray-700 text-sm break-words">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-full font-bold transition-all ${
                plan.popular ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-gray-900 hover:bg-black text-white'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-full transition-all">
            Choose Your Plan
          </button>
        </div>
      </div>
    </section>
  );
}
