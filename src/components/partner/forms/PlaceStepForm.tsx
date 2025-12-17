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

const placeSchema = z.object({
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
  name_ru: z.string().optional(),
  name_kg: z.string().optional(),
  address: z.string().optional(),
  address_ru: z.string().optional(),
  address_kg: z.string().optional(),
  capacity: z.string().optional(),
  capacity_ru: z.string().optional(),
  capacity_kg: z.string().optional(),
  description: z.string().optional(),
  description_ru: z.string().optional(),
  description_kg: z.string().optional(),
  price: z.string().optional(),
  price_ru: z.string().optional(),
  price_kg: z.string().optional(),
  contacts: z.string().optional(),
  contacts_ru: z.string().optional(),
  contacts_kg: z.string().optional(),
});

export type PlaceFormData = z.infer<typeof placeSchema>;

interface PlaceFormProps {
  initialData?: any;
  isEditing?: boolean;
}

const DRAFT_STORAGE_KEY = "place-form-draft";

export const PlaceStepForm = ({ initialData, isEditing = false }: PlaceFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, language } = useTranslation();

  const form = useForm<PlaceFormData>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: initialData?.name || "",
      name_ru: initialData?.name_ru || "",
      name_kg: initialData?.name_kg || "",
      address: initialData?.address || "",
      address_ru: initialData?.address_ru || "",
      address_kg: initialData?.address_kg || "",
      capacity: initialData?.capacity || "",
      capacity_ru: initialData?.capacity_ru || "",
      capacity_kg: initialData?.capacity_kg || "",
      description: initialData?.description || "",
      description_ru: initialData?.description_ru || "",
      description_kg: initialData?.description_kg || "",
      price: initialData?.price || "",
      price_ru: initialData?.price_ru || "",
      price_kg: initialData?.price_kg || "",
      contacts: initialData?.contacts || "",
      contacts_ru: initialData?.contacts_ru || "",
      contacts_kg: initialData?.contacts_kg || "",
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
  } = useImageUpload("places");

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

      const placeData = {
        ...data,
        name: data.name,
        image_url: finalImageUrl,
        owner_id: user.id,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("places")
          .update(placeData)
          .eq("id", initialData.id);
        if (error) throw error;
        toast({ description: t("services.messages.updateSuccess") });
      } else {
        const { error } = await supabase
          .from("places")
          .insert(placeData);
        if (error) throw error;
        toast({ description: t("services.messages.createSuccess") });
        clearDraft();
      }

      navigate("/profile/services");
    } catch (error: any) {
      console.error("Error saving place:", error);
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
  const altAddressField = `address_${alternateLanguage}` as "address_ru" | "address_kg";
  const altCapacityField = `capacity_${alternateLanguage}` as "capacity_ru" | "capacity_kg";
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
            label={t("services.fields.namePlace")}
            placeholder={t("services.fields.namePlaceholder")}
            alternateLanguage={alternateLanguage}
            description={t("services.language.form.description")}
          />
          <LanguageField
            control={form.control}
            mainName="address"
            altName={altAddressField}
            label={t("services.fields.address")}
            placeholder={t("services.fields.addressPlace")}
            alternateLanguage={alternateLanguage}
          />
          <LanguageField
            control={form.control}
            mainName="capacity"
            altName={altCapacityField}
            label={t("services.fields.capacity")}
            placeholder={t("services.fields.capacityPlace")}
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
          placeholder={t("services.fields.descriptionPlace")}
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
            placeholder={t("services.fields.pricePlaceExample")}
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
        formId="place-form"
        loading={loading || uploading}
        saveDraft={!isEditing ? handleFormSaveDraft : undefined}
        loadDraft={!isEditing ? handleFormLoadDraft : undefined}
      />
    </Form>
  );
};
