import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { AdminDashboard } from './AdminDashboard'
import { LoginForm } from './LoginForm'

export default async function AdminPage(props: { params: Promise<{ shopSlug: string }> }) {
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

  const session = await getSession()
  const isAuthorized = session && session.shopId === shop.id

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthorized ? (
        <AdminDashboard shop={shop} />
      ) : (
        <LoginForm shopSlug={shop.slug} shopName={shop.name} />
      )}
    </div>
  )
}
