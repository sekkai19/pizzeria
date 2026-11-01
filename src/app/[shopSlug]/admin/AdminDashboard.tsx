'use client'

import { useState } from 'react'
import { logoutAction, toggleItemAvailability, deleteItem, addCategory, addItem, updateItem } from './actions'
import { LogOut, Eye, Edit2, Trash2, Plus, GripVertical, Image as ImageIcon } from 'lucide-react'

export function AdminDashboard({ shop }: { shop: any }) {
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [isAddingItemTo, setIsAddingItemTo] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    const priceStr = formData.get('price') as string
    if (isNaN(parseFloat(priceStr.replace(',', '.')))) {
      return alert('Bitte einen gültigen Preis eingeben')
    }

    if (editingItem) {
      await updateItem(editingItem.id, formData)
      setEditingItem(null)
    } else if (isAddingItemTo) {
      await addItem(isAddingItemTo, formData)
      setIsAddingItemTo(null)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    await addCategory(shop.id, newCategoryName)
    setNewCategoryName('')
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Möchten Sie "${name}" wirklich löschen?`)) {
      await deleteItem(id)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{shop.name} Editor</h1>
          <p className="text-gray-500 mt-1">Verwalten Sie Ihre Speisekarte in Echtzeit</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <a href={`/${shop.slug}`} target="_blank" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center transition font-semibold text-sm">
            <Eye className="w-4 h-4 mr-2" /> Live-Ansicht
          </a>
          <button onClick={() => logoutAction().then(() => window.location.reload())} className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg flex items-center transition font-semibold text-sm">
            <LogOut className="w-4 h-4 mr-2" /> Abmelden
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {shop.categories.map((category: any) => (
          <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
              <button 
                onClick={() => setIsAddingItemTo(category.id)}
                className="text-sm bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-red-700 transition flex items-center shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1" /> Gericht hinzufügen
              </button>
            </div>
            
            <div className="divide-y divide-gray-100">
              {category.items.map((item: any) => (
                <div key={item.id} className={`p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between transition hover:bg-gray-50 ${!item.isAvailable && 'opacity-60 bg-gray-50 grayscale'}`}>
                  
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="cursor-grab text-gray-300 hover:text-gray-500 pt-1 hidden sm:block">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg text-gray-900">{item.name}</span>
                        {!item.isAvailable && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">Versteckt</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.description || 'Keine Beschreibung'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end mt-4 sm:mt-0 space-x-4 pl-0 sm:pl-4">
                    <span className="font-extrabold text-xl text-gray-900">{item.price.toFixed(2).replace('.', ',')} €</span>
                    
                    <div className="flex items-center space-x-2 border-l pl-4 border-gray-200">
                      <button 
                        onClick={() => toggleItemAvailability(item.id, !item.isAvailable)}
                        className={`px-3 py-1.5 text-xs rounded-md font-bold transition shadow-sm ${item.isAvailable ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200' : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'}`}
                      >
                        {item.isAvailable ? 'Verbergen' : 'Aktivieren'}
                      </button>
                      <button onClick={() => setEditingItem(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition border border-transparent hover:border-blue-100">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id, item.name)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {category.items.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  Noch keine Gerichte in dieser Kategorie.
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <input 
            type="text" 
            placeholder="Neue Kategorie (z.B. Desserts)"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          <button onClick={handleAddCategory} className="w-full sm:w-auto bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900 transition shadow-sm">
            Kategorie hinzufügen
          </button>
        </div>
      </div>

      {/* Item Editor Modal */}
      {(editingItem || isAddingItemTo) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-xl text-gray-900">{editingItem ? 'Gericht bearbeiten' : 'Neues Gericht'}</h3>
            </div>
            
            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                <input name="name" defaultValue={editingItem?.name} required className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none bg-gray-50 focus:bg-white" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Zutaten / Beschreibung</label>
                <textarea name="description" defaultValue={editingItem?.description} rows={3} className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none bg-gray-50 focus:bg-white resize-none" />
              </div>
              
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Preis (€)</label>
                  <input name="price" defaultValue={editingItem?.price?.toString().replace('.', ',')} required className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none bg-gray-50 focus:bg-white font-mono" />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Bild hochladen</label>
                  <input name="imageFile" type="file" accept="image/*" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-red-500 focus:outline-none bg-gray-50 focus:bg-white text-sm file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300" />
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => { setEditingItem(null); setIsAddingItemTo(null) }} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">Abbrechen</button>
                <button type="submit" className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-md hover:bg-red-700 transition">Speichern</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
