"use client"

import { useState } from "react"

type Props = {
  label: string

  orders: number[]

  onAddOrder: (
    amount: number
  ) => void
}

export default function OrderInput({
  label,
  orders,
  onAddOrder,
}: Props) {

  const [amount, setAmount] =
    useState("")
const handleAdd = () => {
  const value = Number(amount)

  if (!value) return

  onAddOrder(value)

  setAmount("")
}
const total = orders.reduce(
  (sum, order) => sum + order,
  0
)
  return (
    <div className="border rounded-xl p-4 space-y-3">

      <div className="flex items-center justify-between">

  <p className="font-bold">
    {label}
  </p>

  <p>
    {orders.length}/{total}
  </p>

</div>

      <div className="flex gap-2">

        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          placeholder="ใส่ยอด"
          className="flex-1 border rounded-lg px-3 py-2"
        />

        <button
  onClick={handleAdd}
  className="border rounded-lg px-4"
>
          เพิ่ม
        </button>

      </div>

    </div>
  )
}