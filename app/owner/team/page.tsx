"use client";

import { useState } from "react";
import {
  UserPlus,
  MoreVertical,
  Mail,
  Shield,
  ShieldCheck,
  User,
  CheckCircle2,
  XCircle,
  MessageSquare,
  CheckCheck,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TeamRole = "Owner" | "Admin" | "Agent";
type TeamStatus = "Active" | "Inactive";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: TeamStatus;
  assignedConversations: number;
  resolvedToday: number;
  avatarColor: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockMembers: TeamMember[] = [
  {
    id: "1",
    name: "Amaka Obi",
    email: "amaka@pingahq.com",
    role: "Owner",
    status: "Active",
    assignedConversations: 12,
    resolvedToday: 8,
    avatarColor: "bg-[#FF6B2C]",
  },
  {
    id: "2",
    name: "Chidi Nwosu",
    email: "chidi@pingahq.com",
    role: "Admin",
    status: "Active",
    assignedConversations: 18,
    resolvedToday: 14,
    avatarColor: "bg-blue-500",
  },
  {
    id: "3",
    name: "Funke Adeyemi",
    email: "funke@pingahq.com",
    role: "Agent",
    status: "Active",
    assignedConversations: 24,
    resolvedToday: 19,
    avatarColor: "bg-green-500",
  },
  {
    id: "4",
    name: "Tunde Bakare",
    email: "tunde@pingahq.com",
    role: "Agent",
    status: "Inactive",
    assignedConversations: 0,
    resolvedToday: 0,
    avatarColor: "bg-purple-500",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getRoleBadge(role: TeamRole) {
  switch (role) {
    case "Owner":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-[#FF6B2C]/20 bg-[#FF6B2C]/10 text-[#FF6B2C]"
        >
          <ShieldCheck className="size-3" />
          Owner
        </Badge>
      );
    case "Admin":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-800 dark:text-blue-400"
        >
          <Shield className="size-3" />
          Admin
        </Badge>
      );
    case "Agent":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-gray-200 bg-gray-500/10 text-gray-700 dark:border-gray-700 dark:text-gray-400"
        >
          <User className="size-3" />
          Agent
        </Badge>
      );
  }
}

function getStatusBadge(status: TeamStatus) {
  if (status === "Active") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-green-500" />
        <span className="text-sm text-green-700 dark:text-green-400">
          Active
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <span className="size-2 rounded-full bg-gray-400" />
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Inactive
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(mockMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("Agent");

  const handleInvite = () => {
    if (!inviteEmail) return;
    // Mock invite action
    setInviteEmail("");
    setInviteRole("Agent");
    setInviteOpen(false);
  };

  const activeMembers = members.filter((m) => m.status === "Active");
  const totalResolved = members.reduce((sum, m) => sum + m.resolvedToday, 0);
  const totalConversations = members.reduce(
    (sum, m) => sum + m.assignedConversations,
    0
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your team members and their roles.
          </p>
        </div>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90">
              <UserPlus className="size-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90"
                onClick={handleInvite}
              >
                <Mail className="size-4" />
                Send Invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card size="sm">
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FF6B2C]/10">
              <User className="size-5 text-[#FF6B2C]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeMembers.length}</p>
              <p className="text-xs text-muted-foreground">Active Members</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <MessageSquare className="size-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalConversations}</p>
              <p className="text-xs text-muted-foreground">
                Assigned Conversations
              </p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCheck className="size-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalResolved}</p>
              <p className="text-xs text-muted-foreground">Resolved Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">
                    Assigned Conversations
                  </TableHead>
                  <TableHead className="text-center">Resolved Today</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className={cn(member.avatarColor, "text-white text-xs")}>
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(member.role)}</TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell className="text-center font-medium">
                      {member.assignedConversations}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {member.resolvedToday}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-xs">
                            <MoreVertical className="size-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Role</DropdownMenuItem>
                          <DropdownMenuItem>
                            {member.status === "Active"
                              ? "Deactivate"
                              : "Activate"}
                          </DropdownMenuItem>
                          {member.role !== "Owner" && (
                            <DropdownMenuItem variant="destructive">
                              Remove
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <Avatar>
                  <AvatarFallback className={cn(member.avatarColor, "text-white text-xs")}>
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{member.name}</p>
                    {getRoleBadge(member.role)}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {member.email}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{member.assignedConversations} assigned</span>
                    <span>{member.resolvedToday} resolved</span>
                  </div>
                </div>
                {getStatusBadge(member.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member) => {
              const maxResolved = Math.max(...members.map((m) => m.resolvedToday), 1);
              const barWidth = (member.resolvedToday / maxResolved) * 100;

              return (
                <div
                  key={member.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <AvatarFallback className={cn(member.avatarColor, "text-white text-[10px]")}>
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Resolved Today
                      </span>
                      <span className="font-semibold">
                        {member.resolvedToday}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[#FF6B2C] transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Assigned</span>
                      <span className="font-semibold">
                        {member.assignedConversations}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
