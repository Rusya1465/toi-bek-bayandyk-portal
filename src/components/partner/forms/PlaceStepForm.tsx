
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

// Define schema
const placeSchema = z.object({
  name: z.string().min(2, "Жайдын аты эң аз дегенде 2 белги болушу керек"),
  description: z.string().optional(),
  address: z.string().min(5, "Толук дарек киргизиңиз"),
  capacity: z.string().optional(),
  price: z.string().optional(),
  contacts: z.string().optional(),
});

export type PlaceFormData = z.infer<typeof placeSchema>;

interface PlaceFormProps {
  initialData?: any;
  isEditing?: boolean;
}

// Define the storage key for drafts
const DRAFT_STORAGE_KEY = "place-form-draft";

export const PlaceStepForm = ({ initialData, isEditing = false }: PlaceFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Initialize form
  const form = useForm<PlaceFormData>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      address: initialData?.address || "",
      capacity: initialData?.capacity || "",
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
  const watchAddress = form.watch("address");

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

      const placeData = {
        ...data,
        image_url: finalImageUrl,
        owner_id: user.id,
        name: data.name, // Ensure name is explicitly set and not optional
      };

      if (isEditing) {
        // Update existing place
        const { error } = await supabase
          .from("places")
          .update(placeData)
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          description: t("services.messages.updateSuccess"),
        });
      } else {
        // Create new place
        const { error } = await supabase
          .from("places")
          .insert(placeData);

        if (error) throw error;

        toast({
          description: t("services.messages.createSuccess"),
        });
        
        // Clear draft after successful submission
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

  // Define steps
  const steps = [
    {
      id: "basic-info",
      title: t("services.steps.basicInfo"),
      isValid: !!watchName && !!watchAddress,
      component: (
        <BasicInfoStep 
          form={form}
          nameLabel={t("services.fields.namePlace")}
          namePlaceholder={t("services.fields.namePlaceholder")}
          addressLabel={t("services.fields.address")}
          addressPlaceholder={t("services.fields.addressPlace")}
          capacityLabel={t("services.fields.capacity")}
          capacityPlaceholder={t("services.fields.capacityPlace")}
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
          descriptionPlaceholder={t("services.fields.descriptionPlace")}
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
          pricePlaceholder={t("services.fields.pricePlaceExample")}
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
        formId="place-form"
        loading={loading || uploading}
        saveDraft={!isEditing ? handleFormSaveDraft : undefined}
        loadDraft={!isEditing ? handleFormLoadDraft : undefined}
      />
    </Form>
  );
};
