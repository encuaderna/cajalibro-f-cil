import React, { useState, useCallback, useEffect } from "react";
import { History, RotateCcw, Trash2, Clock, Plus, Check, Pencil, X, ArrowRight, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSnapshots, saveSnapshot, deleteSnapshot, renameSnapshot, diffSnapshot } from "@/hooks/useSnapshots";

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora mismo";
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "ayer" : `hace ${days} días`;
}

function DiffBadge({ diffs }) {
  if (diffs.length === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">
        <Check className="h-3 w-3" /> Igual al actual
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full">
      <AlertCircle className="h-3 w-3" /> {diffs.length} cambio{diffs.length !== 1 ? "s" : ""}
    </span>
  );
}

function DiffTable({ diffs }) {
  if (diffs.length === 0) return null;
  return (
    <div className="mt-2 rounded-md border border-border overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-secondary/60">
            <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">Campo</th>
            <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">Snapshot</th>
            <th className="text-center px-1 py-1.5 text-muted-foreground">→</th>
            <th className="text-left px-2 py-1.5 font-medium text-muted-foreground">Actual</th>
          </tr>
        </thead>
        <tbody>
          {diffs.map((d) => (
            <tr key={d.field} className="border-t border-border/50">
              <td className="px-2 py-1.5 text-muted-foreground">{d.label}</td>
              <td className="px-2 py-1.5 font-mono text-foreground">{d.from}</td>
              <td className="px-1 py-1.5 text-center text-muted-foreground">
                <ArrowRight className="h-3 w-3 inline" />
              </td>
              <td className="px-2 py-1.5 font-mono text-primary">{d.to}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SnapshotCard({ snap, idx, total, current, onRestore, onDelete, onRename }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(snap.label);
  const [confirmDel, setConfirmDel] = useState(false);

  const diffs = diffSnapshot(snap, current);

  const handleRename = () => {
    if (editLabel.trim()) onRename(snap.id, editLabel.trim());
    setEditing(false);
  };

  const handleRestoreWithAutoSave = () => {
    // Auto-guardar estado actual antes de restaurar (si hay diferencias)
    if (diffs.length > 0) {
      saveSnapshot({
        dimensions: current.dimensions,
        boxType: current.boxType,
        material: current.material,
        label: `Auto-guardado antes de restaurar v${total - idx}`,
      });
    }
    onRestore(snap);
  };

  return (
    <div className="rounded-lg border border-border bg-card transition-colors hover:border-border/80">
      {/* Header de la card */}
      <div className="flex items-center gap-2 p-3">
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0">
          {total - idx}
        </span>

        {editing ? (
          <div className="flex gap-1.5 flex-1 min-w-0">
            <Input
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setEditing(false); }}
              className="h-7 text-xs flex-1"
              autoFocus
            />
            <Button size="sm" variant="ghost" onClick={handleRename} className="h-7 w-7 p-0"><Check className="h-3 w-3" /></Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="h-7 w-7 p-0"><X className="h-3 w-3" /></Button>
          </div>
        ) : (
          <div className="flex-1 min-w-0 flex items-center gap-1.5">
            <span className="text-sm font-medium text-foreground truncate">{snap.label}</span>
            <button onClick={() => setEditing(true)} className="opacity-0 group-hover:opacity-100 hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity">
              <Pencil className="h-3 w-3" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          <span className="text-xs text-muted-foreground hidden sm:block">{timeAgo(snap.savedAt)}</span>
          <DiffBadge diffs={diffs} />
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground p-0.5 transition-colors"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Detalle expandible */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-border/50 pt-3 space-y-3">
          {/* Datos del snapshot */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-md bg-secondary/60 px-2 py-1.5">
              <p className="text-muted-foreground mb-0.5">Libro</p>
              <p className="font-mono text-foreground">{snap.dimensions?.alto}×{snap.dimensions?.ancho}×{snap.dimensions?.profundidad}</p>
            </div>
            <div className="rounded-md bg-secondary/60 px-2 py-1.5">
              <p className="text-muted-foreground mb-0.5">Tipo</p>
              <p className="text-foreground truncate">{snap.boxType?.name || "—"}</p>
            </div>
            <div className="rounded-md bg-secondary/60 px-2 py-1.5">
              <p className="text-muted-foreground mb-0.5">Material</p>
              <p className="text-foreground truncate">{snap.material?.name || "—"}</p>
            </div>
          </div>

          {/* Tabla de diferencias */}
          {diffs.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-medium">Diferencias con el diseño actual:</p>
              <DiffTable diffs={diffs} />
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              onClick={handleRestoreWithAutoSave}
              className="gap-1.5 flex-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Restaurar esta versión
              {diffs.length > 0 && <span className="text-xs opacity-70">(auto-guarda actual)</span>}
            </Button>
            {confirmDel ? (
              <Button size="sm" variant="destructive" onClick={() => onDelete(snap.id)} className="gap-1">
                <Check className="h-3.5 w-3.5" /> Confirmar
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setConfirmDel(true)} className="px-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SnapshotManager({ dimensions, boxType, material, onRestore }) {
  const [open, setOpen] = useState(false);
  const [snapshots, setSnapshots] = useState([]);
  const [label, setLabel] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  const current = { dimensions, boxType, material };

  const refresh = useCallback(() => setSnapshots(getSnapshots()), []);

  useEffect(() => { if (open) refresh(); }, [open, refresh]);

  const handleSave = () => {
    if (!dimensions.alto || !boxType || !material) return;
    saveSnapshot({ dimensions, boxType, material, label: label.trim() || undefined });
    setLabel("");
    setJustSaved(true);
    refresh();
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleRestore = (snap) => {
    onRestore({ dimensions: snap.dimensions, boxType: snap.boxType, material: snap.material });
    setOpen(false);
    refresh();
  };

  const handleDelete = (id) => { deleteSnapshot(id); refresh(); };
  const handleRename = (id, newLabel) => { renameSnapshot(id, newLabel); refresh(); };

  // Número de snapshots con diferencias respecto al diseño actual
  const allSnaps = getSnapshots();
  const hasHistory = allSnaps.length > 0;

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-12 px-6 text-base gap-2 relative"
        title="Historial de versiones del diseño"
      >
        <History className="h-4 w-4" />
        Versiones
        {hasHistory && (
          <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
            {allSnaps.length}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-4 border-b border-border shrink-0">
            <DialogTitle className="flex items-center gap-2 text-base">
              <History className="h-5 w-5 text-primary" />
              Historial de versiones
              {snapshots.length > 0 && (
                <span className="ml-auto text-sm font-normal text-muted-foreground">
                  {snapshots.length} versión{snapshots.length !== 1 ? "es" : ""}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* Panel guardar versión actual */}
          <div className="px-5 py-4 border-b border-border bg-secondary/20 shrink-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Guardar versión actual
            </p>
            <div className="flex gap-2 mb-3">
              <div className="flex-1 grid grid-cols-3 gap-1.5 text-xs">
                <div className="rounded bg-background px-2 py-1.5 border border-border/50">
                  <span className="text-muted-foreground">Libro </span>
                  <span className="font-mono text-foreground">{dimensions.alto}×{dimensions.ancho}×{dimensions.profundidad}</span>
                </div>
                <div className="rounded bg-background px-2 py-1.5 border border-border/50 truncate">
                  <span className="text-muted-foreground">Tipo </span>
                  <span className="text-foreground">{boxType?.name || "—"}</span>
                </div>
                <div className="rounded bg-background px-2 py-1.5 border border-border/50 truncate">
                  <span className="text-muted-foreground">Mat. </span>
                  <span className="text-foreground">{material?.name || "—"}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Nombre de la versión (opcional)"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className="text-sm h-9"
              />
              <Button
                onClick={handleSave}
                size="sm"
                className="shrink-0 px-4 gap-1.5"
                disabled={!dimensions.alto || !boxType || !material}
              >
                {justSaved ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {justSaved ? "¡Guardado!" : "Guardar"}
              </Button>
            </div>
          </div>

          {/* Lista de snapshots */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
            {snapshots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Clock className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Sin versiones guardadas</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Guarda una versión arriba para poder comparar y restaurar configuraciones anteriores en cualquier momento.
                </p>
              </div>
            ) : (
              snapshots.map((snap, idx) => (
                <SnapshotCard
                  key={snap.id}
                  snap={snap}
                  idx={idx}
                  total={snapshots.length}
                  current={current}
                  onRestore={handleRestore}
                  onDelete={handleDelete}
                  onRename={handleRename}
                />
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}