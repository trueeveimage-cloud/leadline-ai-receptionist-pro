import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface BookingNotificationProps {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  preferredTime?: string;
  meetUrl?: string;
}

function OwnerBookingNotification({
  name,
  company,
  phone,
  email,
  preferredTime,
  meetUrl,
}: BookingNotificationProps) {
  const customer = name || "New prospect";
  return (
    <Html lang="en">
      <Head />
      <Preview>New Leadmap booking from {customer}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>LEADMAP</Text>
          <Heading style={styles.heading}>New demo booking</Heading>
          <Section style={styles.details}>
            <Text>
              <strong>Name:</strong> {customer}
            </Text>
            <Text>
              <strong>Company:</strong> {company || "Not provided"}
            </Text>
            <Text>
              <strong>Email:</strong> {email || "Not provided"}
            </Text>
            <Text>
              <strong>Phone:</strong> {phone || "Not provided"}
            </Text>
            <Text>
              <strong>Preferred time:</strong> {preferredTime || "Not provided"}
            </Text>
            {meetUrl ? (
              <Text>
                <strong>Google Meet:</strong> <Link href={meetUrl}>{meetUrl}</Link>
              </Text>
            ) : null}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const template = {
  component: OwnerBookingNotification,
  subject: (data) => `New Leadmap booking from ${data.name || "a prospect"}`,
  displayName: "Owner booking notification",
  previewData: {
    name: "Anna Svensson",
    company: "Demo VVS AB",
    phone: "+46 70 123 45 67",
    email: "anna@demo-vvs.se",
    preferredTime: "2026-06-15 10:00 (Europe/Stockholm)",
    meetUrl: "https://meet.google.com/example",
  },
  to: "__LEADMAP_OWNER_EMAIL__",
} satisfies TemplateEntry;

const styles = {
  body: { backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif", color: "#171512" },
  container: { maxWidth: "560px", margin: "0 auto", padding: "40px 24px" },
  brand: { fontSize: "11px", letterSpacing: "0.24em", color: "#6d685f" },
  heading: { fontSize: "28px", fontWeight: "500", margin: "16px 0 24px" },
  details: { backgroundColor: "#f5f2ec", padding: "20px 24px", lineHeight: "1.6" },
};
