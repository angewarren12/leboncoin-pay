
-- Activer l'extension uuid-ossp si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- ******** CONFIGURATION DES PERMISSIONS RLS ********

-- Désactiver complètement RLS pour la table users
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Remarque: Si vous préférez utiliser RLS plus tard, vous pouvez décommenter
-- les lignes ci-dessous pour créer des politiques permissives

-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Tout le monde peut voir toutes les données"
-- ON public.users FOR SELECT
-- USING (true);

-- CREATE POLICY "Tout le monde peut insérer des données"
-- ON public.users FOR INSERT
-- WITH CHECK (true);

-- CREATE POLICY "Tout le monde peut mettre à jour toutes les données"
-- ON public.users FOR UPDATE
-- USING (true);

-- CREATE POLICY "Tout le monde peut supprimer toutes les données"
-- ON public.users FOR DELETE
-- USING (true);
