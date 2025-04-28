
import { Link } from "react-router-dom";
import { useTranslation } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="border-t kyrgyz-pattern">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="font-bold text-xl text-kyrgyz-red mb-4 inline-block">
              ToiBek
            </Link>
            <p className="text-muted-foreground">
              {t("footer.slogan")}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">{t("footer.contacts")}</h3>
            <p className="text-muted-foreground">{t("footer.address")}</p>
            <p className="text-muted-foreground">info@toibek.kg</p>
            <p className="text-muted-foreground">+996 123 456 789</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">{t("footer.socialMedia")}</h3>
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
          &copy; {new Date().getFullYear()} ToiBek. {t("footer.allRightsReserved")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
