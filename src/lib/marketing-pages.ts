export const SITE_URL = "https://www.leadmap.se";

export type City = { slug: string; name: string };
export type SeoNiche = {
  slug: string;
  label: string;
  plural: string;
  service: string;
  pain: string;
  benefit: string;
  scenario: string;
  cta: string;
};
export type UseCase = {
  slug: string;
  label: string;
  pain: string;
  scenario: string;
  response: string;
  collects: string[];
  value: string;
  faq: [string, string][];
};

export const cities: City[] = [
  { slug: "goteborg", name: "Göteborg" },
  { slug: "stockholm", name: "Stockholm" },
  { slug: "malmo", name: "Malmö" },
  { slug: "uppsala", name: "Uppsala" },
  { slug: "vasteras", name: "Västerås" },
  { slug: "orebro", name: "Örebro" },
  { slug: "linkoping", name: "Linköping" },
  { slug: "helsingborg", name: "Helsingborg" },
  { slug: "jonkoping", name: "Jönköping" },
  { slug: "lund", name: "Lund" },
];

export const seoNiches: SeoNiche[] = [
  {
    slug: "vvs",
    label: "VVS",
    plural: "VVS-företag",
    service: "AI-telefonist för VVS",
    pain: "Akuta kunder ringer ofta vidare direkt om ingen svarar.",
    benefit: "Leadmap svarar, fångar ärendet och skickar en tydlig förfrågan till ägaren.",
    scenario:
      "En kund har en läcka efter stängning. Leadmap tar namn, nummer, plats, problem och önskad tid för återkoppling.",
    cta: "Få gratis VVS-audit",
  },
  {
    slug: "rormokare",
    label: "Rörmokare",
    plural: "rörmokare",
    service: "AI-telefonist för rörmokare",
    pain: "När du är ute på jobb kan varje missat samtal bli ett tappat akutjobb.",
    benefit: "Leadmap håller kunden kvar tills du kan ringa tillbaka.",
    scenario:
      "En kund behöver jourhjälp. AI:n frågar vad som hänt, var kunden finns och hur brådskande det är.",
    cta: "Se hur Leadmap svarar",
  },
  {
    slug: "taklaggare",
    label: "Takläggare",
    plural: "takföretag",
    service: "AI-telefonist för takläggare",
    pain: "Takskador och offertförfrågningar tappar fart när samtal går till röstbrevlådan.",
    benefit: "Leadmap samlar kundens behov, adress och tidshorisont medan intresset är varmt.",
    scenario:
      "En fastighetsägare ringer om läckage. Leadmap fångar taktyp, plats, brådska och kontaktuppgifter.",
    cta: "Få gratis tak-audit",
  },
  {
    slug: "tandlakare",
    label: "Tandläkare",
    plural: "tandkliniker",
    service: "AI-telefonist för tandläkare",
    pain: "Receptionen kan inte alltid svara när personalen är med patienter.",
    benefit: "Leadmap fångar nya patienter, akuta ärenden och önskade tider.",
    scenario:
      "En ny patient ringer om tandvärk. AI:n tar namn, telefon, ärende och när patienten vill bli uppringd.",
    cta: "Få gratis klinik-audit",
  },
  {
    slug: "kliniker",
    label: "Kliniker",
    plural: "kliniker",
    service: "AI-telefonist för kliniker",
    pain: "Missade bokningsförfrågningar kan skapa tomma tider i kalendern.",
    benefit: "Leadmap ger ett lugnt svar och skickar en strukturerad bokningsförfrågan.",
    scenario:
      "En kund vill boka behandling. AI:n fångar behandling, tid, namn och kontaktuppgifter.",
    cta: "Se demo för klinik",
  },
  {
    slug: "bilverkstader",
    label: "Bilverkstäder",
    plural: "bilverkstäder",
    service: "AI-telefonist för bilverkstäder",
    pain: "Verkstäder missar samtal när teamet står med kunder eller bilar.",
    benefit: "Leadmap samlar registreringsinfo, problem och önskad bokningstid.",
    scenario:
      "En bilägare ringer om service. AI:n tar problem, bilmodell, kontakt och passande tid.",
    cta: "Få gratis verkstads-audit",
  },
  {
    slug: "bargning",
    label: "Bärgning",
    plural: "bärgningsföretag",
    service: "AI-telefonist för bärgning",
    pain: "Vid brådska vinner ofta den aktör som svarar först.",
    benefit: "Leadmap svarar och skickar plats, problem och telefonnummer.",
    scenario: "En förare står stilla vid vägen. AI:n fångar position, fordon, behov och brådska.",
    cta: "Testa samtalsaudit",
  },
  {
    slug: "elektriker-jour",
    label: "Elektrikerjour",
    plural: "elektrikerjourer",
    service: "AI-telefonist för elektrikerjour",
    pain: "Elproblem är ofta akuta och kunder ringer vidare snabbt.",
    benefit: "Leadmap kvalificerar ärendet och skickar ett kort underlag för snabb återkoppling.",
    scenario:
      "En kund saknar el i delar av huset. AI:n frågar plats, symptom, risk och när kunden kan bli uppringd.",
    cta: "Få gratis jour-audit",
  },
];

export const useCases: UseCase[] = [
  {
    slug: "vvs",
    label: "VVS",
    pain: "VVS-kunder ringer ofta när problemet redan är akut.",
    scenario:
      "En kund får läckage när företaget är ute på jobb. Samtalet besvaras direkt i stället för att gå till röstbrevlådan.",
    response:
      "Leadmap förklarar att teamet är upptaget, tar ärendet lugnt och samlar detaljer för snabb återkoppling.",
    collects: ["Namn", "Telefonnummer", "Adress", "Problem", "Brådska", "Önskad tid"],
    value: "Använd era egna siffror för att bedöma värdet av missade samtal.",
    faq: [
      [
        "Fungerar det efter stängning?",
        "Ja, Leadmap kan svara på missade samtal och samtal efter stängning.",
      ],
      [
        "Bekräftar AI:n bokningen?",
        "Nej. I piloten skickas en kvalificerad förfrågan som ägaren bekräftar manuellt.",
      ],
    ],
  },
  {
    slug: "taklaggare",
    label: "Takläggare",
    pain: "Takförfrågningar behöver snabb kontakt innan kunden ringer nästa aktör.",
    scenario: "En villaägare ringer om läckage och vill veta om någon kan titta på taket.",
    response: "Leadmap fångar takproblem, plats, tidslinje och kontaktuppgifter.",
    collects: ["Namn", "Telefon", "Fastighetstyp", "Problem", "Stad", "Önskad tid"],
    value: "Bedöm värdet med er egen offertstorlek och konverteringsgrad.",
    faq: [
      [
        "Kan den hantera offertförfrågningar?",
        "Ja, den samlar underlag och skickar det för manuell uppföljning.",
      ],
    ],
  },
  {
    slug: "tandlakare",
    label: "Tandläkare",
    pain: "Nya patienter och akuta tider kan missas när receptionen inte hinner svara.",
    scenario: "En patient ringer under behandlingstid och vill boka en tid för akut tandvärk.",
    response:
      "Leadmap svarar professionellt, tar patientens behov och skickar vidare till kliniken.",
    collects: ["Namn", "Telefon", "Ärende", "Ny eller befintlig patient", "Brådska", "Önskad tid"],
    value: "Använd klinikens egna siffror för att bedöma värdet av fångade förfrågningar.",
    faq: [
      [
        "Är det medicinsk rådgivning?",
        "Nej. Leadmap samlar kontakt- och bokningsinformation för klinikens uppföljning.",
      ],
    ],
  },
  {
    slug: "kliniker",
    label: "Kliniker",
    pain: "Kliniker kan missa bokningsförfrågningar när personalen är med kunder eller patienter.",
    scenario: "En kund vill boka behandling men receptionen är upptagen.",
    response:
      "Leadmap tar behandling, kontaktuppgifter och önskad tid utan att lova en slutlig bokning.",
    collects: ["Namn", "E-post", "Telefon", "Behandling", "Stad", "Önskad tid"],
    value: "Fångade förfrågningar kan minska risken för tomma luckor.",
    faq: [
      [
        "Kan den kopplas till kalender?",
        "Först samlar den förfrågningar. Kalenderkoppling kan läggas till enligt separat scope.",
      ],
    ],
  },
  {
    slug: "bilverkstad",
    label: "Bilverkstad",
    pain: "Verkstäder kan missa service- och reparationsförfrågningar när telefonen inte hinns med.",
    scenario: "En bilägare ringer om service och vill veta nästa lediga tid.",
    response: "Leadmap samlar bilmodell, problem, kontaktuppgifter och önskad tid.",
    collects: ["Namn", "Telefon", "Bilmodell", "Problem", "Önskad tid", "Stad"],
    value: "Bedöm värdet med verkstadens egna ordervärden.",
    faq: [
      [
        "Kan den fråga om registreringsnummer?",
        "Ja, flödet kan anpassas efter hur verkstaden vill ta emot ärenden.",
      ],
    ],
  },
  {
    slug: "bargning",
    label: "Bärgning",
    pain: "Bärgningskunder behöver snabb respons och tydliga nästa steg.",
    scenario: "En förare ringer från vägkanten och behöver hjälp snabbt.",
    response: "Leadmap tar plats, fordon, situation och kontakt så teamet kan prioritera.",
    collects: ["Namn", "Telefon", "Plats", "Fordon", "Situation", "Brådska"],
    value: "Snabbt svar kan hjälpa teamet att prioritera inkommande ärenden.",
    faq: [
      [
        "Ringer AI:n ut till föraren?",
        "Nej, den tar emot samtalet och skickar en tydlig sammanfattning till ägaren.",
      ],
    ],
  },
];

export function getSeoPage(nicheSlug: string, citySlug: string) {
  const niche = seoNiches.find((item) => item.slug === nicheSlug);
  const city = cities.find((item) => item.slug === citySlug);
  if (!niche || !city) return null;
  const campaign = `${niche.slug}_${city.slug}`;
  return {
    niche,
    city,
    path: `/ai-telefonist/${niche.slug}/${city.slug}`,
    title: `${niche.service} i ${city.name} | Leadmap`,
    description: `${niche.label} i ${city.name}: AI-telefonist som svarar på missade samtal och skickar tydliga sammanfattningar. Från 2 900 kr/mån exkl. moms.`,
    h1: `${niche.service} i ${city.name}`,
    auditHref: utm("/missade-samtal-audit", {
      utm_source: "seo",
      utm_medium: "landing_page",
      utm_campaign: campaign,
      source_page: `/ai-telefonist/${niche.slug}/${city.slug}`,
      city_page: city.slug,
      niche_page: niche.slug,
    }),
  };
}

export function getUseCase(slug: string) {
  return useCases.find((item) => item.slug === slug) || null;
}

export function utm(path: string, params: Record<string, string>) {
  return `${path}?${new URLSearchParams(params).toString()}`;
}

export const seoPaths = seoNiches.flatMap((niche) =>
  cities.map((city) => `/ai-telefonist/${niche.slug}/${city.slug}`),
);
export const useCasePaths = useCases.map((useCase) => `/anvandningsfall/${useCase.slug}`);
