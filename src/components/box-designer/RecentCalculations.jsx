import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Clock } from "lucide-react";

const STORAGE_KEY = "recent_box_calculations";
const MAX_ITEMS = 5;

export function saveRecentCalculation({ dimensions, boxType, material }) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const entry = {
      id: Date.now(),
      savedAt: new Date().toISOString(),
      dimensions,
      boxType: { id: boxType?.id, name: boxType?.name },
      material: { name: material?.name, thickness: material?.thickness },
    };
    const updated = [entry, ...existing].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export function loadRecentCalculations() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function RecentCalculations({ onRestore }) {
  const [open, setOpen] = useState(false);
  const items = loadRecentCalculations();

  if (items.length === 0) return null;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="mb-6 rounded-lg border border-border bg-secondary/30">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors rounded-lg"
      >
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Cálculos recientes
          <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-semibold">
            {items.length}
          </span>
        </span>
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-card rounded-lg px-3 py-2.5 border border-border/50"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.dimensions?.alto} × {item.dimensions?.ancho} × {item.dimensions?.profundidad} mm
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.boxType?.name || "—"} · {item.material?.name || "—"} ({item.material?.thickness} mm)
                </p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{formatDate(item.savedAt)}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ml-3 shrink-0 text-xs"
                onClick={() => onRestore(item)}
              >
                Usar
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}