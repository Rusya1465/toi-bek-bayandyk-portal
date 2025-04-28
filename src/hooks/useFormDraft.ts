
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/contexts/LanguageContext";

export const useFormDraft = <T extends Record<string, any>>(
  storageKey: string,
  form: any,
  initialData?: T,
  isEditing: boolean = false
) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [initialized, setInitialized] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (!isEditing && !initialData && !initialized) {
      const savedDraft = localStorage.getItem(storageKey);
      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft);
          form.reset(draftData.formData);
          setInitialized(true);
          return draftData;
        } catch (error) {
          console.error("Error loading draft:", error);
        }
      }
    }
    setInitialized(true);
    return null;
  }, [isEditing, initialData, form, storageKey, initialized]);

  // Save draft to localStorage
  const saveDraft = (imageUrl: string | null) => {
    if (!isEditing) {
      const formData = form.getValues();
      const draftData = {
        formData,
        imageUrl
      };
      localStorage.setItem(storageKey, JSON.stringify(draftData));
      toast({
        description: t("services.messages.draftSaved"),
      });
    }
  };

  // Load draft from localStorage
  const loadDraft = (setImageUrl: (url: string | null) => void) => {
    const savedDraft = localStorage.getItem(storageKey);
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

  // Clear draft from localStorage
  const clearDraft = () => {
    localStorage.removeItem(storageKey);
  };

  return { saveDraft, loadDraft, clearDraft };
};
