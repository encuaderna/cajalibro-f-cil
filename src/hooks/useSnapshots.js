/**
 * useSnapshots — gestiona instantáneas (snapshots) locales del diseño actual.
 * Cada snapshot almacena dimensiones, tipo de caja, material, etiqueta y timestamp.
 */

const KEY = "box_snapshots";
const MAX_SNAPSHOTS = 30;

export function getSnapshots() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveSnapshot({ dimensions, boxType, material, label }) {
  const snapshots = getSnapshots();
  const now = new Date();
  const newSnapshot = {
    id: Date.now().toString(),
    label: label || `Versión ${now.toLocaleDateString("es-ES", { day: "2-digit", month: "short" })} ${now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`,
    savedAt: Date.now(),
    dimensions: { ...dimensions },
    boxType: boxType ? { ...boxType } : null,
    material: material ? { ...material } : null,
  };
  const updated = [newSnapshot, ...snapshots].slice(0, MAX_SNAPSHOTS);
  localStorage.setItem(KEY, JSON.stringify(updated));
  return newSnapshot;
}

export function renameSnapshot(id, newLabel) {
  const updated = getSnapshots().map((s) =>
    s.id === id ? { ...s, label: newLabel } : s
  );
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function deleteSnapshot(id) {
  const updated = getSnapshots().filter((s) => s.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function clearSnapshots() {
  localStorage.removeItem(KEY);
}

/**
 * Compara un snapshot con el diseño actual y devuelve los campos que difieren.
 * Retorna un array de objetos { field, label, from, to }
 */
export function diffSnapshot(snapshot, { dimensions, boxType, material }) {
  const diffs = [];

  const dimFields = [
    { key: "alto", label: "Alto" },
    { key: "ancho", label: "Ancho" },
    { key: "profundidad", label: "Profundidad" },
  ];

  dimFields.forEach(({ key, label }) => {
    const from = snapshot.dimensions?.[key];
    const to = dimensions?.[key];
    if (from !== to) {
      diffs.push({ field: key, label, from: `${from} mm`, to: `${to} mm` });
    }
  });

  if (snapshot.boxType?.id !== boxType?.id) {
    diffs.push({
      field: "boxType",
      label: "Tipo de caja",
      from: snapshot.boxType?.name || "—",
      to: boxType?.name || "—",
    });
  }

  if (snapshot.material?.id !== material?.id || snapshot.material?.name !== material?.name) {
    diffs.push({
      field: "material",
      label: "Material",
      from: snapshot.material ? `${snapshot.material.name} (${snapshot.material.thickness} mm)` : "—",
      to: material ? `${material.name} (${material.thickness} mm)` : "—",
    });
  }

  return diffs;
}