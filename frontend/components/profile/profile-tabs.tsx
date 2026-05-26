"use client"

type Tab = "posts" | "photos" | "saved"

type Props = {
  tab: Tab
  setTab: (t: Tab) => void
}

export function ProfileTabs({ tab, setTab }: Props) {
  const tabs: Tab[] = ["posts", "photos", "saved"]

  return (
    <div className="flex gap-2 border-b pb-3">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`rounded-full px-4 py-1 text-sm capitalize ${
            tab === t
              ? "bg-primary text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
