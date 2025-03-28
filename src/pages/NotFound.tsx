
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <img 
        src="/logo.svg" 
        alt="Leboncoin" 
        className="h-8 mb-12" 
      />
      
      <div className="text-center max-w-md animate-fade-in">
        <h1 className="text-5xl font-bold mb-4 text-leboncoin-orange">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oups ! Cette page <span className="text-leboncoin-orange">Leboncoin</span> n'existe pas
        </p>
        <button 
          onClick={() => navigate("/")}
          className="primary-button max-w-xs mx-auto"
        >
          Retourner à l'accueil
        </button>
      </div>
    </div>
  );
};

export default NotFound;
