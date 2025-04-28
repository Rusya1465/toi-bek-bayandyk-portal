
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-muted/30">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-kyrgyz-red mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Бет табылган жок</p>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Сиз издеген барак табылган жок. Барак жаңы даректе болушу мүмкүн же өчүрүлгөн болушу мүмкүн.
        </p>
        <Button asChild>
          <Link to="/">Башкы бетке кайтуу</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
