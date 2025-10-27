export function HeroSection() {
  return (
    <section className="min-h-screen w-full max-w-[100vw] overflow-hidden bg-gradient-to-br from-amber-900 to-rose-900 text-white">
      <div className="w-full max-w-[100vw] mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center w-full">
          {/* Navigation */}
          <nav className="mb-12 w-full max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm sm:text-base">
              {['Home', 'App', 'Discover', 'Pricing', 'Stories'].map((item) => (
                <button key={item} className="text-white hover:text-amber-300 transition-colors whitespace-nowrap">
                  {item}
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <div className="w-full max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight break-words">
              Find Love, Build Connections,<br />Celebrate Black Love
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed break-words">
              Join thousands of singles worldwide in a safe, culturally-rich dating community.
            </p>

            {/* CTA Button */}
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 mb-12 w-full max-w-xs mx-auto">
              Join Free Today
            </button>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {[
                { title: 'Verified Members', desc: 'Profiles you can trust' },
                { title: 'Smart Matching', desc: 'AI-powered connections' },
                { title: 'Rich Communication', desc: 'Chat, voice, and video calls' },
                { title: 'Privacy First', desc: 'Your dignity is our priority' }
              ].map((feature, index) => (
                <div key={index} className="bg-black/20 rounded-2xl p-4 text-center backdrop-blur-sm">
                  <h3 className="font-bold text-lg mb-2 break-words">{feature.title}</h3>
                  <p className="text-amber-200 text-sm break-words">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
