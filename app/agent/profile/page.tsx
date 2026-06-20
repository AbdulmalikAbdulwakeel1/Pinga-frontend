"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  Shield,
  Camera,
  Bell,
  MessageSquare,
  Lock,
  Eye,
  EyeOff,
  Circle,
  Save,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function AgentProfilePage() {
  // Profile form state
  const [firstName, setFirstName] = useState("Chidi");
  const [lastName, setLastName] = useState("Nwosu");
  const [email, setEmail] = useState("chidi@pinga.ng");
  const [phone, setPhone] = useState("+234 803 456 7890");
  const [role] = useState("Agent");

  // Availability status
  const [availability, setAvailability] = useState<
    "online" | "away" | "offline"
  >("online");

  // Notification preferences
  const [notifications, setNotifications] = useState({
    newConversation: true,
    newLead: true,
    orderUpdate: true,
    teamMention: true,
    emailDigest: false,
    soundAlerts: true,
  });

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const availabilityConfig = {
    online: {
      color: "bg-green-500",
      label: "Online",
      badgeClass:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    away: {
      color: "bg-yellow-500",
      label: "Away",
      badgeClass:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    offline: {
      color: "bg-gray-400",
      label: "Offline",
      badgeClass:
        "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    },
  };

  const handleSaveProfile = () => {
    alert("Profile saved successfully!");
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    alert("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Profile Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile Card */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <User className="size-5 text-[#FF6B2C]" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="size-20">
                    <AvatarFallback className="bg-[#FF6B2C]/10 text-xl font-bold text-[#FF6B2C]">
                      CN
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-background bg-[#FF6B2C] text-white transition-colors hover:bg-[#FF6B2C]/90">
                    <Camera className="size-3.5" />
                  </button>
                </div>
                <div>
                  <p className="text-base font-semibold">
                    {firstName} {lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{role}</p>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "mt-1 text-xs font-semibold",
                      availabilityConfig[availability].badgeClass
                    )}
                  >
                    <Circle
                      className={cn(
                        "mr-0.5 size-2 fill-current",
                        availability === "online" && "text-green-500",
                        availability === "away" && "text-yellow-500",
                        availability === "offline" && "text-gray-400"
                      )}
                    />
                    {availabilityConfig[availability].label}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="relative">
                    <Shield className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="role"
                      value={role}
                      disabled
                      className="pl-9 text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90"
                  onClick={handleSaveProfile}
                >
                  <Save className="mr-1.5 size-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Lock className="size-5 text-[#FF6B2C]" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      setShowCurrentPassword(!showCurrentPassword)
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={handleChangePassword}>
                  <Lock className="mr-1.5 size-4" />
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Availability & Notifications */}
        <div className="space-y-6">
          {/* Availability Status */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-sm">Availability Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Set your availability to let the team and customers know when
                you&apos;re reachable.
              </p>
              <Select
                value={availability}
                onValueChange={(val) =>
                  setAvailability(val as typeof availability)
                }
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Circle
                      className={cn(
                        "size-2.5 fill-current",
                        availability === "online" && "text-green-500",
                        availability === "away" && "text-yellow-500",
                        availability === "offline" && "text-gray-400"
                      )}
                    />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">
                    <div className="flex items-center gap-2">
                      <Circle className="size-2.5 fill-green-500 text-green-500" />
                      Online
                    </div>
                  </SelectItem>
                  <SelectItem value="away">
                    <div className="flex items-center gap-2">
                      <Circle className="size-2.5 fill-yellow-500 text-yellow-500" />
                      Away
                    </div>
                  </SelectItem>
                  <SelectItem value="offline">
                    <div className="flex items-center gap-2">
                      <Circle className="size-2.5 fill-gray-400 text-gray-400" />
                      Offline
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Bell className="size-4 text-[#FF6B2C]" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: "newConversation" as const,
                  label: "New Conversations",
                  description: "When a new conversation is assigned to you",
                  icon: MessageSquare,
                },
                {
                  key: "newLead" as const,
                  label: "New Leads",
                  description: "When a new lead is assigned to you",
                  icon: User,
                },
                {
                  key: "orderUpdate" as const,
                  label: "Order Updates",
                  description: "When an order status changes",
                  icon: Shield,
                },
                {
                  key: "teamMention" as const,
                  label: "Team Mentions",
                  description: "When a teammate mentions you",
                  icon: User,
                },
                {
                  key: "emailDigest" as const,
                  label: "Daily Email Digest",
                  description: "Receive a summary every morning",
                  icon: Mail,
                },
                {
                  key: "soundAlerts" as const,
                  label: "Sound Alerts",
                  description: "Play notification sounds",
                  icon: Bell,
                },
              ].map((pref) => (
                <div
                  key={pref.key}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {pref.description}
                    </p>
                  </div>
                  <Switch
                    checked={notifications[pref.key]}
                    onCheckedChange={() => toggleNotification(pref.key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
