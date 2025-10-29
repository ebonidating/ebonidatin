"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClientComponentClient();
      const { data } = await supabase.from("profiles").select("*").single();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Welcome {profile?.name || "User"}</CardTitle>
        <CardDescription>Your dashboard is ready.</CardDescription>
      </CardHeader>
      <CardContent>
        <Avatar>
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback>{profile?.name?.[0] || "?"}</AvatarFallback>
        </Avatar>
        <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
      </CardContent>
    </Card>
  );
}
