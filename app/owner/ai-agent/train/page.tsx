"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Bot,
  User,
  Edit,
  ChevronDown,
  ChevronUp,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const initialQAPairs = [
  {
    id: "1",
    question: "What are your delivery options?",
    answer:
      "We offer same-day delivery within Lagos (NGN 1,500) and 2-3 day delivery nationwide (NGN 2,500). Free delivery on orders above NGN 50,000.",
  },
  {
    id: "2",
    question: "Do you accept returns?",
    answer:
      "Yes! We accept returns within 7 days of delivery. Items must be in original packaging and unused. Contact us to initiate a return.",
  },
  {
    id: "3",
    question: "How can I pay?",
    answer:
      "We accept bank transfers, card payments, and cash on delivery (Lagos only). Payment details are sent after order confirmation.",
  },
  {
    id: "4",
    question: "What sizes are available?",
    answer:
      "Our clothing comes in sizes S, M, L, XL, and XXL. Check each product listing for available sizes. We also offer custom sizing for an extra NGN 3,000.",
  },
  {
    id: "5",
    question: "Do you have a physical store?",
    answer:
      "Yes, we have a showroom in Lekki Phase 1, Lagos. Open Monday to Saturday, 10am to 7pm. Walk-ins welcome!",
  },
  {
    id: "6",
    question: "Can I get a bulk discount?",
    answer:
      "Absolutely! Orders of 10+ items get 10% off, and 20+ items get 15% off. Contact us for wholesale pricing on larger orders.",
  },
  {
    id: "7",
    question: "How long does custom orders take?",
    answer:
      "Custom orders typically take 5-7 business days. Rush orders (2-3 days) are available for an extra 30% fee.",
  },
  {
    id: "8",
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to the US, UK, Canada, and other countries. International shipping costs start from NGN 15,000 and takes 7-14 days.",
  },
];

const mockDocs = [
  {
    id: "1",
    name: "Product Catalog 2024.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploaded: "May 10, 2026",
    status: "processed",
  },
  {
    id: "2",
    name: "Price Sheet - May 2026.xlsx",
    type: "Excel",
    size: "340 KB",
    uploaded: "May 12, 2026",
    status: "processed",
  },
  {
    id: "3",
    name: "FAQ Document.docx",
    type: "Word",
    size: "128 KB",
    uploaded: "May 14, 2026",
    status: "processed",
  },
];

const reviewConversations = [
  {
    id: "1",
    customer: "Chioma A.",
    message: "How much is the ankara dress in size L?",
    aiResponse:
      "The Ankara Maxi Set in size L is NGN 15,000. It comes with a matching headwrap. Would you like to order?",
    rating: null as "up" | "down" | null,
  },
  {
    id: "2",
    customer: "Emeka O.",
    message: "Abeg, you fit deliver to PH?",
    aiResponse:
      "Yes o! We dey deliver to Port Harcourt. E go take 2-3 days and delivery na NGN 2,500. You wan order?",
    rating: null as "up" | "down" | null,
  },
  {
    id: "3",
    customer: "Fatima B.",
    message: "I ordered 3 days ago, where is my package?",
    aiResponse:
      "I apologize for the concern! Let me check your order status. Could you share your order ID so I can track it for you?",
    rating: null as "up" | "down" | null,
  },
  {
    id: "4",
    customer: "Segun K.",
    message: "What fabrics do you have for aso-ebi?",
    aiResponse:
      "We have beautiful Ankara, Lace, and Adire fabrics perfect for aso-ebi! Ankara starts at NGN 5,000/yard, Lace from NGN 12,000/yard. Would you like to see our catalog?",
    rating: null as "up" | "down" | null,
  },
  {
    id: "5",
    customer: "Ngozi E.",
    message: "Can I pay half now and half on delivery?",
    aiResponse:
      "Yes, we offer part payment! You can pay 60% upfront and the balance on delivery for orders within Lagos. Shall I set that up for you?",
    rating: null as "up" | "down" | null,
  },
];

// ---------------------------------------------------------------------------
// Train AI Page
// ---------------------------------------------------------------------------

export default function TrainAIPage() {
  const [qaPairs, setQAPairs] = useState(initialQAPairs);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [expandedQA, setExpandedQA] = useState<string | null>(null);
  const [reviews, setReviews] = useState(reviewConversations);

  function handleAddQA() {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setQAPairs((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        question: newQuestion,
        answer: newAnswer,
      },
    ]);
    setNewQuestion("");
    setNewAnswer("");
    setShowAddForm(false);
  }

  function handleDeleteQA(id: string) {
    setQAPairs((prev) => prev.filter((qa) => qa.id !== id));
  }

  function handleRate(id: string, rating: "up" | "down") {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, rating: r.rating === rating ? null : rating } : r
      )
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={ROUTES.AI_AGENT}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Train Your AI</h1>
          <p className="text-sm text-muted-foreground">
            Improve your AI agent with knowledge and feedback
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="qa">
        <TabsList>
          <TabsTrigger value="qa">Q&A Pairs</TabsTrigger>
          <TabsTrigger value="knowledge">Product Knowledge</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>

        {/* Q&A Pairs Tab */}
        <TabsContent value="qa" className="mt-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {qaPairs.length} Q&A pairs configured
              </p>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="gap-2"
                style={{ backgroundColor: "#FF6B2C" }}
              >
                <Plus className="size-4" />
                Add Q&A
              </Button>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="border-[#FF6B2C]/30 bg-[#FF6B2C]/5">
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="new-question">Question</Label>
                      <Input
                        id="new-question"
                        placeholder="e.g. What is your return policy?"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="new-answer">Answer</Label>
                      <Textarea
                        id="new-answer"
                        placeholder="Type the answer your AI should give..."
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddQA} className="gap-2" style={{ backgroundColor: "#FF6B2C" }}>
                        Add Pair
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Q&A List */}
            {qaPairs.map((qa) => (
              <Card key={qa.id}>
                <CardContent className="flex flex-col gap-2">
                  <div
                    className="flex cursor-pointer items-center justify-between"
                    onClick={() =>
                      setExpandedQA(expandedQA === qa.id ? null : qa.id)
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-[#FF6B2C]/10">
                        <FileText className="size-4 text-[#FF6B2C]" />
                      </div>
                      <span className="text-sm font-medium">
                        {qa.question}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQA(qa.id);
                        }}
                      >
                        <Trash2 className="size-3.5 text-red-500" />
                      </Button>
                      {expandedQA === qa.id ? (
                        <ChevronUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  {expandedQA === qa.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 rounded-lg bg-muted/50 p-3"
                    >
                      <p className="text-sm text-muted-foreground">
                        {qa.answer}
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Product Knowledge Tab */}
        <TabsContent value="knowledge" className="mt-4">
          <div className="flex flex-col gap-4">
            {/* Upload Area */}
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-4 py-8">
                <div className="flex size-16 items-center justify-center rounded-full bg-[#FF6B2C]/10">
                  <Upload className="size-8 text-[#FF6B2C]" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Upload Product Documents</p>
                  <p className="text-sm text-muted-foreground">
                    PDF, Excel, Word files up to 10MB
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Upload className="size-4" />
                  Choose Files
                </Button>
              </CardContent>
            </Card>

            {/* Document List */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">Uploaded Documents</h3>
              {mockDocs.map((doc) => (
                <Card key={doc.id} size="sm">
                  <CardContent className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <File className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <span className="text-sm font-medium">{doc.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {doc.type} &middot; {doc.size} &middot; {doc.uploaded}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/10 text-green-600"
                    >
                      {doc.status}
                    </Badge>
                    <Button variant="ghost" size="icon-sm">
                      <Trash2 className="size-3.5 text-red-500" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Review Tab */}
        <TabsContent value="review" className="mt-4">
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Review AI responses and provide feedback to improve accuracy
            </p>

            {reviews.map((convo) => (
              <Card key={convo.id}>
                <CardContent className="flex flex-col gap-3">
                  {/* Customer message */}
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <User className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium">
                        {convo.customer}
                      </span>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-sm">{convo.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B2C]/10">
                      <Bot className="size-4 text-[#FF6B2C]" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-xs font-medium text-[#FF6B2C]">
                        AI Agent
                      </span>
                      <div className="rounded-lg border border-[#FF6B2C]/20 bg-[#FF6B2C]/5 p-3">
                        <p className="text-sm">{convo.aiResponse}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="ml-11 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Rate this response:
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRate(convo.id, "up")}
                      className={cn(
                        convo.rating === "up" &&
                          "bg-green-500/10 text-green-600"
                      )}
                    >
                      <ThumbsUp className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRate(convo.id, "down")}
                      className={cn(
                        convo.rating === "down" && "bg-red-500/10 text-red-600"
                      )}
                    >
                      <ThumbsDown className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
