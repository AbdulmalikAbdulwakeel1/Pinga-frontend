"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  User,
  Building2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import {
  BUSINESS_CATEGORIES,
  BUSINESS_SIZES,
  NIGERIAN_CITIES,
} from "@/lib/constants";
import { useRegister } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Schemas ─────────────────────────────────────────────

const personalInfoSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^(\+234|0)[789]\d{9}$/, "Enter a valid Nigerian phone number (e.g. 08012345678)"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const businessInfoSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  category: z.string().min(1, "Please select a business category"),
  businessSize: z.string().min(1, "Please select your business size"),
  city: z.string().min(1, "Please select your city"),
});

type PersonalInfoData = z.infer<typeof personalInfoSchema>;
type BusinessInfoData = z.infer<typeof businessInfoSchema>;

// ─── Step Indicator ──────────────────────────────────────

const steps = [
  { number: 1, label: "Personal Info", icon: User },
  { number: 2, label: "Business Info", icon: Building2 },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.number} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                  currentStep > step.number
                    ? "border-[#FF6B2C] bg-[#FF6B2C] text-white"
                    : currentStep === step.number
                      ? "border-[#FF6B2C] bg-[#FF6B2C]/10 text-[#FF6B2C]"
                      : "border-border bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium",
                  currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-2 mb-6 h-0.5 flex-1">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    currentStep > step.number ? "bg-[#FF6B2C]" : "bg-border"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 1: Personal Info ───────────────────────────────

function PersonalInfoStep({
  onNext,
  defaultValues,
}: {
  onNext: (data: PersonalInfoData) => void;
  defaultValues?: Partial<PersonalInfoData>;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div className="mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">Create your account</h2>
        <p className="mt-1 text-sm text-muted-foreground">Tell us about yourself</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            placeholder="John"
            className={cn("h-11", errors.firstName && "border-destructive")}
            {...register("firstName")}
          />
          {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            className={cn("h-11", errors.lastName && "border-destructive")}
            {...register("lastName")}
          />
          {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className={cn("h-11", errors.email && "border-destructive")}
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="08012345678"
          className={cn("h-11", errors.phone && "border-destructive")}
          {...register("phone")}
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            className={cn("h-11 pr-10", errors.password && "border-destructive")}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm your password"
            className={cn("h-11 pr-10", errors.confirmPassword && "border-destructive")}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="h-11 w-full bg-[#FF6B2C] text-white hover:bg-[#E55A1F]">
        Continue
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className="font-medium text-[#FF6B2C] hover:text-[#E55A1F]">
          Sign in
        </Link>
      </p>
    </form>
  );
}

// ─── Step 2: Business Info ───────────────────────────────

function BusinessInfoStep({
  onSubmit,
  onBack,
  defaultValues,
  isSubmitting,
}: {
  onSubmit: (data: BusinessInfoData) => void;
  onBack: () => void;
  defaultValues?: Partial<BusinessInfoData>;
  isSubmitting: boolean;
}) {
  const {
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<BusinessInfoData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      businessName: "",
      category: "",
      businessSize: "",
      city: "",
      ...defaultValues,
    },
  });

  const businessName = watch("businessName");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">Business information</h2>
        <p className="mt-1 text-sm text-muted-foreground">Tell us about your business</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessName">Business name</Label>
        <Input
          id="businessName"
          placeholder="e.g. Ada's Fashion House"
          className={cn("h-11", errors.businessName && "border-destructive")}
          value={businessName || ""}
          onChange={(e) => {
            setValue("businessName", e.target.value);
            if (errors.businessName) trigger("businessName");
          }}
        />
        {errors.businessName && (
          <p className="text-xs text-destructive">{errors.businessName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Business category</Label>
        <Select
          value={watch("category")}
          onValueChange={(value) => {
            setValue("category", value);
            if (errors.category) trigger("category");
          }}
        >
          <SelectTrigger className={cn("h-11 w-full", errors.category && "border-destructive")}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {BUSINESS_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Business size</Label>
        <Select
          value={watch("businessSize")}
          onValueChange={(value) => {
            setValue("businessSize", value);
            if (errors.businessSize) trigger("businessSize");
          }}
        >
          <SelectTrigger className={cn("h-11 w-full", errors.businessSize && "border-destructive")}>
            <SelectValue placeholder="Select your business size" />
          </SelectTrigger>
          <SelectContent>
            {BUSINESS_SIZES.map((size) => (
              <SelectItem key={size} value={size}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.businessSize && (
          <p className="text-xs text-destructive">{errors.businessSize.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>City</Label>
        <Select
          value={watch("city")}
          onValueChange={(value) => {
            setValue("city", value);
            if (errors.city) trigger("city");
          }}
        >
          <SelectTrigger className={cn("h-11 w-full", errors.city && "border-destructive")}>
            <SelectValue placeholder="Select your city" />
          </SelectTrigger>
          <SelectContent>
            {NIGERIAN_CITIES.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="h-11 flex-1" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 flex-1 bg-[#FF6B2C] text-white hover:bg-[#E55A1F]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>
    </form>
  );
}

// ─── Main Page ───────────────────────────────────────────

export default function RegisterPage() {
  // Step navigation is local state — router.push between step URLs causes
  // component remount and wipes the personalData we need for final submission.
  const [currentStep, setCurrentStep] = useState(1);
  const [personalData, setPersonalData] = useState<PersonalInfoData | null>(null);

  const register = useRegister();

  const handlePersonalNext = (data: PersonalInfoData) => {
    setPersonalData(data);
    setCurrentStep(2);
  };

  const handleBusinessSubmit = (data: BusinessInfoData) => {
    if (!personalData) return;
    register.mutate({
      ownerFirstName: personalData.firstName,
      ownerLastName: personalData.lastName,
      ownerEmail: personalData.email,
      phone: personalData.phone,
      password: personalData.password,
      businessName: data.businessName,
      businessCategory: data.category,
      businessSize: data.businessSize,
      city: data.city,
    });
  };

  return (
    <div>
      <StepIndicator currentStep={currentStep} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <PersonalInfoStep
              onNext={handlePersonalNext}
              defaultValues={personalData ?? undefined}
            />
          )}
          {currentStep === 2 && (
            <BusinessInfoStep
              onSubmit={handleBusinessSubmit}
              onBack={() => setCurrentStep(1)}
              isSubmitting={register.isPending}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
