"use client"

import { useEffect, useMemo, useState } from "react"
import { Copy, Plus, Trash2, ShoppingBag, X } from "lucide-react"

// รายการสินค้าตั้งต้น (สามารถแก้ไขราคาที่นี่ได้ค่ะ)
const PRODUCT_LIST = [
  { name: "Beta Liv Pro Plus 🧡", defaultPrice: 0 },
  { name: "Beta X+ 💙", defaultPrice: 0 },
  { name: "Beta Oil ❤️", defaultPrice: 0 },
  { name: "Beta Herb 💛", defaultPrice: 0 },
  { name: "Beta Life 💚", defaultPrice: 0 },
  { name: "Beta Cal Pro Plus 🤍", defaultPrice: 0 },
  { name: "Lab Farm 🧪", defaultPrice: 0 },
  { name: "Abbie 🧴", defaultPrice: 0 },
  { name: "Beta E 👁️", defaultPrice: 0 },
]

type OrderDetail = {
  productName: string
  price: number
}

type ReportItem = {
  id: string
  name: string
  talk: number
  noTalk: number
  ghost: number
  follow: number
  calls: number
  comeback: number
  buyOrders: OrderDetail[]
  reOrders: OrderDetail[]
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [date, setDate] = useState("")
  const [employee, setEmployee] = useState("")
  const [pages, setPages] = useState<ReportItem[]>([])
  const [lines, setLines] = useState<ReportItem[]>([])

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("daily-report-pro")
    if (saved) {
      const parsed = JSON.parse(saved)
      setDate(parsed.date || "")
      setEmployee(parsed.employee || "")
      setPages(parsed.pages || [])
      setLines(parsed.lines || [])
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("daily-report-pro", JSON.stringify({ date, employee, pages, lines }))
  }, [mounted, date, employee, pages, lines])

  const createItem = (name = ""): ReportItem => ({
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    name,
    talk: 0,
    noTalk: 0,
    ghost: 0,
    follow: 0,
    calls: 0,
    comeback: 0,
    buyOrders: [],
    reOrders: [],
  })

  // Logic การคำนวณแยกตามสินค้า
  const productStats = useMemo(() => {
    const stats: Record<string, { count: number; total: number }> = {}
    const allItems = [...pages, ...lines]
    
    allItems.forEach(item => {
      const allOrders = [...item.buyOrders, ...item.reOrders]
      allOrders.forEach(order => {
        if (!stats[order.productName]) {
          stats[order.productName] = { count: 0, total: 0 }
        }
        stats[order.productName].count += 1
        stats[order.productName].total += order.price
      })
    })
    return stats
  }, [pages, lines])

  const grandTotal = useMemo(() => {
    return Object.values(productStats).reduce((sum, s) => sum + s.total, 0)
  }, [productStats])

  const summaryText = useMemo(() => {
    let text = `${date} ${employee}\n\n`
    
    pages.forEach(item => {
      const buyTotal = item.buyOrders.reduce((s, o) => s + o.price, 0)
      const reTotal = item.reOrders.reduce((s, o) => s + o.price, 0)
      const totalChats = item.talk + item.noTalk + item.ghost + item.buyOrders.length
      
      text += `เพจ ${item.name}\n`
      text += `ทักคุย = ${item.talk}\nไม่คุย = ${item.noTalk}\nทักผี = ${item.ghost}\n`
      text += `ทักซื้อ = ${item.buyOrders.length}/${buyTotal}\n`
      text += `ตาม = ${item.follow}\nโทร = ${item.calls}\n`
      text += `Re = ${item.reOrders.length}/${reTotal}\n`
      text += `รวมทัก = ${totalChats}\n`
      text += `ตามกลับมาคุย = ${item.comeback}\n`
      text += `ยอดขาย ${buyTotal + reTotal}\n\n`
    })

    text += `***********************\n\n`
    lines.forEach(item => {
      const total = item.buyOrders.reduce((s, o) => s + o.price, 0)
      text += `${item.name}\n= ${total}\n`
    })

    text += `\n--- สรุปยอดแยกสินค้า ---\n`
    Object.entries(productStats).forEach(([name, data]) => {
      if (data.count > 0) {
        text += `${name}: ${data.count} ชิ้น = ${data.total.toLocaleString()}\n`
      }
    })
    
    text += `\nยอดขายรวมทั้งหมด ${grandTotal.toLocaleString()}\n`
    return text
  }, [date, employee, pages, lines, productStats, grandTotal])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-zinc-800 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-yellow-100 pb-8">
          <div>
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-800">DAILY REPORT</h1>
            <p className="text-zinc-400 font-medium">จัดการออเดอร์และแยกสินค้าแบบมืออาชีพค่ะ</p>
          </div>
          <button 
            onClick={() => { navigator.clipboard.writeText(summaryText); alert("คัดลอกแล้ว ✨") }}
            className="bg-yellow-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-yellow-100 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Copy size={20} /> คัดลอกรายงาน
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={date} onChange={e => setDate(e.target.value)} placeholder="วันที่..." className="p-4 bg-white border border-yellow-100 rounded-2xl outline-none focus:border-yellow-400 shadow-sm" />
          <input value={employee} onChange={e => setEmployee(e.target.value)} placeholder="พนักงาน..." className="p-4 bg-white border border-yellow-100 rounded-2xl outline-none focus:border-yellow-400 shadow-sm" />
        </div>

        {/* Page Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2"><span className="w-1.5 h-6 bg-yellow-400 rounded-full"></span> ยอดจากเพจ</h2>
            <button onClick={() => setPages([...pages, createItem("เพจใหม่")])} className="text-yellow-600 font-bold flex items-center gap-1 hover:bg-yellow-50 px-4 py-2 rounded-xl transition-all">
              <Plus size={18} /> เพิ่มเพจ
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pages.map(item => (
              <ReportCard 
                key={item.id} 
                item={item} 
                onDelete={() => setPages(pages.filter(p => p.id !== item.id))}
                onUpdate={(newItem) => setPages(pages.map(p => p.id === item.id ? newItem : p))}
              />
            ))}
          </div>
        </div>

        {/* Line Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2"><span className="w-1.5 h-6 bg-zinc-400 rounded-full"></span> ยอดจากไลน์</h2>
            <button onClick={() => setLines([...lines, createItem("ไลน์ใหม่")])} className="text-zinc-500 font-bold flex items-center gap-1 hover:bg-zinc-50 px-4 py-2 rounded-xl transition-all">
              <Plus size={18} /> เพิ่มไลน์
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lines.map(item => (
              <LineCard 
                key={item.id} 
                item={item} 
                onDelete={() => setLines(lines.filter(l => l.id !== item.id))}
                onUpdate={(newItem) => setLines(lines.map(l => l.id === item.id ? newItem : l))}
              />
            ))}
          </div>
        </div>

        {/* Preview Area */}
        <div className="bg-white border-2 border-yellow-50 rounded-[2.5rem] p-8 shadow-xl shadow-yellow-100/20">
          <h3 className="text-xl font-bold text-yellow-800 mb-4">Preview</h3>
          <pre className="p-6 bg-yellow-50/30 rounded-3xl text-sm font-mono text-zinc-600 whitespace-pre-wrap border border-yellow-50/50">
            {summaryText}
          </pre>
        </div>

      </div>
    </main>
  )
}

function ReportCard({ item, onUpdate, onDelete }: { item: ReportItem, onUpdate: (item: ReportItem) => void, onDelete: () => void }) {
  const [selectedProd, setSelectedProd] = useState(PRODUCT_LIST[0].name)
  const [priceInput, setPriceInput] = useState("")

  const addOrder = (type: 'buyOrders' | 'reOrders') => {
    const price = priceInput === "" ? (PRODUCT_LIST.find(p => p.name === selectedProd)?.defaultPrice || 0) : Number(priceInput)
    onUpdate({
      ...item,
      [type]: [...item[type], { productName: selectedProd, price }]
    })
    setPriceInput("")
  }

  const removeOrder = (type: 'buyOrders' | 'reOrders', index: number) => {
    onUpdate({
      ...item,
      [type]: item[type].filter((_, i) => i !== index)
    })
  }

  return (
    <div className="bg-white border border-yellow-100 rounded-[2rem] p-6 shadow-sm flex flex-col space-y-6">
      <div className="flex gap-2">
        <input value={item.name} onChange={e => onUpdate({...item, name: e.target.value})} className="flex-1 bg-yellow-50/50 border-none rounded-2xl p-3 font-bold text-yellow-900 outline-none focus:ring-2 ring-yellow-200" />
        <button onClick={onDelete} className="p-3 text-red-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        {["talk", "noTalk", "ghost", "follow", "calls", "comeback"].map((f) => (
          <div key={f} className="bg-zinc-50 p-2 rounded-xl flex flex-col items-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">{f === 'talk' ? 'คุย' : f === 'noTalk' ? 'ไม่คุย' : f === 'ghost' ? 'ผี' : f === 'follow' ? 'ตาม' : f === 'calls' ? 'โทร' : 'กลับ'}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => onUpdate({...item, [f]: Math.max(0, (item[f as keyof ReportItem] as number) - 1)})} className="text-zinc-300">-</button>
              <span className="font-bold text-sm">{item[f as keyof ReportItem] as number}</span>
              <button onClick={() => onUpdate({...item, [f]: (item[f as keyof ReportItem] as number) + 1})} className="text-yellow-600">+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Entry */}
      <div className="bg-zinc-50/50 p-4 rounded-2xl space-y-3">
        <div className="flex flex-col gap-2">
          <select value={selectedProd} onChange={e => setSelectedProd(e.target.value)} className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold outline-none">
            {PRODUCT_LIST.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
          <div className="flex gap-2">
            <input type="number" value={priceInput} onChange={e => setPriceInput(e.target.value)} placeholder="ใส่ยอดขาย..." className="flex-1 p-2.5 rounded-xl border border-zinc-200 bg-white text-xs outline-none" />
            <button onClick={() => addOrder('buyOrders')} className="bg-zinc-800 text-white px-4 rounded-xl text-xs font-bold hover:bg-black">ทักซื้อ</button>
            <button onClick={() => addOrder('reOrders')} className="bg-white border border-zinc-200 text-zinc-600 px-4 rounded-xl text-xs font-bold hover:bg-zinc-100">Re</button>
          </div>
        </div>

        {/* Order Chips */}
        <div className="space-y-2 pt-2 border-t border-zinc-100">
          <p className="text-[10px] font-bold text-zinc-400">รายการที่เพิ่มแล้ว (คลิกเพื่อลบ):</p>
          <div className="flex flex-wrap gap-1.5">
            {item.buyOrders.map((o, i) => (
              <button key={i} onClick={() => removeOrder('buyOrders', i)} className="text-[9px] bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg font-bold flex items-center gap-1">
                {o.productName} ({o.price.toLocaleString()}) <X size={10}/>
              </button>
            ))}
            {item.reOrders.map((o, i) => (
              <button key={i} onClick={() => removeOrder('reOrders', i)} className="text-[9px] bg-zinc-200 text-zinc-600 px-2 py-1 rounded-lg font-bold flex items-center gap-1">
                RE: {o.productName} ({o.price.toLocaleString()}) <X size={10}/>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LineCard({ item, onUpdate, onDelete }: { item: ReportItem, onUpdate: (item: ReportItem) => void, onDelete: () => void }) {
  const [selectedProd, setSelectedProd] = useState(PRODUCT_LIST[0].name)
  const [priceInput, setPriceInput] = useState("")

  return (
    <div className="bg-white border border-zinc-100 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex gap-2">
        <input value={item.name} onChange={e => onUpdate({...item, name: e.target.value})} className="flex-1 bg-zinc-50 border-none rounded-xl p-2 font-bold text-sm outline-none" />
        <button onClick={onDelete} className="text-zinc-200 hover:text-red-400"><Trash2 size={16}/></button>
      </div>
      <div className="space-y-2">
        <select value={selectedProd} onChange={e => setSelectedProd(e.target.value)} className="w-full p-2 bg-white border border-zinc-100 rounded-xl text-[10px] font-bold outline-none">
          {PRODUCT_LIST.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
        </select>
        <div className="flex gap-2">
          <input type="number" value={priceInput} onChange={e => setPriceInput(e.target.value)} placeholder="ยอด..." className="flex-1 p-2 bg-zinc-50 rounded-xl text-[10px] outline-none" />
          <button onClick={() => {
             const price = priceInput === "" ? (PRODUCT_LIST.find(p => p.name === selectedProd)?.defaultPrice || 0) : Number(priceInput)
             onUpdate({...item, buyOrders: [...item.buyOrders, { productName: selectedProd, price }]})
             setPriceInput("")
          }} className="bg-yellow-400 text-yellow-900 px-3 rounded-xl text-[10px] font-bold">+</button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {item.buyOrders.map((o, i) => (
          <button key={i} onClick={() => onUpdate({...item, buyOrders: item.buyOrders.filter((_, idx) => idx !== i)})} className="text-[8px] bg-zinc-100 p-1 rounded-md flex items-center gap-1">
            {o.productName} ({o.price}) <X size={8}/>
          </button>
        ))}
      </div>
      <div className="text-right pt-2 border-t border-zinc-50">
        <span className="text-[10px] font-bold text-zinc-400">TOTAL: </span>
        <span className="text-sm font-black text-zinc-800">{item.buyOrders.reduce((s,o) => s + o.price, 0).toLocaleString()}</span>
      </div>
    </div>
  )
}