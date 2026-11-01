import { prisma } from '@/lib/prisma'
import { ShopView } from '@/components/ShopView'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const shops = await prisma.shop.findMany({ select: { slug: true } })
  return shops.map((shop) => ({ shopSlug: shop.slug }))
}

export default async function ShopPage(props: { params: Promise<{ shopSlug: string }> }) {
  const params = await props.params;
  const shop = await prisma.shop.findUnique({
    where: { slug: params.shopSlug },
    include: {
      categories: {
        orderBy: { sort: 'asc' },
        include: {
          items: {
            orderBy: { sort: 'asc' }
          }
        }
      }
    }
  })

  if (!shop) {
    notFound()
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <ShopView shop={shop} />
    </div>
  )
}
