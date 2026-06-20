"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Plus,
  LayoutGrid,
  List,
  Users,
  GripVertical,
  Phone,
  Mail,
  User,
  DollarSign,
} from "lucide-react";
import { cn, formatCurrency, timeAgo } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import type { Lead, LeadStage, LeadScore, Platform } from "@/lib/types";
import { useLeads, useUpdateLeadStage, useCreateLead } from "@/hooks";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ---------------------------------------------------------------------------
// Stage / score / platform config
// ---------------------------------------------------------------------------
const STAGES: LeadStage[] = ["New", "Contacted", "Qualified", "Negotiating", "Won", "Lost"];

const stageColors: Record<LeadStage, string> = {
  New: "bg-blue-500",
  Contacted: "bg-yellow-500",
  Qualified: "bg-purple-500",
  Negotiating: "bg-[#FF6B2C]",
  Won: "bg-green-500",
  Lost: "bg-red-500",
};

const scoreConfig: Record<LeadScore, { label: string; color: string }> = {
  hot: { label: "Hot", color: "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400 dark:border-red-800" },
  warm: { label: "Warm", color: "bg-orange-500/10 text-orange-700 border-orange-200 dark:text-orange-400 dark:border-orange-800" },
  cold: { label: "Cold", color: "bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-800" },
};

const platformDotColors: Record<Platform, string> = {
  instagram: "bg-pink-500",
  facebook: "bg-blue-600",
  whatsapp: "bg-green-500",
};

const platformLabels: Record<Platform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
};

// ---------------------------------------------------------------------------
// Add Lead Form Schema
// ---------------------------------------------------------------------------
const addLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(5, "Phone number is required"),
  value: z.string().min(1, "Value is required"),
  source: z.string().min(1, "Source is required"),
});

type AddLeadFormData = z.infer<typeof addLeadSchema>;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LeadsPage() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLeadPlatform, setNewLeadPlatform] = useState<Platform>("whatsapp");
  const [newLeadStage, setNewLeadStage] = useState<LeadStage>("New");
  const [newLeadScore, setNewLeadScore] = useState<LeadScore>("warm");

  const { data: leadsData, isLoading, isError } = useLeads();
  const leads: Lead[] = (leadsData as any)?.leads ?? leadsData ?? [];
  const updateLeadStage = useUpdateLeadStage();
  const createLead = useCreateLead();

  const leadsByStage = useMemo(() => {
    const map: Record<LeadStage, Lead[]> = {
      New: [], Contacted: [], Qualified: [], Negotiating: [], Won: [], Lost: [],
    };
    leads.forEach((lead) => map[lead.stage].push(lead));
    return map;
  }, [leads]);

  // Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddLeadFormData>({
    resolver: zodResolver(addLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      value: "",
      source: "",
    },
  });

  const onAddLead = async (data: AddLeadFormData) => {
    await createLead.mutateAsync({
      name: data.name,
      email: data.email || undefined,
      phone: data.phone,
      platform: newLeadPlatform,
      stage: newLeadStage,
      score: newLeadScore,
      value: Number(data.value),
      source: data.source,
    });
    setShowAddDialog(false);
    reset();
    setNewLeadPlatform("whatsapp");
    setNewLeadStage("New");
    setNewLeadScore("warm");
    toast.success(`Lead "${data.name}" added successfully!`);
  };

  // Drag-and-drop handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("text/plain", leadId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStage: LeadStage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain");
    updateLeadStage.mutate({ id: leadId, stage: targetStage });
    setDraggedLeadId(null);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading leads...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20 text-destructive">
        Failed to load leads. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Leads Pipeline"
        description={`${leads.length} leads in your pipeline`}
        actions={
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-border p-1">
              <Button
                variant={viewMode === "kanban" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setViewMode("kanban")}
                aria-label="Kanban view"
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <List className="size-4" />
              </Button>
            </div>

            <Button
              className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="size-4" />
              Add Lead
            </Button>
          </div>
        }
      />

      {viewMode === "kanban" ? (
        /* ---- Kanban Board ---- */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stagLeads = leadsByStage[stage];
            return (
              <div
                key={stage}
                className="flex w-72 min-w-[288px] flex-col rounded-xl border border-border bg-muted/30"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                {/* Column Header */}
                <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                  <span className={cn("size-2.5 rounded-full", stageColors[stage])} />
                  <span className="text-sm font-semibold text-foreground">
                    {stage}
                  </span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {stagLeads.length}
                  </Badge>
                </div>

                {/* Card List */}
                <ScrollArea className="flex-1 p-2" style={{ maxHeight: "calc(100vh - 280px)" }}>
                  <div className="flex flex-col gap-2">
                    {stagLeads.map((lead) => (
                      <Card
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          "cursor-grab rounded-xl transition-all hover:shadow-md active:cursor-grabbing",
                          draggedLeadId === lead.id && "opacity-50"
                        )}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={ROUTES.LEAD_DETAIL(lead.id)}
                              className="text-sm font-semibold hover:text-[#FF6B2C] transition-colors line-clamp-1"
                            >
                              {lead.name}
                            </Link>
                            <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={cn("size-2 rounded-full", platformDotColors[lead.platform])}
                              title={platformLabels[lead.platform]}
                            />
                            <span className="text-xs text-muted-foreground">
                              {platformLabels[lead.platform]}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className={cn("text-xs font-medium", scoreConfig[lead.score].color)}
                            >
                              {scoreConfig[lead.score].label}
                            </Badge>
                            <span className="text-xs font-semibold text-foreground">
                              {formatCurrency(lead.value)}
                            </span>
                          </div>

                          <p className="mt-2 text-[11px] text-muted-foreground">
                            {timeAgo(lead.lastInteraction)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}

                    {stagLeads.length === 0 && (
                      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
                        <Users className="size-8 text-muted-foreground/40 mb-2" />
                        <p className="text-xs text-muted-foreground">No leads</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>
      ) : (
        /* ---- List View ---- */
        <Card className="rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Last Interaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Link
                      href={ROUTES.LEAD_DETAIL(lead.id)}
                      className="font-medium hover:text-[#FF6B2C] transition-colors"
                    >
                      {lead.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={cn("size-2 rounded-full", platformDotColors[lead.platform])} />
                      <span className="text-sm">{platformLabels[lead.platform]}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={cn("size-2 rounded-full", stageColors[lead.stage])} />
                      <span className="text-sm">{lead.stage}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs font-medium", scoreConfig[lead.score].color)}
                    >
                      {scoreConfig[lead.score].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(lead.value)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {timeAgo(lead.lastInteraction)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* ---- Add Lead Dialog ---- */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>
              Add a new lead to your pipeline. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onAddLead)} className="space-y-4 pt-2">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="e.g. Blessing Okafor"
                  className={cn("pl-10", errors.name && "border-destructive")}
                  {...register("name")}
                />
              </div>
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            {/* Email + Phone row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className={cn("pl-10", errors.email && "border-destructive")}
                    {...register("email")}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="+234 8XX XXX XXXX"
                    className={cn("pl-10", errors.phone && "border-destructive")}
                    {...register("phone")}
                  />
                </div>
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Platform + Stage + Score row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Platform</Label>
                <Select
                  value={newLeadPlatform}
                  onValueChange={(v) => setNewLeadPlatform(v as Platform)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Stage</Label>
                <Select
                  value={newLeadStage}
                  onValueChange={(v) => setNewLeadStage(v as LeadStage)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Score</Label>
                <Select
                  value={newLeadScore}
                  onValueChange={(v) => setNewLeadScore(v as LeadScore)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="cold">Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Value + Source row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="value">Estimated Value (NGN) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="value"
                    type="number"
                    placeholder="50000"
                    className={cn("pl-10", errors.value && "border-destructive")}
                    {...register("value")}
                  />
                </div>
                {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="source">Source *</Label>
                <Input
                  id="source"
                  placeholder="e.g. Instagram DM"
                  className={cn(errors.source && "border-destructive")}
                  {...register("source")}
                />
                {errors.source && <p className="text-xs text-destructive">{errors.source.message}</p>}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || createLead.isPending}
                className="bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90"
              >
                {(isSubmitting || createLead.isPending) ? "Adding..." : "Add Lead"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
