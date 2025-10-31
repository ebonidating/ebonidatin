"use client";

import type React from "react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShieldCheck } from "lucide-react";

interface OTPVerificationFormProps {
  email: string;
  onVerificationSuccess: () => void;
}

export function OTPVerificationForm({ email, onVerificationSuccess }: OTPVerificationFormProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: verificationError } = await supabase.auth.verifyOtp({
        type: "email",
        token: otp,
        email: email,
      });

      if (verificationError) {
        throw new Error(verificationError.message);
      }

      onVerificationSuccess();
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (resendError) {
        throw new Error(resendError.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          <CardTitle>Verify Your Identity</CardTitle>
        </div>
        <CardDescription>An OTP has been sent to {email}. Please enter it below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="otp">One-Time Password</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify OTP"}
          </Button>
        </form>
        <div className="text-sm text-center text-muted-foreground mt-4">
          Didn't receive the code?{" "}
          <button onClick={handleResendOtp} className="text-blue-600 hover:underline font-medium" disabled={resending}>
            {resending ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
