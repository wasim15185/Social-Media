import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function ProfileSidebar() {
  return (
    <div className="space-y-4">
      {/* PROFILE COMPLETION */}
      <Card className="p-4">
        <h3 className="mb-2 font-semibold">Complete Your Profile</h3>
        <Progress value={75} />
        <p className="mt-2 text-sm text-muted-foreground">75%</p>
      </Card>

      {/* ABOUT */}
      <Card className="space-y-2 p-4">
        <h3 className="font-semibold">About Me</h3>
        <p className="text-sm text-muted-foreground">
          "Pushing pixels and experiences in digital products"
        </p>

        <div className="space-y-1 text-sm text-muted-foreground">
          <p>📍 Yogyakarta, ID</p>
          <p>🌐 dribbble.com/fawait</p>
          <p>📅 Joined June 2012</p>
          <p>💼 Working at Sebo Studio</p>
        </div>
      </Card>
    </div>
  )
}
