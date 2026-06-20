"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

interface UploadedImage {
  id: string;
  preview: string;
  url?: string;
  publicId?: string;
  status: "uploading" | "done" | "error";
}

interface ImageUploadProps {
  maxFiles?: number;
  onUrlsChange?: (urls: string[]) => void;
  initialUrls?: string[];
  className?: string;
}

export function ImageUpload({
  maxFiles = 5,
  onUrlsChange,
  initialUrls,
  className,
}: ImageUploadProps) {
  const initialized = useRef(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Seed from initialUrls once — handles both synchronous and async (API-loaded) scenarios
  useEffect(() => {
    if (initialized.current) return;
    if (initialUrls && initialUrls.length > 0) {
      initialized.current = true;
      setImages(
        initialUrls.map((url, i) => ({
          id: `initial-${i}`,
          preview: url,
          url,
          status: "done" as const,
        }))
      );
    }
  }, [initialUrls]);

  // Notify parent after render, never inside a setState updater
  useEffect(() => {
    const urls = images
      .filter((i) => i.status === "done" && i.url)
      .map((i) => i.url!);
    onUrlsChange?.(urls);
  }, [images, onUrlsChange]);

  const uploadFile = useCallback(async (file: File, localId: string) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res: any = await api.upload("/upload", formData);
      const { url, publicId } = res?.data ?? res;
      setImages((prev) =>
        prev.map((img) =>
          img.id === localId ? { ...img, url, publicId, status: "done" as const } : img
        )
      );
    } catch {
      setImages((prev) =>
        prev.map((img) =>
          img.id === localId ? { ...img, status: "error" as const } : img
        )
      );
    }
  }, []);

  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const files = Array.from(fileList).slice(0, maxFiles - images.length);
      if (!files.length) return;

      const newImages: UploadedImage[] = files.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        preview: URL.createObjectURL(file),
        status: "uploading" as const,
      }));

      setImages((prev) => [...prev, ...newImages]);
      files.forEach((file, i) => uploadFile(file, newImages[i].id));
    },
    [images.length, maxFiles, uploadFile]
  );

  const removeImage = useCallback(async (img: UploadedImage) => {
    URL.revokeObjectURL(img.preview);
    setImages((prev) => prev.filter((i) => i.id !== img.id));
    if (img.publicId) {
      try {
        await api.delete("/upload", { publicId: img.publicId });
      } catch {
        // non-critical
      }
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) addFiles(e.target.files);
      e.target.value = "";
    },
    [addFiles]
  );

  const canAddMore = images.length < maxFiles;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors",
            isDragging
              ? "border-[#FF6B2C] bg-[#FF6B2C]/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          )}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Upload className="size-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Drop images here or click to upload</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {images.length}/{maxFiles} images · PNG, JPG, WEBP up to 5MB
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
            >
              <img
                src={image.preview}
                alt="product"
                className={cn(
                  "size-full object-cover transition-opacity",
                  image.status !== "done" && "opacity-60"
                )}
              />

              {image.status === "uploading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Loader2 className="size-5 animate-spin text-white" />
                </div>
              )}

              {image.status === "error" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 p-1">
                  <AlertCircle className="size-4 text-red-400" />
                  <span className="text-[10px] text-red-300 text-center leading-tight">Upload failed</span>
                </div>
              )}

              <Button
                variant="destructive"
                size="icon-xs"
                className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); removeImage(image); }}
              >
                <X className="size-3" />
                <span className="sr-only">Remove image</span>
              </Button>

              {image.status === "done" && images.indexOf(image) === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-0.5 text-center text-[10px] text-white">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
