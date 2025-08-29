import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const steps = [
  "/estimation-tache0",
  "/EstimationGrosBetonForm",
  "/EstimationSemelles",
    
];

export default function SurveyNavigator() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentStep = steps.indexOf(location.pathname);
  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      navigate(steps[currentStep + 1]);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      navigate(steps[currentStep - 1]);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
      {/* Progress bar */}
      <div
        style={{
          background: "#e0e0e0",
          borderRadius: "20px",
          overflow: "hidden",
          height: "20px",
          margin: "20px 0",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#FFD700", // jaune doré
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <p style={{ textAlign: "center" }}>
        Étape {currentStep + 1} / {steps.length} ({Math.round(progress)}%)
      </p>

      {/* Navigation buttons stylés en jaune */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
<button
  onClick={prevStep}
  disabled={currentStep === 0}
  style={{
    backgroundColor: "#FFD700",
    color: "#000",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: currentStep === 0 ? "not-allowed" : "pointer",
    opacity: currentStep === 0 ? 0.5 : 1,
    outline: "none", // supprime le contour bleu au focus
    boxShadow: "none", // supprime l’ombre
  }}
>
   Précédent
</button>

{/* Bouton suivant */}
<button
  onClick={nextStep}
  disabled={currentStep === steps.length - 1}
  style={{
    backgroundColor: "#FFD700",
    color: "#000",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: currentStep === steps.length - 1 ? "not-allowed" : "pointer",
    opacity: currentStep === steps.length - 1 ? 0.5 : 1,
    outline: "none", // supprime le contour bleu au focus
    boxShadow: "none", // supprime l’ombre
  }}
>
  Suivant 
</button>
      </div>
    </div>
  );
}
