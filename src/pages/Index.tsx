import { useState } from "react";
import { Plus, Trash2, Users, X, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import MembersModal, { type Member } from "@/components/jury/MembersModal";

type CriterionType = "all" | "category" | "stage" | "network";

interface Criterion {
  id: string;
  type: CriterionType;
  value: string;
}

interface JuryData {
  id: string;
  name: string;
  criteria: Criterion[];
  members: Member[];
}

const TYPE_OPTIONS: { value: CriterionType; label: string }[] = [
  { value: "all", label: "Tous les projets" },
  { value: "category", label: "Les projets associés à une certaine catégorie" },
  { value: "stage", label: "Les projets associés à une certaine étape" },
  { value: "network", label: "Les projets proposés par un certain réseau" },
];

const VALUE_OPTIONS: Partial<Record<CriterionType, { value: string; label: string }[]>> = {
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
  all: "",
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

/* ── Field row ── */
function FieldRow({
  label,
  required,
  children,
  secondary,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <div className="grid grid-cols-[220px_1fr] items-center gap-6 px-6 py-4">
      <span
        className={
          secondary
            ? "text-[13px] text-muted-foreground leading-snug"
            : "text-[13px] font-semibold text-foreground tracking-tight"
        }
      >
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </span>
      <div>{children}</div>
    </div>
  );
}

/* ── AND divider ── */
function AndDivider() {
  return (
    <div className="flex items-center gap-3 px-8">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] select-none py-1">
        et
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ── Jury card (read mode) ── */
function JuryCard({
  jury,
  onEdit,
  onDelete,
  onOpenMembers,
}: {
  jury: JuryData;
  onEdit: () => void;
  onDelete: () => void;
  onOpenMembers: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-xl bg-card overflow-hidden transition-shadow duration-300"
      style={{ boxShadow: "var(--shadow-card)" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-card-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-card)")}
    >
      {/* Name header */}
      <div className="px-6 py-4 bg-gradient-to-r from-accent/60 to-accent/30">
        <span className="text-[15px] font-semibold text-foreground tracking-tight">{jury.name}</span>
      </div>

      {/* Criteria */}
      <div className="py-1">
        {jury.criteria.map((c, i) => (
          <div key={c.id}>
            {i > 0 && <AndDivider />}
            {c.type === "all" ? (
              <FieldRow label="Tous les projets" secondary>
                <span className="text-sm text-foreground" />
              </FieldRow>
            ) : (
              <FieldRow
                label={TYPE_OPTIONS.find((t) => t.value === c.type)?.label ?? ""}
                secondary
              >
                <span className="text-sm text-foreground">{VALUE_DISPLAY[c.value] ?? c.value}</span>
              </FieldRow>
            )}
          </div>
        ))}
      </div>

      {/* Members */}
      <div className="border-t border-border/60">
        <button
          onClick={onOpenMembers}
          className="flex items-center justify-between w-full px-6 py-3.5 hover:bg-accent/30 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-primary/8 flex items-center justify-center">
              <Users className="h-3.5 w-3.5 text-primary/70" />
            </div>
            <span className="text-[13px] text-muted-foreground">
              Composé de <strong className="text-foreground font-medium">{jury.members.length} membre{jury.members.length !== 1 ? "s" : ""}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1 text-[12px] font-medium text-primary/80 group-hover:text-primary transition-colors">
            Voir et modifier les membres
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </button>
      </div>

      {/* Actions */}
      <div className="border-t border-border/60 flex items-center justify-end gap-2 px-6 py-3">
        <Button size="sm" variant="outline" className="text-[12px] h-8" onClick={onEdit}>
          Modifier
        </Button>
        <button
          onClick={onDelete}
          className="text-muted-foreground/50 hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/8"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

/* ── Jury edit form ── */
function JuryForm({
  jury,
  onChange,
  onSave,
  onCancel,
  onDelete,
}: {
  jury: JuryData;
  onChange: (j: JuryData) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const usedTypes = jury.criteria.map((c) => c.type);

  const addCriterion = () => {
    const specificUsed = usedTypes.filter((t) => t !== "all");
    if (specificUsed.length >= 3) return;
    onChange({ ...jury, criteria: [...jury.criteria, { id: uid(), type: "" as CriterionType, value: "" }] });
  };

  const updateCriterion = (id: string, updates: Partial<Criterion>) => {
    onChange({
      ...jury,
      criteria: jury.criteria.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  };

  const removeCriterion = (id: string) => {
    if (jury.criteria.length <= 1) return;
    onChange({ ...jury, criteria: jury.criteria.filter((c) => c.id !== id) });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="rounded-xl bg-card overflow-hidden ring-2 ring-primary/20"
      style={{ boxShadow: "var(--shadow-card-hover)" }}
    >
      {/* Name */}
      <div className="px-6 py-4 bg-gradient-to-r from-primary/6 to-transparent">
        <FieldRow label="Nom du jury" required>
          <Input
            value={jury.name}
            onChange={(e) => onChange({ ...jury, name: e.target.value })}
            placeholder="Ex : Jury Innovation"
            className="bg-card"
          />
        </FieldRow>
      </div>

      <div className="border-t border-border/60" />

      {/* Criteria */}
      <AnimatePresence initial={false}>
        {jury.criteria.map((criterion, i) => {
          const availableTypes = TYPE_OPTIONS.filter(
            (t) => t.value === criterion.type || !usedTypes.includes(t.value)
          );
          const needsValue = criterion.type && criterion.type !== "all" && VALUE_OPTIONS[criterion.type];
          return (
            <motion.div
              key={criterion.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {i > 0 && <AndDivider />}

              {/* Type */}
              <FieldRow label="Quels projets ce jury peut-il modérer ?" required>
                <div className="flex items-center gap-2">
                  <Select
                    value={criterion.type || undefined}
                    onValueChange={(val) =>
                      updateCriterion(criterion.id, { type: val as CriterionType, value: val === "all" ? "all" : "" })
                    }
                  >
                    <SelectTrigger className="flex-1 bg-card">
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {jury.criteria.length > 1 && (
                    <button
                      onClick={() => removeCriterion(criterion.id)}
                      className="text-muted-foreground/50 hover:text-destructive transition-colors p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </FieldRow>

              {/* Value — only if type needs a sub-selection */}
              {needsValue && (
                <FieldRow label={VALUE_LABEL_MAP[criterion.type]} required>
                  <Select
                    value={criterion.value}
                    onValueChange={(val) => updateCriterion(criterion.id, { value: val })}
                  >
                    <SelectTrigger className="bg-card">
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
                </FieldRow>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="border-t border-border/60" />

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-3.5">
        {usedTypes.filter((t) => t !== "all").length < 3 ? (
          <button
            onClick={addCriterion}
            className="text-[13px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Ajouter un critère
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-[12px] h-8" onClick={onCancel}>
            Annuler
          </Button>
          <Button size="sm" className="text-[12px] h-8 px-5" onClick={onSave}>
            Sauvegarder
          </Button>
          <button
            onClick={onDelete}
            className="text-muted-foreground/50 hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/8"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Page ── */
export default function JuryPage() {
  const [juries, setJuries] = useState<JuryData[]>([
    {
      id: "j1",
      name: "Jury RSE",
      criteria: [
        { id: "x1", type: "category", value: "ecologie" },
        { id: "x2", type: "stage", value: "prototypage" },
      ],
      members: [
        { id: "u1", name: "Marie Dupont", email: "marie.dupont@entreprise.com" },
        { id: "u3", name: "Sophie Bernard", email: "sophie.bernard@entreprise.com" },
      ],
    },
  ]);
  const [editing, setEditing] = useState<JuryData | null>(null);
  const [membersJuryId, setMembersJuryId] = useState<string | null>(null);

  const membersJury = juries.find((j) => j.id === membersJuryId) ?? null;

  const startNew = () => {
    setEditing({ id: `j_${Date.now()}`, name: "", criteria: [{ id: uid(), type: "category", value: "" }], members: [] });
  };

  const save = () => {
    if (!editing) return;
    if (!editing.name.trim()) { toast.error("Veuillez saisir un nom"); return; }
    if (editing.criteria.some((c) => !c.type)) { toast.error("Veuillez remplir tous les critères"); return; }
    if (editing.criteria.some((c) => c.type !== "all" && !c.value)) { toast.error("Veuillez remplir tous les critères"); return; }
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

  const updateMembers = (juryId: string, members: Member[]) => {
    setJuries(juries.map((j) => (j.id === juryId ? { ...j, members } : j)));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-gradient-to-br from-accent via-accent/40 to-background border-b border-border/50 px-8 py-7">
        <h1 className="text-base font-bold text-foreground tracking-tight">
          Création des jurys
        </h1>
        <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed max-w-2xl">
          Un jury est un groupe d'utilisateurs qui évalue des projets. Commencez par choisir le nom
          du jury et le type de projet qu'il peut modérer, puis composez le jury. Vous pouvez
          désormais <strong className="text-foreground font-medium">croiser plusieurs critères</strong> pour
          affiner le périmètre.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8 space-y-5">
        {/* Create button */}
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors group"
        >
          <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
            <Plus className="h-3.5 w-3.5" />
          </div>
          Créer un jury
        </button>

        {/* Edit form */}
        <AnimatePresence>
          {editing && (
            <JuryForm
              key={editing.id}
              jury={editing}
              onChange={setEditing}
              onSave={save}
              onCancel={() => setEditing(null)}
              onDelete={() => deleteJury(editing.id)}
            />
          )}
        </AnimatePresence>

        {/* Existing juries */}
        {juries
          .filter((j) => j.id !== editing?.id)
          .map((jury) => (
            <JuryCard
              key={jury.id}
              jury={jury}
              onEdit={() =>
                setEditing({ ...jury, criteria: jury.criteria.map((c) => ({ ...c })) })
              }
              onDelete={() => deleteJury(jury.id)}
              onOpenMembers={() => setMembersJuryId(jury.id)}
            />
          ))}
      </div>

      {/* Members modal */}
      {membersJury && (
        <MembersModal
          open={!!membersJuryId}
          onOpenChange={(open) => { if (!open) setMembersJuryId(null); }}
          members={membersJury.members}
          onMembersChange={(m) => updateMembers(membersJury.id, m)}
          juryName={membersJury.name}
        />
      )}
    </div>
  );
}
