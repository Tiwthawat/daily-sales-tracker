type Props = {
  label: string
  value: number
  onDecrease: () => void
  onIncrease: () => void
}

export default function CounterInput({
  label,
  value,
  onDecrease,
  onIncrease,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>

      <div className="flex items-center gap-3">
        <button
          onClick={onDecrease}
          className="w-8 h-8 border rounded-lg"
        >
          -
        </button>

        <span className="w-6 text-center">
          {value}
        </span>

        <button
          onClick={onIncrease}
          className="w-8 h-8 border rounded-lg"
        >
          +
        </button>
      </div>
    </div>
  )
}