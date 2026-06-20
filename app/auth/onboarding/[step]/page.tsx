"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
  Package,
  Sparkles,
  Globe,
  Loader2,
  Upload,
  Check,
  MessageCircle,
  ArrowRight,
  Smile,
  Briefcase,
  HandMetal,
} from "lucide-react";
import { Instagram, Facebook } from "@/components/icons/brand-icons";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

// ─── Step Indicator ─────────────────────────────────────

const onboardingSteps = [
  { number: 1, label: "Add Product", icon: Package },
  { number: 2, label: "Configure AI", icon: Sparkles },
  { number: 3, label: "Connect", icon: Globe },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-0">
        {onboardingSteps.map((step, i) => (
          <div key={step.number} className="flex items-center">
            {/* Step dot */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                  currentStep > step.number
                    ? "border-[#FF6B2C] bg-[#FF6B2C] text-white"
                    : currentStep === step.number
                      ? "border-[#FF6B2C] bg-[#FF6B2C]/10 text-[#FF6B2C]"
                      : "border-border bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
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
            {/* Connecting line */}
            {i < onboardingSteps.length - 1 && (
              <div className="mx-3 mb-6 h-0.5 w-16">
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

// ─── Step 1: Add Your First Product ─────────────────────

const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

function AddProductStep({
  onNext,
  onSkip,
}: {
  onNext: () => void;
  onSkip: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      price: "",
      description: "",
    },
  });

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Product added successfully!");
      onNext();
    } catch {
      toast.error("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Add Your First Product
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          List a product so your AI agent can start selling for you.
        </p>
      </div>

      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="productName">Product name</Label>
        <Input
          id="productName"
          placeholder="e.g. Ankara Dress"
          className={cn("h-11", errors.productName && "border-destructive")}
          {...register("productName")}
        />
        {errors.productName && (
          <p className="text-xs text-destructive">
            {errors.productName.message}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            NGN
          </span>
          <Input
            id="price"
            type="number"
            placeholder="0.00"
            className={cn("h-11 pl-14", errors.price && "border-destructive")}
            {...register("price")}
          />
        </div>
        {errors.price && (
          <p className="text-xs text-destructive">{errors.price.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your product..."
          className="min-h-[80px] resize-none"
          {...register("description")}
        />
      </div>

      {/* Image Upload Placeholder */}
      <div className="space-y-2">
        <Label>Product image</Label>
        <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted transition-colors hover:border-[#FF6B2C]/40 hover:bg-[#FF6B2C]/10/30">
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">
            Click to upload image
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
        </div>
      </div>

      {/* Actions */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full bg-[#FF6B2C] text-white hover:bg-[#E55A1F]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Adding product...
          </>
        ) : (
          "Add Product"
        )}
      </Button>

      <button
        type="button"
        onClick={onSkip}
        className="w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Skip & Continue
      </button>
    </form>
  );
}

// ─── Step 2: Configure Your AI ──────────────────────────

const personalityIcons: Record<string, React.ReactNode> = {
  friendly: <Smile className="size-5 text-[#FF6B2C]" />,
  professional: <Briefcase className="size-5 text-[#1877F2]" />,
  casual: <HandMetal className="size-5 text-[#25D366]" />,
  pidgin: <Globe className="size-5 text-[#8B5CF6]" />,
};

const personalities = [
  {
    id: "friendly",
    name: "Friendly",
    sample: "Hey there! Thanks for reaching out! How can I help you today?",
  },
  {
    id: "professional",
    name: "Professional",
    sample:
      "Good day. Thank you for your inquiry. How may I assist you?",
  },
  {
    id: "casual",
    name: "Casual",
    sample: "Hey! What's up? Looking for something nice?",
  },
  {
    id: "pidgin",
    name: "Pidgin",
    sample: "How far! Wetin you dey find? We get better things for you!",
  },
];

const languages = [
  { id: "english", label: "English" },
  { id: "pidgin", label: "Pidgin" },
  { id: "yoruba", label: "Yoruba" },
  { id: "hausa", label: "Hausa" },
  { id: "igbo", label: "Igbo" },
];

function ConfigureAIStep({ onNext }: { onNext: () => void }) {
  const [selectedPersonality, setSelectedPersonality] = useState("friendly");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "english",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLanguageToggle = (languageId: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(languageId)
        ? prev.filter((id) => id !== languageId)
        : [...prev, languageId]
    );
  };

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("AI personality configured!");
      onNext();
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Configure Your AI
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a personality and language for your AI sales agent.
        </p>
      </div>

      {/* Personality Cards */}
      <div>
        <Label className="mb-3 block">AI Personality</Label>
        <RadioGroup
          value={selectedPersonality}
          onValueChange={setSelectedPersonality}
          className="grid grid-cols-2 gap-3"
        >
          {personalities.map((personality) => (
            <Label
              key={personality.id}
              htmlFor={personality.id}
              className="cursor-pointer [&:has([data-state=checked])>div]:border-[#FF6B2C] [&:has([data-state=checked])>div]:bg-[#FF6B2C]/10"
            >
              <Card
                className={cn(
                  "relative border-2 p-0 shadow-none transition-all hover:border-muted-foreground/30",
                  selectedPersonality === personality.id
                    ? "border-[#FF6B2C] bg-[#FF6B2C]/10"
                    : "border-border"
                )}
              >
                <CardContent className="p-4">
                  <RadioGroupItem
                    value={personality.id}
                    id={personality.id}
                    className="sr-only"
                  />
                  <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-muted">{personalityIcons[personality.id]}</div>
                  <p className="text-sm font-semibold text-foreground">
                    {personality.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    &ldquo;{personality.sample}&rdquo;
                  </p>
                </CardContent>
              </Card>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {/* Language Selection */}
      <div>
        <Label className="mb-3 block">Languages</Label>
        <div className="flex flex-wrap gap-3">
          {languages.map((language) => (
            <label
              key={language.id}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all",
                selectedLanguages.includes(language.id)
                  ? "border-[#FF6B2C] bg-[#FF6B2C]/10 text-[#FF6B2C]"
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <Checkbox
                checked={selectedLanguages.includes(language.id)}
                onCheckedChange={() => handleLanguageToggle(language.id)}
                className={cn(
                  selectedLanguages.includes(language.id) &&
                    "border-[#FF6B2C] bg-[#FF6B2C] text-white data-[state=checked]:border-[#FF6B2C] data-[state=checked]:bg-[#FF6B2C]"
                )}
              />
              {language.label}
            </label>
          ))}
        </div>
      </div>

      {/* Continue */}
      <Button
        type="button"
        disabled={isSubmitting}
        onClick={handleContinue}
        className="h-11 w-full bg-[#FF6B2C] text-white hover:bg-[#E55A1F]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}

// ─── Step 3: Connect Your Platforms ─────────────────────

const platformOptions = [
  {
    id: "instagram",
    name: "Instagram",
    description: "Connect your Instagram Business account",
    icon: Instagram,
    color: "#E1306C",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-200",
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Connect your Facebook Page",
    icon: Facebook,
    color: "#1877F2",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-200",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Connect your WhatsApp Business",
    icon: MessageCircle,
    color: "#25D366",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
  },
];

function ConnectPlatformsStep({ onComplete }: { onComplete: () => void }) {
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    // Simulate connection
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setConnected((prev) => ({ ...prev, [platformId]: true }));
    setConnecting(null);
    toast.success(
      `${platformId.charAt(0).toUpperCase() + platformId.slice(1)} connected!`
    );
  };

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">
          Connect Your Platforms
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your social platforms so your AI agent can start responding to
          customers.
        </p>
      </div>

      {/* Platform Cards */}
      <div className="space-y-3">
        {platformOptions.map((platform) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4 transition-all",
              connected[platform.id]
                ? "border-green-500/30 bg-green-500/10"
                : "border-border hover:border-muted-foreground/30"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  platform.bgColor
                )}
              >
                <platform.icon
                  className="h-5 w-5"
                  style={{ color: platform.color }}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {platform.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {platform.description}
                </p>
              </div>
            </div>

            {connected[platform.id] ? (
              <div className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                <Check className="h-4 w-4" />
                Connected
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                disabled={connecting !== null}
                onClick={() => handleConnect(platform.id)}
                className="min-w-[90px]"
              >
                {connecting === platform.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Connect"
                )}
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Go to Dashboard */}
      <Button
        type="button"
        onClick={onComplete}
        className="h-11 w-full bg-[#FF6B2C] text-white hover:bg-[#E55A1F]"
      >
        Go to Dashboard
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────

export default function OnboardingPage() {
  const params = useParams();
  const router = useRouter();

  // Parse step from URL param
  const stepParam = params.step as string;
  const currentStep = parseInt(stepParam?.replace("step-", "") || "1", 10);

  // Redirect to step-1 if invalid step
  useEffect(() => {
    if (![1, 2, 3].includes(currentStep)) {
      router.replace(ROUTES.ONBOARDING);
    }
  }, [currentStep, router]);

  const handleGoToStep = (step: number) => {
    router.push(ROUTES.ONBOARDING_STEP(step));
  };

  const handleComplete = () => {
    Cookies.set("onboardingComplete", "true", { expires: 365 });
    toast.success("You're all set! Welcome to Pinga!");
    router.push(ROUTES.DASHBOARD);
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
            <AddProductStep
              onNext={() => handleGoToStep(2)}
              onSkip={() => handleGoToStep(2)}
            />
          )}
          {currentStep === 2 && (
            <ConfigureAIStep onNext={() => handleGoToStep(3)} />
          )}
          {currentStep === 3 && (
            <ConnectPlatformsStep onComplete={handleComplete} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
