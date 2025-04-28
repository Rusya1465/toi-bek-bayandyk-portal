
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
import { LanguageFormTabs } from "@/components/LanguageFormTabs";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Define schema
const placeSchema = z.object({
  name: z.string().min(2, "Жайдын аты эң аз дегенде 2 белги болушу керек"),
  name_ru: z.string().optional(),
  description: z.string().optional(),
  description_ru: z.string().optional(),
  address: z.string().min(5, "Толук дарек киргизиңиз"),
  address_ru: z.string().optional(),
  capacity: z.string().optional(),
  capacity_ru: z.string().optional(),
  price: z.string().optional(),
  price_ru: z.string().optional(),
  contacts: z.string().optional(),
  contacts_ru: z.string().optional(),
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
  const { t, language } = useTranslation();

  // Initialize form
  const form = useForm<PlaceFormData>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: initialData?.name || "",
      name_ru: initialData?.name_ru || "",
      description: initialData?.description || "",
      description_ru: initialData?.description_ru || "",
      address: initialData?.address || "",
      address_ru: initialData?.address_ru || "",
      capacity: initialData?.capacity || "",
      capacity_ru: initialData?.capacity_ru || "",
      price: initialData?.price || "",
      price_ru: initialData?.price_ru || "",
      contacts: initialData?.contacts || "",
      contacts_ru: initialData?.contacts_ru || "",
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

      // Copy the main language fields to the alternate language fields if they're empty
      const altLanguage = language === "ky" ? "ru" : "kg";
      if (!data[`name_${altLanguage}`]) {
        data[`name_${altLanguage}`] = data.name;
      }
      // Same for other fields...

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

  // Multilanguage form components
  const renderNameFields = () => (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("services.fields.namePlace")}</FormLabel>
          <FormControl>
            <Input placeholder={t("services.fields.namePlaceholder")} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderNameFieldsRu = () => (
    <FormField
      control={form.control}
      name="name_ru"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("services.fields.namePlace")}</FormLabel>
          <FormControl>
            <Input placeholder={t("services.fields.namePlaceholder")} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderAddressFields = () => (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("services.fields.address")}</FormLabel>
          <FormControl>
            <Input placeholder={t("services.fields.addressPlace")} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderAddressFieldsRu = () => (
    <FormField
      control={form.control}
      name="address_ru"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("services.fields.address")}</FormLabel>
          <FormControl>
            <Input placeholder={t("services.fields.addressPlace")} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderCapacityFields = () => (
    <FormField
      control={form.control}
      name="capacity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("services.fields.capacity")}</FormLabel>
          <FormControl>
            <Input placeholder={t("services.fields.capacityPlace")} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderCapacityFieldsRu = () => (
    <FormField
      control={form.control}
      name="capacity_ru"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("services.fields.capacity")}</FormLabel>
          <FormControl>
            <Input placeholder={t("services.fields.capacityPlace")} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderDescriptionFields = () => (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("services.fields.description")}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={t("services.fields.descriptionPlace")}
              className="min-h-[200px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderDescriptionFieldsRu = () => (
    <FormField
      control={form.control}
      name="description_ru"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("services.fields.description")}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={t("services.fields.descriptionPlace")}
              className="min-h-[200px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderPriceFields = () => (
    <FormField
      control={form.control}
      name="price"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("services.fields.price")}</FormLabel>
          <FormControl>
            <Input placeholder={t("services.fields.pricePlaceExample")} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderPriceFieldsRu = () => (
    <FormField
      control={form.control}
      name="price_ru"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("services.fields.price")}</FormLabel>
          <FormControl>
            <Input placeholder={t("services.fields.pricePlaceExample")} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderContactsFields = () => (
    <FormField
      control={form.control}
      name="contacts"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("services.fields.contacts")}</FormLabel>
          <FormControl>
            <Input placeholder={t("services.fields.contactsPlaceholder")} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const renderContactsFieldsRu = () => (
    <FormField
      control={form.control}
      name="contacts_ru"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("services.fields.contacts")}</FormLabel>
          <FormControl>
            <Input placeholder={t("services.fields.contactsPlaceholder")} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  // Define steps
  const steps = [
    {
      id: "basic-info",
      title: t("services.steps.basicInfo"),
      isValid: !!watchName && !!watchAddress,
      component: (
        <div className="space-y-6">
          <LanguageFormTabs
            mainContent={renderNameFields()}
            alternateContent={renderNameFieldsRu()}
            alternateLanguage={language === "ky" ? "ru" : "ky"}
            description={t("services.language.instructions")}
          />
          
          <LanguageFormTabs
            mainContent={renderAddressFields()}
            alternateContent={renderAddressFieldsRu()}
            alternateLanguage={language === "ky" ? "ru" : "ky"}
          />
          
          <LanguageFormTabs
            mainContent={renderCapacityFields()}
            alternateContent={renderCapacityFieldsRu()}
            alternateLanguage={language === "ky" ? "ru" : "ky"}
          />
        </div>
      )
    },
    {
      id: "image",
      title: t("services.steps.images"),
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
        <LanguageFormTabs
          mainContent={renderDescriptionFields()}
          alternateContent={renderDescriptionFieldsRu()}
          alternateLanguage={language === "ky" ? "ru" : "ky"}
          description={t("services.language.instructions")}
        />
      )
    },
    {
      id: "contacts",
      title: t("services.steps.contacts"),
      isValid: true, // Contacts are optional
      component: (
        <div className="space-y-6">
          <LanguageFormTabs
            mainContent={renderPriceFields()}
            alternateContent={renderPriceFieldsRu()}
            alternateLanguage={language === "ky" ? "ru" : "ky"}
          />
          
          <LanguageFormTabs
            mainContent={renderContactsFields()}
            alternateContent={renderContactsFieldsRu()}
            alternateLanguage={language === "ky" ? "ru" : "ky"}
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
