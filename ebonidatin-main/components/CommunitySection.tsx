export default function CommunitySection() {
  return (
    <section className="bg-background py-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8">
        <img src="/community.jpg" alt="Community" className="w-60 h-60 object-cover rounded-lg" />
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Our Community</h3>
          <p className="text-lg text-white">
            Join a vibrant, supportive community celebrating Black love worldwide.
          </p>
        </div>
      </div>
    </section>
  )
}
