"use client";

import { useProfile, useBusinessSocket } from "@/hooks";

export function SocketInitializer() {
  const { data: user } = useProfile();
  useBusinessSocket(user?.businessId);
  return null;
}
