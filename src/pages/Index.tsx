import { useState } from "react";
import { Plus, Trash2, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import MembersModal, { type Member } from "@/components/jury/MembersModal";

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
  members: Member[];
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

/* ── Field row (label + content) ── */
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
    <div className="grid grid-cols-[200px_1fr] items-center gap-6 px-6 py-4">
      <span
        className={
          secondary
            ? "text-[13px] text-muted-foreground leading-snug"
            : "text-[13px] font-semibold text-foreground"
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
    <div className="flex items-center gap-3 px-6 py-1.5 bg-muted/60">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] select-none">
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
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      {/* Name */}
      <FieldRow label="Nom">
        <span className="text-sm text-foreground">{jury.name}</span>
      </FieldRow>

      <div className="border-t border-border" />

      {/* Criteria */}
      {jury.criteria.map((c, i) => (
        <div key={c.id}>
          {i > 0 && <AndDivider />}
          <FieldRow
            label={TYPE_OPTIONS.find((t) => t.value === c.type)?.label ?? ""}
            secondary
          >
            <Badge variant={c.type}>{VALUE_DISPLAY[c.value] ?? c.value}</Badge>
          </FieldRow>
        </div>
      ))}

      <div className="border-t border-border" />

      {/* Members */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-[13px] text-muted-foreground">
            Ce jury est actuellement composé de <strong className="text-foreground font-medium">{jury.members.length} membre{jury.members.length !== 1 ? "s" : ""}</strong>
          </span>
        </div>
        <button
          onClick={onOpenMembers}
          className="text-[13px] font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Voir et modifier les membres
        </button>
      </div>

      <div className="border-t border-border" />

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 px-6 py-3">
        <Button size="sm" onClick={onEdit}>
          Modifier
        </Button>
        <button
          onClick={onDelete}
          className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
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
    const available = (["category", "stage", "network"] as CriterionType[]).filter(
      (t) => !usedTypes.includes(t)
    );
    if (!available.length) return;
    onChange({ ...jury, criteria: [...jury.criteria, { id: uid(), type: available[0], value: "" }] });
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
      className="border border-primary/25 rounded-lg bg-card overflow-hidden shadow-sm"
    >
      {/* Name */}
      <FieldRow label="Nom" required>
        <Input
          value={jury.name}
          onChange={(e) => onChange({ ...jury, name: e.target.value })}
          placeholder="Ex : Jury Innovation"
        />
      </FieldRow>

      <div className="border-t border-border" />

      {/* Criteria */}
      <AnimatePresence initial={false}>
        {jury.criteria.map((criterion, i) => {
          const availableTypes = TYPE_OPTIONS.filter(
            (t) => t.value === criterion.type || !usedTypes.includes(t.value)
          );
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
                  {jury.criteria.length > 1 && (
                    <button
                      onClick={() => removeCriterion(criterion.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </FieldRow>

              {/* Value */}
              <FieldRow label={VALUE_LABEL_MAP[criterion.type]} required>
                <Select
                  value={criterion.value}
                  onValueChange={(val) => updateCriterion(criterion.id, { value: val })}
                >
                  <SelectTrigger>
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
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="border-t border-border" />

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-3">
        {usedTypes.length < 3 ? (
          <button
            onClick={addCriterion}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Ajouter un critère
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Annuler
          </Button>
          <Button size="sm" onClick={onSave}>
            Sauvegarder
          </Button>
          <button
            onClick={onDelete}
            className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
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

  const updateMembers = (juryId: string, members: Member[]) => {
    setJuries(juries.map((j) => (j.id === juryId ? { ...j, members } : j)));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-accent/50 border-b border-primary/10 px-6 py-5">
        <h1 className="text-sm font-bold text-foreground uppercase tracking-wide">
          Création des jurys
        </h1>
        <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed max-w-2xl">
          Un jury est un groupe d'utilisateurs qui évalue des projets. Commencez par choisir le nom
          du jury et le type de projet qu'il peut modérer, puis composez le jury. Vous pouvez
          désormais <strong className="text-foreground font-medium">croiser plusieurs critères</strong> pour
          affiner le périmètre.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-5">
        {/* Create link */}
        <button
          onClick={startNew}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
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
