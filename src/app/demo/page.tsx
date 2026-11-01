'use client'

import React, { useState } from 'react'
import { ShopView, ShopData } from '@/components/ShopView'
import { RotateCcw } from 'lucide-react'

const INITIAL_SHOP: ShopData = {
  name: "Mario's Pizza (Demo)",
  address: "Musterstraße 1, 10115 Berlin",
  phone: "030 1234567",
  openingHours: "Mo-So: 11:00 - 23:00",
  orderingLink: null,
  imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1920&auto=format&fit=crop',
  categories: [
    {
      id: "cat-1",
      name: "Pizza",
      items: [
        {
          id: "item-1",
          name: "Margherita",
          description: "San Marzano Tomatensauce, Fior di Latte Mozzarella, frisches Basilikum",
          price: 9.50,
          isAvailable: true,
          isOffer: false,
          imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop'
        },
        {
          id: "item-2",
          name: "Diavola",
          description: "Scharfe Salami, Peperoncino, Mozzarella, Rote Zwiebeln",
          price: 11.50,
          isAvailable: true,
          isOffer: true,
          imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600&auto=format&fit=crop'
        }
      ]
    },
    {
      id: "cat-2",
      name: "Pasta",
      items: [
        {
          id: "item-3",
          name: "Spaghetti Carbonara",
          description: "Guanciale, Ei, Pecorino Romano, Schwarzer Pfeffer (Original ohne Sahne!)",
          price: 13.50,
          isAvailable: true,
          isOffer: false,
          imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=600&auto=format&fit=crop'
        }
      ]
    }
  ]
}

export default function DemoPage() {
  const [shop, setShop] = useState<ShopData>(INITIAL_SHOP)
  const [editingItem, setEditingItem] = useState<{ id: string, currentPrice: number } | null>(null)
  const [newPrice, setNewPrice] = useState("")

  const resetDemo = () => setShop(INITIAL_SHOP)

  const handleEdit = (id: string, currentPrice: number) => {
    setEditingItem({ id, currentPrice })
    setNewPrice(currentPrice.toString())
  }

  const handleSave = () => {
    if (!editingItem || !newPrice) return
    const parsed = parseFloat(newPrice.replace(',', '.'))
    if (isNaN(parsed)) return

    const newCategories = shop.categories.map(c => ({
      ...c,
      items: c.items.map(i => i.id === editingItem.id ? { ...i, price: parsed } : i)
    }))

    setShop({ ...shop, categories: newCategories })
    setEditingItem(null)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
      {/* Value prop / Explanation panel */}
      <div className="bg-blue-900 text-white p-8 md:w-1/3 flex flex-col justify-center shadow-xl z-10 relative">
        <h2 className="text-4xl font-extrabold mb-4 leading-tight">Sekundenschnell<br/>alles im Griff.</h2>
        <p className="text-xl text-blue-100 mb-8">
          Ändern Sie Preise, Menüs und Öffnungszeiten direkt am Handy. Die Website aktualisiert sich sofort. 
          Kein Warten auf Agenturen. Kein Stress.
        </p>
        
        <div className="bg-blue-950 p-6 rounded-xl border border-blue-800">
          <p className="font-bold text-blue-300 mb-2 uppercase tracking-wide text-sm">Probieren Sie es aus:</p>
          <p className="text-lg mb-6">Tippen Sie bei einem beliebigen Gericht auf den <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded font-bold text-sm mx-1">Preis selbst ändern</span> Button.</p>
          <button onClick={resetDemo} className="flex items-center space-x-2 text-blue-300 hover:text-white transition">
            <RotateCcw className="w-5 h-5" />
            <span>Demo zurücksetzen</span>
          </button>
        </div>
      </div>

      {/* The Demo Phone wrapper */}
      <div className="flex-1 p-4 md:p-8 flex justify-center overflow-y-auto bg-gray-800 relative">
        <div className="w-full max-w-md relative">
           <ShopView shop={shop} isDemoMode={true} onEditItem={handleEdit} />

           {/* Edit Overlay */}
           {editingItem && (
             <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-2xl p-6 w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                 <h3 className="font-bold text-xl mb-4 text-gray-900">Preis ändern</h3>
                 <div className="flex items-center space-x-4 mb-6">
                   <input 
                     type="text" 
                     value={newPrice}
                     onChange={e => setNewPrice(e.target.value)}
                     className="w-full text-3xl font-bold border-b-2 border-red-500 pb-1 outline-none focus:border-red-600 text-center"
                     autoFocus
                   />
                   <span className="text-3xl font-bold text-gray-500">€</span>
                 </div>
                 <div className="flex space-x-3">
                   <button onClick={() => setEditingItem(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Abbrechen</button>
                   <button onClick={handleSave} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-md">Speichern</button>
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
