import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function LeftSidebar() {
  return (
    <Card className="space-y-4 p-4">
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>WA</AvatarFallback>
        </Avatar>

        <h2 className="mt-2 font-semibold">Wasim Akram</h2>

        <p className="text-sm text-muted-foreground">Full Stack Developer</p>
      </div>

      <div className="space-y-1 text-sm">
        <p>Followers: 120</p>
        <p>Following: 80</p>
        <p>Saved Posts</p>
      </div>
    </Card>
  )
}
