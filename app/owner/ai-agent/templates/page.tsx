"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Edit,
  Copy,
  MessageSquare,
  BarChart3,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

type Template = {
  id: string;
  name: string;
  category: string;
  language: string;
  content: string;
  usageCount: number;
  active: boolean;
};

const initialTemplates: Template[] = [
  {
    id: "1",
    name: "Welcome Message",
    category: "Greeting",
    language: "English",
    content:
      "Hello! Welcome to our store. How can I help you today? Feel free to browse our products or ask me anything!",
    usageCount: 342,
    active: true,
  },
  {
    id: "2",
    name: "Pidgin Welcome",
    category: "Greeting",
    language: "Pidgin",
    content:
      "Hey! Welcome to our shop o. Wetin you dey find? We get plenty fine things for you. Just ask me anything!",
    usageCount: 189,
    active: true,
  },
  {
    id: "3",
    name: "Price Inquiry",
    category: "Pricing",
    language: "English",
    content:
      "The {product_name} is priced at {price}. We currently have a {discount}% discount running! Would you like to place an order?",
    usageCount: 278,
    active: true,
  },
  {
    id: "4",
    name: "Bulk Pricing",
    category: "Pricing",
    language: "English",
    content:
      "For bulk orders, we offer: 10+ items = 10% off, 20+ items = 15% off. Contact us for wholesale pricing!",
    usageCount: 145,
    active: true,
  },
  {
    id: "5",
    name: "Order Confirmation",
    category: "Orders",
    language: "English",
    content:
      "Your order has been confirmed! Order ID: {order_id}. You will receive delivery within {delivery_days} days. Thank you!",
    usageCount: 210,
    active: true,
  },
  {
    id: "6",
    name: "Delivery Update",
    category: "Orders",
    language: "English",
    content:
      "Great news! Your order #{order_id} has been shipped and is on its way. Expected delivery: {delivery_date}.",
    usageCount: 167,
    active: true,
  },
  {
    id: "7",
    name: "Follow-up After Purchase",
    category: "Follow-up",
    language: "English",
    content:
      "Hi {name}! Hope you love your purchase. Would you like to leave a review? Also, check out our new arrivals!",
    usageCount: 98,
    active: true,
  },
  {
    id: "8",
    name: "Re-engagement",
    category: "Follow-up",
    language: "English",
    content:
      "Hi {name}! We haven't heard from you in a while. We have new products and special offers waiting for you!",
    usageCount: 76,
    active: false,
  },
  {
    id: "9",
    name: "Out of Stock",
    category: "Orders",
    language: "English",
    content:
      "Sorry, {product_name} is currently out of stock. Would you like to be notified when it's back? We also have similar items.",
    usageCount: 134,
    active: true,
  },
  {
    id: "10",
    name: "Payment Reminder",
    category: "Orders",
    language: "English",
    content:
      "Hi {name}! Just a reminder that your order #{order_id} is pending payment. Please complete payment to confirm your order.",
    usageCount: 203,
    active: true,
  },
  {
    id: "11",
    name: "Yoruba Greeting",
    category: "Greeting",
    language: "Yoruba",
    content:
      "Bawo ni! E kaabo si ile-itaja wa. Kini o nfe? A ni opolopo nkan to dara fun o. Bere ibeere kankan!",
    usageCount: 45,
    active: false,
  },
  {
    id: "12",
    name: "Negotiation Response",
    category: "Pricing",
    language: "English",
    content:
      "I understand you'd like a better price. The best I can offer is {best_price} for the {product_name}. This is a {discount}% discount! Deal?",
    usageCount: 156,
    active: true,
  },
];

const categories = ["All", "Greeting", "Pricing", "Orders", "Follow-up"];

// ---------------------------------------------------------------------------
// Category badge colors
// ---------------------------------------------------------------------------

function categoryColor(cat: string) {
  switch (cat) {
    case "Greeting":
      return "bg-green-500/10 text-green-600 border-green-200";
    case "Pricing":
      return "bg-blue-500/10 text-blue-600 border-blue-200";
    case "Orders":
      return "bg-purple-500/10 text-purple-600 border-purple-200";
    case "Follow-up":
      return "bg-amber-500/10 text-amber-600 border-amber-200";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-200";
  }
}

// ---------------------------------------------------------------------------
// Templates Page
// ---------------------------------------------------------------------------

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Greeting");
  const [formLanguage, setFormLanguage] = useState("English");
  const [formContent, setFormContent] = useState("");

  const filtered =
    selectedCategory === "All"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  function openCreate() {
    setEditingTemplate(null);
    setFormName("");
    setFormCategory("Greeting");
    setFormLanguage("English");
    setFormContent("");
    setDialogOpen(true);
  }

  function openEdit(template: Template) {
    setEditingTemplate(template);
    setFormName(template.name);
    setFormCategory(template.category);
    setFormLanguage(template.language);
    setFormContent(template.content);
    setDialogOpen(true);
  }

  function handleSave() {
    if (!formName.trim() || !formContent.trim()) return;

    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id
            ? {
                ...t,
                name: formName,
                category: formCategory,
                language: formLanguage,
                content: formContent,
              }
            : t
        )
      );
    } else {
      setTemplates((prev) => [
        ...prev,
        {
          id: String(prev.length + 1),
          name: formName,
          category: formCategory,
          language: formLanguage,
          content: formContent,
          usageCount: 0,
          active: true,
        },
      ]);
    }
    setDialogOpen(false);
  }

  function toggleActive(id: string) {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
          <p className="text-sm text-muted-foreground">
            Manage your AI response templates
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="gap-2"
          style={{ backgroundColor: "#FF6B2C" }}
        >
          <Plus className="size-4" />
          Create Template
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            style={
              selectedCategory === cat
                ? { backgroundColor: "#FF6B2C" }
                : undefined
            }
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
          >
            <Card
              className={cn(
                "h-full transition-shadow hover:shadow-md",
                !template.active && "opacity-60"
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm">{template.name}</CardTitle>
                  <Switch
                    checked={template.active}
                    onCheckedChange={() => toggleActive(template.id)}
                    size="sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", categoryColor(template.category))}
                  >
                    {template.category}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {template.language}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="line-clamp-3 text-xs text-muted-foreground">
                  {template.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BarChart3 className="size-3" />
                    {template.usageCount} uses
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(template)}
                    >
                      <Edit className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <Copy className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Create Template"}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? "Update the template details below."
                : "Create a new response template for your AI agent."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tpl-name">Name</Label>
              <Input
                id="tpl-name"
                placeholder="Template name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Category</Label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Language</Label>
                <Select value={formLanguage} onValueChange={setFormLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Pidgin">Pidgin</SelectItem>
                    <SelectItem value="Yoruba">Yoruba</SelectItem>
                    <SelectItem value="Hausa">Hausa</SelectItem>
                    <SelectItem value="Igbo">Igbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="tpl-content">Content</Label>
              <Textarea
                id="tpl-content"
                placeholder="Write your template content. Use {variable} for dynamic values."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                rows={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} style={{ backgroundColor: "#FF6B2C" }}>
              {editingTemplate ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
