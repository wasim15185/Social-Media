"use client"

import { UserItem } from "./type/search"
import Image from "next/image"

type Props = {
  item: UserItem
}

export function SearchUserItem({ item }: Props) {
  return (
    <div className="group flex w-full items-center gap-3">
      {/* Avatar */}
      <div className="relative">
        <Image
          height={44}
          width={44}
          alt={`${item.username}-image`}
          src={item.profileImage}
          className="rounded-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-primary"
        />

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 blur-md transition group-hover:opacity-100" />
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold tracking-tight">
          {item.username}
        </span>

        <span className="text-xs text-muted-foreground">View profile</span>
      </div>

      {/* Arrow */}
      <div className="ml-auto translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
        →
      </div>
    </div>
  )
}
