"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// List your images here (make sure they exist in /public)
const sliderImages = [
  "/community1.jpg",
  "/community2.jpg",
  "/community3.jpg",
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  const [formState, setFormState] = useState({ error: null, success: null });
  const supabase = createClient();

  // Auto-slide every 3 seconds
  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, []);

  // Handle signup form submit
  const handleSignup = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const age = form.age.value;
    const email = form.email.value;
    const gender = form.gender.value;

    // Optional: Add further validation here
    if (!name || !age || !email || !gender) {
      setFormState({ error: "All fields are required.", success: null });
      return;
    }

    // Insert into Supabase (adjust table/fields as needed)
    const { error } = await supabase
      .from("profiles")
      .insert([
        {
          full_name: name,
          email,
          gender,
          // Convert age to date_of_birth if needed
          date_of_birth: `19${new Date().getFullYear() - age}-01-01`, // crude conversion
        },
      ]);
    if (error) {
      setFormState({ error: "Signup failed. Please try again.", success: null });
    } else {
      setFormState({ error: null, success: "Signup successful! Please check your email." });
      form.reset();
    }
  };

  return (
    <main className="bg-gray-900 text-white min-h-screen">
      {/* Image Slider */}
      <section className="relative w-full h-[280px] sm:h-[400px] md:h-[500px] mb-8 overflow-hidden">
        {sliderImages.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-700 ${i === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
            aria-hidden={i !== currentSlide}
          >
            <Image
              src={src}
              alt={`Community slide ${i + 1}`}
              fill
              priority={i === currentSlide}
              sizes="100vw"
              className="object-cover w-full h-full"
            />
          </div>
        ))}
        {/* Slider dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {sliderImages.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-3 h-3 rounded-full ${i === currentSlide ? "bg-yellow-500" : "bg-gray-600"} transition`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 text-yellow-500">
          Find Love, Build Connections, Celebrate Black Love
        </h1>
        <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8">
          Join thousands of singles connecting every day on Eboni Dating. Where real love meets authenticity.
        </p>
        {/* Signup Form */}
        <form className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-2xl mx-auto"
          onSubmit={handleSignup}
          aria-label="Signup form"
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            aria-label="Name"
            className="w-full sm:w-auto flex-1 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="number"
            name="age"
            min="18"
            max="100"
            placeholder="Age"
            required
            aria-label="Age"
            className="w-full sm:w-auto flex-1 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            aria-label="Email"
            className="w-full sm:w-auto flex-1 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-yellow-500"
          />
          <select
            name="gender"
            required
            aria-label="Gender"
            className="w-full sm:w-auto flex-1 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">I'm a...</option>
            <option value="man">Man Seeking Woman</option>
            <option value="woman">Woman Seeking Man</option>
            <option value="other">Other</option>
          </select>
          <button
            type="submit"
            className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-lg p-3 touch-button"
            aria-label="Join Free Today"
          >
            Join Free Today
          </button>
        </form>
        {formState.error && <p className="text-red-500 mt-4">{formState.error}</p>}
        {formState.success && <p className="text-green-500 mt-4">{formState.success}</p>}
      </section>

      {/* Features Section */}
      <section className="bg-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-yellow-500">Why Choose Eboni Dating?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Authentic Profiles", desc: "Real people. Real love stories." },
              { title: "Private & Secure", desc: "Your information stays safe with us." },
              { title: "Smart Matching", desc: "We connect you with compatible singles." },
              { title: "Community Vibes", desc: "Celebrate love, culture, and connection." },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition"
              >
                <h3 className="text-xl font-semibold text-yellow-500 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-500 mb-10">Choose Your Membership Plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { plan: "Free", price: "$0", features: ["Basic Matchmaking", "Profile Setup"] },
              { plan: "Premium", price: "$19.99/mo", features: ["Advanced Matchmaking", "Unlimited Chats", "Priority Support"] },
              { plan: "Elite", price: "$49.99/mo", features: ["Everything in Premium", "Verified Badge", "Video Calls"] },
            ].map((p, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:scale-105 transition">
                <h3 className="text-xl font-semibold text-yellow-500 mb-3">{p.plan}</h3>
                <p className="text-3xl font-bold mb-4">{p.price}</p>
                <ul className="text-gray-300 text-sm mb-6 space-y-2">
                  {p.features.map((f, j) => (
                    <li key={j}>• {f}</li>
                  ))}
                </ul>
                <a
                  href="/pricing"
                  className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg inline-block"
                  aria-label={`Get started with ${p.plan} plan`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-500 mb-10">
            Join Our Thriving Community
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {sliderImages.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`Community member ${i + 1}`}
                width={300}
                height={300}
                className="rounded-xl object-cover w-full h-auto hover:opacity-90 transition"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-center border-t border-gray-700">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Eboni Dating — All rights reserved.
        </p>
        <nav className="mt-2 flex justify-center gap-6 text-sm">
          <a href="/terms" aria-label="Terms of Service" className="hover:text-yellow-500">Terms of Service</a>
          <a href="/privacy" aria-label="Privacy Policy" className="hover:text-yellow-500">Privacy Policy</a>
          <a href="/pricing" aria-label="Pricing" className="hover:text-yellow-500">Pricing</a>
        </nav>
      </footer>
    </main>
  );
}

