import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BOX_TYPES } from "@/lib/boxCalculations";
import BoxTypeIcon from "@/components/box-designer/BoxTypeIcon";

export default function StepBoxType({ selectedType, onSelect, onNext, onBack }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Paso 2 — Tipo de caja
      </h2>
      <p className="text-muted-foreground text-sm mb-8">
        Selecciona el tipo de estructura que necesitas.
      </p>

      <div className="space-y-3 max-w-xl">
        {BOX_TYPES.map((box) => {
          const isSelected = selectedType?.id === box.id;
          return (
            <button
              key={box.id}
              onClick={() => onSelect(box)}
              className={`w-full text-left rounded-lg border-2 transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-secondary hover:border-muted-foreground/30"
              }`}
              aria-pressed={isSelected}
            >
              {/* Fila principal: ícono + nombre */}
              <div className="flex items-center gap-4 p-4">
                <div className={`shrink-0 rounded-md p-2 ${isSelected ? "bg-primary/10" : "bg-background/40"}`}>
                  <BoxTypeIcon typeId={box.id} active={isSelected} />
                </div>
                <div className="min-w-0">
                  <span className={`block text-base font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {box.name}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5 truncate">
                    {box.alias}
                  </span>
                </div>
              </div>

              {/* Descripción expandida al seleccionar */}
              {isSelected && (
                <div className="px-4 pb-4 border-t border-primary/20 pt-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {box.description}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex gap-3">
        <Button variant="outline" onClick={onBack} className="h-12 px-6 text-base">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Atrás
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedType}
          className="h-12 px-8 text-base font-medium"
        >
          Siguiente
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}