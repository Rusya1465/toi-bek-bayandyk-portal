
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
import { LanguageFormTabs } from "@/components/LanguageFormTabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

// Define schema with both languages
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

  // Initialize imageUrl with initial data - FIX: Make sure this useEffect returns either nothing or a proper cleanup function
  useEffect(() => {
    if (initialData?.image_url) {
      initializeImage(initialData.image_url);
    }
    // Return nothing or a proper cleanup function
    return () => {
      // Empty cleanup function
    };
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
        name: data.name, // Ensure name is explicitly set and not optional
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

  // Determine which language is alternate based on current language
  const alternateLanguage = language === "ky" ? "ru" : "ky";

  // Define custom components for language tabs
  const NameInput = () => {
    const altLang = alternateLanguage;
    const altLangField = `name_${altLang}` as "name_ru" | "name_kg";
    
    return (
      <LanguageFormTabs
        mainContent={
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
        }
        alternateContent={
          <FormField
            control={form.control}
            name={altLangField}
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
        }
        alternateLanguage={altLang}
        description={t("services.language.form.description")}
      />
    );
  };

  const AddressInput = () => {
    const altLang = alternateLanguage;
    const altLangField = `address_${altLang}` as "address_ru" | "address_kg";
    
    return (
      <LanguageFormTabs
        mainContent={
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
        }
        alternateContent={
          <FormField
            control={form.control}
            name={altLangField}
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
        }
        alternateLanguage={altLang}
      />
    );
  };

  const CapacityInput = () => {
    const altLang = alternateLanguage;
    const altLangField = `capacity_${altLang}` as "capacity_ru" | "capacity_kg";
    
    return (
      <LanguageFormTabs
        mainContent={
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
        }
        alternateContent={
          <FormField
            control={form.control}
            name={altLangField}
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
        }
        alternateLanguage={altLang}
      />
    );
  };

  const DescriptionInputTab = () => {
    const altLang = alternateLanguage;
    const altLangField = `description_${altLang}` as "description_ru" | "description_kg";
    
    return (
      <LanguageFormTabs
        mainContent={
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("services.fields.description")}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t("services.fields.descriptionPlace")}
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        }
        alternateContent={
          <FormField
            control={form.control}
            name={altLangField}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("services.fields.description")}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t("services.fields.descriptionPlace")}
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        }
        alternateLanguage={altLang}
        description={t("services.language.form.description")}
      />
    );
  };
  
  const PriceInput = () => {
    const altLang = alternateLanguage;
    const altLangField = `price_${altLang}` as "price_ru" | "price_kg";
    
    return (
      <LanguageFormTabs
        mainContent={
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
        }
        alternateContent={
          <FormField
            control={form.control}
            name={altLangField}
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
        }
        alternateLanguage={altLang}
      />
    );
  };

  const ContactsInput = () => {
    const altLang = alternateLanguage;
    const altLangField = `contacts_${altLang}` as "contacts_ru" | "contacts_kg";
    
    return (
      <LanguageFormTabs
        mainContent={
          <FormField
            control={form.control}
            name="contacts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("services.fields.contacts")}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t("services.fields.contactsPlaceholder")}
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        }
        alternateContent={
          <FormField
            control={form.control}
            name={altLangField}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("services.fields.contacts")}</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t("services.fields.contactsPlaceholder")}
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        }
        alternateLanguage={altLang}
      />
    );
  };

  // Define steps
  const steps = [
    {
      id: "basic-info",
      title: t("services.steps.basicInfo"),
      isValid: !!watchName,
      component: (
        <div className="space-y-4">
          <NameInput />
          <AddressInput />
          <CapacityInput />
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
      component: <DescriptionInputTab />
    },
    {
      id: "contacts",
      title: t("services.steps.contacts"),
      isValid: true, // Contacts are optional
      component: (
        <div className="space-y-4">
          <PriceInput />
          <ContactsInput />
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

