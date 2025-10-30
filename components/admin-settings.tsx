"use client";

import type React from "react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AdminSettingsProps {
  settings: {
    maintenance_mode: boolean;
    new_user_approval: boolean;
  };
}

export function AdminSettings({ settings }: AdminSettingsProps) {
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenance_mode);
  const [newUserApproval, setNewUserApproval] = useState(settings.new_user_approval);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("site_settings").update({
        maintenance_mode: maintenanceMode,
        new_user_approval: newUserApproval,
      }).eq("id", 1); // Assuming a single settings row with id 1

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Settings</CardTitle>
        <CardDescription>Manage site-wide settings and features.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label htmlFor="maintenance-mode" className="font-semibold">Maintenance Mode</Label>
            <p className="text-sm text-muted-foreground">Temporarily disable access to the site for all non-admin users.</p>
          </div>
          <Switch
            id="maintenance-mode"
            checked={maintenanceMode}
            onCheckedChange={setMaintenanceMode}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label htmlFor="new-user-approval" className="font-semibold">New User Approval</Label>
            <p className="text-sm text-muted-foreground">Require admin approval for all new user registrations.</p>
          </div>
          <Switch
            id="new-user-approval"
            checked={newUserApproval}
            onCheckedChange={setNewUserApproval}
          />
        </div>

        <Button onClick={handleSaveSettings} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
