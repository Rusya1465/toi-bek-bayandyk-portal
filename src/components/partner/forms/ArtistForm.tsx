
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, Upload, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const artistFormSchema = z.object({
  name: z.string().min(2, "Аты эң аз дегенде 2 белги болушу керек"),
  genre: z.string().optional(),
  experience: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  contacts: z.string().optional(),
});

type ArtistFormData = z.infer<typeof artistFormSchema>;

const genreOptions = [
  "Ырчы",
  "Тамада",
  "Бийчи",
  "Музыкант",
  "DJ",
  "Ансамбль",
  "Башка",
];

interface ArtistFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export const ArtistForm = ({ initialData, isEditing = false }: ArtistFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ArtistFormData>({
    resolver: zodResolver(artistFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      genre: initialData?.genre || "",
      experience: initialData?.experience || "",
      description: initialData?.description || "",
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

  const onSubmit = async (data: ArtistFormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Upload image if there's a new one
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await handleImageUpload(imageFile);
        if (!finalImageUrl) return;
      }

      const artistData = {
        ...data,
        image_url: finalImageUrl,
        owner_id: user.id,
      };

      if (isEditing) {
        // Update existing artist
        const { error } = await supabase
          .from("artists")
          .update(artistData)
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          description: "Артист ийгиликтүү жаңыртылды",
        });
      } else {
        // Create new artist
        const { error } = await supabase
          .from("artists")
          .insert([artistData]);

        if (error) throw error;

        toast({
          description: "Артист ийгиликтүү түзүлдү",
        });
      }

      navigate("/profile/services");
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Артистти ${isEditing ? "жаңыртууда" : "түзүүдө"} ката кетти: ` + error.message,
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
              <FormLabel>Аты</FormLabel>
              <FormControl>
                <Input placeholder="Атыңыз же топтун аты" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Категория</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Категорияны тандаңыз" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genreOptions.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тажрыйба</FormLabel>
                <FormControl>
                  <Input placeholder="Мисалы: 5 жыл" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сыпаттама</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Өзүңүз, репертуарыңыз же кызматтарыңыз жөнүндө кыскача маалымат"
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Баасы</FormLabel>
                <FormControl>
                  <Input placeholder="Мисалы: Саатына 5000 сом" {...field} />
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
