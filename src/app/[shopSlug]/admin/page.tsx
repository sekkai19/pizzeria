import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ShieldAlert, ArrowLeft, Sparkles } from 'lucide-react'

export async function generateStaticParams() {
  const shops = await prisma.shop.findMany({ select: { slug: true } })
  return shops.map((shop) => ({ shopSlug: shop.slug }))
}

export default async function AdminPage(props: { params: Promise<{ shopSlug: string }> }) {
  const params = await props.params;
  const shop = await prisma.shop.findUnique({
    where: { slug: params.shopSlug }
  })

  if (!shop) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl text-center">
        <div className="w-16 h-16 bg-blue-900/50 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-700/50">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{shop.name} Admin-Portal</h1>
        <span className="inline-block bg-yellow-500/20 text-yellow-300 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider mb-4">
          Statischer GitHub Pages Modus
        </span>
        <p className="text-gray-300 text-sm leading-relaxed mb-6">
          Diese Website wird als statischer Export auf GitHub Pages gehostet. Das Live-Verwalten von Gerichten und Preisen via SQLite-Datenbank und Server-Aktionen erfordert eine vollwertige Server-Umgebung (z.&nbsp;B. Vercel oder Docker).
        </p>
        <p className="text-gray-400 text-xs mb-8">
          Möchten Sie das Ändern von Preisen sekundenschnell im Browser ausprobieren? Nutzen Sie unsere interaktive Live-Demo!
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            href="/demo"
            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Zur interaktiven Live-Demo</span>
          </Link>
          <Link
            href={`/${shop.slug}`}
            className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-xl transition flex items-center justify-center space-x-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Zur Speisekarte</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

