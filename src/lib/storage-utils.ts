
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";

export type UploadProgressHandler = (progress: number) => void;

// Function to ensure the bucket exists
export const ensureBucketExists = async (bucketName: string) => {
  // Check if bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  
  if (!bucketExists) {
    // Create bucket if it doesn't exist
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024 // 5MB
    });
    
    if (error) {
      console.error("Error creating bucket:", error);
      return false;
    }
  }
  
  return true;
}

// Function to upload file with progress tracking
export const uploadFileWithProgress = async (
  file: File,
  bucketName: string,
  userId: string,
  onProgress?: UploadProgressHandler
): Promise<string | null> => {
  try {
    // Check if bucket exists or create it
    const bucketOk = await ensureBucketExists(bucketName);
    if (!bucketOk) {
      throw new Error("Failed to create or access storage bucket");
    }
    
    // Generate unique file path
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    // Use the correct type for upload options
    const options = {
      cacheControl: '3600',
      upsert: false
    } as const;
    
    // Add onUploadProgress handler if provided
    if (onProgress) {
      // Cast to any to work around TypeScript limitations
      (options as any).onUploadProgress = (progress: { percent: number }) => {
        onProgress(progress.percent);
      };
    }
    
    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, options);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
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
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error("File deletion error:", error);
    return false;
  }
}
