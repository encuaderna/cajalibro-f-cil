import React from "react";
import { CheckCircle2, Clock } from "lucide-react";

export default function AssemblyProgress({ checked, instructions }) {
  const total = checked.length;
  const done = checked.filter(Boolean).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const remaining = instructions.filter((_, i) => !checked[i]);
  const allDone = done === total && total > 0;

  return (
    <div className="mb-6 rounded-lg border border-border bg-secondary/40 p-4 space-y-3">
      {/* Barra + porcentaje */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 bg-background rounded-full overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              allDone ? "bg-green-500" : "bg-primary"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-foreground whitespace-nowrap tabular-nums">
          {pct}%
        </span>
      </div>

      {/* Resumen */}
      {allDone ? (
        <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
          <CheckCircle2 className="h-4 w-4" />
          ¡Todos los pasos completados!
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Pasos pendientes ({remaining.length})
          </p>
          <ul className="space-y-1">
            {remaining.slice(0, 3).map((inst, i) => (
              <li key={i} className="text-xs text-muted-foreground truncate">
                • {inst}
              </li>
            ))}
            {remaining.length > 3 && (
              <li className="text-xs text-muted-foreground italic">
                …y {remaining.length - 3} más
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Contador compacto */}
      <p className="text-xs text-muted-foreground">
        {done} de {total} pasos completados
      </p>
    </div>
  );
}