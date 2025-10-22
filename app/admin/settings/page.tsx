
import { createClient } from "@/lib/supabase/server";
import { AdminSettings } from "@/components/admin-settings";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  if (error) {
    console.error("Error fetching settings:", error);
    // Provide default settings if none are found
    return <AdminSettings settings={{ maintenance_mode: false, new_user_approval: true }} />;
  }

  return <AdminSettings settings={settings} />;
}
