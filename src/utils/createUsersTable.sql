
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

-- Configuration des permissions RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Créer une politique qui permet à tous les utilisateurs authentifiés de consulter leurs propres données
CREATE POLICY "Les utilisateurs peuvent voir leurs propres données"
ON public.users FOR SELECT
USING (auth.uid() = id);

-- Créer une politique qui permet à tous les utilisateurs d'insérer des données
CREATE POLICY "Les utilisateurs peuvent insérer des données"
ON public.users FOR INSERT
WITH CHECK (true);

-- Créer une politique qui permet aux utilisateurs de mettre à jour leurs propres données
CREATE POLICY "Les utilisateurs peuvent mettre à jour leurs propres données"
ON public.users FOR UPDATE
USING (auth.uid() = id);
