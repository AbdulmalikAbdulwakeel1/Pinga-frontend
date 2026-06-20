"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { useVerifyResetPin, useResetPassword } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 4) return { score, label: "Fair", color: "bg-yellow-500" };
  return { score, label: "Strong", color: "bg-green-500" };
}

function PasswordStrengthIndicator({ password }: { password: string }) {
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const percentage = Math.min((strength.score / 6) * 100, 100);

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full transition-colors", strength.color)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p
        className={cn(
          "text-xs font-medium",
          strength.score <= 2
            ? "text-red-500"
            : strength.score <= 4
              ? "text-yellow-600"
              : "text-green-600"
        )}
      >
        {strength.label} password
      </p>
    </div>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [step, setStep] = useState<"pin" | "password">("pin");
  const [pin, setPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const verifyPin = useVerifyResetPin();
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password");

  const handleVerifyPin = useCallback(() => {
    if (pin.length !== 4 || !email) return;
    verifyPin.mutate({ email, pin }, {
      onSuccess: () => setStep("password"),
    });
  }, [pin, email, verifyPin]);

  useEffect(() => {
    if (pin.length === 4) handleVerifyPin();
  }, [pin, handleVerifyPin]);

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword.mutate({ email, newPassword: data.password });
  };

  if (step === "pin") {
    return (
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FF6B2C]/10"
        >
          <ShieldCheck className="h-10 w-10 text-[#FF6B2C]" />
        </motion.div>

        <h1 className="font-heading text-2xl font-bold text-foreground">Enter reset PIN</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a 4-digit PIN to{" "}
          {email ? (
            <span className="font-medium text-foreground">{email}</span>
          ) : (
            "your email"
          )}
          .<br />
          Enter it below to continue.
        </p>

        <div className="mt-8">
          <InputOTP
            maxLength={4}
            value={pin}
            onChange={setPin}
            disabled={verifyPin.isPending}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="h-14 w-14 text-xl font-semibold" />
              <InputOTPSlot index={1} className="h-14 w-14 text-xl font-semibold" />
              <InputOTPSlot index={2} className="h-14 w-14 text-xl font-semibold" />
              <InputOTPSlot index={3} className="h-14 w-14 text-xl font-semibold" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="button"
          disabled={pin.length !== 4 || verifyPin.isPending}
          onClick={handleVerifyPin}
          className="mt-6 h-11 w-full max-w-xs bg-[#FF6B2C] text-white hover:bg-[#E55A1F]"
        >
          {verifyPin.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying PIN...
            </>
          ) : (
            "Verify PIN"
          )}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FF6B2C]/10"
        >
          <Lock className="h-10 w-10 text-[#FF6B2C]" />
        </motion.div>
      </div>

      <div className="mb-8 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Set new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a strong new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className={cn("h-11 pl-10 pr-10", errors.password && "border-destructive")}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
          <PasswordStrengthIndicator password={passwordValue || ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              className={cn("h-11 pl-10 pr-10", errors.confirmPassword && "border-destructive")}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={resetPassword.isPending}
          className="h-11 w-full bg-[#FF6B2C] text-white hover:bg-[#E55A1F]"
        >
          {resetPassword.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Resetting password...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
