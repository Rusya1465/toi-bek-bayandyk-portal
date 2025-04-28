
import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader, Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  imageUrl: string | null;
  onImageChange: (file: File | null) => void;
  onImageRemove: () => void;
  uploading: boolean;
  className?: string;
}

export const ImageUpload = ({
  imageUrl,
  onImageChange,
  onImageRemove,
  uploading,
  className
}: ImageUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { toast } = useToast();
  const intervalRef = useRef<number | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Simulate progress for better UX
  const simulateProgress = () => {
    setUploadProgress(0);
    
    // Clear any existing interval
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    
    // Use window.setInterval and store the ID
    intervalRef.current = window.setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return prev;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        description: "Сүрөттүн өлчөмү 5МБ-дан ашпашы керек",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        description: "Бул файл сүрөт эмес",
      });
      return;
    }

    simulateProgress();
    onImageChange(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        description: "Бул файл сүрөт эмес",
      });
      return;
    }

    simulateProgress();
    onImageChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className={cn(
        "w-full h-48 relative rounded-lg overflow-hidden",
        dragOver ? "border-2 border-primary" : "border border-dashed border-gray-300", 
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {imageUrl ? (
        <div className="relative w-full h-full">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full"
            onClick={onImageRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            {t("forms.imageUpload.select")}<br />{t("forms.imageUpload.drag")}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={handleButtonClick}
            disabled={uploading}
          >
            {t("forms.imageUpload.select")}
          </Button>
        </div>
      )}

      {uploading && (
        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center gap-4">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <div className="w-3/4">
            <Progress value={uploadProgress} className="h-2" />
          </div>
          <p className="text-sm">{t("forms.imageUpload.uploading")}</p>
        </div>
      )}
    </div>
  );
};
