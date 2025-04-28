
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "@/contexts/LanguageContext";
import { Form, FormField } from "@/components/ui/form";
import { Loader } from "lucide-react";
import { StepForm } from "@/components/StepForm";
import { BasicInfoStep } from "../step-forms/BasicInfoStep";
import { ImageStep } from "../step-forms/ImageStep";
import { DescriptionStep } from "../step-forms/DescriptionStep";
import { ContactsStep } from "../step-forms/ContactsStep";
import { uploadFileWithProgress } from "@/lib/storage-utils";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Define schema
const artistSchema = z.object({
  name: z.string().min(2, "Аты эң аз дегенде 2 белги болушу керек"),
  genre: z.string().optional(),
  experience: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  contacts: z.string().optional(),
});

export type ArtistFormData = z.infer<typeof artistSchema>;

interface ArtistFormProps {
  initialData?: any;
  isEditing?: boolean;
}

// Define the storage key for drafts
const DRAFT_STORAGE_KEY = "artist-form-draft";

// Genre options
const genreOptions = [
  "Ырчы",
  "Тамада",
  "Бийчи",
  "Музыкант",
  "DJ",
  "Ансамбль",
  "Башка",
];

export const ArtistStepForm = ({ initialData, isEditing = false }: ArtistFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Initialize form
  const form = useForm<ArtistFormData>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: initialData?.name || "",
      genre: initialData?.genre || "",
      experience: initialData?.experience || "",
      description: initialData?.description || "",
      price: initialData?.price || "",
      contacts: initialData?.contacts || "",
    },
  });

  const watchName = form.watch("name");
  const watchGenre = form.watch("genre");
  const watchDescription = form.watch("description");

  // Load draft from localStorage on mount
  useEffect(() => {
    if (!isEditing && !initialData) {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft);
          form.reset(draftData.formData);
          if (draftData.imageUrl) {
            setImageUrl(draftData.imageUrl);
          }
        } catch (error) {
          console.error("Error loading draft:", error);
        }
      }
    }
  }, [isEditing, initialData, form]);

  // Save draft to localStorage
  const saveDraft = () => {
    if (!isEditing) {
      const formData = form.getValues();
      const draftData = {
        formData,
        imageUrl
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
    }
  };

  // Load draft from localStorage
  const loadDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        form.reset(draftData.formData);
        if (draftData.imageUrl) {
          setImageUrl(draftData.imageUrl);
        }
        toast({
          description: t("services.messages.draftLoaded"),
        });
      } catch (error) {
        console.error("Error loading draft:", error);
        toast({
          variant: "destructive",
          description: "Error loading draft",
        });
      }
    } else {
      toast({
        variant: "destructive",
        description: "No saved draft found",
      });
    }
  };

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
  };

  const onSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get form data
      const data = form.getValues();
      
      // Upload image if there's a new one
      let finalImageUrl = imageUrl;
      if (imageFile) {
        setUploading(true);
        finalImageUrl = await uploadFileWithProgress(
          imageFile,
          "service-images",
          user.id,
          (progress) => setUploadProgress(progress)
        );
        setUploading(false);
        
        if (!finalImageUrl) {
          toast({
            variant: "destructive",
            description: t("forms.imageUpload.error"),
          });
          setLoading(false);
          return;
        }
      }

      const artistData = {
        ...data,
        name: data.name, // Ensure name is explicitly set and not optional
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
          description: t("services.messages.updateSuccess"),
        });
      } else {
        // Create new artist
        const { error } = await supabase
          .from("artists")
          .insert(artistData);

        if (error) throw error;

        toast({
          description: t("services.messages.createSuccess"),
        });
        
        // Clear draft after successful submission
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }

      navigate("/profile/services");
    } catch (error: any) {
      console.error("Error saving artist:", error);
      toast({
        variant: "destructive",
        description: `${isEditing ? t("services.messages.updateError") : t("services.messages.createError")}: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Genre select component
  const GenreSelect = () => (
    <div className="grid grid-cols-1 gap-4">
      <FormField
        control={form.control}
        name="genre"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("services.fields.genre")}</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("services.fields.selectCategory")} />
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
            <FormLabel>{t("services.fields.experience")}</FormLabel>
            <FormControl>
              <Input placeholder={t("services.fields.experienceArtistPlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  // Define steps
  const steps = [
    {
      id: "basic-info",
      title: t("services.steps.basicInfo"),
      isValid: !!watchName,
      component: (
        <BasicInfoStep 
          form={form}
          nameLabel={t("services.fields.nameArtist")}
          namePlaceholder={t("services.fields.nameArtistPlaceholder")}
          genreLabel={t("services.fields.genre")}
          experienceOptions={<GenreSelect />}
          addressLabel=""
          addressPlaceholder=""
        />
      )
    },
    {
      id: "image",
      title: "Сүрөт",
      isValid: true, // Image is optional
      component: (
        <ImageStep
          imageUrl={imageUrl}
          onImageChange={handleImageChange}
          onImageRemove={handleImageRemove}
          uploading={uploading}
        />
      )
    },
    {
      id: "description",
      title: t("services.steps.description"),
      isValid: true, // Description is optional
      component: (
        <DescriptionStep 
          form={form}
          descriptionLabel={t("services.fields.description")}
          descriptionPlaceholder={t("services.fields.descriptionArtist")}
        />
      )
    },
    {
      id: "contacts",
      title: t("services.steps.contacts"),
      isValid: true, // Contacts are optional
      component: (
        <ContactsStep 
          form={form}
          priceLabel={t("services.fields.price")}
          pricePlaceholder={t("services.fields.priceArtistExample")}
          contactsLabel={t("services.fields.contacts")}
          contactsPlaceholder={t("services.fields.contactsPlaceholder")}
        />
      )
    }
  ];

  return (
    <Form {...form}>
      <StepForm 
        steps={steps}
        onSubmit={onSubmit}
        formId="artist-form"
        loading={loading || uploading}
        saveDraft={!isEditing ? saveDraft : undefined}
        loadDraft={!isEditing ? loadDraft : undefined}
      />
    </Form>
  );
};
