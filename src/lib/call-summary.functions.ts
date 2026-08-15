import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const TurnSchema = z.object({
  role: z.enum(["agent", "user"]),
  text: z.string().min(1).max(1000),
});

const InputSchema = z
  .object({
    language: z.enum(["en", "sv", "es"]).default("en"),
    businessType: z.string().max(120).optional(),
    transcript: z.array(TurnSchema).min(1).max(80),
  })
  .refine(
    (input) => input.transcript.reduce((total, turn) => total + turn.text.length, 0) <= 20000,
    { message: "Transcript is too long", path: ["transcript"] },
  );

const SummarySchema = z.object({
  caller_name: z.string().describe("Caller's full name, or 'Unknown' if not stated."),
  phone: z.string().describe("Caller phone number if mentioned, else 'Not given'."),
  intent: z.string().describe("One short sentence: why they called."),
  job_type: z
    .string()
    .describe(
      "Concrete service / product / job they need (e.g. 'leaking radiator', 'wisdom-tooth check').",
    ),
  urgency: z.enum(["emergency", "high", "medium", "low"]).describe("Urgency of the request."),
  preferred_time: z
    .string()
    .describe("When they want to be helped, e.g. 'Tue 10:30' or 'ASAP'. 'Flexible' if unclear."),
  location: z.string().describe("Address / area mentioned, else 'Not given'."),
  qualified: z
    .boolean()
    .describe("True if this looks like a serious, bookable lead (not spam/wrong number)."),
  next_step: z
    .string()
    .describe(
      "One short imperative sentence for the owner, e.g. 'Call back today to confirm Tue 10:30 booking.'",
    ),
  summary: z
    .string()
    .describe("2–3 sentence natural-language summary the owner can read in 5 seconds."),
});

export type CallSummary = z.infer<typeof SummarySchema>;

const LANG_NAME: Record<"en" | "sv" | "es", string> = {
  en: "English",
  sv: "Swedish",
  es: "Spanish",
};

export const summarizeCall = createServerFn({ method: "POST" })
  .validator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<CallSummary> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const transcriptText = data.transcript
      .map((t) => `${t.role === "user" ? "Caller" : "AI receptionist"}: ${t.text}`)
      .join("\n");

    const langName = LANG_NAME[data.language];
    const businessLine = data.businessType
      ? `The business this AI is answering for: ${data.businessType}.\n`
      : "";

    const { experimental_output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      experimental_output: Output.object({ schema: SummarySchema }),
      system:
        "You are Leadmap's call-summary engine. You read a transcript between an AI receptionist and a caller, then produce a structured, owner-ready summary. " +
        "Be factual — never invent details that aren't in the transcript. If something wasn't said, use the explicit 'unknown' / 'Not given' / 'Flexible' values defined in the schema. " +
        `Write all natural-language fields in ${langName}.`,
      prompt: `${businessLine}Conversation language: ${langName}.\n\nTranscript:\n${transcriptText}\n\nReturn the structured call summary.`,
    });

    return experimental_output;
  });
