import { createFileRoute, Link } from "@tanstack/react-router";
import { CONTACT_EMAIL, LEGAL_ENTITY, SITE_URL } from "@/lib/site-config";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Integritetspolicy | Leadmap" },
      {
        name: "description",
        content:
          "Så behandlar Leadmap kontaktuppgifter, samtalsdata, kampanjattribution och rättigheter enligt GDPR.",
      },
      { property: "og:title", content: "Integritetspolicy | Leadmap" },
      { property: "og:url", content: `${SITE_URL}/privacy` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LegalHeader />
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-brand">Juridik</p>
        <h1 className="text-3xl font-medium tracking-[-0.025em] md:text-5xl">Integritetspolicy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Senast uppdaterad: 11 juli 2026</p>

        <div className="mt-12 max-w-none space-y-10 text-[15px] leading-relaxed text-foreground/90">
          <Section title="1. Personuppgiftsansvarig">
            <p>
              {LEGAL_ENTITY.name} är personuppgiftsansvarig för webbplatsens audit-, demo- och
              kontaktförfrågningar.
              {LEGAL_ENTITY.organizationNumber
                ? ` Organisationsnummer: ${LEGAL_ENTITY.organizationNumber}.`
                : ""}
              {LEGAL_ENTITY.address ? ` Adress: ${LEGAL_ENTITY.address}.` : ""}
              {" Kontakt: "}
              <EmailLink />.
            </p>
          </Section>

          <Section title="2. Uppgifter vi behandlar">
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                Företagsnamn, kontaktperson, telefon eller e-post och frivilliga uppgifter i
                formulär.
              </li>
              <li>
                Samtalsljud, transkript, sammanfattningar och bokningsförfrågningar när tjänsten
                används.
              </li>
              <li>
                Tekniska säkerhetsuppgifter, exempelvis tidsstämpel, användaragent och serverloggar.
              </li>
              <li>
                Kampanjparametrar som UTM, gclid, gbraid, wbraid och fbclid när de finns i länken.
              </li>
            </ul>
          </Section>

          <Section title="3. Ändamål och rättslig grund">
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                Audit, demo och offertdialog: åtgärder inför avtal och vårt berättigade intresse av
                att besvara B2B-förfrågningar.
              </li>
              <li>
                Leverans av AI-telefonist: fullgörande av kundavtal och kundens dokumenterade
                instruktioner.
              </li>
              <li>Säkerhet, felsökning och missbruksförebyggande: berättigat intresse.</li>
              <li>
                Google- och annonsmätning: samtycke. Taggar laddas inte innan samtycke har lämnats.
              </li>
              <li>Bokföring och andra lagkrav: rättslig förpliktelse.</li>
            </ul>
          </Section>

          <Section title="4. Mottagare och personuppgiftsbiträden">
            <p>
              Uppgifter kan behandlas av leverantörer för databas och drift, webbhosting, telefoni
              och röst-AI, e-postleverans samt — efter samtycke — Google för mätning. Nuvarande
              tekniska leverantörer omfattar bland annat Supabase, Cloudflare/Lovable och Retell AI.
              Kundspecifik biträdesförteckning lämnas med personuppgiftsbiträdesavtal.
            </p>
          </Section>

          <Section title="5. Lagring och överföringar">
            <p>
              Audit-, demo- och kontaktförfrågningar sparas normalt i högst 24 månader. Den publika
              röstdemon är begränsad till två minuter och konfigureras utan samtalsinspelning;
              tekniska demouppgifter och eventuella transkript raderas inom 24 timmar. Kundsamtal
              följer kundavtalets dokumenterade lagringsinställning. Bokföringsunderlag sparas så
              länge svensk lag kräver. Primär applikationsdata lagras inom EU där tjänsten är
              konfigurerad så. Om ett biträde behandlar data utanför EES används tillämpligt
              adekvansbeslut eller EU:s standardavtalsklausuler.
            </p>
          </Section>

          <Section title="6. Cookies och lokal lagring">
            <p>
              Webbplatsen använder nödvändig lokal lagring för tema, språkval, samtycke och
              sessionsbaserad kampanjattribution. Google-taggar laddas endast efter ett aktivt
              godkännande. Valet kan ändras via “Cookieinställningar” i sidfoten.
            </p>
          </Section>

          <Section title="7. Dina rättigheter">
            <p>
              Du kan begära tillgång, rättelse, radering, begränsning och dataportabilitet samt
              invända mot behandling. Samtycke kan återkallas när som helst. Kontakta <EmailLink />.
              Du har även rätt att lämna klagomål till{" "}
              <a
                href="https://www.imy.se/privatperson/utfora-arenden/lamna-ett-klagomal/"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                Integritetsskyddsmyndigheten (IMY)
              </a>
              .
            </p>
          </Section>

          <Section title="8. Automatisering och AI">
            <p>
              Leadmap använder AI för att svara, transkribera och sammanfatta enligt kundens
              instruktioner. Den publika röstdemon informerar tydligt före första interaktionen att
              besökaren talar med AI. Under piloten fattar systemet inte beslut med rättslig eller
              motsvarande betydande effekt och bekräftar inte bokningar utan mänsklig kontroll.
            </p>
          </Section>

          <Section title="9. Kontakt">
            <p>
              Frågor, registerutdrag och raderingsbegäran skickas till <EmailLink />.
            </p>
          </Section>
        </div>
      </main>
      <LegalFooter counterpart="terms" />
    </div>
  );
}

function LegalHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand" />
          <span className="font-semibold tracking-tight">Leadmap</span>
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Tillbaka
        </Link>
      </div>
    </header>
  );
}

function LegalFooter({ counterpart }: { counterpart: "terms" | "privacy" }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-10 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Leadmap</span>
        <Link
          to={counterpart === "terms" ? "/terms" : "/privacy"}
          className="hover:text-foreground"
        >
          {counterpart === "terms" ? "Villkor" : "Integritetspolicy"}
        </Link>
      </div>
    </footer>
  );
}

function EmailLink() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
      {CONTACT_EMAIL}
    </a>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold tracking-tight">{title}</h2>
      <div className="text-muted-foreground">{children}</div>
    </section>
  );
}
