
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 flex justify-center">
          <img src="/logo.svg" alt="Leboncoin Logo" className="h-12" />
        </div>
        
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Bienvenue sur votre espace Leboncoin
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Connectez-vous pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-center text-gray-600">
              Notre plateforme vous permet de gérer facilement vos informations personnelles
              et de suivre vos transactions en toute sécurité.
            </p>
            
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={() => navigate('/login')} 
                className="bg-leboncoin-orange hover:bg-leboncoin-orange/90 text-white"
              >
                Se connecter
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin')}
                className="border-leboncoin-orange text-leboncoin-orange hover:bg-leboncoin-orange/10"
              >
                Accès administrateur
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center text-sm text-gray-500">
            © {new Date().getFullYear()} Leboncoin - Tous droits réservés
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
