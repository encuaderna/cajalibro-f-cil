import React, { useState, useCallback } from "react";
import { Camera, RotateCcw, Trash2, Clock, X, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSnapshots, saveSnapshot, deleteSnapshot } from "@/hooks/useSnapshots";

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  return `hace ${Math.floor(hrs / 24)} d`;
}

export default function SnapshotManager({ dimensions, boxType, material, onRestore }) {
  const [open, setOpen] = useState(false);
  const [snapshots, setSnapshots] = useState([]);
  const [label, setLabel] = useState("");
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const refreshSnapshots = useCallback(() => {
    setSnapshots(getSnapshots());
  }, []);

  const handleOpen = () => {
    refreshSnapshots();
    setOpen(true);
  };

  const handleSave = () => {
    saveSnapshot({ dimensions, boxType, material, label: label.trim() || undefined });
    setLabel("");
    setSaved(true);
    refreshSnapshots();
    setTimeout(() => setSaved(false), 1500);
  };

  const handleRestore = (snapshot) => {
    onRestore({ dimensions: snapshot.dimensions, boxType: snapshot.boxType, material: snapshot.material });
    setOpen(false);
  };

  const handleDelete = (id) => {
    deleteSnapshot(id);
    refreshSnapshots();
    setConfirmDelete(null);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpen}
        className="h-12 px-6 text-base gap-2"
        title="Guardar y ver instantáneas del diseño"
      >
        <Camera className="h-4 w-4" />
        Snapshots
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[520px] max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Historial de instantáneas
            </DialogTitle>
          </DialogHeader>

          {/* Guardar snapshot actual */}
          <div className="rounded-lg border border-border bg-secondary/40 p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Guardar diseño actual
            </p>
            <div className="rounded-md bg-background px-3 py-2 text-xs text-muted-foreground space-y-0.5">
              <p><span className="font-medium text-foreground">Libro:</span> {dimensions.alto} × {dimensions.ancho} × {dimensions.profundidad} mm</p>
              <p><span className="font-medium text-foreground">Tipo:</span> {boxType?.name || "—"}</p>
              <p><span className="font-medium text-foreground">Material:</span> {material?.name || "—"} {material ? `(${material.thickness} mm)` : ""}</p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Etiqueta opcional (ej: v2 con margen extra)"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className="text-sm h-9"
              />
              <Button
                onClick={handleSave}
                size="sm"
                className="shrink-0 gap-1.5 px-4"
                disabled={!dimensions.alto || !boxType || !material}
              >
                {saved ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {saved ? "Guardado" : "Guardar"}
              </Button>
            </div>
          </div>

          {/* Lista de snapshots */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {snapshots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Clock className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">Aún no hay instantáneas guardadas.</p>
                <p className="text-xs text-muted-foreground mt-1">Guarda una arriba para poder restaurarla después.</p>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                {snapshots.map((snap, idx) => (
                  <div
                    key={snap.id}
                    className="group relative rounded-lg border border-border bg-card p-3 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0">
                            {snapshots.length - idx}
                          </span>
                          <span className="text-sm font-medium text-foreground truncate">
                            {snap.label}
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0 ml-auto">
                            {timeAgo(snap.savedAt)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground ml-7">
                          <span>{snap.dimensions.alto}×{snap.dimensions.ancho}×{snap.dimensions.profundidad} mm</span>
                          {snap.boxType?.name && <span>{snap.boxType.name}</span>}
                          {snap.material?.name && <span>{snap.material.name} ({snap.material.thickness} mm)</span>}
                        </div>
                      </div>

                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRestore(snap)}
                          className="h-7 px-2 gap-1 text-xs"
                          title="Restaurar esta instantánea"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Restaurar
                        </Button>
                        {confirmDelete === snap.id ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(snap.id)}
                            className="h-7 px-2 text-xs"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setConfirmDelete(snap.id)}
                            className="h-7 px-2 text-muted-foreground hover:text-destructive"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}