
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "@/contexts/LanguageContext";
import { Form } from "@/components/ui/form";
import { StepForm } from "@/components/StepForm";
import { BasicInfoStep } from "../step-forms/BasicInfoStep";
import { ImageStep } from "../step-forms/ImageStep";
import { DescriptionStep } from "../step-forms/DescriptionStep";
import { ContactsStep } from "../step-forms/ContactsStep";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useFormDraft } from "@/hooks/useFormDraft";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
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

  // Use custom hooks
  const { 
    imageUrl, 
    imageFile, 
    uploading, 
    handleImageChange, 
    handleImageRemove, 
    uploadImage, 
    initializeImage,
    setImageUrl
  } = useImageUpload();

  const { saveDraft, loadDraft, clearDraft } = useFormDraft(
    DRAFT_STORAGE_KEY,
    form,
    initialData,
    isEditing
  );

  // Watch fields for validation
  const watchName = form.watch("name");

  // Initialize imageUrl with initial data
  useEffect(() => {
    if (initialData?.image_url) {
      initializeImage(initialData.image_url);
    }
  }, [initialData]);

  const handleFormSaveDraft = () => {
    saveDraft(imageUrl);
  };

  const handleFormLoadDraft = () => {
    loadDraft(setImageUrl);
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
        finalImageUrl = await uploadImage();
        
        if (!finalImageUrl) {
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
        clearDraft();
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
        saveDraft={!isEditing ? handleFormSaveDraft : undefined}
        loadDraft={!isEditing ? handleFormLoadDraft : undefined}
      />
    </Form>
  );
};
