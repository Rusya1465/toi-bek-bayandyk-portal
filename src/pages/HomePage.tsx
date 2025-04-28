
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const HomePage = () => {
  const services = [
    {
      title: "Жайлар",
      description: "Ресторандар, банкеттик залдар",
      image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      title: "Артисттер",
      description: "Ырчылар, алып баруучулар, музыкалык группалар",
      image: "https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      title: "Ижара",
      description: "Майрам үчүн жабдуулар",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
  ];

  const benefits = [
    {
      title: "Бардык керектүү нерселер бир жерде",
      description: "Майрамды уюштуруу үчүн керектүү бардык нерселерди биздин платформадан табасыз.",
    },
    {
      title: "Убакытты үнөмдөө",
      description: "Майрам уюштуруу үчүн сапарларга убакыт коротпоңуз, баары онлайн.",
    },
    {
      title: "Ыңгайлуу тандоо",
      description: "Көптөгөн варианттарды салыштырып, өзүңүзгө эң ыңгайлуусун тандаңыз.",
    },
    {
      title: "Ишенимдүү өнөктөштөр",
      description: "Биз менен кызматташкан өнөктөштөр - өз ишинин адистери.",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <section className="relative overflow-hidden kyrgyz-pattern">
        <div className="container px-4 py-16 md:py-24 flex flex-col items-center text-center">
          <div className="w-full max-w-xl mx-auto space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
              Сиздин майрамыңыз - <span className="text-kyrgyz-red">Биздин майрамыбыз</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Кыргыз маданиятын сактоо менен заманбап майрамдарды уюштурабыз
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link to="/catalog">
                  Каталогго өтүү
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
              Биздин кызматтар
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Биз сиздин майрамыңыз үчүн керектүү бардык нерселерди сунуштайбыз
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
                Бардык кызматтарды көрүү
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
              Эмне үчүн биз?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              ToiBek менен майрамды уюштуруу жеңил жана ыңгайлуу
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
              Майрамыңызды бирге уюштуралы!
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Биринчи кадамды жасаңыз - ToiBek сизге майрамды уюштурууга жардам берет.
            </p>
            <Button size="lg" asChild>
              <Link to="/catalog">
                Каталогго өтүү
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
