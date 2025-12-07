import { MedicalForm } from "@/components/MedicalForm";
import { LanguageSelector } from "@/components/LanguageSelector";
import { AccessibilityControls } from "@/components/AccessibilityControls";

const Index = () => {
  return (
    <>
      <LanguageSelector />
      <AccessibilityControls />
      <MedicalForm />
    </>
  );
};

export default Index;
