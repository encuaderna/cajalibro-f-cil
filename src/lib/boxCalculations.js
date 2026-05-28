// Tipos de caja
export const BOX_TYPES = [
  {
    id: "clamshell",
    name: "Caja Clamshell",
    alias: "Caja tipo almeja / concha",
    description:
      "Una sola pieza con base a la medida del libro y tapa con bisagra en el lomo. Al abrirse, un lado queda completamente expuesto. Ideal para restauración y archivos. Se fabrica con cartón y papeles libres de ácido.",
    pieces: [
      { name: "Base", axis: "ancho x profundidad", qty: 1 },
      { name: "Lateral largo (base)", axis: "alto x profundidad", qty: 2 },
      { name: "Lateral corto (base)", axis: "ancho x alto", qty: 2 },
      { name: "Tapa", axis: "ancho x profundidad", qty: 1 },
      { name: "Lateral largo (tapa)", axis: "alto x profundidad", qty: 2 },
      { name: "Lateral corto (tapa)", axis: "ancho x alto", qty: 2 },
    ],
  },
  {
    id: "tapa_abatible",
    name: "Caja tapa abatible",
    alias: "Caja de Conservación",
    description:
      "Similar a la clamshell pero más sencilla. La tapa está unida por uno de los lados largos o cortos mediante bisagra de cartón. Ideal para manuscritos, folletos o libros de archivo.",
    pieces: [
      { name: "Base", axis: "ancho x profundidad", qty: 1 },
      { name: "Lateral largo", axis: "alto x profundidad", qty: 2 },
      { name: "Lateral corto", axis: "ancho x alto", qty: 2 },
      { name: "Tapa", axis: "ancho x profundidad", qty: 1 },
      { name: "Lengüeta de bisagra", axis: "ancho x alto", qty: 1 },
    ],
  },
  {
    id: "tapa_separada",
    name: "Caja con tapa separada",
    alias: "Base + tapa independiente",
    description:
      "Dos piezas independientes: una base y una tapa que cubre parcial o totalmente el cuerpo. Modelo estándar para almacenamiento de colecciones y protección frente al polvo y la luz.",
    pieces: [
      { name: "Base inferior", axis: "ancho x profundidad", qty: 1 },
      { name: "Lateral largo (base)", axis: "ancho x alto/2", qty: 2 },
      { name: "Lateral corto (base)", axis: "profundidad x alto/2", qty: 2 },
      { name: "Tapa superior", axis: "ancho x profundidad", qty: 1 },
      { name: "Lateral largo (tapa)", axis: "ancho x alto/2", qty: 2 },
      { name: "Lateral corto (tapa)", axis: "profundidad x alto/2", qty: 2 },
    ],
  },
  {
    id: "estuche",
    name: "Estuche (Slipcase)",
    alias: "Funda deslizante de lujo",
    description:
      "Funda rígida abierta por uno de los lados. El libro se desliza hacia adentro quedando el lomo expuesto. Muy común en ediciones de lujo o colecciones encuadernadas.",
    pieces: [
      { name: "Base", axis: "ancho x profundidad", qty: 1 },
      { name: "Tapa", axis: "ancho x profundidad", qty: 1 },
      { name: "Lateral largo", axis: "alto x profundidad", qty: 2 },
      { name: "Lateral corto", axis: "ancho x alto", qty: 2 },
    ],
  },
  {
    id: "storbox",
    name: "Caja Storbox",
    alias: "Caja de mudanza / archivo activo",
    description:
      "Fabricada en cartón corrugado kraft. Resistente, modular e incluye manillas para transporte. Ideal para grandes cantidades de libros almacenados verticalmente en estanterías.",
    pieces: [
      { name: "Base", axis: "ancho x profundidad", qty: 1 },
      { name: "Tapa", axis: "ancho x profundidad", qty: 1 },
      { name: "Lateral largo", axis: "ancho x alto", qty: 2 },
      { name: "Lateral corto", axis: "profundidad x alto", qty: 2 },
      { name: "Manilla de transporte", axis: "ancho x alto", qty: 2 },
    ],
  },
];

// Materiales disponibles
export const MATERIALS = [
  { id: "carton_rigido", name: "Cartón Rígido", thickness: 2.0 },
  { id: "carton_pluma", name: "Cartón Pluma", thickness: 5.0 },
  { id: "craft", name: "Craft", thickness: 0.5 },
  { id: "balsa", name: "Madera Balsa", thickness: 3.0 },
];

// Margen estándar en mm
const MARGIN = 2;

function applyFormula(dimension, thickness) {
  return dimension + MARGIN + 2 * thickness;
}

export function calculatePieces(bookDimensions, boxType, material) {
  const { alto, ancho, profundidad } = bookDimensions;
  const t = material.thickness;
  const needsAngleCut = t > 3;

  const dimMap = {
    alto: applyFormula(alto, t),
    ancho: applyFormula(ancho, t),
    profundidad: applyFormula(profundidad, t),
    "alto/2": applyFormula(alto / 2, t),
  };

  const pieces = boxType.pieces.map((piece) => {
    const [dimA, dimB] = piece.axis.split(" x ");
    const measureA = dimMap[dimA];
    const measureB = dimMap[dimB];

    return {
      name: piece.name,
      description: `${dimA} × ${dimB}`,
      qty: piece.qty,
      measureA: parseFloat(measureA.toFixed(1)),
      measureB: parseFloat(measureB.toFixed(1)),
      finalMeasure: `${measureA.toFixed(1)} × ${measureB.toFixed(1)} mm`,
    };
  });

  return { pieces, needsAngleCut };
}

export function getInstructions(boxType, material) {
  const needsAngleCut = material.thickness > 3;

  const base = [
    `Cortar todas las piezas según las medidas indicadas en la tabla, usando ${material.name} de ${material.thickness} mm.`,
  ];

  if (needsAngleCut) {
    base.push(
      `ALERTA: El grosor del material (${material.thickness} mm) supera los 3 mm. Realizar cortes a 45° en todas las aristas de unión para un ensamble limpio.`
    );
  }

  const typeInstructions = {
    clamshell: [
      "Construir la base: pegar los 4 laterales a la pieza inferior.",
      "Verificar escuadra de la base con una regla en L.",
      "Construir la tapa de igual forma que la base.",
      "Unir base y tapa con una tira de cartón o tela en el lomo (bisagra).",
      "Verificar que la tapa cierre completamente y el libro entre sin resistencia.",
      "Dejar secar bajo peso uniforme durante mínimo 3 horas.",
    ],
    tapa_abatible: [
      "Construir la base pegando los 4 laterales a la pieza inferior.",
      "Verificar escuadra de la base con una regla en L.",
      "Pegar la tapa plana sobre la base, dejando libre el lado de bisagra.",
      "Adherir la lengüeta de bisagra conectando tapa y lateral correspondiente.",
      "Comprobar el movimiento de apertura y cierre antes de que seque el adhesivo.",
      "Dejar secar bajo peso uniforme durante mínimo 2 horas.",
    ],
    tapa_separada: [
      "Construir la base: pegar los 4 laterales de base a la pieza inferior.",
      "Verificar escuadra de la base con una regla en L.",
      "Construir la tapa: pegar los 4 laterales de tapa a la pieza superior.",
      "La tapa debe encajar sobre la base con un deslizamiento suave.",
      "Si la tapa queda ajustada, lijar 0.5 mm en los laterales de tapa.",
      "Dejar secar ambas partes bajo peso uniforme durante mínimo 2 horas.",
    ],
    estuche: [
      "Pegar los 2 laterales largos a la base, alineando los bordes exteriores.",
      "Pegar los 2 laterales cortos entre los laterales largos, formando la caja.",
      "Verificar escuadra con una regla en L antes de que el adhesivo seque.",
      "Colocar la tapa sobre la estructura. Ajustar si es necesario.",
      "Dejar secar bajo peso uniforme durante mínimo 2 horas.",
    ],
    storbox: [
      "Marcar y puntear las líneas de pliegue en los laterales largos.",
      "Pegar los 2 laterales largos a la base.",
      "Pegar los 2 laterales cortos cerrando la caja.",
      "Reforzar las esquinas exteriores con cinta de papel kraft.",
      "Instalar las manillas de transporte en los laterales largos con remaches o adhesivo fuerte.",
      "Verificar que la tapa encaje correctamente sobre la caja base.",
      "Dejar secar 4 horas antes de cargar.",
    ],
  };

  return [...base, ...(typeInstructions[boxType.id] || [])];
}