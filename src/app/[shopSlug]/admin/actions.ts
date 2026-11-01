'use server'

import { prisma } from '@/lib/prisma'
import { createSession, clearSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function loginAction(slug: string, password: string) {
  const shop = await prisma.shop.findUnique({ where: { slug } })
  if (!shop) return { error: 'Shop nicht gefunden' }

  // Simple plain-text comparison for MVP, bcrypt in prod
  if (shop.passwordHash !== password) {
    return { error: 'Falsches Passwort' }
  }

  await createSession(shop.id, shop.slug)
  return { success: true }
}

export async function logoutAction() {
  await clearSession()
}

export async function updateShopDetails(shopId: string, data: any) {
  await prisma.shop.update({
    where: { id: shopId },
    data: {
      name: data.name,
      address: data.address,
      phone: data.phone,
      openingHours: data.openingHours,
      orderingLink: data.orderingLink || null
    }
  })
  revalidatePath(`/${data.slug}`)
  revalidatePath(`/${data.slug}/admin`)
}

export async function updateItemPrice(itemId: string, newPrice: number) {
  const item = await prisma.item.update({
    where: { id: itemId },
    data: { price: newPrice },
    include: { shop: true }
  })
  revalidatePath(`/${item.shop.slug}`)
  revalidatePath(`/${item.shop.slug}/admin`)
}

export async function toggleItemAvailability(itemId: string, isAvailable: boolean) {
  const item = await prisma.item.update({
    where: { id: itemId },
    data: { isAvailable },
    include: { shop: true }
  })
  revalidatePath(`/${item.shop.slug}`)
  revalidatePath(`/${item.shop.slug}/admin`)
}

export async function deleteItem(itemId: string) {
  const item = await prisma.item.delete({
    where: { id: itemId },
    include: { shop: true }
  })
  revalidatePath(`/${item.shop.slug}`)
  revalidatePath(`/${item.shop.slug}/admin`)
}

export async function addCategory(shopId: string, name: string) {
  const category = await prisma.category.create({
    data: { shopId, name, sort: 99 },
    include: { shop: true }
  })
  revalidatePath(`/${category.shop.slug}`)
  revalidatePath(`/${category.shop.slug}/admin`)
}

import { writeFile } from 'fs/promises'
import path from 'path'

async function saveImage(file: File | null): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`
  const filepath = path.join(process.cwd(), 'public/uploads', filename)
  
  await writeFile(filepath, buffer)
  return `/uploads/${filename}`
}

export async function addItem(categoryId: string, formData: FormData) {
  const category = await prisma.category.findUnique({ where: { id: categoryId }, include: { shop: true } })
  if (!category) return
  
  const file = formData.get('imageFile') as File | null
  const imageUrl = await saveImage(file)
  
  await prisma.item.create({
    data: {
      shopId: category.shopId,
      categoryId: category.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat((formData.get('price') as string).replace(',', '.')),
      imageUrl: imageUrl || null,
      sort: 99
    }
  })
  revalidatePath(`/${category.shop.slug}`)
  revalidatePath(`/${category.shop.slug}/admin`)
}

export async function updateItem(itemId: string, formData: FormData) {
  const file = formData.get('imageFile') as File | null
  const newImageUrl = await saveImage(file)
  
  const dataToUpdate: any = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: parseFloat((formData.get('price') as string).replace(',', '.'))
  }
  
  if (newImageUrl) {
    dataToUpdate.imageUrl = newImageUrl
  }
  
  const item = await prisma.item.update({
    where: { id: itemId },
    data: dataToUpdate,
    include: { shop: true }
  })
  revalidatePath(`/${item.shop.slug}`)
  revalidatePath(`/${item.shop.slug}/admin`)
}

