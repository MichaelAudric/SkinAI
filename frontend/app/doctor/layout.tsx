"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const user = await apiFetch("/me");

        // not doctor → kick out
        if (user.role !== "doctor") {
          router.replace("/");
          return;
        }

        // doctor but not approved → send to pending page
        if (!user.is_approved) {
          router.replace("/pending_approval");
          return;
        }

        setAllowed(true);
      } catch {
        router.replace("/login");
      }
    };

    check();
  }, []);

  if (!allowed) return null;

  return <>{children}</>;
}
