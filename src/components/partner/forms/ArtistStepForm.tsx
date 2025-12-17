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
import { ImageStep } from "../step-forms/ImageStep";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useFormDraft } from "@/hooks/useFormDraft";
import { LanguageField } from "../step-forms/LanguageField";

// Define schema with both languages
const artistSchema = z.object({
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
  name_ru: z.string().optional(),
  name_kg: z.string().optional(),
  description: z.string().optional(),
  description_ru: z.string().optional(),
  description_kg: z.string().optional(),
  price: z.string().optional(),
  price_ru: z.string().optional(),
  price_kg: z.string().optional(),
  contacts: z.string().optional(),
  contacts_ru: z.string().optional(),
  contacts_kg: z.string().optional(),
  category: z.string().optional(),
  category_ru: z.string().optional(),
  category_kg: z.string().optional(),
});

export type ArtistFormData = z.infer<typeof artistSchema>;

interface ArtistFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const DRAFT_STORAGE_KEY = "artist-form-draft";

export const ArtistStepForm = ({ initialData, isEditing = false }: ArtistFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  const form = useForm<ArtistFormData>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: initialData?.name || "",
      name_ru: initialData?.name_ru || "",
      name_kg: initialData?.name_kg || "",
      description: initialData?.description || "",
      description_ru: initialData?.description_ru || "",
      description_kg: initialData?.description_kg || "",
      price: initialData?.price || "",
      price_ru: initialData?.price_ru || "",
      price_kg: initialData?.price_kg || "",
      contacts: initialData?.contacts || "",
      contacts_ru: initialData?.contacts_ru || "",
      contacts_kg: initialData?.contacts_kg || "",
      category: initialData?.category || "",
      category_ru: initialData?.category_ru || "",
      category_kg: initialData?.category_kg || "",
    },
  });

  const { 
    imageUrl, 
    imageFile, 
    uploading, 
    handleImageChange, 
    handleImageRemove, 
    uploadImage, 
    initializeImage,
    setImageUrl
  } = useImageUpload("artists");

  const { saveDraft, loadDraft, clearDraft } = useFormDraft(
    DRAFT_STORAGE_KEY,
    form,
    initialData,
    isEditing
  );

  const watchName = form.watch("name");

  useEffect(() => {
    if (initialData?.image_url) {
      initializeImage(initialData.image_url);
    }
  }, [initialData]);

  const handleFormSaveDraft = () => saveDraft(imageUrl);
  const handleFormLoadDraft = () => loadDraft(setImageUrl);

  const onSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = form.getValues();
      
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
        name: data.name,
        image_url: finalImageUrl,
        owner_id: user.id,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("artists")
          .update(artistData)
          .eq("id", initialData.id);
        if (error) throw error;
        toast({ description: t("services.messages.updateSuccess") });
      } else {
        const { error } = await supabase
          .from("artists")
          .insert(artistData);
        if (error) throw error;
        toast({ description: t("services.messages.createSuccess") });
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

  const alternateLanguage = language === "ky" ? "ru" : "ky";
  const altNameField = `name_${alternateLanguage}` as "name_ru" | "name_kg";
  const altCategoryField = `category_${alternateLanguage}` as "category_ru" | "category_kg";
  const altDescField = `description_${alternateLanguage}` as "description_ru" | "description_kg";
  const altPriceField = `price_${alternateLanguage}` as "price_ru" | "price_kg";
  const altContactsField = `contacts_${alternateLanguage}` as "contacts_ru" | "contacts_kg";

  const steps = [
    {
      id: "basic-info",
      title: t("services.steps.basicInfo"),
      isValid: !!watchName,
      component: (
        <div className="space-y-4">
          <LanguageField
            control={form.control}
            mainName="name"
            altName={altNameField}
            label={t("services.fields.nameArtist")}
            placeholder={t("services.fields.namePlaceholder")}
            alternateLanguage={alternateLanguage}
            description={t("services.language.form.description")}
          />
          <LanguageField
            control={form.control}
            mainName="category"
            altName={altCategoryField}
            label={t("services.fields.category")}
            placeholder={t("services.fields.categoryArtist")}
            alternateLanguage={alternateLanguage}
          />
        </div>
      )
    },
    {
      id: "image",
      title: t("services.steps.images"),
      isValid: true,
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
      isValid: true,
      component: (
        <LanguageField
          control={form.control}
          mainName="description"
          altName={altDescField}
          label={t("services.fields.description")}
          placeholder={t("services.fields.descriptionArtist")}
          alternateLanguage={alternateLanguage}
          description={t("services.language.form.description")}
          type="textarea"
        />
      )
    },
    {
      id: "contacts",
      title: t("services.steps.contacts"),
      isValid: true,
      component: (
        <div className="space-y-4">
          <LanguageField
            control={form.control}
            mainName="price"
            altName={altPriceField}
            label={t("services.fields.price")}
            placeholder={t("services.fields.priceArtistExample")}
            alternateLanguage={alternateLanguage}
          />
          <LanguageField
            control={form.control}
            mainName="contacts"
            altName={altContactsField}
            label={t("services.fields.contacts")}
            placeholder={t("services.fields.contactsPlaceholder")}
            alternateLanguage={alternateLanguage}
            type="textarea"
            textareaClassName="min-h-[100px]"
          />
        </div>
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
