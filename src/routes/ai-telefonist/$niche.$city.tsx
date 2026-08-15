import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, MapPin, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogsProvider } from "@/components/site/DialogsProvider";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { getSeoPage, seoNiches, SITE_URL } from "@/lib/marketing-pages";

export const Route = createFileRoute("/ai-telefonist/$niche/$city")({
  head: ({ params }) => {
    const page = getSeoPage(params.niche, params.city);
    const url = page ? `${SITE_URL}${page.path}` : `${SITE_URL}/ai-telefonist`;
    return {
      meta: [
        { title: page?.title ?? "AI-telefonist för serviceföretag | Leadmap" },
        {
          name: "description",
          content:
            page?.description ??
            "Leadmap svarar på missade samtal, kvalificerar leads och skickar tydliga sammanfattningar till ägaren.",
        },
        { name: "robots", content: "noindex,follow" },
        { property: "og:title", content: page?.title ?? "Leadmap AI-telefonist" },
        {
          property: "og:description",
          content: page?.description ?? "AI-telefonist för serviceföretag.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: page?.title ?? "Leadmap AI-telefonist" },
        {
          name: "twitter:description",
          content: page?.description ?? "AI-telefonist för serviceföretag.",
        },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: page
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Service",
                name: page.title.replace(" | Leadmap", ""),
                provider: { "@type": "Organization", name: "Leadmap", url: SITE_URL },
                areaServed: { "@type": "City", name: page.city.name },
                serviceType: page.niche.service,
                offers: {
                  "@type": "Offer",
                  priceCurrency: "SEK",
                  price: "2900",
                  description:
                    "Pilot från 2 900 kr/mån exkl. moms. Efter första månaden gäller 30 dagars uppsägning.",
                },
                description: page.description,
              }),
            },
          ]
        : [],
    };
  },
  component: SeoLandingPage,
});

function SeoLandingPage() {
  const { niche, city } = Route.useParams();
  const page = getSeoPage(niche, city);

  if (!page) {
    return (
      <DialogsProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Nav />
          <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6 pt-24">
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              Sidan saknas
            </p>
            <h1 className="mt-4 text-4xl font-extralight">Den lokala sidan finns inte än.</h1>
            <Link
              to="/missade-samtal-audit"
              className="mt-8 text-sm font-medium underline underline-offset-4"
            >
              Få gratis audit
            </Link>
          </main>
          <Footer />
        </div>
      </DialogsProvider>
    );
  }

  const siblings = seoNiches.filter((item) => item.slug !== page.niche.slug).slice(0, 5);

  return (
    <DialogsProvider>
      <div className="min-h-screen bg-background text-foreground">
        <ScrollProgress />
        <Nav />
        <main>
          <section className="relative overflow-hidden border-b border-border/60 pt-28 md:pt-36">
            <div className="pointer-events-none absolute inset-0 opacity-[0.045]">
              <div className="h-full w-full bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:44px_44px]" />
            </div>
            <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-20 md:grid-cols-[1fr_0.8fr] md:items-end md:pb-28">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {page.city.name} / {page.niche.label}
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-extralight leading-[1.02] tracking-normal md:text-7xl">
                  {page.h1}
                </h1>
                <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-muted-foreground md:text-lg">
                  Leadmap svarar när ni är upptagna, ute på jobb eller har stängt. Kunden får ett
                  snabbt svar, och ni får en kvalificerad förfrågan med namn, nummer, ärende och
                  önskad tid.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    variant="brand"
                    size="lg"
                    className="rounded-none px-8 text-[11px] font-semibold uppercase tracking-[0.2em]"
                  >
                    <a href={page.auditHref}>{page.niche.cta}</a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-none px-8 text-[11px] font-semibold uppercase tracking-[0.2em]"
                  >
                    <Link
                      to="/anvandningsfall/$niche"
                      params={{ niche: toUseCaseSlug(page.niche.slug) }}
                    >
                      Läs användningsfall
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.08 }}
                className="border border-border bg-card/70 p-5 shadow-2xl shadow-foreground/5 backdrop-blur"
              >
                <div className="flex items-center justify-between border-b border-border/70 pb-4">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                    Missat samtal
                  </p>
                  <PhoneCall className="h-4 w-4" />
                </div>
                <p className="mt-5 text-2xl font-light leading-snug">{page.niche.scenario}</p>
                <div className="mt-6 grid gap-3 text-sm text-muted-foreground">
                  {[
                    page.niche.pain,
                    page.niche.benefit,
                    "Pilot från 2 900 kr/mån exkl. moms. Ni bekräftar själva nästa steg.",
                  ].map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-16 md:py-24">
            <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[0.7fr_1fr]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                  Lokalt scenario
                </p>
                <h2 className="mt-4 text-3xl font-extralight md:text-5xl">
                  Kunder i {page.city.name} vill ha svar nu.
                </h2>
              </div>
              <div className="grid gap-px bg-border/70 sm:grid-cols-3">
                {[
                  ["Svar direkt", "AI:n svarar när teamet inte hinner."],
                  ["Rätt frågor", "Ärende, plats, brådska och kontakt samlas."],
                  [
                    "Tydlig överlämning",
                    "Ägaren får en kort sammanfattning för manuell uppföljning.",
                  ],
                ].map(([title, body]) => (
                  <article key={title} className="bg-background p-6">
                    <h3 className="text-xl font-light">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="border-y border-border/60 py-14">
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
                    Fler lokala sidor
                  </p>
                  <h2 className="mt-3 text-2xl font-extralight md:text-4xl">
                    Jämför andra branscher i {page.city.name}.
                  </h2>
                </div>
                <a
                  href={page.auditHref}
                  className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] underline underline-offset-8"
                >
                  Få gratis audit <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {siblings.map((item) => (
                  <Link
                    key={item.slug}
                    to="/ai-telefonist/$niche/$city"
                    params={{ niche: item.slug, city: page.city.slug }}
                    className="border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {item.service} i {page.city.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </DialogsProvider>
  );
}

function toUseCaseSlug(slug: string) {
  if (slug === "rormokare" || slug === "elektriker-jour") return "vvs";
  if (slug === "bilverkstader") return "bilverkstad";
  return slug;
}
