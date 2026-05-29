import React from "react";
import { RotateCcw, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "hace un momento";
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  return `hace ${Math.floor(hrs / 24)} días`;
}

export default function DraftRestoreBanner({ draft, onRestore, onDiscard }) {
  if (!draft) return null;

  const stepLabels = { 1: "Dimensiones", 2: "Tipo de caja", 3: "Material", 4: "Resultados" };
  const label = stepLabels[draft.step] || "Paso 1";

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 mb-6">
      <div className="flex items-center gap-3 min-w-0">
        <Clock className="h-4 w-4 text-primary shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            Tienes un borrador guardado
          </p>
          <p className="text-xs text-muted-foreground truncate">
            Hasta <span className="font-medium">{label}</span>
            {draft.dimensions?.alto > 0 &&
              ` · ${draft.dimensions.alto}×${draft.dimensions.ancho}×${draft.dimensions.profundidad} mm`}
            {draft.boxType?.name && ` · ${draft.boxType.name}`}
            {" · "}{timeAgo(draft.savedAt)}
          </p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button size="sm" onClick={onRestore}>
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Continuar
        </Button>
        <Button size="sm" variant="ghost" onClick={onDiscard} className="px-2">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}