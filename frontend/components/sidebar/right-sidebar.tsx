import { Card } from "@/components/ui/card"

export function RightSidebar() {
  return (
    <Card className="space-y-4 p-4">
      <h3 className="font-semibold">Trending</h3>

      <div className="space-y-2 text-sm">
        <p>#nextjs</p>
        <p>#webdevelopment</p>
        <p>#react</p>
        <p>#opensource</p>
      </div>
    </Card>
  )
}
