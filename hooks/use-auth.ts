import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post("/auth/login", data),
    onSuccess: (response: any) => {
      const { user, tokens } = response.data;
      Cookies.set("accessToken", tokens.accessToken, { expires: 7, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
      Cookies.set("refreshToken", tokens.refreshToken, { expires: 30, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
      Cookies.set("userRole", user.role, { expires: 7 });
      queryClient.setQueryData(["auth", "profile"], user);
      toast.success(`Welcome back, ${user.firstName}!`);
      router.push(user.role === "owner" ? "/owner/dashboard" : "/agent/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.message || "Login failed");
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      ownerFirstName: string;
      ownerLastName: string;
      ownerEmail: string;
      phone: string;
      password: string;
      businessName: string;
      businessCategory: string;
      businessSize: string;
      city: string;
    }) => api.post("/auth/register", {
      ...data,
      businessEmail: data.ownerEmail,
    }),
    onSuccess: (_: any, variables: any) => {
      toast.success("Registration successful! Check your email for the verification PIN.");
      router.push(`/auth/verify-email?email=${encodeURIComponent(variables.ownerEmail)}`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Registration failed");
    },
  });
}

export function useVerifyEmail() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; pin: string }) =>
      api.post("/auth/verify-email", data),
    onSuccess: (response: any) => {
      const { user, tokens } = response.data;
      Cookies.set("accessToken", tokens.accessToken, { expires: 7 });
      Cookies.set("refreshToken", tokens.refreshToken, { expires: 30 });
      Cookies.set("userRole", user.role, { expires: 7 });
      queryClient.setQueryData(["auth", "profile"], user);
      toast.success("Email verified! Welcome to Pinga!");
      router.push("/owner/dashboard");
    },
  });
}

export function useResendVerificationPin() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      api.post("/auth/resend-verification", data),
    onSuccess: () => {
      toast.success("Verification PIN resent to your email!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to resend PIN");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      api.post("/auth/forgot-password", data),
    onSuccess: () => {
      toast.success("Reset PIN sent to your email! Check your inbox.");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send reset PIN");
    },
  });
}

export function useVerifyResetPin() {
  return useMutation({
    mutationFn: (data: { email: string; pin: string }) =>
      api.post("/auth/verify-reset-pin", data),
    onError: (error: any) => {
      toast.error(error.message || "Invalid or expired PIN");
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; newPassword: string }) =>
      api.post("/auth/reset-password", data),
    onSuccess: () => {
      toast.success("Password reset successfully! Please sign in.");
      router.push("/auth/login");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reset password");
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => api.get("/auth/profile").then((r: any) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { firstName?: string; lastName?: string; phone?: string }) =>
      api.put("/auth/profile", data).then((r: any) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => api.post("/auth/logout", {}),
    onSettled: () => {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("userRole");
      queryClient.clear();
      router.push("/auth/login");
    },
  });
}
