"use client";

import { ClientSessionProvider } from "@/components/session-provider";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientSessionProvider>
      {children}
    </ClientSessionProvider>
  );
}