"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { apiFetch } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  async function handleLogout() {
    await apiFetch("/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }

  const navItems =
    user?.role === "doctor"
      ? [{ name: "Doctor Panel", href: "/doctor" }]
      : [
          { name: "Dashboard", href: "/dashboard" },
          { name: "History", href: "/history" },
        ];

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-white/20 bg-white/40 backdrop-blur-md backdrop-saturate-150 py-2">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-gray-900"
          >
            SkinAI
          </Link>

          {user && user.role !== "admin" && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/20 border border-white/20 shadow-sm">
              {navItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      active
                        ? "bg-white shadow text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* USER INFO (slightly more structured, same data) */}
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/20 border border-white/20 shadow-sm">
                <div className="flex flex-col text-right leading-tight">
                  <span className="text-sm font-medium text-gray-800">
                    {user.username}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="h-6 w-px bg-gray-200" />

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1.5 rounded-lg border border-white/20 bg-white/20 text-gray-700 hover:bg-white/40 hover:text-gray-900 transition shadow-sm cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
