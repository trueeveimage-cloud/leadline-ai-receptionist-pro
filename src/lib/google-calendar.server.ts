const CALENDAR_TIMEZONE = "Europe/Stockholm";
const SLOT_TIMES = ["10:00", "11:00", "13:00", "14:00", "15:00"] as const;
const MEETING_MINUTES = 30;
const BUFFER_MINUTES = 15;
const MIN_NOTICE_HOURS = 12;
const MAX_DEMOS_PER_DAY = 2;

type GoogleCalendarEvent = {
  id?: string;
  status?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  extendedProperties?: { private?: Record<string, string> };
  conferenceData?: {
    entryPoints?: Array<{ entryPointType?: string; uri?: string }>;
  };
  hangoutLink?: string;
};

export type CalendarSlot = {
  date: string;
  time: string;
  startsAt: string;
  endsAt: string;
};

export type ConfirmedCalendarBooking = CalendarSlot & {
  eventId: string;
  meetUrl: string;
};

export function isGoogleCalendarConfigured() {
  return Boolean(
    process.env.GOOGLE_CALENDAR_CLIENT_ID &&
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET &&
    process.env.GOOGLE_CALENDAR_REFRESH_TOKEN,
  );
}

async function getAccessToken() {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_CALENDAR_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GOOGLE_CALENDAR_NOT_CONFIGURED");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data = (await response.json().catch(() => null)) as {
    access_token?: string;
    error?: string;
  } | null;
  if (!response.ok || !data?.access_token) {
    console.error("[leadmap] Google Calendar token refresh failed", {
      status: response.status,
      error: data?.error,
    });
    throw new Error("GOOGLE_CALENDAR_AUTH_FAILED");
  }
  return data.access_token;
}

function calendarId() {
  return process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";
}

function timezoneOffsetMilliseconds(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );
  return asUtc - date.getTime();
}

export function stockholmTimeToUtc(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const guessedUtc = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const firstOffset = timezoneOffsetMilliseconds(guessedUtc, CALENDAR_TIMEZONE);
  let result = new Date(guessedUtc.getTime() - firstOffset);
  const correctedOffset = timezoneOffsetMilliseconds(result, CALENDAR_TIMEZONE);
  if (correctedOffset !== firstOffset) {
    result = new Date(guessedUtc.getTime() - correctedOffset);
  }
  return result;
}

function localDate(date: Date) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: CALENDAR_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll("/", "-");
}

function isMondayThroughThursday(date: Date) {
  return ["Mon", "Tue", "Wed", "Thu"].includes(
    new Intl.DateTimeFormat("en-US", {
      timeZone: CALENDAR_TIMEZONE,
      weekday: "short",
    }).format(date),
  );
}

function eventInterval(event: GoogleCalendarEvent) {
  const startValue = event.start?.dateTime || event.start?.date;
  const endValue = event.end?.dateTime || event.end?.date;
  if (!startValue || !endValue || event.status === "cancelled") return null;
  const start = new Date(startValue);
  const end = new Date(endValue);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  return { start, end };
}

async function listEvents(accessToken: string, timeMin: Date, timeMax: Date) {
  const query = new URLSearchParams({
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "2500",
    timeZone: CALENDAR_TIMEZONE,
  });
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId())}/events?${query}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  const data = (await response.json().catch(() => null)) as {
    items?: GoogleCalendarEvent[];
    error?: unknown;
  } | null;
  if (!response.ok) {
    console.error("[leadmap] Google Calendar event listing failed", {
      status: response.status,
      error: data?.error,
    });
    throw new Error("GOOGLE_CALENDAR_READ_FAILED");
  }
  return data?.items || [];
}

function meetUrlForEvent(event: GoogleCalendarEvent) {
  return (
    event.hangoutLink ||
    event.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri ||
    ""
  );
}

async function getEvent(accessToken: string, eventId: string) {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId())}/events/${encodeURIComponent(eventId)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  const event = (await response.json().catch(() => null)) as GoogleCalendarEvent | null;
  if (!response.ok || !event?.id) throw new Error("GOOGLE_CALENDAR_EVENT_READ_FAILED");
  return event;
}

async function findBookingEvent(accessToken: string, bookingId: string, slot: CalendarSlot) {
  const query = new URLSearchParams({
    timeMin: new Date(new Date(slot.startsAt).getTime() - 24 * 60 * 60_000).toISOString(),
    timeMax: new Date(new Date(slot.endsAt).getTime() + 24 * 60 * 60_000).toISOString(),
    singleEvents: "true",
    maxResults: "10",
    privateExtendedProperty: `leadmap_booking_id=${bookingId}`,
  });
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId())}/events?${query}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  const data = (await response.json().catch(() => null)) as {
    items?: GoogleCalendarEvent[];
  } | null;
  if (!response.ok) throw new Error("GOOGLE_CALENDAR_IDEMPOTENCY_CHECK_FAILED");
  return (data?.items || []).find((event) => event.status !== "cancelled") || null;
}

async function waitForMeetUrl(accessToken: string, initialEvent: GoogleCalendarEvent) {
  let event = initialEvent;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const meetUrl = meetUrlForEvent(event);
    if (meetUrl && event.id) return { eventId: event.id, meetUrl };
    if (!event.id) break;
    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    event = await getEvent(accessToken, event.id);
  }
  throw new Error("GOOGLE_MEET_LINK_MISSING");
}

export async function getAvailableCalendarSlots(options?: {
  now?: Date;
  days?: number;
  extraBusyStarts?: string[];
  ignoreBookingId?: string;
}) {
  const now = options?.now || new Date();
  const days = Math.min(Math.max(options?.days || 14, 1), 21);
  const horizon = new Date(now.getTime() + (days + 2) * 24 * 60 * 60 * 1000);
  const listedEvents = isGoogleCalendarConfigured()
    ? await listEvents(await getAccessToken(), now, horizon)
    : [];
  const events = options?.ignoreBookingId
    ? listedEvents.filter(
        (event) =>
          event.extendedProperties?.private?.leadmap_booking_id !== options.ignoreBookingId,
      )
    : listedEvents;
  const existingStarts = new Set(
    events
      .map((event) => event.start?.dateTime)
      .filter(Boolean)
      .map((value) => new Date(value as string).toISOString()),
  );
  const extraEvents: GoogleCalendarEvent[] = (options?.extraBusyStarts || [])
    .filter((startsAt) => !existingStarts.has(new Date(startsAt).toISOString()))
    .map((startsAt) => ({
      start: { dateTime: startsAt },
      end: {
        dateTime: new Date(new Date(startsAt).getTime() + MEETING_MINUTES * 60_000).toISOString(),
      },
      extendedProperties: { private: { leadmap_demo: "true" } },
    }));
  const allEvents = [...events, ...extraEvents];
  const eventIntervals = allEvents.map(eventInterval).filter(Boolean) as Array<{
    start: Date;
    end: Date;
  }>;

  const demoCountByDate = new Map<string, number>();
  for (const event of allEvents) {
    if (event.extendedProperties?.private?.leadmap_demo !== "true") continue;
    const interval = eventInterval(event);
    if (!interval) continue;
    const key = localDate(interval.start);
    demoCountByDate.set(key, (demoCountByDate.get(key) || 0) + 1);
  }

  const dateKeys = new Set<string>();
  for (let index = 0; index < days + 4; index += 1) {
    const candidate = new Date(now.getTime() + index * 24 * 60 * 60 * 1000);
    dateKeys.add(localDate(candidate));
  }

  const minimumStart = now.getTime() + MIN_NOTICE_HOURS * 60 * 60 * 1000;
  const slots: CalendarSlot[] = [];
  for (const date of [...dateKeys].sort()) {
    if ((demoCountByDate.get(date) || 0) >= MAX_DEMOS_PER_DAY) continue;
    for (const time of SLOT_TIMES) {
      const start = stockholmTimeToUtc(date, time);
      if (!isMondayThroughThursday(start) || start.getTime() < minimumStart) continue;
      const end = new Date(start.getTime() + MEETING_MINUTES * 60_000);
      const bufferedStart = start.getTime() - BUFFER_MINUTES * 60_000;
      const bufferedEnd = end.getTime() + BUFFER_MINUTES * 60_000;
      const overlaps = eventIntervals.some(
        (event) => bufferedStart < event.end.getTime() && bufferedEnd > event.start.getTime(),
      );
      if (!overlaps) {
        slots.push({
          date,
          time,
          startsAt: start.toISOString(),
          endsAt: end.toISOString(),
        });
      }
    }
  }
  return slots;
}

export async function createCalendarDemo(input: {
  bookingId: string;
  company: string;
  name: string;
  email: string;
  phone?: string;
  slot: CalendarSlot;
}) {
  const accessToken = await getAccessToken();
  const existingEvent = await findBookingEvent(accessToken, input.bookingId, input.slot);
  if (existingEvent) {
    const existingConference = await waitForMeetUrl(accessToken, existingEvent);
    return {
      ...input.slot,
      ...existingConference,
    } satisfies ConfirmedCalendarBooking;
  }

  const requestId = `leadmap-${input.bookingId}`.replace(/[^a-zA-Z0-9-]/g, "");
  const eventBody = {
    summary: `Leadmap VVS-demo — ${input.company}`,
    description: [
      "Kvalificerad VVS-demo via Leadmaps webbplats.",
      `Kontakt: ${input.name}`,
      input.phone ? `Telefon: ${input.phone}` : null,
      "30 minuter. Leadmap bekräftar nästa steg efter mötet.",
    ]
      .filter(Boolean)
      .join("\n"),
    start: { dateTime: input.slot.startsAt, timeZone: CALENDAR_TIMEZONE },
    end: { dateTime: input.slot.endsAt, timeZone: CALENDAR_TIMEZONE },
    attendees: [{ email: input.email, displayName: input.name }],
    conferenceData: {
      createRequest: {
        requestId,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    extendedProperties: {
      private: {
        leadmap_demo: "true",
        leadmap_booking_id: input.bookingId,
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 60 },
      ],
    },
    visibility: "private",
  };
  const query = new URLSearchParams({ conferenceDataVersion: "1", sendUpdates: "all" });
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId())}/events?${query}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventBody),
    },
  );
  const event = (await response.json().catch(() => null)) as GoogleCalendarEvent | null;
  if (!response.ok || !event?.id) {
    console.error("[leadmap] Google Calendar event creation failed", {
      status: response.status,
      bookingId: input.bookingId,
    });
    throw new Error("GOOGLE_CALENDAR_CREATE_FAILED");
  }
  const conference = await waitForMeetUrl(accessToken, event);
  return {
    ...input.slot,
    ...conference,
  } satisfies ConfirmedCalendarBooking;
}

export const calendarRules = {
  timezone: CALENDAR_TIMEZONE,
  meetingMinutes: MEETING_MINUTES,
  bufferMinutes: BUFFER_MINUTES,
  minimumNoticeHours: MIN_NOTICE_HOURS,
  maximumDemosPerDay: MAX_DEMOS_PER_DAY,
};
