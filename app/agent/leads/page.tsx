"use client";

import { useState } from "react";
import { cn, formatDate, getInitials, getPlatformColor } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MessageCircle, Eye, Users } from "lucide-react";
import { Instagram, Facebook } from "@/components/icons/brand-icons";
import { useLeads } from "@/hooks";
import Link from "next/link";

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: MessageCircle,
};

const stageStyles: Record<string, string> = {
  new: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  contacted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  qualified: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  negotiating: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  converted: "bg-green-500/10 text-green-600 border-green-500/20",
  lost: "bg-red-500/10 text-red-600 border-red-500/20",
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

export default function AgentLeadsPage() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");

  const { data: leadsData, isLoading } = useLeads({
    search: search || undefined,
    stage: stageFilter !== "all" ? stageFilter : undefined,
  } as any);

  const leads: any[] = leadsData?.leads || leadsData || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage potential customers.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter by stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="negotiating">Negotiating</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Lead List</CardTitle>
          <CardAction>
            <Badge variant="secondary">
              <Users className="mr-1 size-3" />
              {leads.length} leads
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
              No leads found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead className="hidden sm:table-cell">Platform</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead className="hidden md:table-cell">Score</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead: any) => {
                    const PlatformIcon = platformIcons[lead.platform] || MessageCircle;
                    const platformColor = getPlatformColor(lead.platform);
                    const stage = (lead.stage || "new").toLowerCase();

                    return (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="size-8 shrink-0">
                              <AvatarFallback className="text-[10px] font-semibold bg-pinga-orange/10 text-pinga-orange">
                                {getInitials(lead.name || lead.contactName || "?")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {lead.name || lead.contactName || "Unknown"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {lead.phone || lead.email || ""}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant="secondary"
                            className="h-5 px-1.5 text-[10px] font-semibold"
                            style={{ backgroundColor: `${platformColor}15`, color: platformColor }}
                          >
                            <PlatformIcon className="mr-0.5 size-2.5" />
                            {lead.platform}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("text-xs capitalize", stageStyles[stage] || "")}
                          >
                            {stage}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <ScoreBar score={lead.score || lead.leadScore || 0} />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                          {formatDate(lead.lastContactAt || lead.updatedAt || lead.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon-sm" asChild>
                              <Link href={ROUTES.AGENT_CONVERSATIONS}>
                                <MessageCircle className="size-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon-sm">
                              <Eye className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
