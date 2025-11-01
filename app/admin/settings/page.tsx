import { createClient } from "@/lib/supabase/server"
import { AdminSettings } from "@/components/admin-settings"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminSettingsPage() {
  const supabase = await createClient()

  const { data: settings, error } = await supabase.from("site_settings").select("*").single()

  if (error) {
    return <AdminSettings settings={{ maintenance_mode: false, new_user_approval: true }} />
  }

  return <AdminSettings settings={settings} />
}
