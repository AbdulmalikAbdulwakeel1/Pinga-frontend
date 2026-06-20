"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Mail, RotateCw } from "lucide-react";

import { useVerifyEmail, useResendVerificationPin } from "@/hooks";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const verifyEmail = useVerifyEmail();
  const resendPin = useResendVerificationPin();
  const submittedPin = useRef<string | null>(null);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (otp.length !== 4 || !email) return;
    if (submittedPin.current === otp) return;
    if (verifyEmail.isPending) return;
    submittedPin.current = otp;
    verifyEmail.mutate({ email, pin: otp });
  }, [otp]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVerify = () => {
    if (otp.length !== 4 || !email || verifyEmail.isPending) return;
    submittedPin.current = otp;
    verifyEmail.mutate({ email, pin: otp });
  };

  const handleResend = () => {
    if (!email) return;
    resendPin.mutate({ email }, {
      onSuccess: () => {
        setCountdown(60);
        setCanResend(false);
      },
    });
  };

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FF6B2C]/10"
      >
        <Mail className="h-10 w-10 text-[#FF6B2C]" />
      </motion.div>

      <h1 className="font-heading text-2xl font-bold text-foreground">Verify your email</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We sent a 4-digit verification code to{" "}
        {email ? (
          <span className="font-medium text-foreground">{email}</span>
        ) : (
          "your email address"
        )}
        .<br />
        Please enter it below to verify your account.
      </p>

      <div className="mt-8">
        <InputOTP
          maxLength={4}
          value={otp}
          onChange={setOtp}
          disabled={verifyEmail.isPending}
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
        disabled={otp.length !== 4 || verifyEmail.isPending}
        onClick={handleVerify}
        className="mt-6 h-11 w-full max-w-xs bg-[#FF6B2C] text-white hover:bg-[#E55A1F]"
      >
        {verifyEmail.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify Email"
        )}
      </Button>

      <div className="mt-6">
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendPin.isPending}
            className="flex items-center gap-2 text-sm font-medium text-[#FF6B2C] transition-colors hover:text-[#E55A1F] disabled:opacity-50"
          >
            {resendPin.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCw className="h-3.5 w-3.5" />
            )}
            Resend code
          </button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?{" "}
            <span className="font-medium text-foreground">Resend in {countdown}s</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
