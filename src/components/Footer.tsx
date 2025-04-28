
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t kyrgyz-pattern">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="font-bold text-xl text-kyrgyz-red mb-4 inline-block">
              ToiBek
            </Link>
            <p className="text-muted-foreground">
              Сиздин майрамыңыз - Биздин майрамыбыз
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Байланыш</h3>
            <p className="text-muted-foreground">Бишкек, Кыргызстан</p>
            <p className="text-muted-foreground">info@toibek.kg</p>
            <p className="text-muted-foreground">+996 123 456 789</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Социалдык тармактар</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                Facebook
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                Instagram
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ToiBek. Бардык укуктар корголгон.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
