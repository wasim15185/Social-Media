"use client"

import { PostItem } from "./type/search"

type Props = {
  item: PostItem
}

export function SearchPostItem({ item }: Props) {
  return (
    <div className="group flex w-full flex-col gap-2">
      {/* Content */}
      <p className="line-clamp-2 text-sm leading-snug font-medium">
        {item.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="opacity-70">View post</span>

        <span className="translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
          →
        </span>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-primary/5 opacity-0 transition group-hover:opacity-100" />
    </div>
  )
}
