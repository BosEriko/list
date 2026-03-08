'use client'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithCustomToken } from 'firebase/auth'
import { auth } from "@lib/Firebase";

const Authenticate = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      signInWithCustomToken(auth, token).then(() => {
        router.push('/')
      }).catch(console.error)
    }
  }, [token])

  return <p>Signing you in...</p>
}

export default function AuthenticateSuspense() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Authenticate />
    </Suspense>
  )
}
