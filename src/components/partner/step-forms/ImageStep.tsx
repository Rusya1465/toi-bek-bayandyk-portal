
import { ImageUpload } from "@/components/ImageUpload";
import { FormLabel } from "@/components/ui/form";
import { useTranslation } from "@/contexts/LanguageContext";

interface ImageStepProps {
  imageUrl: string | null;
  onImageChange: (file: File | null) => void;
  onImageRemove: () => void;
  uploading: boolean;
}

export const ImageStep = ({
  imageUrl,
  onImageChange,
  onImageRemove,
  uploading
}: ImageStepProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <FormLabel>Сүрөт</FormLabel>
        <p className="text-sm text-muted-foreground mb-4">
          {t("forms.imageUpload.select")}
        </p>
      </div>
      
      <ImageUpload
        imageUrl={imageUrl}
        onImageChange={onImageChange}
        onImageRemove={onImageRemove}
        uploading={uploading}
        className="h-64"
      />
    </div>
  );
};
