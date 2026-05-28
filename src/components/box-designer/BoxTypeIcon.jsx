import React from "react";

/**
 * Iconos SVG simples y descriptivos para cada tipo de caja.
 * Tamaño fijo 48×36 px, estilo de línea técnica.
 */
export default function BoxTypeIcon({ typeId, active }) {
  const stroke = active ? "#4a9eff" : "#5a7090";
  const fill = active ? "rgba(74,158,255,0.12)" : "rgba(255,255,255,0.03)";
  const accent = active ? "#60c4ff" : "#3a5a78";

  const icons = {
    clamshell: (
      // Caja abierta con tapa unida en el lomo, vista lateral
      <svg viewBox="0 0 48 36" width="48" height="36" aria-hidden="true">
        {/* Base */}
        <rect x="4" y="18" width="40" height="14" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" />
        {/* Tapa abierta (rotada hacia arriba, unida a la izquierda) */}
        <path d="M4,18 Q4,8 12,5 L44,5 Q44,5 44,18" fill={fill} stroke={stroke} strokeWidth="1.5" />
        {/* Bisagra en el lomo (izquierda) */}
        <line x1="4" y1="5" x2="4" y2="32" stroke={accent} strokeWidth="2" strokeLinecap="round" />
        {/* Libro dentro */}
        <rect x="10" y="20" width="28" height="10" rx="0.5" fill="none" stroke={accent} strokeWidth="0.8" strokeDasharray="2 1.5" />
      </svg>
    ),

    tapa_abatible: (
      // Caja con tapa unida por un lado, semi-abierta
      <svg viewBox="0 0 48 36" width="48" height="36" aria-hidden="true">
        {/* Base */}
        <rect x="4" y="16" width="40" height="16" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" />
        {/* Tapa inclinada (abatible) unida al lado derecho */}
        <path d="M44,16 L44,4 L8,4 L4,16" fill={fill} stroke={stroke} strokeWidth="1.5" />
        {/* Bisagra (lado derecho) */}
        <line x1="44" y1="4" x2="44" y2="32" stroke={accent} strokeWidth="2" strokeLinecap="round" />
        {/* Línea de apertura */}
        <line x1="4" y1="16" x2="44" y2="16" stroke={accent} strokeWidth="0.8" strokeDasharray="2 2" />
      </svg>
    ),

    tapa_separada: (
      // Dos piezas separadas apiladas
      <svg viewBox="0 0 48 36" width="48" height="36" aria-hidden="true">
        {/* Tapa (arriba, desplazada) */}
        <rect x="6" y="2" width="38" height="10" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" />
        {/* Flecha de separación */}
        <line x1="24" y1="13" x2="24" y2="17" stroke={accent} strokeWidth="1" markerEnd="url(#sep-down)" />
        <line x1="24" y1="13" x2="24" y2="9" stroke={accent} strokeWidth="1" />
        <defs>
          <marker id="sep-down" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
            <polygon points="0,0 4,2 0,4" fill={accent} />
          </marker>
        </defs>
        {/* Base (abajo) */}
        <rect x="4" y="20" width="40" height="14" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" />
        {/* Interior base */}
        <rect x="7" y="23" width="34" height="8" rx="0.5" fill="none" stroke={accent} strokeWidth="0.7" strokeDasharray="2 1.5" />
      </svg>
    ),

    estuche: (
      // Funda abierta por un lado con libro deslizándose
      <svg viewBox="0 0 48 36" width="48" height="36" aria-hidden="true">
        {/* Cuerpo del estuche (U, abierto a la derecha) */}
        <path d="M6,4 L6,32 L42,32 L42,28 M6,4 L42,4 L42,8" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="6" y1="4" x2="6" y2="32" stroke={stroke} strokeWidth="1.5" />
        {/* Fondo */}
        <line x1="6" y1="32" x2="42" y2="32" stroke={stroke} strokeWidth="1.5" />
        <line x1="6" y1="4" x2="42" y2="4" stroke={stroke} strokeWidth="1.5" />
        {/* Libro saliendo */}
        <rect x="28" y="7" width="16" height="22" rx="0.5" fill={fill} stroke={accent} strokeWidth="1.2" />
        {/* Lomo expuesto */}
        <rect x="38" y="7" width="6" height="22" rx="0" fill={active ? "rgba(74,158,255,0.2)" : "rgba(255,255,255,0.06)"} stroke={accent} strokeWidth="0.8" />
        {/* Flecha de extracción */}
        <line x1="30" y1="18" x2="22" y2="18" stroke={accent} strokeWidth="1" strokeDasharray="2 1.5" />
      </svg>
    ),

    storbox: (
      // Caja robusta con manillas
      <svg viewBox="0 0 48 36" width="48" height="36" aria-hidden="true">
        {/* Cuerpo */}
        <rect x="4" y="8" width="40" height="24" rx="1.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
        {/* Tapa */}
        <rect x="4" y="4" width="40" height="6" rx="1" fill={fill} stroke={stroke} strokeWidth="1.5" />
        {/* Línea separadora tapa/cuerpo */}
        <line x1="4" y1="10" x2="44" y2="10" stroke={accent} strokeWidth="0.8" strokeDasharray="2 2" />
        {/* Manilla izquierda */}
        <path d="M10,8 Q10,2 14,2 L18,2 Q22,2 22,8" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        {/* Manilla derecha */}
        <path d="M26,8 Q26,2 30,2 L34,2 Q38,2 38,8" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        {/* Líneas de cartón corrugado */}
        <line x1="4" y1="17" x2="44" y2="17" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
        <line x1="4" y1="24" x2="44" y2="24" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
      </svg>
    ),
  };

  return icons[typeId] || null;
}