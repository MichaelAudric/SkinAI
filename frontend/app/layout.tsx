import AuthProvider from "@/components/auth/AuthProvider";
import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen text-gray-900 overflow-x-hidden">
        {/* MAIN BLUE GRADIENT BACKGROUND */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-white" />

        {/* SOFT BLUE DEPTH LAYER */}
        <div className="fixed inset-0 bg-gradient-to-tr from-blue-200/20 via-transparent to-blue-300/10" />

        {/* VERY SUBTLE NOISE (optional premium feel) */}
        <div className="fixed inset-0 opacity-[0.03] bg-[url('/images/noise.png')]" />

        {/* CENTER FOCUS VIGNETTE */}
        <div className="fixed inset-0 bg-radial from-transparent via-transparent to-blue-900/5" />

        {/* CONTENT */}
        <div className="relative z-20">
          <AuthProvider>
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-8 bg-transparent">
              {children}
            </main>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
