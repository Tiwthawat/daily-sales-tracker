import { ReactNode } from "react"

type Props = {
  title: string
  children: ReactNode
}

export default function ChannelCard({
  title,
  children,
}: Props) {
  return (
    <div className="border rounded-xl p-4 space-y-4">
      <h2 className="text-xl font-bold">
        {title}
      </h2>

      {children}
    </div>
  )
}