"use client";

import type React from "react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import va from "@vercel/analytics";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      va.track("login_success", { method: "email" });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred during login.");
      va.track("login_error", { method: "email", error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    va.track("login_attempt", { method: "google" });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
        va.track("login_error", { method: "google", error: error.message });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during Google sign in.");
      va.track("login_error", { method: "google", error: err.message });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-gray-800">Welcome Back</CardTitle>
        <CardDescription className="text-center text-gray-500">Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign In
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
            <Mail className="mr-2 h-4 w-4" /> Sign In with Google
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
