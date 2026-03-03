import { Lightbulb } from "lucide-react";
import AdminSidebar from "@/components/jury/AdminSidebar";
import JuryCreationForm from "@/components/jury/JuryCreationForm";

const TABS = ["Vue d'ensemble", "Mon espace", "Modération", "Administration"];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Idéation</h1>
        </div>
        <nav className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={
                tab === "Administration"
                  ? "px-4 py-2 text-sm font-semibold text-foreground border-b-2 border-primary rounded-t-md"
                  : "px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {/* Main */}
      <div className="max-w-6xl mx-auto flex gap-8 p-6 pt-8">
        <AdminSidebar />
        <main className="flex-1 min-w-0">
          <JuryCreationForm />
        </main>
      </div>
    </div>
  );
};

export default Index;
