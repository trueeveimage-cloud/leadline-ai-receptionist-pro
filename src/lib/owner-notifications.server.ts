import * as React from 'react'
import { render } from '@react-email/render'
import { supabaseAdmin } from '@/integrations/supabase/client.server'
import { TEMPLATES } from './email-templates/registry'

export async function queueOwnerNotification(templateName: string, templateData: Record<string, unknown>) {
  const template = TEMPLATES[templateName]
  if (!template?.to) throw new Error(`Owner notification template not found: ${templateName}`)

  const messageId = crypto.randomUUID()
  const element = React.createElement(template.component, templateData)
  const html = await render(element)
  const text = await render(element, { plainText: true })
  const subject = typeof template.subject === 'function' ? template.subject(templateData) : template.subject

  await supabaseAdmin.from('email_send_log').insert({
    message_id: messageId,
    template_name: templateName,
    recipient_email: template.to,
    status: 'pending',
  })

  const { error } = await supabaseAdmin.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: template.to,
      from: 'Leadmap <noreply@www.leadmap.se>',
      sender_domain: 'notify.www.leadmap.se',
      subject,
      html,
      text,
      purpose: 'transactional',
      label: templateName,
      idempotency_key: messageId,
      queued_at: new Date().toISOString(),
    },
  })

  if (error) {
    await supabaseAdmin.from('email_send_log').insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: template.to,
      status: 'failed',
      error_message: 'Failed to enqueue email',
    })
    throw error
  }

  return messageId
}