export function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: "Jamal & Maya",
      location: "Atlanta, GA",
      story: "We matched in 2023 and got married in 2024. Eboni Dating understood our cultural values from day one.",
      duration: "Together 1 year"
    },
    {
      id: 2, 
      name: "Kwame & Imani",
      location: "Brooklyn, NY",
      story: "As professionals in our 30s, we appreciated the quality of matches and shared cultural understanding.",
      duration: "Engaged 6 months"
    },
    {
      id: 3,
      name: "Darius & Simone", 
      location: "Chicago, IL",
      story: "The video call feature helped us connect deeply before meeting. We're so grateful for this platform!",
      duration: "Together 8 months"
    }
  ];

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Real Love Stories
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            See how Black singles are finding meaningful connections.
          </p>
        </div>

        {/* Testimonials Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 md:mb-16">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow h-full">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-900 font-bold text-sm sm:text-lg">
                    {testimonial.name.split('&')[0].charAt(0)}{testimonial.name.split('&')[1].charAt(1)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-base sm:text-lg truncate">{testimonial.name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm truncate">{testimonial.location}</p>
                  <p className="text-amber-600 text-xs sm:text-sm font-medium">{testimonial.duration}</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm sm:text-base italic">"{testimonial.story}"</p>
            </div>
          ))}
        </div>

        {/* Trust Metrics - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
          {[
            { number: "10K+", label: "Active Members" },
            { number: "500+", label: "Success Stories" },
            { number: "47", label: "Cities Worldwide" },
            { number: "98%", label: "Satisfaction Rate" }
          ].map((metric, index) => (
            <div key={index} className="p-3 sm:p-4">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-600 mb-1 sm:mb-2">
                {metric.number}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 leading-tight">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
