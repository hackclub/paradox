import { usePage, router } from '@inertiajs/react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import type { SharedProps } from '@/types'
import FlashMessages from '@/components/FlashMessages'
import { notify } from '@/lib/notifications'

const PARADOX = {
  images: '/paradox/images',
  bg: '#180c04',
}

export default function LandingIndex() {
  const shared = usePage<SharedProps>().props
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.post(shared.rsvp_path, { email }, {
      onStart: () => setSubmitting(true),
      onFinish: () => setSubmitting(false),
      onSuccess: (page) => {
        const flash = (page.props as unknown as SharedProps).flash
        if (flash.notice) {
          notify('notice', flash.notice)
          setEmail('')
        }
        if (flash.alert) notify('alert', flash.alert)
      },
      onError: () => notify('alert', 'Something went wrong. Please try again.'),
    })
  }

  return (
    <div
      className="w-screen min-h-screen relative overflow-hidden select-none"
      style={{ backgroundColor: PARADOX.bg }}
    >
      <title>Paradox</title>
      <meta name="description" content="Hack Club event — RSVP to stay in the loop." />

      {/* Hack Club flag — top left */}
      <a
        className="fixed top-0 left-4 z-50 transition-opacity duration-300 hover:opacity-65 cursor-pointer"
        href="https://hackclub.com/"
        style={{ width: 'clamp(130px, 13vw, 220px)', height: 'auto' }}
      >
        <img src={`${PARADOX.images}/flag-orpheus-top.svg`} alt="Orpheus Flag" />
      </a>

      {/* Sign In — top right */}
      <a
        href={shared.sign_in_path}
        className="fixed top-0 right-6 z-50 cursor-pointer transition-opacity duration-300 hover:opacity-60"
      >
        <img
          src={`${PARADOX.images}/1/Sign-fixed.png`}
          className="pointer-events-none select-none"
          style={{ width: 'clamp(130px, 13vw, 220px)', height: 'auto' }}
          alt="Sign In"
        />
      </a>

      {/* Stage background */}
      <img
        src={`${PARADOX.images}/1/Stage-fixed.jpg`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
        aria-hidden
      />

      {/* Curtains */}
      <img
        src={`${PARADOX.images}/1/Curtain-fixed.png`}
        alt=""
        className="absolute left-0 top-0 h-[80%] w-auto pointer-events-none select-none z-20"
        aria-hidden
      />
      <img
        src={`${PARADOX.images}/1/Curtain-fixed.png`}
        alt=""
        className="absolute right-0 top-0 h-[80%] w-auto scale-x-[-1] pointer-events-none select-none z-20"
        aria-hidden
      />

      {/* Main content — centered */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <FlashMessages />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4 w-full max-w-md"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 text-lg rounded bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold rounded transition-colors"
          >
            {submitting ? '…' : 'RSVP'}
          </button>
        </form>
      </div>
    </div>
  )
}

LandingIndex.layout = (page: ReactNode) => page
