import { Card } from "@/components/ui/card"

export function StoryBar() {
  return (
    <Card className="p-4">
      <div className="flex gap-4 overflow-x-auto ">
        {[1, 2, 3, 4, 5].map((story) => (
          <div key={story} className="flex flex-col items-center">
            <img src="/avatar.png" className="h-14 w-14 rounded-full border" />

            <span className="text-xs">User</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
