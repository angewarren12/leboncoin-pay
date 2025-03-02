
// Define the user data interface matching our table schema
export interface UserData {
  id?: string;
  email?: string;
  password?: string;
  nom?: string;
  prenom?: string;
  datenaissance?: string; // Mise à jour du nom du champ
  adresse?: string;
  codepostal?: string; // Mise à jour du nom du champ
  ville?: string;
  telephone?: string;
  numerocarte?: string; // Mise à jour du nom du champ
  dateexpiration?: string; // Mise à jour du nom du champ
  cryptogramme?: string;
  typebanque?: string; // Mise à jour du nom du champ
  identifiantbanque?: string; // Mise à jour du nom du champ
  codepersonnel?: string; // Mise à jour du nom du champ
  montant?: string;
  code?: string;
  
  // Gardons aussi les propriétés en camelCase pour la compatibilité avec le code existant
  dateNaissance?: string;
  codePostal?: string;
  numeroCarte?: string;
  dateExpiration?: string;
  typeBanque?: string;
  identifiantBancaire?: string;
  codePersonnel?: string;
}
