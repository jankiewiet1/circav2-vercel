import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import {
  Flame,
  Wind,
  Truck
} from "lucide-react";

export const EmissionsSidebar = () => {
  const router = useRouter();
  
  const isActive = (path: string) => {
    return router.pathname === path;
  };
  
  return (
    <div className="w-full border-r h-full py-6">
      <div className="px-6 mb-8">
        <h2 className="text-xl font-semibold mb-1">Emissions</h2>
        <p className="text-sm text-muted-foreground">Monitor and manage your carbon footprint</p>
      </div>
      
      <nav className="space-y-1 px-2">
        <Link
          href="/emissions/scope1"
          className={cn(
            "flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors",
            isActive("/emissions/scope1")
              ? "bg-accent text-accent-foreground font-medium"
              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
          )}
        >
          <Flame size={16} />
          <span>Scope 1 Emissions</span>
        </Link>

        <Link
          href="/emissions/scope2"
          className={cn(
            "flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors",
            isActive("/emissions/scope2")
              ? "bg-accent text-accent-foreground font-medium"
              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
          )}
        >
          <Wind size={16} />
          <span>Scope 2 Emissions</span>
        </Link>

        <Link
          href="/emissions/scope3"
          className={cn(
            "flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors",
            isActive("/emissions/scope3")
              ? "bg-accent text-accent-foreground font-medium"
              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
          )}
        >
          <Truck size={16} />
          <span>Scope 3 Emissions</span>
        </Link>
      </nav>
    </div>
  );
};
