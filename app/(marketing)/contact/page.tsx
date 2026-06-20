"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ------------------------------------------------------------------ */
/*  Schema                                                             */
/* ------------------------------------------------------------------ */

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

/* ------------------------------------------------------------------ */
/*  Contact info data                                                  */
/* ------------------------------------------------------------------ */

const CONTACT_INFO = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@pinga.ng",
    href: "mailto:hello@pinga.ng",
    description: "Send us an email anytime",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+234 801 234 5678",
    href: "tel:+2348012345678",
    description: "Mon-Fri, 9am-6pm WAT",
  },
  {
    icon: MapPin,
    title: "Address",
    value: "Lagos, Nigeria",
    href: undefined,
    description: "Yaba, Lagos State",
  },
];

const SUBJECTS = [
  "General Inquiry",
  "Sales & Pricing",
  "Technical Support",
  "Partnership Opportunity",
  "Feature Request",
  "Other",
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message sent successfully!", {
      description: "We will get back to you within 24 hours.",
    });
    reset();
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FF6B2C]/10 via-background to-background py-20 lg:py-28">
        <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-[#FF6B2C]/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1 text-xs font-semibold">
              Contact Us
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Get in <span className="text-[#FF6B2C]">touch</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Have a question, feedback, or need help? We would love to hear from you.
              Our team typically responds within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Form column */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="lg:col-span-3"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Send us a message</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form below and we will get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        aria-invalid={!!errors.name}
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        aria-invalid={!!errors.email}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        onValueChange={(value) => setValue("subject", value, { shouldValidate: true })}
                      >
                        <SelectTrigger className="w-full" aria-invalid={!!errors.subject}>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECTS.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.subject && (
                        <p className="text-sm text-destructive">{errors.subject.message}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help..."
                        className="min-h-32"
                        aria-invalid={!!errors.message}
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 w-full gap-2 text-base sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      {!isSubmitting && <Send className="size-4" />}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Info column */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-6 lg:col-span-2"
            >
              {CONTACT_INFO.map(({ icon: Icon, title, value, href, description }) => (
                <motion.div key={title} variants={fadeUp}>
                  <Card className="transition-shadow duration-300 hover:shadow-lg hover:shadow-[#FF6B2C]/5">
                    <CardContent className="flex items-start gap-4 pt-6">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#FF6B2C]/10">
                        <Icon className="size-6 text-[#FF6B2C]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                        {href ? (
                          <a
                            href={href}
                            className="text-base font-medium text-[#FF6B2C] hover:underline"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="text-base font-medium text-foreground">{value}</p>
                        )}
                        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Extra info card */}
              <motion.div variants={fadeUp}>
                <div className="rounded-2xl bg-[#1A2B3E] p-6">
                  <h3 className="text-lg font-bold text-white">Looking for support?</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    If you are an existing Pinga user and need technical support, please reach out
                    through your dashboard or email us directly at{" "}
                    <a href="mailto:support@pinga.ng" className="text-[#FF6B2C] hover:underline">
                      support@pinga.ng
                    </a>
                    . We aim to respond to all support tickets within 4 hours during business hours.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
