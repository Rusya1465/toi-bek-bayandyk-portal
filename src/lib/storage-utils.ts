
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";

export type UploadProgressHandler = (progress: number) => void;

// Function to upload file with progress tracking
export const uploadFileWithProgress = async (
  file: File,
  bucketName: string,
  userId: string,
  onProgress?: UploadProgressHandler
): Promise<string | null> => {
  try {
    // Generate unique file path
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    console.log(`Starting file upload to ${bucketName}/${filePath}`);
    
    // Use the correct type for upload options
    const options: {
      cacheControl: string;
      upsert: boolean;
      onUploadProgress?: (progress: { percent: number }) => void;
    } = {
      cacheControl: '3600',
      upsert: false
    };
    
    // Add onUploadProgress handler if provided
    if (onProgress) {
      options.onUploadProgress = (progress: { percent: number }) => {
        const percent = Math.round(progress.percent);
        console.log(`Upload progress: ${percent}%`);
        onProgress(percent);
      };
    }
    
    // Upload file
    const { error: uploadError, data } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, options);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }
    
    if (!data) {
      throw new Error("No data returned from upload");
    }
    
    console.log("File uploaded successfully, getting public URL");
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log("Public URL generated:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error: any) {
    console.error("File upload error:", error);
    toast({
      variant: "destructive",
      description: `Error uploading file: ${error.message}`,
    });
    return null;
  }
}

// Function to delete a file
export const deleteFile = async (
  bucketName: string,
  filePath: string
): Promise<boolean> => {
  try {
    // Extract the path from the full URL if needed
    let path = filePath;
    
    if (filePath.includes(bucketName)) {
      // Extract path from URL format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]
      const pathParts = filePath.split(`/${bucketName}/`);
      if (pathParts.length > 1) {
        path = pathParts[1];
      }
    }
    
    console.log(`Attempting to delete file: ${bucketName}/${path}`);
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);

    if (error) {
      console.error("File deletion error:", error);
      throw error;
    }
    
    console.log("File deleted successfully");
    return true;
  } catch (error: any) {
    console.error("File deletion error:", error);
    return false;
  }
}
