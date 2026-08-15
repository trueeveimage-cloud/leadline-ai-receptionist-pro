import { createFileRoute, Link } from "@tanstack/react-router";
import { CONTACT_EMAIL, LEGAL_ENTITY, SITE_URL } from "@/lib/site-config";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Allmänna villkor | Leadmap" },
      {
        name: "description",
        content:
          "Villkor för Leadmaps AI-telefonist, pilot, priser, manuell bokningsbekräftelse och uppsägning.",
      },
      { property: "og:title", content: "Allmänna villkor | Leadmap" },
      { property: "og:url", content: `${SITE_URL}/terms` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/terms` }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
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

      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="mb-4 text-[11px] uppercase tracking-[0.22em] text-brand">Juridik</p>
        <h1 className="text-3xl font-medium tracking-[-0.025em] md:text-5xl">Allmänna villkor</h1>
        <p className="mt-3 text-sm text-muted-foreground">Senast uppdaterade: 13 juli 2026</p>

        <div className="mt-12 max-w-none space-y-10 text-[15px] leading-relaxed text-foreground/90">
          <Section title="1. Avtalspart">
            Leadmap tillhandahålls av {LEGAL_ENTITY.name}
            {LEGAL_ENTITY.organizationNumber ? `, org.nr ${LEGAL_ENTITY.organizationNumber}` : ""}
            {LEGAL_ENTITY.address ? `, ${LEGAL_ENTITY.address}` : ""}. Dessa villkor gäller om inget
            annat uttryckligen avtalats skriftligt.
          </Section>

          <Section title="2. Tjänsten">
            Leadmap är en AI-telefonist som kan svara, ställa godkända frågor och skicka
            sammanfattningar och återkopplingsförfrågningar. Under piloten bekräftar kunden själv
            bokning, tid, pris, prioritet och utförande. Funktioner som kalenderbokning eller direkt
            vidarekoppling ingår endast när de står i det skriftliga kundavtalet.
          </Section>

          <Section title="3. Pilot och godkännande">
            Piloten är sju dagar och startar först när kunden har godkänt röst, manus,
            verksamhetsuppgifter, fallback-regler och vidarekoppling. Kunden behåller sitt
            befintliga nummer och bestämmer vilka samtal Leadmap får hantera. Ingen kundtrafik
            kopplas på före kundens skriftliga godkännande. Om testflödet inte uppfyller den
            skriftligt överenskomna startchecklistan hålls det pausat tills avvikelsen är åtgärdad
            eller parterna skriftligen avtalar annat.
          </Section>

          <Section title="4. Priser och betalning">
            Pilot kostar 2 900 kr per månad plus 2 000 kr i startavgift och omfattar 500 minuter.
            Premium kostar 4 900 kr per månad, startavgift ingår och 1 500 minuter ingår. Övervolym
            kostar 2,50 kr per minut. Alla priser anges exklusive moms. Betalning sker månadsvis i
            förskott om inget annat avtalas.
          </Section>

          <Section title="5. Avtalstid och uppsägning">
            Den första avtalsperioden är en månad. Därefter gäller 30 dagars uppsägning utan längre
            bindningstid. Uppsägning skickas skriftligt till <EmailLink />. Redan påbörjad
            betalningsperiod återbetalas inte om inget annat följer av tvingande lag eller
            skriftligt avtal.
          </Section>

          <Section title="6. Kundens ansvar">
            Kunden ansvarar för att verksamhetsuppgifter, priser, öppettider, riskinstruktioner och
            kontaktvägar är riktiga. Kunden ansvarar även för nödvändig information till uppringare
            om AI, inspelning och behandling av personuppgifter samt för att inte använda tjänsten
            för olagliga, vilseledande eller skadliga ändamål.
          </Section>

          <Section title="7. Personuppgifter">
            Behandling för kundens räkning regleras i personuppgiftsbiträdesavtal. Kunden är normalt
            personuppgiftsansvarig för sina uppringares uppgifter och Leadmap agerar biträde enligt
            dokumenterade instruktioner. Webbplatsens egna demo- och auditförfrågningar regleras av
            vår{" "}
            <Link to="/privacy" className="underline underline-offset-4">
              integritetspolicy
            </Link>
            .
          </Section>

          <Section title="8. Tillgänglighet och tredjepart">
            Tjänsten är beroende av telefoni-, hosting-, AI- och e-postleverantörer. Leadmap
            eftersträvar hög tillgänglighet men lämnar ingen särskild drifttidsgaranti utan ett
            separat serviceavtal. Planerat underhåll kommuniceras när det är praktiskt möjligt.
          </Section>

          <Section title="9. Resultat och ansvar">
            Leadmap garanterar inte ett visst antal samtal, bokningar, intäkter eller sparad tid.
            Kunden ansvarar för sin egen återkoppling och leverans till slutkund. I den utsträckning
            lagen tillåter begränsas Leadmaps sammanlagda ansvar till avgifter som kunden betalat
            under de tre månader som föregick skadan. Indirekt skada och utebliven vinst ersätts
            inte.
          </Section>

          <Section title="10. Ändringar och kontakt">
            Väsentliga ändringar meddelas innan de börjar gälla för en pågående kundperiod. Frågor
            skickas till <EmailLink />.
          </Section>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-10 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Leadmap</span>
          <Link to="/privacy" className="hover:text-foreground">
            Integritetspolicy
          </Link>
        </div>
      </footer>
    </div>
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
      <p className="text-muted-foreground">{children}</p>
    </section>
  );
}
