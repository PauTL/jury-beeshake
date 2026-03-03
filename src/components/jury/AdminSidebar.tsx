import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  FileText,
  Settings,
  Shield,
  Zap,
  Users,
  Award,
} from "lucide-react";

const SECTIONS = [
  {
    title: "Paramètres essentiels",
    items: [
      { icon: LayoutGrid, label: "Attributs" },
      { icon: FileText, label: "Formulaire de soumission" },
      { icon: Shield, label: "Modération" },
      { icon: Zap, label: "Activations" },
    ],
  },
  {
    title: "Paramètres avancés",
    items: [
      { icon: Award, label: "Jurys", active: true },
      { icon: Users, label: "Administrateurs" },
    ],
  },
];

export default function AdminSidebar() {
  return (
    <nav className="w-56 shrink-0 space-y-6">
      {SECTIONS.map((section) => (
        <div key={section.title}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {section.title}
          </h3>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.label}>
                <button
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
