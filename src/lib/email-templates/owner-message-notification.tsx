import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'
import type { TemplateEntry } from './registry'

interface MessageNotificationProps {
  name?: string
  email?: string
  message?: string
}

function OwnerMessageNotification({ name, email, message }: MessageNotificationProps) {
  const sender = name || 'Website visitor'
  return (
    <Html lang="en">
      <Head />
      <Preview>New website message from {sender}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>LEADMAP</Text>
          <Heading style={styles.heading}>New website message</Heading>
          <Section style={styles.details}>
            <Text><strong>Name:</strong> {sender}</Text>
            <Text><strong>Email:</strong> {email || 'Not provided'}</Text>
            <Text style={styles.message}>{message || 'No message provided.'}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: OwnerMessageNotification,
  subject: (data) => `New Leadmap message from ${data.name || 'a visitor'}`,
  displayName: 'Owner message notification',
  previewData: { name: 'Jane Doe', email: 'jane@example.com', message: 'I would like to learn more about Leadmap.' },
  to: '38kqgt@gmail.com',
} satisfies TemplateEntry

const styles = {
  body: { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', color: '#171512' },
  container: { maxWidth: '560px', margin: '0 auto', padding: '40px 24px' },
  brand: { fontSize: '11px', letterSpacing: '0.24em', color: '#6d685f' },
  heading: { fontSize: '28px', fontWeight: '500', margin: '16px 0 24px' },
  details: { backgroundColor: '#f5f2ec', padding: '20px 24px' },
  message: { borderTop: '1px solid #ded9d0', paddingTop: '16px', lineHeight: '1.6', whiteSpace: 'pre-wrap' as const },
}