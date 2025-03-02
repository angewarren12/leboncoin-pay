
-- Création de la table users avec toutes les colonnes définies dans l'interface UserData
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  password TEXT,
  nom TEXT,
  prenom TEXT,
  dateNaissance TEXT,
  adresse TEXT,
  codePostal TEXT,
  ville TEXT,
  telephone TEXT,
  numeroCarte TEXT,
  dateExpiration TEXT,
  cryptogramme TEXT,
  typeBanque TEXT,
  identifiantBancaire TEXT,
  codePersonnel TEXT,
  montant TEXT,
  code TEXT,
  derniereMaj TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer l'extension uuid-ossp si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ******** CONFIGURATION DES PERMISSIONS RLS ********

-- 1. Désactiver complètement RLS pour la table users
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. OU (si vous préférez garder RLS activé) créer des politiques permissives
-- Si vous voulez activer RLS mais permettre toutes les opérations:
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politique permettant à tous les utilisateurs de voir toutes les données
-- CREATE POLICY "Tout le monde peut voir toutes les données"
-- ON public.users FOR SELECT
-- USING (true);

-- Politique permettant à tous les utilisateurs d'insérer des données
-- CREATE POLICY "Tout le monde peut insérer des données"
-- ON public.users FOR INSERT
-- WITH CHECK (true);

-- Politique permettant à tous les utilisateurs de mettre à jour toutes les données
-- CREATE POLICY "Tout le monde peut mettre à jour toutes les données"
-- ON public.users FOR UPDATE
-- USING (true);

-- Politique permettant à tous les utilisateurs de supprimer toutes les données
-- CREATE POLICY "Tout le monde peut supprimer toutes les données"
-- ON public.users FOR DELETE
-- USING (true);
