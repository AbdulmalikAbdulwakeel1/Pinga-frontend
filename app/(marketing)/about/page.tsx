"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Target,
  Heart,
  Lightbulb,
  Users,
  ArrowRight,
  Globe,
  MessageSquare,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: "2,000+", label: "Businesses" },
  { value: "3", label: "Platforms" },
  { value: "1M+", label: "Messages" },
];

const TEAM = [
  {
    name: "Adewale Ogunleye",
    role: "Co-Founder & CEO",
    initials: "AO",
    description:
      "Former product lead at a leading fintech. Adewale is passionate about building technology that empowers African entrepreneurs to compete on a global stage.",
  },
  {
    name: "Ngozi Eze",
    role: "Co-Founder & CTO",
    initials: "NE",
    description:
      "AI/ML engineer with a background in natural language processing. Ngozi leads the technical vision behind Pinga's conversational AI and multi-language capabilities.",
  },
  {
    name: "Ibrahim Musa",
    role: "Co-Founder & COO",
    initials: "IM",
    description:
      "Operations expert who has scaled startups across West Africa. Ibrahim ensures Pinga delivers a seamless experience for thousands of businesses every day.",
  },
];

const VALUES = [
  {
    icon: Target,
    title: "Customer First",
    description:
      "Everything we build starts with the needs of Nigerian SMBs. We listen, learn, and iterate to deliver real value to the businesses that use Pinga every day.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We harness the latest in AI and conversational technology to solve real problems. Our goal is to make advanced tools accessible and affordable for every business.",
  },
  {
    icon: Heart,
    title: "Community",
    description:
      "We believe in the power of Nigerian entrepreneurship. Pinga is more than a tool -- it is a community of ambitious business owners supporting each other to grow.",
  },
  {
    icon: Users,
    title: "Inclusion",
    description:
      "From Pidgin to Yoruba, Hausa, and Igbo, we build for the diversity of Nigeria. Every business owner deserves technology that speaks their language.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FF6B2C]/10 via-background to-background py-20 lg:py-28">
        <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-[#FF6B2C]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 size-[30rem] rounded-full bg-[#FF6B2C]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge variant="secondary" className="mb-4 gap-1.5 px-3 py-1 text-xs font-semibold">
              About Pinga
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Empowering Nigerian Businesses{" "}
              <span className="text-[#FF6B2C]">with AI</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Pinga is on a mission to help every Nigerian small business sell more, reply faster,
              and grow bigger using the power of artificial intelligence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Our Mission
              </h2>
              <Separator className="my-6 w-16 bg-[#FF6B2C]" />
              <p className="text-lg leading-relaxed text-muted-foreground">
                Nigerian SMBs are the backbone of our economy, yet most lack the tools and resources
                to compete in today's digital-first world. Social media has become the marketplace,
                but managing DMs across Instagram, Facebook, and WhatsApp is overwhelming for
                business owners who are already stretched thin.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Pinga exists to change that. We built an AI-powered sales agent that handles
                conversations, negotiates prices, manages products, captures leads, and tracks
                orders -- so business owners can focus on what they do best: creating amazing
                products and serving their customers.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Our vision is a Nigeria where every small business has access to enterprise-level
                sales automation, regardless of their size or technical expertise.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: MessageSquare, label: "AI-Powered DM Replies", color: "#FF6B2C" },
                { icon: Globe, label: "Multi-Platform Support", color: "#1877F2" },
                { icon: Users, label: "Lead Management", color: "#25D366" },
                { icon: Zap, label: "Instant Automation", color: "#FF6B2C" },
              ].map(({ icon: Icon, label, color }) => (
                <motion.div key={label} variants={fadeUp}>
                  <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                    <div
                      className="flex size-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon className="size-6" style={{ color }} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1A2B3E] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-8 text-center sm:grid-cols-3"
          >
            {STATS.map(({ value, label }) => (
              <motion.div key={label} variants={fadeUp}>
                <p className="text-4xl font-extrabold text-[#FF6B2C] sm:text-5xl">{value}</p>
                <p className="mt-2 text-sm font-medium text-white/60">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-14 text-center"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Meet the team
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              The people behind Pinga who are passionate about empowering Nigerian businesses
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-8 md:grid-cols-3"
          >
            {TEAM.map((member) => (
              <motion.div key={member.name} variants={fadeUp}>
                <Card className="h-full text-center transition-shadow duration-300 hover:shadow-lg hover:shadow-[#FF6B2C]/5">
                  <CardHeader>
                    <div className="mx-auto mb-3 flex size-20 items-center justify-center rounded-full bg-[#FF6B2C]/10 text-2xl font-bold text-[#FF6B2C]">
                      {member.initials}
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm font-medium text-[#FF6B2C]">{member.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-14 text-center"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Our values
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              The principles that guide everything we do at Pinga
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {VALUES.map(({ icon: Icon, title, description }) => (
              <motion.div key={title} variants={fadeUp}>
                <Card className="group h-full transition-shadow duration-300 hover:shadow-lg hover:shadow-[#FF6B2C]/5">
                  <CardHeader>
                    <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-[#FF6B2C]/10 transition-colors group-hover:bg-[#FF6B2C]">
                      <Icon className="size-6 text-[#FF6B2C] transition-colors group-hover:text-white" />
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF6B2C] to-[#E55A1F] px-8 py-16 text-center shadow-2xl shadow-[#FF6B2C]/20 sm:px-16"
          >
            <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-white/5" />

            <div className="relative">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Join our mission
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-white/80">
                Whether you are a business owner looking to grow or someone who wants to help
                build the future of African commerce, we would love to hear from you.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-12 gap-2 bg-white px-8 text-base font-semibold text-[#FF6B2C] hover:bg-white/90"
                >
                  <Link href={ROUTES.REGISTER}>
                    Get Started Free <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 border-white/30 bg-transparent px-8 text-base text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href={ROUTES.CONTACT}>Contact Us</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
