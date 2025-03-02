
import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

const PaymentNotification: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/address-confirmation");
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
            className="primary-button"
          >
            Continuer
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentNotification;
