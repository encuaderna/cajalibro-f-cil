import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { ImagePlus, ChevronLeft, ChevronRight, Copy, Check, Trash2, Loader2, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

function CopyUrlButton({ url }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-1.5 mt-2 w-full">
      <div className="flex-1 min-w-0 bg-background border border-border rounded-md px-2 py-1.5 text-xs font-mono text-muted-foreground truncate select-all">
        {url}
      </div>
      <button
        onClick={handleCopy}
        title="Copiar URL"
        className="shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-xs text-foreground transition-colors border border-border"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "¡Copiado!" : "Copiar"}
      </button>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title="Abrir en nueva pestaña"
        className="shrink-0 flex items-center px-2 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors border border-border"
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

export default function PhotoCarousel() {
  const [open, setOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      uploaded.push({ url: file_url, name: file.name });
    }
    setPhotos((prev) => {
      const updated = [...prev, ...uploaded];
      setCurrentIdx(updated.length - 1);
      return updated;
    });
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = (idx) => {
    setPhotos((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      setCurrentIdx(Math.max(0, Math.min(idx, updated.length - 1)));
      return updated;
    });
    setConfirmDelete(null);
  };

  const prev = () => setCurrentIdx((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setCurrentIdx((i) => (i + 1) % photos.length);

  return (
    <div className="mt-6 rounded-lg border border-border bg-card overflow-hidden">
      {/* Header colapsable */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/40 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <ImagePlus className="h-4 w-4 text-primary" />
          Fotos del proyecto
          {photos.length > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {photos.length}
            </span>
          )}
        </span>
        <span className="text-xs text-muted-foreground">{open ? "▲ Ocultar" : "▼ Ver"}</span>
      </button>

      {open && (
        <div className="border-t border-border p-4 space-y-4">

          {/* Zona de subida */}
          <div
            className="relative border-2 border-dashed border-border rounded-lg p-5 text-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-7 w-7 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Subiendo foto…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ImagePlus className="h-7 w-7 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Arrastra fotos aquí o <span className="text-primary font-medium">haz clic para seleccionar</span>
                </p>
                <p className="text-xs text-muted-foreground/60">JPG, PNG, WEBP — múltiples archivos permitidos</p>
              </div>
            )}
          </div>

          {/* Carrusel */}
          {photos.length > 0 && (
            <div className="space-y-3">
              {/* Imagen principal */}
              <div className="relative rounded-lg overflow-hidden bg-secondary aspect-[4/3] flex items-center justify-center">
                <img
                  src={photos[currentIdx].url}
                  alt={photos[currentIdx].name}
                  className="max-h-full max-w-full object-contain"
                />

                {/* Flechas de navegación */}
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Indicador y eliminar */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                  <span className="text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
                    {currentIdx + 1} / {photos.length}
                  </span>
                  {confirmDelete === currentIdx ? (
                    <button
                      onClick={() => handleDelete(currentIdx)}
                      className="text-xs bg-destructive text-white px-2 py-0.5 rounded-full flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" /> Eliminar
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(currentIdx)}
                      className="h-6 w-6 rounded-full bg-black/60 hover:bg-destructive/80 flex items-center justify-center text-white transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Nombre y URL para copiar */}
              <div>
                <p className="text-xs text-muted-foreground mb-1 truncate">
                  <span className="font-medium text-foreground">{photos[currentIdx].name}</span>
                  {" — "}comparte esta URL:
                </p>
                <CopyUrlButton url={photos[currentIdx].url} />
              </div>

              {/* Miniaturas */}
              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      className={`shrink-0 h-14 w-14 rounded-md overflow-hidden border-2 transition-all ${
                        idx === currentIdx
                          ? "border-primary opacity-100"
                          : "border-border opacity-60 hover:opacity-90"
                      }`}
                    >
                      <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}