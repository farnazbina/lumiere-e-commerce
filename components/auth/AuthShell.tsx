import Image from "next/image";

export default function AuthShell({ children, size = "login" }: { children: React.ReactNode; size?: "compact" | "login" }) {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden px-4 py-10">
      <Image src="/images/luxury-banner.png" alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-stone-950/50" />
      <div className={`relative z-10 w-full border border-border bg-card p-5 shadow-2xl sm:p-7 ${size === "compact" ? "max-w-sm" : "max-w-md"}`}>{children}</div>
    </main>
  );
}
