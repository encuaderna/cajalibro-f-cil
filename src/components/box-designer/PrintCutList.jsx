import React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

/**
 * Botón que abre una ventana de impresión con la lista de cortes en tabla.
 */
export default function PrintCutList({ pieces, dimensions, boxType, material }) {
  const handlePrint = () => {
    // Convertir mm a cm con 1 decimal
    const toCm = (mmStr) => {
      const nums = mmStr?.match(/[\d.]+/g);
      if (!nums) return ["—", "—"];
      return nums.slice(0, 2).map((n) => (parseFloat(n) / 10).toFixed(1));
    };

    const rows = pieces
      .map((p) => {
        const [alto, ancho] = toCm(p.finalMeasure);
        return `
          <tr>
            <td>${p.name}</td>
            <td>${p.description}</td>
            <td class="num">${alto}</td>
            <td class="num">${ancho}</td>
            <td class="num">${p.qty}</td>
            <td>${material?.name || "—"}</td>
          </tr>`;
      })
      .join("");

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Lista de Cortes</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; color: #000; margin: 24px; }
    h1 { font-size: 16px; margin-bottom: 4px; }
    .meta { font-size: 11px; color: #555; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1e293b; color: #fff; padding: 7px 10px; text-align: left; font-size: 11px; }
    td { padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) td { background: #f8fafc; }
    .num { text-align: right; }
    @media print { body { margin: 10mm; } }
  </style>
</head>
<body>
  <h1>Lista de Cortes — ${boxType?.name || ""}</h1>
  <p class="meta">
    Libro: ${dimensions?.alto} × ${dimensions?.ancho} × ${dimensions?.profundidad} mm &nbsp;|&nbsp;
    Material: ${material?.name || "—"} (${material?.thickness || "—"} mm)
  </p>
  <table>
    <thead>
      <tr>
        <th>Pieza</th>
        <th>Descripción</th>
        <th class="num">Alto (cm)</th>
        <th class="num">Ancho (cm)</th>
        <th class="num">Cant.</th>
        <th>Material</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.print();
  };

  return (
    <Button variant="outline" onClick={handlePrint} className="h-12 px-6 text-base">
      <Printer className="mr-2 h-4 w-4" />
      Imprimir lista de cortes
    </Button>
  );
}