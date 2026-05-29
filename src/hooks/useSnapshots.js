/**
 * useSnapshots — gestiona instantáneas (snapshots) locales del diseño actual.
 * Los snapshots se guardan en localStorage bajo la clave "box_snapshots".
 * Cada snapshot almacena dimensiones, tipo de caja, material y una etiqueta.
 */

const KEY = "box_snapshots";
const MAX_SNAPSHOTS = 20;

export function getSnapshots() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveSnapshot({ dimensions, boxType, material, label }) {
  const snapshots = getSnapshots();
  const newSnapshot = {
    id: Date.now().toString(),
    label: label || `Snapshot ${new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`,
    savedAt: Date.now(),
    dimensions,
    boxType,
    material,
  };
  // Insertar al inicio, limitar a MAX_SNAPSHOTS
  const updated = [newSnapshot, ...snapshots].slice(0, MAX_SNAPSHOTS);
  localStorage.setItem(KEY, JSON.stringify(updated));
  return newSnapshot;
}

export function deleteSnapshot(id) {
  const updated = getSnapshots().filter((s) => s.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function clearSnapshots() {
  localStorage.removeItem(KEY);
}