"use client";

import { useState, useEffect } from "react";
import {
  User,
  Building2,
  CreditCard,
  ShieldCheck,
  Bell,
  Upload,
  Eye,
  EyeOff,
  Monitor,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { useProfile, useUpdateProfile } from "@/hooks";

// ---------------------------------------------------------------------------
// Mock billing data (no billing API yet)
// ---------------------------------------------------------------------------

const mockInvoices = [
  { id: "INV-001", date: "2026-05-01", amount: 15000, status: "Paid" },
  { id: "INV-002", date: "2026-04-01", amount: 15000, status: "Paid" },
  { id: "INV-003", date: "2026-03-01", amount: 15000, status: "Paid" },
];

const mockSessions = [
  {
    id: "1",
    device: "MacBook Pro - Chrome",
    icon: Monitor,
    location: "Lagos, Nigeria",
    lastActive: "Active now",
    current: true,
  },
  {
    id: "2",
    device: "iPhone 15 - Safari",
    icon: Smartphone,
    location: "Lagos, Nigeria",
    lastActive: "2 hours ago",
    current: false,
  },
];

// ---------------------------------------------------------------------------
// Tab: Profile
// ---------------------------------------------------------------------------

function ProfileTab() {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  const initials = profile
    ? `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`
    : "?";

  const handleSave = () => {
    updateProfile.mutate({ firstName, lastName, phone });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and profile photo.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Avatar size="lg" className="size-16">
            <AvatarFallback className="bg-[#FF6B2C] text-white text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <Button variant="outline" size="sm">
              <Upload className="size-4" />
              Upload Photo
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max 2MB.
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-firstname">First Name</Label>
            <Input
              id="profile-firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-lastname">Last Name</Label>
            <Input
              id="profile-lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-email">Email Address</Label>
            <Input
              id="profile-email"
              type="email"
              value={profile?.email ?? ""}
              disabled
              className="bg-muted/50 text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-phone">Phone Number</Label>
            <Input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 800 000 0000"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            className="bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90"
            onClick={handleSave}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Tab: Business
// ---------------------------------------------------------------------------

function BusinessTab() {
  const { data: profile } = useProfile();

  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("Fashion & Clothing");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (profile?.business) {
      setBusinessName(profile.business.name ?? "");
      setCategory(profile.business.category ?? "Fashion & Clothing");
      setCity(profile.business.city ?? "");
    }
  }, [profile]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Manage your business details and branding.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Logo Upload */}
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-xl bg-[#1A2B3E] text-white">
            <Building2 className="size-7" />
          </div>
          <div className="flex flex-col gap-1">
            <Button variant="outline" size="sm">
              <Upload className="size-4" />
              Upload Logo
            </Button>
            <p className="text-xs text-muted-foreground">
              Square image recommended. Max 2MB.
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="biz-name">Business Name</Label>
            <Input
              id="biz-name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="biz-category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fashion & Clothing">Fashion & Clothing</SelectItem>
                <SelectItem value="Beauty & Cosmetics">Beauty & Cosmetics</SelectItem>
                <SelectItem value="Food & Catering">Food & Catering</SelectItem>
                <SelectItem value="Electronics & Gadgets">Electronics & Gadgets</SelectItem>
                <SelectItem value="Home & Living">Home & Living</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="biz-city">City</Label>
            <Input
              id="biz-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <p className="text-xs text-muted-foreground">Business update coming soon.</p>
          <Button className="bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90" disabled>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Tab: Billing
// ---------------------------------------------------------------------------

function BillingTab() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-[#FF6B2C]/10">
                <CreditCard className="size-6 text-[#FF6B2C]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Growth Plan</h3>
                  <Badge className="bg-[#FF6B2C] text-white">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(15000)}/month
                </p>
              </div>
            </div>
            <Button className="bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90">
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10">
              <CreditCard className="size-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Visa ending in 4242</p>
              <p className="text-sm text-muted-foreground">Expires 12/2027</p>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium text-[#FF6B2C]">{invoice.id}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="gap-1 border-green-200 bg-green-500/10 text-green-700 dark:border-green-800 dark:text-green-400"
                    >
                      <CheckCircle2 className="size-3" />
                      {invoice.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Security
// ---------------------------------------------------------------------------

function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="current-pw">Current Password</Label>
            <div className="relative">
              <Input
                id="current-pw"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="absolute top-1/2 right-2 -translate-y-1/2"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-pw">New Password</Label>
              <div className="relative">
                <Input
                  id="new-pw"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute top-1/2 right-2 -translate-y-1/2"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-pw">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-pw"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute top-1/2 right-2 -translate-y-1/2"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90">
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#1A2B3E]/10">
                <ShieldCheck className="size-5 text-[#1A2B3E] dark:text-white" />
              </div>
              <div>
                <p className="font-medium">{twoFactorEnabled ? "Enabled" : "Disabled"}</p>
                <p className="text-sm text-muted-foreground">
                  {twoFactorEnabled
                    ? "Your account is protected with 2FA"
                    : "Protect your account with two-factor authentication"}
                </p>
              </div>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage your active sessions across devices.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {mockSessions.map((session) => {
            const Icon = session.icon;
            return (
              <div
                key={session.id}
                className="flex items-center gap-4 rounded-lg border border-border p-3"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{session.device}</p>
                    {session.current && (
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-500/10 text-green-700 dark:border-green-800 dark:text-green-400"
                      >
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {session.location} &middot; {session.lastActive}
                  </p>
                </div>
                {!session.current && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab: Notifications
// ---------------------------------------------------------------------------

function NotificationsTab() {
  const [notifications, setNotifications] = useState({
    newOrders: true,
    newLeads: true,
    aiHandoffs: false,
    weeklyDigest: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const items = [
    { key: "newOrders" as const, title: "New Orders", description: "Get notified when you receive a new order." },
    { key: "newLeads" as const, title: "New Leads", description: "Get notified when a new lead is captured." },
    { key: "aiHandoffs" as const, title: "AI Handoffs", description: "Get notified when the AI agent hands off a conversation to a human." },
    { key: "weeklyDigest" as const, title: "Weekly Digest", description: "Receive a weekly summary of your business performance." },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>
          Choose which email notifications you want to receive.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {items.map((item, index) => (
          <div key={item.key}>
            <div className="flex items-center justify-between py-4">
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch
                checked={notifications[item.key]}
                onCheckedChange={() => toggleNotification(item.key)}
              />
            </div>
            {index < items.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, business, and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="size-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-1.5">
            <Building2 className="size-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-1.5">
            <CreditCard className="size-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <ShieldCheck className="size-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="size-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="business">
          <BusinessTab />
        </TabsContent>
        <TabsContent value="billing">
          <BillingTab />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
