import { useTranslations } from '@/lib/i18n/use-translations'
import { ShieldCheck, Search, MessageSquare, Lock } from 'lucide-react'

export default function FeaturesSection() {
  const { t } = useTranslations()
  return (
    <section className="bg-background py-12">
      <div className="container mx-auto flex flex-wrap justify-center gap-8">
        <Feature icon={<ShieldCheck size={36} />} title={t.home.features.verified.title} desc={t.home.features.verified.description} />
        <Feature icon={<Search size={36} />} title={t.home.features.matching.title} desc={t.home.features.matching.description} />
        <Feature icon={<MessageSquare size={36} />} title={t.home.features.communication.title} desc={t.home.features.communication.description} />
        <Feature icon={<Lock size={36} />} title="Privacy First" desc="Your dignity in our top priority" />
      </div>
    </section>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center bg-black/70 p-6 rounded-lg w-64">
      <div className="mb-3 text-yellow-600">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white">{desc}</p>
    </div>
  )
}
