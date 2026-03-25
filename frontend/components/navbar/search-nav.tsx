import React from "react"
import { Button } from "../ui/button"
import { SearchIcon } from "lucide-react"
import { SearchCommand } from "./search/search-command"

const SearchNav = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.preventDefault()
          setOpen(!open)
        }}
      >
        <SearchIcon size={18} />
      </Button>
      <SearchCommand open={open} setOpen={setOpen} />
    </>
  )
}

export default SearchNav
