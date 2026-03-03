import { useState } from "react";
import { Search, X, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const ALL_USERS: Member[] = [
  { id: "u1", name: "Marie Dupont", email: "marie.dupont@entreprise.com" },
  { id: "u2", name: "Jean Martin", email: "jean.martin@entreprise.com" },
  { id: "u3", name: "Sophie Bernard", email: "sophie.bernard@entreprise.com" },
  { id: "u4", name: "Pierre Leroy", email: "pierre.leroy@entreprise.com" },
  { id: "u5", name: "Camille Moreau", email: "camille.moreau@entreprise.com" },
  { id: "u6", name: "Lucas Petit", email: "lucas.petit@entreprise.com" },
  { id: "u7", name: "Emma Richard", email: "emma.richard@entreprise.com" },
  { id: "u8", name: "Hugo Thomas", email: "hugo.thomas@entreprise.com" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface MembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  onMembersChange: (members: Member[]) => void;
  juryName: string;
}

export default function MembersModal({
  open,
  onOpenChange,
  members,
  onMembersChange,
  juryName,
}: MembersModalProps) {
  const [search, setSearch] = useState("");

  const memberIds = new Set(members.map((m) => m.id));

  const filteredUsers = ALL_USERS.filter(
    (u) =>
      !memberIds.has(u.id) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const addMember = (user: Member) => {
    onMembersChange([...members, user]);
    toast.success(`${user.name} ajouté(e) au jury`);
  };

  const removeMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    onMembersChange(members.filter((m) => m.id !== id));
    if (member) toast.success(`${member.name} retiré(e) du jury`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Membres du jury</DialogTitle>
          <DialogDescription className="text-[13px]">
            Gérez les membres de <strong>{juryName}</strong>
          </DialogDescription>
        </DialogHeader>

        {/* Current members */}
        {members.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
              Membres actuels ({members.length})
            </span>
            <div className="border border-border rounded-md divide-y divide-border max-h-48 overflow-y-auto">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 px-3 py-2.5"
                >
                  <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-semibold shrink-0">
                    {getInitials(m.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                    <p className="text-[12px] text-muted-foreground truncate">{m.email}</p>
                  </div>
                  <button
                    onClick={() => removeMember(m.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & add */}
        <div className="space-y-1.5">
          <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
            Ajouter un membre
          </span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou email…"
              className="pl-9"
            />
          </div>
          {search.length > 0 && (
            <div className="border border-border rounded-md divide-y divide-border max-h-40 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <p className="text-[13px] text-muted-foreground px-3 py-3 text-center">
                  Aucun utilisateur trouvé
                </p>
              ) : (
                filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => addMember(u)}
                    className="flex items-center gap-3 px-3 py-2.5 w-full text-left hover:bg-accent/50 transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[11px] font-semibold shrink-0">
                      {getInitials(u.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{u.name}</p>
                      <p className="text-[12px] text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <UserPlus className="h-4 w-4 text-primary shrink-0" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Close */}
        <div className="flex justify-end pt-2">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
