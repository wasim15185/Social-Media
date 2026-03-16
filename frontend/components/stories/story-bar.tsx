export function StoryBar() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {[1, 2, 3, 4, 5].map((story) => (
        <div key={story} className="flex flex-col items-center">
          <img src="/avatar.png" className="h-14 w-14 rounded-full border" />

          <span className="text-xs">User</span>
        </div>
      ))}
    </div>
  )
}
