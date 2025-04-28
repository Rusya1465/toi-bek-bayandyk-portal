
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface Step {
  id: string;
  title: string;
  component: React.ReactNode;
  isValid: boolean;
}

interface StepFormProps {
  steps: Step[];
  onSubmit: () => void;
  formId: string;
  loading?: boolean;
  saveDraft?: () => void;
  loadDraft?: () => void;
}

export const StepForm: React.FC<StepFormProps> = ({
  steps,
  onSubmit,
  formId,
  loading = false,
  saveDraft,
  loadDraft,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { t } = useTranslation();
  const { toast } = useToast();

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const nextStep = useCallback(() => {
    if (!currentStep.isValid) {
      toast({
        variant: "destructive",
        description: t("forms.required"),
      });
      return;
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      
      if (saveDraft) {
        saveDraft();
        toast({
          description: t("services.messages.draftSaved"),
        });
      }
    }
  }, [currentStepIndex, steps.length, currentStep.isValid, saveDraft, toast, t]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!steps.every((step) => step.isValid)) {
      toast({
        variant: "destructive",
        description: t("forms.required"),
      });
      return;
    }
    
    onSubmit();
  };

  // Keyboard navigation between steps
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        nextStep();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextStep]);

  return (
    <div className="w-full">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              type="button" 
              className={`text-sm ${
                index === currentStepIndex
                  ? "text-primary font-medium"
                  : index < currentStepIndex
                  ? "text-muted-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => {
                if (index < currentStepIndex || steps[index].isValid) {
                  setCurrentStepIndex(index);
                }
              }}
            >
              {step.title}
            </button>
          ))}
        </div>
        <Progress value={progress} />
      </div>

      {/* Step content */}
      <form id={formId} onSubmit={handleSubmitForm}>
        {currentStep.component}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <div>
            {currentStepIndex > 0 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep}
                disabled={loading}
              >
                {t("common.back")}
              </Button>
            )}
            
            {loadDraft && (
              <Button
                type="button"
                variant="ghost"
                onClick={loadDraft}
                className="ml-2"
                disabled={loading}
              >
                {t("services.buttons.loadDraft")}
              </Button>
            )}
          </div>
          
          <div>
            {saveDraft && (
              <Button
                type="button"
                variant="secondary"
                onClick={saveDraft}
                className="mr-2"
                disabled={loading}
              >
                {t("services.buttons.saveDraft")}
              </Button>
            )}
            
            {currentStepIndex < steps.length - 1 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={loading || !currentStep.isValid}
              >
                {t("common.next")}
              </Button>
            ) : (
              <Button 
                type="submit"
                disabled={loading || !currentStep.isValid}
              >
                {t("common.submit")}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
