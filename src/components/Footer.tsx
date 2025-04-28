
import { Link } from "react-router-dom";
import { useTranslation } from "@/contexts/LanguageContext";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="border-t kyrgyz-pattern mt-auto">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 md:grid-cols-3 gap-x-8">
          <div>
            <Link to="/" className="font-bold text-xl text-kyrgyz-red mb-4 inline-block">
              ToiBek
            </Link>
            <p className="text-muted-foreground text-sm md:text-base">
              {t("footer.slogan")}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3 md:mb-4">{t("footer.contacts")}</h3>
            <div className="space-y-2 text-sm md:text-base">
              <p className="text-muted-foreground">{t("footer.address")}</p>
              <p className="text-muted-foreground">info@toibek.kg</p>
              <p className="text-muted-foreground">+996 123 456 789</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3 md:mb-4">{t("footer.socialMedia")}</h3>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5 mr-1.5" />
                <span className="text-sm md:text-base">Facebook</span>
              </a>
              <a href="#" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5 mr-1.5" />
                <span className="text-sm md:text-base">Instagram</span>
              </a>
              <a href="#" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-5 w-5 mr-1.5" />
                <span className="text-sm md:text-base">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs sm:text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ToiBek. {t("footer.allRightsReserved")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
