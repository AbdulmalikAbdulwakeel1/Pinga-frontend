"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { KeyRound, Mail, Loader2, ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { useForgotPassword } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword.mutate({ email: data.email }, {
      onSuccess: () => {
        router.push(`${ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(data.email)}`);
      },
    });
  };

  return (
    <div>
      <div className="mb-6 flex justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FF6B2C]/10"
        >
          <KeyRound className="h-10 w-10 text-[#FF6B2C]" />
        </motion.div>
      </div>

      <div className="mb-8 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No worries! Enter your email address and we&apos;ll send you a PIN to
          reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={cn("h-11 pl-10", errors.email && "border-destructive")}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={forgotPassword.isPending}
          className="h-11 w-full bg-[#FF6B2C] text-white hover:bg-[#E55A1F]"
        >
          {forgotPassword.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending reset PIN...
            </>
          ) : (
            "Send Reset PIN"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#FF6B2C] transition-colors hover:text-[#E55A1F]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
