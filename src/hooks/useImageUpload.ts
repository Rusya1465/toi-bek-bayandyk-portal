
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { uploadFileWithProgress } from "@/lib/storage-utils";

export const useImageUpload = (bucketName: string = "places") => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleImageChange = (file: File | null) => {
    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      setImageFile(file);
    }
  };

  const handleImageRemove = () => {
    setImageUrl(null);
    setImageFile(null);
    setUploadProgress(0);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!user || !imageFile) return imageUrl;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Reset the progress state before starting the upload
      const finalImageUrl = await uploadFileWithProgress(
        imageFile,
        bucketName,
        user.id,
        (progress) => {
          console.log(`Upload progress: ${progress}%`);
          setUploadProgress(progress);
        }
      );
      
      if (!finalImageUrl) {
        toast({
          variant: "destructive",
          description: "Error uploading image",
        });
        return null;
      }
      
      console.log("Upload complete, final URL:", finalImageUrl);
      setImageUrl(finalImageUrl);
      return finalImageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        description: `Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const initializeImage = (initialImageUrl: string | null) => {
    if (initialImageUrl) {
      setImageUrl(initialImageUrl);
    }
  };

  return {
    imageUrl,
    imageFile,
    uploading,
    uploadProgress,
    handleImageChange,
    handleImageRemove,
    uploadImage,
    initializeImage,
    setImageUrl
  };
};
