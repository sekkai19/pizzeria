'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/demo')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-xl font-bold mb-4">Weiterleitung zur Demo...</p>
        <Link href="/demo" className="text-blue-400 hover:text-blue-300 underline font-medium">
          Hier klicken, falls Sie nicht automatisch weitergeleitet werden.
        </Link>
      </div>
    </div>
  )
}

