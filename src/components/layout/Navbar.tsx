import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export function Navbar() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-subtle bg-bg-secondary/80 px-6 backdrop-blur-md">
      {/* Brand / Logo placeholder or spacer */}
      <div className="flex items-center gap-2">
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-text-secondary hover:text-text-primary">
          <Bell className="h-5 w-5" />
        </Button>
        {user && (
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-3 rounded-full transition-colors hover:bg-white/5 pr-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-bg-primary text-xs font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </button>
        )}
      </div>
    </header>
  );
}
