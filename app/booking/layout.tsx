import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Réserver une séance — Monica Schneider",
  description: "Réservez une séance découverte gratuite (45 min) avec Monica Schneider. Executive coaching, philosophical counselling et Happiness Design.",
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
      {children}
    </>
  )
}
