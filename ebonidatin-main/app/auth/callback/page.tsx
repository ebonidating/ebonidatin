app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) setProfile(data);
    };

    loadProfile();
  }, [supabase, router]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-amber-600">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white p-6">
      <Card className="w-full max-w-lg shadow-md border border-amber-100">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border border-amber-200">
              <AvatarImage src={profile.avatar_url || ""} />
              <AvatarFallback>{profile.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-amber-800">{profile.name}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
              {profile.email_verified ? (
                <p className="text-green-600 text-sm mt-1">✔ Email verified</p>
              ) : (
                <p className="text-red-600 text-sm mt-1">✖ Email not verified</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-4 space-y-4">
          <Button
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/auth/login");
            }}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
