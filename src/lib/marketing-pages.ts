export const SITE_URL = "https://www.leadmap.se";

export type City = {
  slug: string;
  name: string;
};

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
    benefit: "Leadmap svarar, fangar arendet och skickar en tydlig forfragan till agaren.",
    scenario:
      "En kund har en lacka efter stangning. Leadmap tar namn, nummer, plats, problem och onskad tid for aterkoppling.",
    cta: "Få gratis VVS-audit",
  },
  {
    slug: "rormokare",
    label: "Rörmokare",
    plural: "rörmokare",
    service: "AI-telefonist för rörmokare",
    pain: "Nar du ar ute pa jobb kan varje missat samtal bli ett tappat akutjobb.",
    benefit: "Leadmap haller kunden kvar tills du kan ringa tillbaka.",
    scenario:
      "En kund behover jourhjalp. AI:n fragar vad som hant, var kunden finns och hur bradskande det ar.",
    cta: "Se hur Leadmap svarar",
  },
  {
    slug: "taklaggare",
    label: "Takläggare",
    plural: "takföretag",
    service: "AI-telefonist för takläggare",
    pain: "Takskador och offertforfragningar tappar fart nar samtal gar till voicemail.",
    benefit: "Leadmap samlar kundens behov, adress och tidshorisont medan intresset ar varmt.",
    scenario:
      "En fastighetsagare ringer om lackage. Leadmap fangar taktyp, plats, bradska och kontaktuppgifter.",
    cta: "Få gratis tak-audit",
  },
  {
    slug: "tandlakare",
    label: "Tandläkare",
    plural: "tandkliniker",
    service: "AI-telefonist för tandläkare",
    pain: "Receptionen kan inte alltid svara nar personalen ar med patienter.",
    benefit: "Leadmap fangar nya patienter, akuta arenden och onskade tider.",
    scenario:
      "En ny patient ringer om tandvark. AI:n tar namn, telefon, arende och nar patienten vill bli uppringd.",
    cta: "Få gratis klinik-audit",
  },
  {
    slug: "kliniker",
    label: "Kliniker",
    plural: "kliniker",
    service: "AI-telefonist för kliniker",
    pain: "Missade bokningsforfragningar kan skapa tomma tider i kalendern.",
    benefit: "Leadmap ger ett lugnt svar och skickar en strukturerad bokningsforfragan.",
    scenario:
      "En kund vill boka behandling. AI:n fangar behandling, tid, namn och kontaktuppgifter.",
    cta: "Se demo for klinik",
  },
  {
    slug: "bilverkstader",
    label: "Bilverkstäder",
    plural: "bilverkstäder",
    service: "AI-telefonist för bilverkstäder",
    pain: "Verkstader missar samtal nar teamet star med kunder eller bilar.",
    benefit: "Leadmap samlar registreringsinfo, problem och onskad bokningstid.",
    scenario:
      "En bilagare ringer om service. AI:n tar problem, bilmodell, kontakt och passande tid.",
    cta: "Få gratis verkstads-audit",
  },
  {
    slug: "bargning",
    label: "Bärgning",
    plural: "bärgningsföretag",
    service: "AI-telefonist för bärgning",
    pain: "Vid bradska vinner ofta den aktor som svarar forst.",
    benefit: "Leadmap plockar upp snabbt och skickar plats, problem och telefonnummer.",
    scenario: "En forare star stilla vid vagen. AI:n fangar position, fordon, behov och bradska.",
    cta: "Testa missade-samtal audit",
  },
  {
    slug: "elektriker-jour",
    label: "Elektriker jour",
    plural: "elektrikerjourer",
    service: "AI-telefonist för elektriker jour",
    pain: "Elproblem ar ofta akuta och kunder ringer vidare snabbt.",
    benefit: "Leadmap kvalificerar arendet och skickar ett kort underlag for snabb aterkoppling.",
    scenario:
      "En kund saknar el i delar av huset. AI:n fragar plats, symptom, risk och nar kunden kan bli uppringd.",
    cta: "Få gratis jour-audit",
  },
];

export const useCases: UseCase[] = [
  {
    slug: "vvs",
    label: "VVS",
    pain: "VVS-kunder ringer ofta nar problemet redan ar akut.",
    scenario:
      "En kund far lackage nar foretaget ar ute pa jobb. Samtalet besvaras direkt i stallet for att ga till voicemail.",
    response:
      "Leadmap forklarar att teamet ar upptaget, tar arendet lugnt och samlar detaljer for snabb aterkoppling.",
    collects: ["Namn", "Telefonnummer", "Adress", "Problem", "Bradska", "Onskad tid"],
    value: "Ett akutjobb kan ofta betala en stor del av manadskostnaden.",
    faq: [
      [
        "Fungerar det efter stangning?",
        "Ja, Leadmap kan svara pa missade samtal och efter-stangning samtal.",
      ],
      [
        "Bekraftar AI:n bokningen?",
        "I piloten skickas en kvalificerad forfragan sa agaren kan bekrafta manuellt.",
      ],
    ],
  },
  {
    slug: "taklaggare",
    label: "Taklaggare",
    pain: "Takforfragningar behover snabb kontakt innan kunden ringer nasta aktor.",
    scenario: "En villaagare ringer om lackage och vill veta om nagon kan titta pa taket.",
    response: "Leadmap fangar takproblem, plats, tidslinje och kontaktuppgifter.",
    collects: ["Namn", "Telefon", "Fastighetstyp", "Problem", "Stad", "Onskad tid"],
    value: "En missad offertforfragan kan vara vard langt mer an en hel pilotmanad.",
    faq: [
      [
        "Kan den hantera offertforfragningar?",
        "Ja, den samlar underlag och skickar det till dig for manuell uppfoljning.",
      ],
    ],
  },
  {
    slug: "tandlakare",
    label: "Tandlakare",
    pain: "Nya patienter och akuta tider forsvinner nar receptionen inte hinner svara.",
    scenario: "En patient ringer under behandlingstid och vill boka akut tandvarkstid.",
    response:
      "Leadmap svarar professionellt, tar patientens behov och skickar vidare till kliniken.",
    collects: ["Namn", "Telefon", "Arende", "Ny eller befintlig patient", "Bradska", "Onskad tid"],
    value: "Att fylla en tom tid kan snabbt gora systemet lonsamt.",
    faq: [
      [
        "Ar det en medicinsk radgivare?",
        "Nej, Leadmap samlar kontakt- och bokningsinformation for klinikens uppfoljning.",
      ],
    ],
  },
  {
    slug: "kliniker",
    label: "Kliniker",
    pain: "Kliniker tappar bokningar nar personalen ar med kunder eller patienter.",
    scenario: "En kund vill boka behandling men receptionen ar upptagen.",
    response:
      "Leadmap tar behandling, kontaktuppgifter och onskad tid utan att lova en slutlig bokning.",
    collects: ["Namn", "E-post", "Telefon", "Behandling", "Stad", "Onskad tid"],
    value: "Fler fangade forfragningar betyder farre tomma luckor.",
    faq: [
      [
        "Kan den kopplas till kalender?",
        "Forst samlar den forfragningar. Kalenderkoppling kan laggas till senare.",
      ],
    ],
  },
  {
    slug: "bilverkstad",
    label: "Bilverkstad",
    pain: "Verkstader missar service- och reparationsforfragningar nar telefonen inte hinns med.",
    scenario: "En bilagare ringer om service och vill veta nasta lediga tid.",
    response: "Leadmap samlar bilmodell, problem, kontaktuppgifter och onskad tid.",
    collects: ["Namn", "Telefon", "Bilmodell", "Problem", "Onskad tid", "Stad"],
    value: "En extra servicebokning kan racka langt.",
    faq: [
      [
        "Kan den fraga om registreringsnummer?",
        "Ja, flodet kan anpassas efter hur verkstaden vill ta emot arenden.",
      ],
    ],
  },
  {
    slug: "bargning",
    label: "Bargning",
    pain: "Bargningskunder behover snabb respons och tydliga nasta steg.",
    scenario: "En forare ringer fran vagkanten och behover hjalp snabbt.",
    response: "Leadmap tar plats, fordon, situation och kontakt sa teamet kan prioritera.",
    collects: ["Namn", "Telefon", "Plats", "Fordon", "Situation", "Bradska"],
    value: "Snabbt svar kan vara skillnaden mellan vunnet och tappat arende.",
    faq: [
      [
        "Ringer AI:n ut till foraren?",
        "Nej, den tar emot samtalet och skickar en tydlig sammanfattning till agaren.",
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
    description: `${niche.label} i ${city.name}: få AI-telefonist som svarar på missade samtal, kvalificerar leads och skickar sammanfattningar. Från 2 900 kr/mån.`,
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
  return useCases.find((item) => item.slug === slug) ?? null;
}

export function utm(path: string, params: Record<string, string>) {
  const search = new URLSearchParams(params);
  return `${path}?${search.toString()}`;
}

export const seoPaths = seoNiches.flatMap((niche) =>
  cities.map((city) => `/ai-telefonist/${niche.slug}/${city.slug}`),
);

export const useCasePaths = useCases.map((useCase) => `/anvandningsfall/${useCase.slug}`);
