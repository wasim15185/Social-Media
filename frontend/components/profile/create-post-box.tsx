import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function CreatePostBox() {
  return (
    <Card className="flex items-center gap-3 p-4">
      <img src="/avatar.png" className="h-10 w-10 rounded-full" />

      <Input placeholder="What's on your mind?" className="rounded-full" />
    </Card>
  )
}
