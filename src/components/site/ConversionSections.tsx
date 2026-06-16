import { useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  MailCheck,
  PhoneOff,
  PhoneOutgoing,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDialogs } from "./DialogsProvider";
import { useI18n, type Lang } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

const proofCopy = {
  sv: {
    eyebrow: "Sample call, inte fejkad kund",
    title: "Så här låter ett missat samtal med Leadmap",
    body: "Välj bransch och se vilka frågor Leadmap ställer, vilka uppgifter som fångas och hur sammanfattningen landar hos ägaren.",
    transcript: "Samtal",
    questions: "AI-frågor",
    summary: "Lead till ägaren",
    cta: "Vill du se detta för ditt företag?",
    button: "Få gratis audit",
    status: "Skickad till ägaren",
  },
  en: {
    eyebrow: "Sample call, not a fake customer",
    title: "How a missed call sounds with Leadmap",
    body: "Choose a niche and see the questions Leadmap asks, the details it captures and the summary the owner receives.",
    transcript: "Call",
    questions: "AI questions",
    summary: "Lead to owner",
    cta: "Want to see this for your business?",
    button: "Get free audit",
    status: "Sent to owner",
  },
  es: {
    eyebrow: "Llamada de ejemplo, no cliente falso",
    title: "Así suena una llamada perdida con Leadmap",
    body: "Elige un sector y mira qué pregunta Leadmap, qué datos captura y qué resumen recibe el dueño.",
    transcript: "Llamada",
    questions: "Preguntas de IA",
    summary: "Lead al dueño",
    cta: "¿Quieres verlo para tu empresa?",
    button: "Recibir auditoría gratis",
    status: "Enviado al dueño",
  },
} satisfies Record<Lang, Record<string, string>>;

const demos = [
  {
    key: "vvs",
    label: "VVS",
    problem: "Akut vattenläcka under diskbänk",
    time: "Så snart som möjligt",
    transcript: [
      ["AI", "Hej, du har kommit till rörmokaren. Vad behöver du hjälp med?"],
      ["Kund", "Det läcker vatten under diskbänken och jag behöver hjälp akut."],
      [
        "AI",
        "Jag förstår. Kan jag ta ditt namn, telefonnummer och adress så skickar jag detta direkt?",
      ],
    ],
    questions: [
      "Vad gäller ärendet?",
      "Hur bråttom är det?",
      "Vilken adress gäller det?",
      "När kan ni bli uppringda?",
    ],
  },
  {
    key: "dental",
    label: "Tandläkare",
    problem: "Tandvärk och önskar tid denna vecka",
    time: "Efter 14:00",
    transcript: [
      ["AI", "Hej, du har kommit till kliniken. Gäller det en ny tid eller ett akut besvär?"],
      ["Kund", "Jag har tandvärk och vill gärna få en tid snabbt."],
      ["AI", "Tack. Jag tar dina uppgifter och skickar en tydlig förfrågan till kliniken."],
    ],
    questions: [
      "Är det akut eller bokning?",
      "När passar en tid?",
      "Har du varit hos kliniken tidigare?",
      "Vilket nummer når vi dig på?",
    ],
  },
  {
    key: "auto",
    label: "Bilverkstad",
    problem: "Bilen startar inte efter jobbet",
    time: "Idag efter 16:30",
    transcript: [
      ["AI", "Hej, vad gäller bilen?"],
      ["Kund", "Den startar inte och jag behöver veta om ni kan ta in den."],
      ["AI", "Jag fångar registreringsnummer, problem och önskad tid och skickar till verkstaden."],
    ],
    questions: [
      "Vad är problemet?",
      "Vilken bilmodell?",
      "När kan bilen lämnas?",
      "Behövs bärgning?",
    ],
  },
  {
    key: "electric",
    label: "Elektriker jour",
    problem: "Ström borta i delar av lokalen",
    time: "Jour så fort det går",
    transcript: [
      ["AI", "Hej, berätta kort vad som har hänt."],
      ["Kund", "Vi har tappat ström i halva lokalen och behöver jour."],
      ["AI", "Jag skickar detta som brådskande med namn, nummer och adress."],
    ],
    questions: [
      "Vad har hänt?",
      "Är det pågående risk?",
      "Vilken adress?",
      "Vem ska elektrikern ringa?",
    ],
  },
] as const;

export function SampleCallProof() {
  const { lang } = useI18n();
  const { openBooking } = useDialogs();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<(typeof demos)[number]["key"]>("vvs");
  const c = proofCopy[lang];
  const demo = useMemo(() => demos.find((item) => item.key === active) ?? demos[0], [active]);

  return (
    <section
      id="demo"
      className="relative overflow-hidden border-b border-border/60 py-16 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]" aria-hidden>
        <div className="h-full w-full bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease }}
          className="grid gap-6 md:grid-cols-[0.86fr_1.14fr] md:items-end"
        >
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-muted-foreground">
              {c.eyebrow}
            </p>
            <h2 className="mt-5 max-w-2xl text-4xl font-extralight tracking-normal md:text-6xl">
              {c.title}
            </h2>
          </div>
          <p className="max-w-xl text-sm font-light leading-relaxed text-muted-foreground md:text-base">
            {c.body}
          </p>
        </motion.div>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {demos.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActive(item.key)}
              className={`shrink-0 border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                active === item.key
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr_1fr]">
          <ProofPanel title={c.transcript} icon={PhoneOutgoing} delay={0}>
            <div className="space-y-3">
              {demo.transcript.map(([who, text], index) => (
                <motion.div
                  key={`${who}-${text}`}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease, delay: index * 0.06 }}
                  className={`max-w-[92%] border p-3 text-sm leading-relaxed ${
                    who === "AI"
                      ? "border-border bg-card text-foreground"
                      : "ml-auto border-foreground bg-foreground text-background"
                  }`}
                >
                  <span className="mb-1 block text-[9px] uppercase tracking-[0.2em] opacity-55">
                    {who}
                  </span>
                  {text}
                </motion.div>
              ))}
            </div>
          </ProofPanel>

          <ProofPanel title={c.questions} icon={Sparkles} delay={0.06}>
            <ol className="space-y-3">
              {demo.questions.map((question, index) => (
                <li key={question} className="grid grid-cols-[2rem_1fr] gap-3 text-sm">
                  <span className="grid h-8 w-8 place-items-center border border-border bg-background text-[10px] tabular-nums">
                    0{index + 1}
                  </span>
                  <span className="pt-1.5 text-muted-foreground">{question}</span>
                </li>
              ))}
            </ol>
          </ProofPanel>

          <ProofPanel title={c.summary} icon={MailCheck} delay={0.12}>
            <div className="border border-border bg-background p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {c.status}
              </p>
              <dl className="mt-5 space-y-4 text-sm">
                <SummaryRow label="Namn" value="Johan Andersson" />
                <SummaryRow label="Telefon" value="07X XXX XX XX" />
                <SummaryRow label="Ärende" value={demo.problem} />
                <SummaryRow label="Önskad tid" value={demo.time} />
                <SummaryRow label="Status" value={c.status} />
              </dl>
            </div>
          </ProofPanel>
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-lg text-2xl font-extralight tracking-normal md:text-3xl">{c.cta}</p>
          <Button
            asChild
            variant="brand"
            size="lg"
            className="rounded-none text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            <a href="/missade-samtal-audit?utm_source=homepage&utm_medium=proof&utm_campaign=free_audit">
              {c.button}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

const economicsCopy = {
  sv: {
    eyebrow: "Varför det spelar roll",
    title: "Ett missat samtal kan vara ett förlorat jobb.",
    before: "Utan Leadmap",
    after: "Med Leadmap",
    beforeItems: [
      "Ni är ute på jobb",
      "Kunden ringer",
      "Ingen svarar",
      "Kunden går till nästa företag",
    ],
    afterItems: [
      "Samtalet besvaras",
      "Kundinfo samlas",
      "Ni får tydligt lead",
      "Ni bekräftar själva",
    ],
    roiTitle: "Där ett samtal kan betala månaden",
    roi: [
      ["VVS", "1 akutjobb kan betala pilotmånaden"],
      ["Tandläkare", "1-2 fyllda tider kan täcka kostnaden"],
      ["Bilverkstad", "1 extra bokning kan räcka"],
      ["Bärgning / jour", "Snabba samtal är högintenta"],
    ],
  },
  en: {
    eyebrow: "Why it matters",
    title: "One missed call can be one lost job.",
    before: "Before Leadmap",
    after: "With Leadmap",
    beforeItems: [
      "You are on a job",
      "The customer calls",
      "Nobody answers",
      "They call the next company",
    ],
    afterItems: [
      "The call is answered",
      "Customer info is captured",
      "You get a clear lead",
      "You confirm the customer",
    ],
    roiTitle: "Where one call can pay the month",
    roi: [
      ["Plumbing", "1 urgent job can pay the pilot month"],
      ["Dental", "1-2 filled slots can cover the cost"],
      ["Auto", "1 extra booking can be enough"],
      ["Towing / emergency", "Fast calls carry high intent"],
    ],
  },
  es: {
    eyebrow: "Por qué importa",
    title: "Una llamada perdida puede ser un trabajo perdido.",
    before: "Sin Leadmap",
    after: "Con Leadmap",
    beforeItems: ["Estás trabajando", "El cliente llama", "Nadie contesta", "Llama a otra empresa"],
    afterItems: [
      "La llamada se responde",
      "Se capturan los datos",
      "Recibes un lead claro",
      "Tú confirmas al cliente",
    ],
    roiTitle: "Donde una llamada puede pagar el mes",
    roi: [
      ["Fontanería", "1 urgencia puede pagar el piloto"],
      ["Dental", "1-2 citas llenas pueden cubrir el coste"],
      ["Taller", "1 reserva extra puede bastar"],
      ["Emergencias", "Las llamadas rápidas tienen alta intención"],
    ],
  },
} satisfies Record<
  Lang,
  Record<string, string | string[] | readonly (readonly [string, string])[]>
>;

export function MissedCallEconomics() {
  const { lang } = useI18n();
  const reduce = useReducedMotion();
  const c = economicsCopy[lang];
  const items = [
    { title: c.before as string, icon: PhoneOff, rows: c.beforeItems as string[], muted: true },
    { title: c.after as string, icon: CheckCircle2, rows: c.afterItems as string[], muted: false },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-surface/25 py-16 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease }}
            className="lg:sticky lg:top-28"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-muted-foreground">
              {c.eyebrow as string}
            </p>
            <h2 className="mt-5 max-w-2xl text-4xl font-extralight tracking-normal md:text-6xl">
              {c.title as string}
            </h2>
          </motion.div>

          <div className="space-y-4">
            {items.map((group, index) => {
              const Icon = group.icon;
              return (
                <motion.article
                  key={group.title}
                  initial={reduce ? false : { opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.65, ease, delay: index * 0.08 }}
                  className={`border p-5 md:p-6 ${
                    group.muted
                      ? "border-border bg-background"
                      : "border-foreground bg-foreground text-background"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-10 w-10 place-items-center border ${group.muted ? "border-border bg-card" : "border-background/20 bg-background/10"}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-2xl font-light tracking-normal">{group.title}</h3>
                  </div>
                  <ol className="mt-5 grid gap-px overflow-hidden border border-current/10 bg-current/10 sm:grid-cols-2">
                    {group.rows.map((row, rowIndex) => (
                      <li
                        key={row}
                        className={`p-4 text-sm ${group.muted ? "bg-card" : "bg-foreground text-background"}`}
                      >
                        <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] opacity-55">
                          0{rowIndex + 1}
                        </span>
                        {row}
                      </li>
                    ))}
                  </ol>
                </motion.article>
              );
            })}

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease, delay: 0.12 }}
              className="border border-border bg-background p-5 md:p-6"
            >
              <div className="flex items-center gap-3">
                <CalendarClock className="h-4 w-4" />
                <h3 className="text-xl font-light tracking-normal">{c.roiTitle as string}</h3>
              </div>
              <div className="mt-5 grid gap-px bg-border/70 sm:grid-cols-2">
                {(c.roi as readonly (readonly [string, string])[]).map(([label, value]) => (
                  <div key={label} className="bg-card p-4">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {label}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FounderTrust() {
  const { lang } = useI18n();
  const text = {
    sv: {
      eyebrow: "Byggt nära kunderna",
      title:
        "Byggt av Maged i Göteborg för svenska serviceföretag som tappar kunder på missade samtal.",
      items: [
        "Göteborg, Sverige",
        "Svensk setup",
        "Personlig onboarding",
        "Första kunder får setup inkluderad",
      ],
    },
    en: {
      eyebrow: "Built close to the customer",
      title:
        "Built by Maged in Gothenburg for Swedish service businesses losing customers to missed calls.",
      items: [
        "Gothenburg, Sweden",
        "Swedish setup",
        "Personal onboarding",
        "First customers get setup included",
      ],
    },
    es: {
      eyebrow: "Construido cerca del cliente",
      title:
        "Creado por Maged en Gotemburgo para empresas suecas que pierden clientes por llamadas no contestadas.",
      items: [
        "Gotemburgo, Suecia",
        "Setup sueco",
        "Onboarding personal",
        "Setup incluido para primeros clientes",
      ],
    },
  }[lang];

  return (
    <section className="border-b border-border/60 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[0.85fr_1.15fr] md:items-center">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-muted-foreground">
            {text.eyebrow}
          </p>
          <h2 className="mt-5 max-w-3xl text-3xl font-extralight tracking-normal md:text-5xl">
            {text.title}
          </h2>
        </div>
        <div className="grid gap-px bg-border/70 sm:grid-cols-2">
          {text.items.map((item) => (
            <div key={item} className="flex items-center gap-3 bg-card p-5">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofPanel({
  title,
  icon: Icon,
  delay,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.65, ease, delay }}
      className="border border-border bg-card p-4 md:p-5"
    >
      <div className="mb-5 flex items-center gap-3 border-b border-border/70 pb-4">
        <Icon className="h-4 w-4" />
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          {title}
        </h3>
      </div>
      {children}
    </motion.article>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[5rem_1fr] gap-3">
      <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</dt>
      <dd className="font-light">{value}</dd>
    </div>
  );
}
