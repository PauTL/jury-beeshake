import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type CriterionType = "category" | "stage" | "network";

export interface Criterion {
  id: string;
  type: CriterionType;
  value: string;
}

const CRITERION_LABELS: Record<CriterionType, string> = {
  category: "Catégorie",
  stage: "Étape de développement",
  network: "Réseau",
};

const MOCK_VALUES: Record<CriterionType, { value: string; label: string }[]> = {
  category: [
    { value: "ecologie", label: "🌿 Écologie" },
    { value: "innovation", label: "💡 Innovation" },
    { value: "social", label: "🤝 Social" },
    { value: "digital", label: "💻 Digital" },
    { value: "rse", label: "🌍 RSE" },
  ],
  stage: [
    { value: "ideation", label: "Idéation" },
    { value: "prototypage", label: "Prototypage" },
    { value: "experimentation", label: "Expérimentation" },
    { value: "deploiement", label: "Déploiement" },
  ],
  network: [
    { value: "rh", label: "Ressources Humaines" },
    { value: "tech", label: "Tech & Innovation" },
    { value: "marketing", label: "Marketing" },
    { value: "direction", label: "Direction Générale" },
  ],
};

interface CriterionRowProps {
  criterion: Criterion;
  index: number;
  showAndLabel: boolean;
  usedTypes: CriterionType[];
  onUpdate: (id: string, updates: Partial<Criterion>) => void;
  onRemove: (id: string) => void;
}

export default function CriterionRow({
  criterion,
  showAndLabel,
  usedTypes,
  onUpdate,
  onRemove,
}: CriterionRowProps) {
  const availableTypes = (["category", "stage", "network"] as CriterionType[]).filter(
    (t) => t === criterion.type || !usedTypes.includes(t)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="space-y-3"
    >
      {showAndLabel && (
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <Badge variant="secondary" className="text-xs font-semibold uppercase tracking-wider px-3">
            ET
          </Badge>
          <div className="h-px flex-1 bg-border" />
        </div>
      )}

      <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 relative group">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Type de critère</label>
            <Select
              value={criterion.type}
              onValueChange={(val) => onUpdate(criterion.id, { type: val as CriterionType, value: "" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {CRITERION_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {criterion.type === "category" && "Quelle catégorie ?"}
              {criterion.type === "stage" && "Quelle étape ?"}
              {criterion.type === "network" && "Quel réseau ?"}
            </label>
            <Select
              value={criterion.value}
              onValueChange={(val) => onUpdate(criterion.id, { value: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_VALUES[criterion.type].map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-5"
          onClick={() => onRemove(criterion.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
