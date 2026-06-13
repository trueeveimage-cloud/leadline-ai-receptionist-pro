import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/unsubscribe')({
  component: UnsubscribePage,
})

type State = 'checking' | 'valid' | 'submitting' | 'success' | 'invalid'

function UnsubscribePage() {
  const [state, setState] = useState<State>('checking')
  const token = typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('token') || ''

  useEffect(() => {
    if (!token) {
      setState('invalid')
      return
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        const data = await response.json().catch(() => null)
        setState(response.ok && data?.valid ? 'valid' : data?.reason === 'already_unsubscribed' ? 'success' : 'invalid')
      })
      .catch(() => setState('invalid'))
  }, [token])

  const unsubscribe = async () => {
    setState('submitting')
    const response = await fetch('/email/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).catch(() => null)
    setState(response?.ok ? 'success' : 'invalid')
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-6">
      <section className="w-full max-w-lg border-y border-border py-14 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Leadmap email preferences</p>
        <h1 className="mt-5 text-3xl font-light tracking-tight">
          {state === 'success' ? 'You are unsubscribed' : 'Stop email notifications?'}
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {state === 'checking' && 'Checking your unsubscribe link…'}
          {state === 'valid' && 'Confirm below and we will stop sending app emails to this address.'}
          {state === 'submitting' && 'Updating your preferences…'}
          {state === 'success' && 'Your preference has been saved. You will not receive further app emails.'}
          {state === 'invalid' && 'This unsubscribe link is invalid or has expired.'}
        </p>
        {state === 'valid' && <Button className="mt-8" variant="brand" size="lg" onClick={unsubscribe}>Confirm unsubscribe</Button>}
        {(state === 'success' || state === 'invalid') && <Button className="mt-8" variant="outline" size="lg" onClick={() => window.location.assign('/')}>Back to Leadmap</Button>}
      </section>
    </main>
  )
}