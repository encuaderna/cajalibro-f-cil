import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

/**
 * Diagrama 2D SVG de las piezas de la caja a escala relativa con medidas anotadas.
 * Descargable como PNG.
 */
export default function CutDiagram2D({ pieces }) {
  const svgRef = useRef(null);

  // Filtrar piezas con dimensiones válidas (w y h > 0)
  const validPieces = pieces.filter((p) => {
    const parts = p.finalMeasure?.match(/[\d.]+/g);
    return parts && parts.length >= 2;
  });

  if (validPieces.length === 0) return null;

  // Parsear dimensiones de cada pieza desde finalMeasure "W × H mm"
  const parsed = validPieces.map((p) => {
    const parts = p.finalMeasure.match(/[\d.]+/g).map(Number);
    return { ...p, w: parts[0], h: parts[1] };
  });

  // Escalar para que quepan en el SVG
  const SVG_W = 700;
  const SVG_H = 420;
  const PAD = 16;
  const LABEL_H = 36;
  const GAP = 10;

  const maxW = Math.max(...parsed.map((p) => p.w * (p.qty || 1)));
  const maxH = Math.max(...parsed.map((p) => p.h));
  const cols = Math.min(parsed.length, 4);
  const rows = Math.ceil(parsed.length / cols);
  const cellW = (SVG_W - PAD * 2 - GAP * (cols - 1)) / cols;
  const cellH = (SVG_H - PAD * 2 - GAP * (rows - 1) - LABEL_H * rows) / rows;

  const scaleX = (w) => (w / maxW) * (cellW - 8);
  const scaleY = (h) => (h / maxH) * (cellH - 8);

  const COLORS = [
    "#3b82f6","#10b981","#f59e0b","#ef4444",
    "#8b5cf6","#06b6d4","#f97316","#84cc16",
  ];

  const handleDownload = () => {
    const svg = svgRef.current;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const img = new Image();
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = SVG_W * 2;
      canvas.height = SVG_H * 2;
      const ctx = canvas.getContext("2d");
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = "diagrama-piezas.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="mt-6 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Vista previa gráfica — piezas a escala relativa
        </p>
        <Button size="sm" variant="outline" onClick={handleDownload}>
          <Download className="h-3 w-3 mr-1" />
          Guardar diagrama
        </Button>
      </div>

      <svg
        ref={svgRef}
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto rounded bg-[#1a1f2e]"
      >
        {parsed.map((p, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const cellX = PAD + col * (cellW + GAP);
          const cellY = PAD + row * (cellH + LABEL_H + GAP);

          const rw = scaleX(p.w);
          const rh = scaleY(p.h);
          const rx = cellX + (cellW - rw) / 2;
          const ry = cellY + LABEL_H + (cellH - rh) / 2;

          const color = COLORS[i % COLORS.length];
          const labelY = cellY + LABEL_H - 6;

          return (
            <g key={i}>
              {/* Nombre de la pieza */}
              <text
                x={cellX + cellW / 2}
                y={labelY}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill={color}
              >
                {p.name} {p.qty > 1 ? `×${p.qty}` : ""}
              </text>

              {/* Rectángulo de la pieza */}
              <rect
                x={rx}
                y={ry}
                width={rw}
                height={rh}
                fill={`${color}22`}
                stroke={color}
                strokeWidth="1.5"
                rx="3"
              />

              {/* Medida ancho */}
              <text
                x={rx + rw / 2}
                y={ry + rh + 13}
                textAnchor="middle"
                fontSize="9"
                fill="#94a3b8"
              >
                {p.w} mm
              </text>

              {/* Medida alto */}
              <text
                x={rx - 5}
                y={ry + rh / 2}
                textAnchor="end"
                fontSize="9"
                fill="#94a3b8"
                dominantBaseline="middle"
              >
                {p.h} mm
              </text>

              {/* Líneas de cota ancho */}
              <line x1={rx} y1={ry + rh + 4} x2={rx + rw} y2={ry + rh + 4} stroke="#475569" strokeWidth="0.8" />
              {/* Líneas de cota alto */}
              <line x1={rx - 3} y1={ry} x2={rx - 3} y2={ry + rh} stroke="#475569" strokeWidth="0.8" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}