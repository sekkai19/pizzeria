const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const shopSlug = 'marios-pizza'
  
  await prisma.item.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.shop.deleteMany({})

  const shop = await prisma.shop.create({
    data: {
      slug: shopSlug,
      name: 'Mario\'s Pizza',
      address: 'Hauptstraße 1, 10115 Berlin',
      phone: '030 1234567',
      openingHours: 'Mo-So: 11:00 - 23:00',
      orderingLink: 'https://lieferando.de',
      passwordHash: 'admin123',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1920&auto=format&fit=crop'
    }
  })

  const pizzaCat = await prisma.category.create({
    data: { shopId: shop.id, name: 'Pizza', sort: 1 }
  })

  const pastaCat = await prisma.category.create({
    data: { shopId: shop.id, name: 'Pasta', sort: 2 }
  })

  const drinksCat = await prisma.category.create({
    data: { shopId: shop.id, name: 'Getränke', sort: 3 }
  })

  await prisma.item.createMany({
    data: [
      {
        shopId: shop.id, categoryId: pizzaCat.id,
        name: 'Margherita',
        description: 'San Marzano Tomatensauce, Fior di Latte Mozzarella, frisches Basilikum',
        price: 9.50, isAvailable: true, isOffer: false, sort: 1,
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop'
      },
      {
        shopId: shop.id, categoryId: pizzaCat.id,
        name: 'Diavola',
        description: 'Scharfe Salami, Peperoncino, Mozzarella, Rote Zwiebeln',
        price: 11.50, isAvailable: true, isOffer: true, sort: 2,
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600&auto=format&fit=crop'
      },
      {
        shopId: shop.id, categoryId: pizzaCat.id,
        name: 'Quattro Formaggi',
        description: 'Gorgonzola, Parmesan, Mozzarella, Ricotta',
        price: 12.00, isAvailable: true, isOffer: false, sort: 3,
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop'
      },
      {
        shopId: shop.id, categoryId: pizzaCat.id,
        name: 'Prosciutto e Funghi',
        description: 'Gekochter Schinken, frische Champignons',
        price: 11.00, isAvailable: false, isOffer: false, sort: 4,
        imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=600&auto=format&fit=crop'
      },
      {
        shopId: shop.id, categoryId: pastaCat.id,
        name: 'Spaghetti Carbonara',
        description: 'Guanciale, Ei, Pecorino Romano, Schwarzer Pfeffer (Original ohne Sahne!)',
        price: 13.50, isAvailable: true, isOffer: false, sort: 1,
        imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=600&auto=format&fit=crop'
      },
      {
        shopId: shop.id, categoryId: pastaCat.id,
        name: 'Penne all\'Arrabbiata',
        description: 'Scharfe Tomatensauce, Knoblauch, Petersilie',
        price: 10.50, isAvailable: true, isOffer: false, sort: 2,
        imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=600&auto=format&fit=crop'
      },
      {
        shopId: shop.id, categoryId: drinksCat.id,
        name: 'San Pellegrino 0.5l',
        description: 'Mineralwasser mit Kohlensäure',
        price: 3.00, isAvailable: true, isOffer: false, sort: 1,
        imageUrl: null
      },
      {
        shopId: shop.id, categoryId: drinksCat.id,
        name: 'Peroni Nastro Azzurro',
        description: 'Italienisches Bier 0.33l',
        price: 4.50, isAvailable: true, isOffer: false, sort: 2,
        imageUrl: 'https://images.unsplash.com/photo-1657223019808-1cc67d64380b?q=80&w=600&auto=format&fit=crop'
      }
    ]
  })
  console.log('Seed data created for Marios Pizza!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
