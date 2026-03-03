import { useState } from "react";
import { Plus, Users, Save, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import CriterionRow, { type Criterion, type CriterionType } from "./CriterionRow";

const CRITERION_LABELS: Record<CriterionType, string> = {
  category: "Catégorie",
  stage: "Étape",
  network: "Réseau",
};

const MOCK_VALUE_LABELS: Record<string, string> = {
  ecologie: "🌿 Écologie",
  innovation: "💡 Innovation",
  social: "🤝 Social",
  digital: "💻 Digital",
  rse: "🌍 RSE",
  ideation: "Idéation",
  prototypage: "Prototypage",
  experimentation: "Expérimentation",
  deploiement: "Déploiement",
  rh: "Ressources Humaines",
  tech: "Tech & Innovation",
  marketing: "Marketing",
  direction: "Direction Générale",
};

let idCounter = 0;
const newId = () => `crit_${++idCounter}`;

interface JuryData {
  id: string;
  name: string;
  criteria: Criterion[];
}

export default function JuryCreationForm() {
  const [juries, setJuries] = useState<JuryData[]>([
    {
      id: "jury_1",
      name: "Jury RSE",
      criteria: [
        { id: "c1", type: "category", value: "ecologie" },
        { id: "c2", type: "stage", value: "prototypage" },
      ],
    },
  ]);

  const [editingJury, setEditingJury] = useState<JuryData | null>(null);

  const startNewJury = () => {
    setEditingJury({
      id: `jury_${Date.now()}`,
      name: "",
      criteria: [{ id: newId(), type: "category", value: "" }],
    });
  };

  const addCriterion = () => {
    if (!editingJury) return;
    const usedTypes = editingJury.criteria.map((c) => c.type);
    const available = (["category", "stage", "network"] as CriterionType[]).filter(
      (t) => !usedTypes.includes(t)
    );
    if (available.length === 0) return;
    setEditingJury({
      ...editingJury,
      criteria: [...editingJury.criteria, { id: newId(), type: available[0], value: "" }],
    });
  };

  const updateCriterion = (id: string, updates: Partial<Criterion>) => {
    if (!editingJury) return;
    setEditingJury({
      ...editingJury,
      criteria: editingJury.criteria.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  };

  const removeCriterion = (id: string) => {
    if (!editingJury) return;
    if (editingJury.criteria.length <= 1) return;
    setEditingJury({
      ...editingJury,
      criteria: editingJury.criteria.filter((c) => c.id !== id),
    });
  };

  const saveJury = () => {
    if (!editingJury) return;
    if (!editingJury.name.trim()) {
      toast.error("Veuillez saisir un nom pour le jury");
      return;
    }
    if (editingJury.criteria.some((c) => !c.value)) {
      toast.error("Veuillez remplir tous les critères");
      return;
    }
    const exists = juries.find((j) => j.id === editingJury.id);
    if (exists) {
      setJuries(juries.map((j) => (j.id === editingJury.id ? editingJury : j)));
    } else {
      setJuries([...juries, editingJury]);
    }
    setEditingJury(null);
    toast.success("Jury sauvegardé avec succès");
  };

  const deleteJury = (id: string) => {
    setJuries(juries.filter((j) => j.id !== id));
    toast.success("Jury supprimé");
  };

  const editJury = (jury: JuryData) => {
    setEditingJury({ ...jury, criteria: jury.criteria.map((c) => ({ ...c })) });
  };

  const usedTypes = editingJury?.criteria.map((c) => c.type) ?? [];
  const canAddMore = usedTypes.length < 3;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-accent/60 rounded-xl p-5 border border-primary/10">
        <h2 className="text-lg font-semibold text-foreground mb-1">Création des jurys</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Un jury est un groupe d'utilisateurs qui évalue des projets. Vous pouvez combiner
          plusieurs critères pour affiner le périmètre de modération d'un jury.
        </p>
      </div>

      {/* Existing juries */}
      <div className="space-y-3">
        {juries.map((jury) => (
          <motion.div key={jury.id} layout>
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{jury.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {jury.criteria.map((c, i) => (
                        <span key={c.id} className="flex items-center gap-1">
                          {i > 0 && (
                            <span className="text-[10px] font-bold text-muted-foreground mx-0.5">ET</span>
                          )}
                          <Badge variant={c.type}>
                            {CRITERION_LABELS[c.type]}: {MOCK_VALUE_LABELS[c.value] ?? c.value}
                          </Badge>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => editJury(jury)}>
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => deleteJury(jury.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create / Edit form */}
      <AnimatePresence mode="wait">
        {editingJury ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <Card className="border-primary/20 shadow-lg shadow-primary/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">
                  {juries.find((j) => j.id === editingJury.id) ? "Modifier le jury" : "Nouveau jury"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Nom du jury <span className="text-primary">*</span>
                  </label>
                  <Input
                    placeholder="Ex : Jury Innovation Digitale"
                    value={editingJury.name}
                    onChange={(e) => setEditingJury({ ...editingJury, name: e.target.value })}
                    className="max-w-md"
                  />
                </div>

                {/* Criteria section */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Ce jury peut modérer les projets correspondant à : <span className="text-primary">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Ajoutez un ou plusieurs critères. Si plusieurs critères sont définis, le jury ne modère que les projets qui correspondent à <strong>tous</strong> les critères.
                  </p>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {editingJury.criteria.map((criterion, index) => (
                      <CriterionRow
                        key={criterion.id}
                        criterion={criterion}
                        index={index}
                        showAndLabel={index > 0}
                        usedTypes={usedTypes}
                        onUpdate={updateCriterion}
                        onRemove={removeCriterion}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {canAddMore && (
                  <Button variant="soft" size="sm" onClick={addCriterion} className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Ajouter un critère
                  </Button>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <Button onClick={saveJury} className="gap-2">
                    <Save className="h-4 w-4" />
                    Sauvegarder
                  </Button>
                  <Button variant="ghost" onClick={() => setEditingJury(null)}>
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="add-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Button variant="soft" onClick={startNewJury} className="gap-2">
              <Plus className="h-4 w-4" />
              Créer un jury
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
