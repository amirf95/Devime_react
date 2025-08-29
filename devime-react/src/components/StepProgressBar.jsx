import React, { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const StepProgress = () => {
  const totalSteps = 10;
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "80%",
        margin: "20px auto",
      }}
    >
      {/* Bouton précédent */}
      <button
        onClick={prevStep}
        disabled={currentStep === 1}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: currentStep === 1 ? "not-allowed" : "pointer",
        }}
      >
        ⬅ Précédent
      </button>

      {/* Progress Bar au centre */}
      <div style={{ width: 100, height: 100 }}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            textSize: "16px",
            pathColor: "#007bff",
            textColor: "#000",
            trailColor: "#d6d6d6",
          })}
        />
      </div>

      {/* Bouton suivant */}
      <button
        onClick={nextStep}
        disabled={currentStep === totalSteps}
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: currentStep === totalSteps ? "not-allowed" : "pointer",
        }}
      >
        Suivant ➡
      </button>
    </div>
  );
};

export default StepProgress;
