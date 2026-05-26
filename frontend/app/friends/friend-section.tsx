import { cn } from "@/lib/utils/utils"
import { FriendCard } from "./friend-card"
import { FriendUser } from "./types/friend"

type Props = {
  className?: string
  title: string
  users: FriendUser[]
  loading: boolean
}

export function FriendSection({ title, users, loading, className }: Props) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">{title}</h2>
        <span className="text-sm text-muted-foreground">
          {users.length} users
        </span>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-lg border p-6 text-center text-muted-foreground">
          Sorry!
          <span className="mx-1 font-semibold text-red-700 capitalize">
            No {title}
          </span>
          found
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {users.map((user) => (
            <FriendCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </section>
  )
}
