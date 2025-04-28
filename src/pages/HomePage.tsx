
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/LanguageContext";

const HomePage = () => {
  const { t } = useTranslation();
  
  const services = [
    {
      title: t("home.services.venues.title"),
      description: t("home.services.venues.description"),
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      title: t("home.services.artists.title"),
      description: t("home.services.artists.description"),
      image: "https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      title: t("home.services.rentals.title"),
      description: t("home.services.rentals.description"),
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
  ];

  const benefits = [
    {
      title: t("home.benefits.allinone.title"),
      description: t("home.benefits.allinone.description"),
    },
    {
      title: t("home.benefits.timesaving.title"),
      description: t("home.benefits.timesaving.description"),
    },
    {
      title: t("home.benefits.convenient.title"),
      description: t("home.benefits.convenient.description"),
    },
    {
      title: t("home.benefits.trusted.title"),
      description: t("home.benefits.trusted.description"),
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <section className="relative overflow-hidden kyrgyz-pattern">
        <div className="container px-4 py-16 md:py-24 flex flex-col items-center text-center">
          <div className="w-full max-w-xl mx-auto space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
              {t("home.hero.title")} - <span className="text-kyrgyz-red">{t("home.hero.subtitle")}</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              {t("home.hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link to="/catalog">
                  {t("home.hero.catalogButton")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 banner-gradient" />
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter mb-4">
              {t("home.servicesSection.title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("home.servicesSection.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {services.map((service, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-lg border hover:shadow-md transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 p-4 md:p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-white/80">{service.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link to="/catalog">
                {t("home.servicesSection.viewAllButton")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter mb-4">
              {t("home.benefitsSection.title")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("home.benefitsSection.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <Card key={i} className="bg-background border">
                <CardContent className="pt-6">
                  <CardTitle className="text-lg md:text-xl mb-2">{benefit.title}</CardTitle>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 kyrgyz-pattern">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter mb-4">
              {t("home.cta.title")}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t("home.cta.description")}
            </p>
            <Button size="lg" asChild>
              <Link to="/catalog">
                {t("home.cta.button")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
