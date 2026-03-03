import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type CriterionType = "category" | "stage" | "network";

interface Criterion {
  id: string;
  type: CriterionType;
  value: string;
}

interface JuryData {
  id: string;
  name: string;
  criteria: Criterion[];
}

const TYPE_OPTIONS: { value: CriterionType; label: string }[] = [
  { value: "category", label: "Les projets associés à une certaine catégorie" },
  { value: "stage", label: "Les projets associés à une certaine étape" },
  { value: "network", label: "Les projets proposés par un certain réseau" },
];

const VALUE_OPTIONS: Record<CriterionType, { value: string; label: string }[]> = {
  category: [
    { value: "ecologie", label: "🇫🇷 Écologie  🇬🇧 Ecology" },
    { value: "innovation", label: "🇫🇷 Innovation  🇬🇧 Innovation" },
    { value: "social", label: "🇫🇷 Social  🇬🇧 Social" },
    { value: "digital", label: "🇫🇷 Digital  🇬🇧 Digital" },
    { value: "rse", label: "🇫🇷 RSE  🇬🇧 CSR" },
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

const VALUE_LABEL_MAP: Record<CriterionType, string> = {
  category: "Catégorie",
  stage: "Étape",
  network: "Réseau",
};

const VALUE_DISPLAY: Record<string, string> = {
  ecologie: "🇫🇷 Écologie  🇬🇧 Ecology",
  innovation: "Innovation",
  social: "Social",
  digital: "Digital",
  rse: "RSE",
  ideation: "Idéation",
  prototypage: "Prototypage",
  experimentation: "Expérimentation",
  deploiement: "Déploiement",
  rh: "Ressources Humaines",
  tech: "Tech & Innovation",
  marketing: "Marketing",
  direction: "Direction Générale",
};

let counter = 0;
const uid = () => `c_${++counter}`;

export default function JuryPage() {
  const [juries, setJuries] = useState<JuryData[]>([
    {
      id: "j1",
      name: "Jury RSE",
      criteria: [
        { id: "x1", type: "category", value: "ecologie" },
        { id: "x2", type: "stage", value: "prototypage" },
      ],
    },
  ]);

  const [editing, setEditing] = useState<JuryData | null>(null);

  const startNew = () => {
    setEditing({ id: `j_${Date.now()}`, name: "", criteria: [{ id: uid(), type: "category", value: "" }] });
  };

  const usedTypes = editing?.criteria.map((c) => c.type) ?? [];

  const addCriterion = () => {
    if (!editing) return;
    const available = (["category", "stage", "network"] as CriterionType[]).filter(
      (t) => !usedTypes.includes(t)
    );
    if (!available.length) return;
    setEditing({ ...editing, criteria: [...editing.criteria, { id: uid(), type: available[0], value: "" }] });
  };

  const updateCriterion = (id: string, updates: Partial<Criterion>) => {
    if (!editing) return;
    setEditing({
      ...editing,
      criteria: editing.criteria.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  };

  const removeCriterion = (id: string) => {
    if (!editing || editing.criteria.length <= 1) return;
    setEditing({ ...editing, criteria: editing.criteria.filter((c) => c.id !== id) });
  };

  const save = () => {
    if (!editing) return;
    if (!editing.name.trim()) { toast.error("Veuillez saisir un nom"); return; }
    if (editing.criteria.some((c) => !c.value)) { toast.error("Veuillez remplir tous les critères"); return; }
    const exists = juries.find((j) => j.id === editing.id);
    setJuries(exists ? juries.map((j) => (j.id === editing.id ? editing : j)) : [...juries, editing]);
    setEditing(null);
    toast.success("Jury sauvegardé");
  };

  const deleteJury = (id: string) => {
    setJuries(juries.filter((j) => j.id !== id));
    if (editing?.id === id) setEditing(null);
    toast.success("Jury supprimé");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-accent/60 border-b border-primary/10 px-6 py-4">
        <h1 className="text-base font-semibold text-foreground uppercase tracking-wide">Création des jurys</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Un jury est un groupe d'utilisateurs qui évalue des projets. Commencez par choisir le nom du jury et le type de projet qu'il peut modérer, puis composez le jury.
          Vous pouvez désormais <strong>croiser plusieurs critères</strong> pour affiner le périmètre.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Add button */}
        <button
          onClick={startNew}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Créer un jury
        </button>

        {/* Editing form */}
        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border border-border rounded-lg bg-card">
                {/* Jury name row */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
                  <label className="text-sm font-semibold text-foreground whitespace-nowrap min-w-[200px]">
                    Nom <span className="text-primary">*</span>
                  </label>
                  <Input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="Ex : Jury Innovation"
                    className="flex-1"
                  />
                </div>

                {/* Criteria */}
                {editing.criteria.map((criterion, i) => {
                  const availableTypes = TYPE_OPTIONS.filter(
                    (t) => t.value === criterion.type || !usedTypes.includes(t.value)
                  );
                  return (
                    <motion.div
                      key={criterion.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-border last:border-b-0"
                    >
                      {/* AND separator */}
                      {i > 0 && (
                        <div className="px-6 py-2 bg-secondary/50">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">ET</span>
                        </div>
                      )}

                      {/* Type selector */}
                      <div className="flex items-center gap-4 px-6 py-4">
                        <label className="text-sm font-semibold text-foreground whitespace-nowrap min-w-[200px]">
                          Quels projets modérer ? <span className="text-primary">*</span>
                        </label>
                        <div className="flex-1 flex items-center gap-2">
                          <Select
                            value={criterion.type}
                            onValueChange={(val) =>
                              updateCriterion(criterion.id, { type: val as CriterionType, value: "" })
                            }
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableTypes.map((t) => (
                                <SelectItem key={t.value} value={t.value}>
                                  {t.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {editing.criteria.length > 1 && (
                            <button
                              onClick={() => removeCriterion(criterion.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Value selector */}
                      <div className="flex items-center gap-4 px-6 pb-4">
                        <label className="text-sm font-semibold text-foreground whitespace-nowrap min-w-[200px]">
                          {VALUE_LABEL_MAP[criterion.type]} <span className="text-primary">*</span>
                        </label>
                        <Select
                          value={criterion.value}
                          onValueChange={(val) => updateCriterion(criterion.id, { value: val })}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Choisissez une valeur" />
                          </SelectTrigger>
                          <SelectContent>
                            {VALUE_OPTIONS[criterion.type].map((v) => (
                              <SelectItem key={v.value} value={v.value}>
                                {v.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Add criterion + Actions */}
                <div className="px-6 py-4 flex items-center justify-between bg-secondary/30">
                  <div>
                    {usedTypes.length < 3 && (
                      <button
                        onClick={addCriterion}
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Ajouter un critère
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={save}>
                      Sauvegarder
                    </Button>
                    <button
                      onClick={() => deleteJury(editing.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing juries */}
        {juries
          .filter((j) => j.id !== editing?.id)
          .map((jury) => (
            <div key={jury.id} className="border border-border rounded-lg bg-card">
              <div className="flex items-center gap-4 px-6 py-4 border-b border-border">
                <label className="text-sm font-semibold text-foreground min-w-[200px]">Nom</label>
                <span className="text-sm text-foreground">{jury.name}</span>
              </div>
              {jury.criteria.map((c, i) => (
                <div key={c.id}>
                  {i > 0 && (
                    <div className="px-6 py-2 bg-secondary/50">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">ET</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 px-6 py-3 border-b border-border last:border-b-0">
                    <span className="text-sm text-muted-foreground min-w-[200px]">
                      {TYPE_OPTIONS.find((t) => t.value === c.type)?.label}
                    </span>
                    <Badge variant={c.type}>{VALUE_DISPLAY[c.value] ?? c.value}</Badge>
                  </div>
                </div>
              ))}
              <div className="px-6 py-3 flex items-center justify-end gap-2 bg-secondary/30">
                <Button
                  size="sm"
                  onClick={() => setEditing({ ...jury, criteria: jury.criteria.map((c) => ({ ...c })) })}
                >
                  Sauvegarder
                </Button>
                <button
                  onClick={() => deleteJury(jury.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
