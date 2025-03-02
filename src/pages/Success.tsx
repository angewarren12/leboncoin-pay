
import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { getFromSession, saveUserDataToJson } from "@/utils/sessionUtils";
import { useNavigate } from "react-router-dom";

const Success: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const navigate = useNavigate();

  useEffect(() => {
    // Récupère les données utilisateur depuis la session
    const sessionData = getFromSession("userData");
    setUserData(sessionData);

    // Sauvegarde les données
    const saveData = async () => {
      setSaveStatus("saving");
      try {
        await saveUserDataToJson();
        setSaveStatus("success");
      } catch (error) {
        console.error("Error saving data:", error);
        setSaveStatus("error");
      }
    };

    saveData();
  }, []);

  const handleFinish = () => {
    // Réinitialise la session et redirige vers la page d'accueil
    sessionStorage.clear();
    navigate("/");
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
        <div className="w-full max-w-lg px-6 py-10 bg-white rounded-lg text-center animate-scale-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Transaction réussie !</h1>
          
          <p className="text-gray-600 mb-8">
            Votre paiement a été traité avec succès. Vous recevrez une confirmation par email dans les plus brefs délais.
          </p>

          {saveStatus === "saving" && (
            <div className="mb-6 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-leboncoin-orange border-t-transparent rounded-full animate-spin mr-2"></div>
              <p className="text-gray-600">Finalisation de votre transaction...</p>
            </div>
          )}

          {saveStatus === "success" && (
            <div className="mb-6 text-green-600">
              <p>Toutes vos données ont été enregistrées avec succès !</p>
            </div>
          )}

          {saveStatus === "error" && (
            <div className="mb-6 text-red-600">
              <p>Une erreur est survenue lors de l'enregistrement de vos données. Veuillez réessayer ultérieurement.</p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <h3 className="font-semibold text-gray-700 mb-2">Résumé de transaction</h3>
            <div className="space-y-1 text-left">
              <p className="flex justify-between">
                <span className="text-gray-500">Statut:</span>
                <span className="font-medium text-green-600">Complété</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">ID Transaction:</span>
                <span>{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="primary-button"
          >
            Terminer
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Success;
