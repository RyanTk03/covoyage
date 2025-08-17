import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  if (auth().sessionClaims?.metadata.userRegistered) {
    redirect('/dashboard/my-account')
  }

  return <>{children}</>
}