'use client'

import React from 'react'
import { MapPin, Clock, Phone, ExternalLink, Search } from 'lucide-react'

export type ShopData = {
  name: string
  address: string
  phone: string
  openingHours: string
  orderingLink?: string | null
  imageUrl?: string | null
  categories: {
    id: string
    name: string
    items: {
      id: string
      name: string
      description?: string | null
      price: number
      isAvailable: boolean
      isOffer: boolean
      variants?: string | null
      imageUrl?: string | null
    }[]
  }[]
}

export function ShopView({ shop, isDemoMode, onEditItem }: { shop: ShopData, isDemoMode?: boolean, onEditItem?: (id: string, currentPrice: number) => void }) {
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredCategories = shop.categories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.items.length > 0)

  return (
    <div className="max-w-5xl mx-auto bg-white min-h-screen shadow-2xl rounded-b-xl pb-10 overflow-hidden font-sans">
      
      {/* Hero Image */}
      <div 
        className="w-full h-64 md:h-96 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${shop.imageUrl || 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1920&auto=format&fit=crop'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 md:p-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 shadow-sm drop-shadow-lg">{shop.name}</h1>
        </div>
      </div>

      {/* Info Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 border-b border-gray-200 p-4 md:p-6 text-gray-700 shadow-inner space-y-4 md:space-y-0">
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-8">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <span className="font-medium">{shop.address}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-red-600" />
            <span className="font-medium">{shop.openingHours}</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
          <a href={`tel:${shop.phone}`} className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-gray-100 transition">
            <Phone className="w-4 h-4 text-red-600" />
            <span>Anrufen</span>
          </a>
          
          {shop.orderingLink && (
            <a href={shop.orderingLink} target="_blank" rel="noreferrer" className="flex items-center justify-center space-x-2 bg-red-600 text-white px-5 py-2 rounded-lg font-bold shadow-md hover:bg-red-700 transition">
              <span>Bestellen</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Search Sticky Bar */}
      <div className="p-4 md:px-8 bg-white sticky top-0 z-20 shadow-sm border-b border-gray-100">
        <div className="relative max-w-xl mx-auto md:mx-0">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input 
            type="search" 
            placeholder="Pizza, Pasta, Getränke suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 border border-transparent rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition text-gray-800 font-medium placeholder-gray-500"
          />
        </div>
      </div>

      {/* Menu Sections */}
      <div className="p-4 md:p-8">
        {filteredCategories.length === 0 && (
          <div className="text-center text-gray-500 py-16">
            <p className="text-xl">Keine Ergebnisse für "{searchQuery}" gefunden.</p>
          </div>
        )}
        
        {filteredCategories.map((category) => (
          <div key={category.id} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 border-b-4 border-red-500 pb-2 mb-6 inline-block">
              {category.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.items.map((item) => (
                <div key={item.id} className={`flex rounded-2xl overflow-hidden border transition hover:shadow-lg ${item.isAvailable ? 'bg-white border-gray-200' : 'bg-gray-50 opacity-70 border-gray-200 grayscale'}`}>
                  
                  {item.imageUrl && (
                    <div 
                      className="w-1/3 min-h-full bg-cover bg-center" 
                      style={{ backgroundImage: `url(${item.imageUrl})` }}
                    />
                  )}
                  
                  <div className={`flex flex-col justify-between p-4 flex-1 ${!item.imageUrl && 'w-full'}`}>
                    <div>
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{item.name}</h3>
                        <span className="font-extrabold text-gray-900 ml-2 whitespace-nowrap">
                          {item.price.toFixed(2).replace('.', ',')} €
                        </span>
                      </div>
                      
                      {item.isOffer && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider mb-2">
                          Empfehlung
                        </span>
                      )}
                      
                      {item.description && <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.description}</p>}
                      {!item.isAvailable && <p className="text-xs text-red-600 font-bold mt-2 uppercase tracking-wide">Ausverkauft</p>}
                    </div>
                    
                    {isDemoMode && onEditItem && (
                      <div className="mt-4 text-right">
                        <button 
                          onClick={() => onEditItem(item.id, item.price)}
                          className="bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-yellow-300 transition hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Preis selbst ändern
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <footer className="text-center text-sm text-gray-400 p-8 border-t bg-gray-50">
        <p className="mb-2">© {new Date().getFullYear()} {shop.name}. Alle Rechte vorbehalten.</p>
        <p className="space-x-4">
          <a href="#" className="hover:text-gray-600 hover:underline">Impressum</a>
          <a href="#" className="hover:text-gray-600 hover:underline">Datenschutz</a>
        </p>
      </footer>
    </div>
  )
}
