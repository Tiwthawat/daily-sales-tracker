"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Copy,
  Plus,
  Trash2,
  X,
  Store,
  ClipboardCheck,
  MessageCircle,
  RotateCcw,
} from "lucide-react"

// --- Configuration ---
const PRODUCT_LIST = [
  { name: "Beta Liv Pro Plus ❤️", defaultPrice: 0 },
  { name: "Beta X+ 💚", defaultPrice: 0 },
  { name: "Beta Oil 💛", defaultPrice: 0 },
  { name: "Beta Herb 💜", defaultPrice: 0 },
  { name: "Beta Life 🤎", defaultPrice: 0 },
  { name: "Beta Cal Pro Plus 🤍", defaultPrice: 0 },
  { name: "Lab Farm 🧪", defaultPrice: 0 },
  { name: "Abbie 💛", defaultPrice: 0 },
  { name: "Beta E 👁️", defaultPrice: 0 },
]

type OrderDetail = {
  productName: string
  price: number
}

type OrderType = "buyOrders" | "reOrders" | "followOrders" | "callOrders"

type ReportItem = {
  id: string
  name: string
  talk: number
  noTalk: number
  ghost: number
  comeback: number
  buyOrders: OrderDetail[]
  reOrders: OrderDetail[]
  followOrders: OrderDetail[]
  callOrders: OrderDetail[]
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [date, setDate] = useState("")
  const [employee, setEmployee] = useState("")
  const [pages, setPages] = useState<ReportItem[]>([])
  const [lines, setLines] = useState<ReportItem[]>([])

  const createItem = (name = "เพจใหม่"): ReportItem => ({
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    name,
    talk: 0,
    noTalk: 0,
    ghost: 0,
    comeback: 0,
    buyOrders: [],
    reOrders: [],
    followOrders: [],
    callOrders: [],
  })

  // Load Data
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("daily-report-v3")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const sanitize = (list: any[]) => (list || []).map(item => ({
          ...createItem(item.name),
          ...item,
          buyOrders: item.buyOrders || [],
          reOrders: item.reOrders || [],
          followOrders: item.followOrders || [],
          callOrders: item.callOrders || []
        }))
        setDate(parsed.date || "")
        setEmployee(parsed.employee || "")
        setPages(sanitize(parsed.pages))
        setLines(sanitize(parsed.lines))
      } catch (e) { console.error(e) }
    }
  }, [])

  // Save Data
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("daily-report-v3", JSON.stringify({ date, employee, pages, lines }))
  }, [mounted, date, employee, pages, lines])

  // ฟังก์ชันรีเซ็ตยอดวันใหม่ (เก็บโครงสร้างเพจไว้)
  const resetDailyData = () => {
    if (confirm("ต้องการรีเซ็ตตัวเลขและออเดอร์ทั้งหมดใช่ไหมคะ? (รายชื่อเพจจะยังอยู่ค่ะ)")) {
      const reset = (item: ReportItem): ReportItem => ({
        ...item,
        talk: 0, noTalk: 0, ghost: 0, comeback: 0,
        buyOrders: [], reOrders: [], followOrders: [], callOrders: []
      })
      setPages(pages.map(reset))
      setLines(lines.map(reset))
      setDate("")
      alert("รีเซ็ตเรียบร้อยแล้วค่ะ")
    }
  }

  const productStats = useMemo(() => {
    const stats: Record<string, { count: number; total: number }> = {}
    const allItems = [...pages, ...lines]
    allItems.forEach((item) => {
      const allOrders = [...item.buyOrders, ...item.reOrders, ...item.followOrders, ...item.callOrders]
      allOrders.forEach((order) => {
        if (!stats[order.productName]) stats[order.productName] = { count: 0, total: 0 }
        stats[order.productName].count += 1
        stats[order.productName].total += order.price
      })
    })
    return stats
  }, [pages, lines])

  const summaryText = useMemo(() => {
    let text = `${date} ${employee}\n\n`
    pages.forEach((item) => {
      const bT = item.buyOrders.reduce((s, o) => s + o.price, 0)
      const rT = item.reOrders.reduce((s, o) => s + o.price, 0)
      const fT = item.followOrders.reduce((s, o) => s + o.price, 0)
      const cT = item.callOrders.reduce((s, o) => s + o.price, 0)
      const chats = item.talk + item.noTalk + item.ghost

      text += `เพจ ${item.name}\n`
      text += `ทักคุย = ${item.talk}\nไม่คุย = ${item.noTalk}\nทักผี = ${item.ghost}\n`
      text += `ทักซื้อ = ${item.buyOrders.length}/${bT}\nตาม = ${item.followOrders.length}/${fT}\n`
      text += `โทร = ${item.callOrders.length}/${cT}\nRe = ${item.reOrders.length}/${rT}\n`
      text += `รวมทัก = ${chats}\nตามกลับมาคุย = ${item.comeback}\n`
      text += `ยอดขาย ${bT + rT + fT + cT}\n\n`
    })

    if (lines.length > 0) {
      text += `--- ยอดจากไลน์ ---\n`
      lines.forEach(item => {
        const total = item.buyOrders.reduce((s, o) => s + o.price, 0)
        text += `${item.name} = ${total.toLocaleString()}\n`
      })
      text += `\n`
    }

    text += `--- สรุปยอดแยกสินค้า ---\n`
    Object.entries(productStats).forEach(([name, data]) => {
      if (data.count > 0) text += `${name}: ${data.count} ออเดอร์ = ${data.total.toLocaleString()}\n`
    })

    const grandTotal = Object.values(productStats).reduce((s, d) => s + d.total, 0)
    text += `\nยอดขายรวมทั้งหมด ${grandTotal.toLocaleString()}\n`
    return text
  }, [date, employee, pages, lines, productStats])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-[#FDFCF8] text-zinc-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-zinc-100">
          <div>
            <h1 className="text-4xl font-black italic">DAILY REPORT</h1>
            <p className="text-zinc-400">จัดการยอดขายประจำวัน</p>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button onClick={resetDailyData} className="flex-1 md:flex-none px-6 py-4 rounded-2xl font-bold text-zinc-400 hover:text-orange-500 hover:bg-orange-50 transition-all flex gap-2 items-center justify-center">
              <RotateCcw size={20} /> รีเซ็ตยอดวันใหม่
            </button>
            <button onClick={() => { navigator.clipboard.writeText(summaryText); alert("คัดลอกแล้วค่ะ") }} className="flex-[2] md:flex-none bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-2xl font-bold flex gap-2 items-center justify-center shadow-lg shadow-yellow-100 transition-all">
              <Copy size={20} /> คัดลอกรายงาน
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={date} onChange={e => setDate(e.target.value)} placeholder="วันที่ (เช่น 11/05/26)" className="p-4 rounded-2xl border bg-white outline-none focus:ring-2 focus:ring-yellow-400" />
          <input value={employee} onChange={e => setEmployee(e.target.value)} placeholder="ชื่อพนักงาน" className="p-4 rounded-2xl border bg-white outline-none focus:ring-2 focus:ring-yellow-400" />
        </div>

        {/* เพจ Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-bold flex gap-2 items-center"><Store /> ยอดจากเพจ</h2>
            <button onClick={() => setPages([...pages, createItem()])} className="bg-zinc-900 text-white px-4 py-2 rounded-xl flex gap-2 items-center hover:bg-zinc-800 transition-all text-sm">
              <Plus size={18} /> เพิ่มเพจ
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pages.map(item => (
              <ReportCard key={item.id} item={item} onDelete={() => setPages(pages.filter(p => p.id !== item.id))} onUpdate={(n) => setPages(pages.map(p => p.id === item.id ? n : p))} />
            ))}
          </div>
        </div>

        {/* ไลน์ Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-bold flex gap-2 items-center"><MessageCircle /> ยอดจากไลน์</h2>
            <button onClick={() => setLines([...lines, createItem("ไลน์ใหม่")])} className="bg-green-600 text-white px-4 py-2 rounded-xl flex gap-2 items-center hover:bg-green-700 transition-all text-sm">
              <Plus size={18} /> เพิ่มไลน์
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lines.map(item => (
              <LineCard key={item.id} item={item} onDelete={() => setLines(lines.filter(l => l.id !== item.id))} onUpdate={(n) => setLines(lines.map(l => l.id === item.id ? n : l))} />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white border rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="font-bold mb-4 text-zinc-400 flex items-center gap-2"><ClipboardCheck /> Preview ก่อนส่ง</h3>
          <pre className="p-6 bg-zinc-50 rounded-3xl text-sm font-mono whitespace-pre-wrap border border-zinc-100">{summaryText}</pre>
        </div>
      </div>
    </main>
  )
}

function ReportCard({ item, onUpdate, onDelete }: { item: ReportItem, onUpdate: (item: ReportItem) => void, onDelete: () => void }) {
  const [selectedProd, setSelectedProd] = useState(PRODUCT_LIST[0].name)
  const [priceInput, setPriceInput] = useState("")

  const addOrder = (type: OrderType) => {
    const price = priceInput === "" ? (PRODUCT_LIST.find(p => p.name === selectedProd)?.defaultPrice || 0) : Number(priceInput)
    onUpdate({ ...item, [type]: [...(item[type] || []), { productName: selectedProd, price }] })
    setPriceInput("")
  }

  const removeOrderItem = (type: OrderType, index: number) => {
    onUpdate({ ...item, [type]: item[type].filter((_, i) => i !== index) })
  }

  return (
    <div className="bg-white border rounded-[2rem] p-6 space-y-6 shadow-sm">
      <div className="flex gap-2">
        <input value={item.name} onChange={e => onUpdate({ ...item, name: e.target.value })} className="flex-1 bg-zinc-50 rounded-2xl p-3 font-bold outline-none border-none" />
        <button onClick={onDelete} className="p-2 text-zinc-300 hover:text-red-500"><Trash2 size={20} /></button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {([["talk", "คุย"], ["noTalk", "ไม่คุย"], ["ghost", "ผี"], ["comeback", "กลับ"]] as const).map(([f, label]) => (
          <div key={f} className="bg-zinc-50 p-2 rounded-xl flex flex-col items-center border border-zinc-100">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">{label}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => onUpdate({ ...item, [f]: Math.max(0, item[f] - 1) })} className="px-1">-</button>
              <span className="font-bold text-sm">{item[f]}</span>
              <button onClick={() => onUpdate({ ...item, [f]: item[f] + 1 })} className="px-1 text-yellow-600">+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-50/50 p-4 rounded-2xl space-y-3">
        <select value={selectedProd} onChange={e => setSelectedProd(e.target.value)} className="w-full p-2.5 rounded-xl border bg-white text-xs font-bold outline-none">
          {PRODUCT_LIST.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
        </select>
        <div className="grid grid-cols-5 gap-2">
          <input type="number" value={priceInput} onChange={e => setPriceInput(e.target.value)} placeholder="ยอด..." className="col-span-2 p-2.5 rounded-xl border bg-white text-xs outline-none" />
          <button onClick={() => addOrder('buyOrders')} className="bg-zinc-800 text-white rounded-xl text-[10px] font-bold">ทักซื้อ</button>
          <button onClick={() => addOrder('followOrders')} className="bg-yellow-400 text-black rounded-xl text-[10px] font-bold">ตาม</button>
          <button onClick={() => addOrder('callOrders')} className="bg-green-600 text-white rounded-xl text-[10px] font-bold">โทร</button>
        </div>
        <button onClick={() => addOrder('reOrders')} className="w-full py-2 border border-dashed border-zinc-200 rounded-xl text-[10px] text-zinc-400 hover:bg-white font-bold transition-all">+ เพิ่มยอด RE</button>

        <div className="space-y-2 pt-2 border-t border-zinc-100">
          <p className="text-[10px] font-bold text-zinc-400">รายการ (กดเพื่อลบ):</p>
          <div className="flex flex-wrap gap-1.5">
            {item.buyOrders.map((o, i) => (
              <button key={`b-${i}`} onClick={() => removeOrderItem('buyOrders', i)} className="text-[9px] bg-zinc-900 text-white px-2 py-1 rounded-lg flex items-center gap-1">ซื้อ: {o.price} <X size={8}/></button>
            ))}
            {item.followOrders.map((o, i) => (
              <button key={`f-${i}`} onClick={() => removeOrderItem('followOrders', i)} className="text-[9px] bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg flex items-center gap-1 border border-yellow-200">ตาม: {o.price} <X size={8}/></button>
            ))}
            {item.callOrders.map((o, i) => (
              <button key={`c-${i}`} onClick={() => removeOrderItem('callOrders', i)} className="text-[9px] bg-green-100 text-green-800 px-2 py-1 rounded-lg flex items-center gap-1 border border-green-200">โทร: {o.price} <X size={8}/></button>
            ))}
            {item.reOrders.map((o, i) => (
              <button key={`r-${i}`} onClick={() => removeOrderItem('reOrders', i)} className="text-[9px] bg-zinc-100 text-zinc-500 px-2 py-1 rounded-lg flex items-center gap-1">RE: {o.price} <X size={8}/></button>
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

  const addOrder = () => {
    const price = priceInput === "" ? (PRODUCT_LIST.find(p => p.name === selectedProd)?.defaultPrice || 0) : Number(priceInput)
    onUpdate({ ...item, buyOrders: [...item.buyOrders, { productName: selectedProd, price }] })
    setPriceInput("")
  }

  return (
    <div className="bg-white border border-zinc-100 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex gap-2">
        <input value={item.name} onChange={e => onUpdate({ ...item, name: e.target.value })} className="flex-1 bg-zinc-50 border-none rounded-xl p-2 font-bold text-sm outline-none" />
        <button onClick={onDelete} className="text-zinc-200 hover:text-red-400"><Trash2 size={16} /></button>
      </div>
      <div className="space-y-2">
        <select value={selectedProd} onChange={e => setSelectedProd(e.target.value)} className="w-full p-2 border border-zinc-100 rounded-xl text-[10px] font-bold outline-none">
          {PRODUCT_LIST.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
        </select>
        <div className="flex gap-2">
          <input type="number" value={priceInput} onChange={e => setPriceInput(e.target.value)} placeholder="ยอด..." className="flex-1 p-2 bg-zinc-50 rounded-xl text-[10px] outline-none" />
          <button onClick={addOrder} className="bg-yellow-400 text-yellow-900 px-3 rounded-xl text-[10px] font-bold">+</button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {item.buyOrders.map((o, i) => (
          <button key={i} onClick={() => onUpdate({...item, buyOrders: item.buyOrders.filter((_, idx) => idx !== i)})} className="text-[8px] bg-zinc-100 p-1 rounded-md border border-zinc-200 flex items-center gap-1">
            {o.price} <X size={8}/>
          </button>
        ))}
      </div>
      <div className="text-right pt-2 border-t border-zinc-50 font-black text-zinc-800">
        TOTAL: {item.buyOrders.reduce((s, o) => s + o.price, 0).toLocaleString()}
      </div>
    </div>
  )
}