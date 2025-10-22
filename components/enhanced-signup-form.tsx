
"use client";

import type React from "react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getCountries, getCitiesByCountry } from "@/lib/countries-data";
import { Loader2, Mail, Upload, ShieldCheck } from "lucide-react";
import { MembershipSelector } from "./membership-selector";
import Image from "next/image";

export function EnhancedSignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userType, setUserType] = useState<"user" | "model">("user");
  const [membershipTier, setMembershipTier] = useState("free");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);

  const countries = getCountries();
  const cities = country ? getCitiesByCountry(country) : [];
  const requiresPayment = membershipTier !== "free";

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... (rest of the function remains the same)
  };

  const uploadProfilePicture = async (): Promise<string | null> => {
    // ... (rest of the function remains the same)
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password || !fullName || !phone || !country || !city) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must contain uppercase, lowercase, and numeric characters");
      setLoading(false);
      return;
    }

    if (requiresPayment && !paymentMethod) {
      setError("Please select a payment method for premium membership");
      setLoading(false);
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the terms and conditions");
      setLoading(false);
      return;
    }

    try {
      let profilePhotoUrl = null;
      if (profilePicture) {
        profilePhotoUrl = await uploadProfilePicture();
        if (!profilePhotoUrl) {
          setLoading(false);
          return;
        }
      }

      const supabase = createClient();
      const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`;

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone,
            country,
            city,
            user_type: userType,
            membership_tier: membershipTier,
            profile_photo_url: profilePhotoUrl,
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString(),
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: fullName,
          phone,
          country,
          city,
          user_type: userType,
          subscription_tier: membershipTier,
          profile_photo_url: profilePhotoUrl,
          email_verified: false,
          gallery_access: membershipTier !== "free",
          terms_accepted: true,
          terms_accepted_at: new Date().toISOString(),
        });

        if (profileError) {
          setError("Failed to create profile. Please try again.");
          return;
        }

        if (requiresPayment) {
          try {
            const response = await fetch("/api/create-checkout-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: authData.user.id,
                tier: membershipTier,
                email: email,
              }),
            });

            if (response.ok) {
              const { url } = await response.json();
              window.location.href = url;
              return;
            } else {
              const errorData = await response.json();
              setError(errorData.error || "Payment processing failed. Please try again.");
            }
          } catch (err) {
            setError("Payment processing failed. Please try again.");
          }
          return;
        }

        setSuccess(true);
      }
    } catch (err: any) {
      if (err.message.includes("already registered")) {
        setError("This email address is already registered. Please log in or use a different email.");
      } else if (err.message.includes("rate limit")) {
        setError("You are signing up too frequently. Please try again later.");
      } else {
        setError(err.message || "An error occurred during sign up. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    // ... (rest of the function remains the same)
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <CardTitle>Verification Required</CardTitle>
          </div>
          <CardDescription>We've sent a verification link to {email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-900">
              <strong>Action Required:</strong> To complete your registration, please check your email and click the verification link.
            </AlertDescription>
          </Alert>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>The verification link will expire in 10 minutes.</p>
            <p>
              Didn't receive the email? Check your spam folder or{" "}
              <button onClick={() => setSuccess(false)} className="text-amber-600 hover:underline font-medium">
                try signing up again
              </button>.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      {/* ... (rest of the form remains the same) */}
    </Card>
  );
}
