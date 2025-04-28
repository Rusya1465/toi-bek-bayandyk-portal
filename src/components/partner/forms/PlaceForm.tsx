
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Upload, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const placeFormSchema = z.object({
  name: z.string().min(2, "Жайдын аты эң аз дегенде 2 белги болушу керек"),
  description: z.string().optional(),
  address: z.string().min(5, "Толук дарек киргизиңиз"),
  capacity: z.string().optional(),
  price: z.string().optional(),
  contacts: z.string().optional(),
});

type PlaceFormData = z.infer<typeof placeFormSchema>;

interface PlaceFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export const PlaceForm = ({ initialData, isEditing = false }: PlaceFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<PlaceFormData>({
    resolver: zodResolver(placeFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      address: initialData?.address || "",
      capacity: initialData?.capacity || "",
      price: initialData?.price || "",
      contacts: initialData?.contacts || "",
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!user) return null;
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    setUploading(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from("service-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("service-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: "Сүрөт жүктөөдө ката кетти: " + error.message,
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setImageFile(file);
  };

  const onSubmit = async (data: PlaceFormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Upload image if there's a new one
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await handleImageUpload(imageFile);
        if (!finalImageUrl) return;
      }

      const placeData = {
        ...data,
        image_url: finalImageUrl,
        owner_id: user.id,
      };

      if (isEditing) {
        // Update existing place
        const { error } = await supabase
          .from("places")
          .update(placeData)
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          description: "Жай ийгиликтүү жаңыртылды",
        });
      } else {
        // Create new place
        const { error } = await supabase
          .from("places")
          .insert([placeData]);

        if (error) throw error;

        toast({
          description: "Жай ийгиликтүү түзүлдү",
        });
      }

      navigate("/profile/services");
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Жайды ${isEditing ? "жаңыртууда" : "түзүүдө"} ката кетти: ` + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6">
          <FormLabel>Сүрөт</FormLabel>
          <div className="mt-2 flex items-center justify-center border border-dashed border-gray-300 rounded-lg p-6 h-48 relative">
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
                  className="absolute top-0 right-0 rounded-full"
                  onClick={() => {
                    setImageUrl(null);
                    setImageFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Сүрөт тандаңыз же сүйрөп келиңиз
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
              </label>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <Loader className="h-8 w-8 animate-spin" />
              </div>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Жайдын аты</FormLabel>
              <FormControl>
                <Input placeholder="Ресторан же банкет залынын аты" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сыпаттама</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Жайдын сыпаттамасы, өзгөчөлүктөрү жана кошумча маалымат"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дареги</FormLabel>
                <FormControl>
                  <Input placeholder="Толук дареги" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Сыйымдуулугу</FormLabel>
                <FormControl>
                  <Input placeholder="Канча адам батат" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Баасы</FormLabel>
                <FormControl>
                  <Input placeholder="Мисалы: 50000-100000 сом" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contacts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Байланыш маалыматтары</FormLabel>
                <FormControl>
                  <Input placeholder="Телефон, WhatsApp же башка байланыш" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/profile/services")}
            disabled={loading}
          >
            Жокко чыгаруу
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Сакталууда...
              </>
            ) : isEditing ? (
              "Жаңыртуу"
            ) : (
              "Түзүү"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
