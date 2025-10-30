import { CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VerifiedBadgeProps {
  verified: boolean;
  verificationType?: "email" | "phone" | "id" | "model";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function VerifiedBadge({
  verified,
  verificationType = "id",
  size = "md",
  className = "",
}: VerifiedBadgeProps) {
  if (!verified) return null;

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const verificationMessages = {
    email: "This user has a verified email address.",
    phone: "This user has a verified phone number.",
    id: "This user has been verified by our team.",
    model: "This user is a verified model.",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-1 ${className}`}>
            <CheckCircle2 className={`${sizeClasses[size]} text-blue-500 fill-blue-500`} />
            <span className="text-xs font-semibold text-blue-600">Verified</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{verificationMessages[verificationType]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
