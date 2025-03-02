
import React from "react";
import { cn } from "@/lib/utils";

interface ProgressStepperProps {
  currentStep: number;
  steps: string[];
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-lg mx-auto mb-10 animate-fade-in">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                index < currentStep
                  ? "border-leboncoin-blue bg-white"
                  : index === currentStep
                  ? "border-leboncoin-blue bg-leboncoin-blue"
                  : "border-gray-300 bg-white"
              )}
            >
              {index < currentStep ? (
                <svg 
                  className="w-4 h-4 text-leboncoin-blue" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : index === currentStep ? (
                <div className="w-3 h-3 bg-white rounded-full"></div>
              ) : null}
            </div>
            <span className="mt-2 text-xs font-medium text-gray-600">{step}</span>
          </div>
          
          {/* Line between circles */}
          {index < steps.length - 1 && (
            <div 
              className={cn(
                "flex-grow h-0.5 transition-all duration-300",
                index < currentStep ? "bg-leboncoin-blue" : "bg-gray-300"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressStepper;
