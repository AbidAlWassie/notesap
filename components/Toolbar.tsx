// components/Toolbar.tsx
import { Editor } from "@tiptap/react"
import { useEffect, useRef, useState } from "react"
import {
  FaBold,
  FaChevronDown,
  FaHighlighter,
  FaItalic,
  FaLink,
  FaList,
  FaPalette,
  FaUnderline,
} from "react-icons/fa"

import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuList,
  LuListOrdered,
  LuPilcrow,
} from "react-icons/lu"

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [openInNewTab, setOpenInNewTab] = useState(false)
  const linkModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editor) return
  }, [editor])

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const applyHeading = (level: number) => {
    editor
      ?.chain()
      .focus()
      .toggleHeading({ level: level as 1 | 2 | 3 })
      .run()
    setIsDropdownOpen(false)
  }
  const applyList = (listType: string) => {
    switch (listType) {
      case "bullet":
        editor?.chain().focus().toggleBulletList().run()
        break
      case "ordered":
        editor?.chain().focus().toggleOrderedList().run()
        break
      default:
        editor?.chain().focus().setParagraph().run()
    }
    setIsDropdownOpen(false)
  }

  const handleSetLink = () => {
    const attributes = openInNewTab
      ? { href: linkUrl, target: "_blank" }
      : { href: linkUrl }
    editor?.chain().focus().setLink(attributes).run()
    setIsLinkModalOpen(false)
    setLinkUrl("")
    setOpenInNewTab(false)
  }

  const handleHighlight = (e: React.ChangeEvent<HTMLInputElement>) => {
    editor?.chain().focus().toggleHighlight({ color: e.target.value }).run()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        linkModalRef.current &&
        !linkModalRef.current.contains(event.target as Node)
      ) {
        setIsLinkModalOpen(false)
      }
    }

    if (isLinkModalOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isLinkModalOpen])

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-t-md border-b border-gray-700 bg-gray-800/50 p-2">
      <div className="relative">
        <button
          type="button"
          onClick={toggleDropdown}
          className="flex items-center rounded-md bg-gray-700 p-2 text-gray-100 hover:bg-gray-600"
        >
          <FaList /> <FaChevronDown className="ml-1" />
        </button>
        {isDropdownOpen && (
          <div className="absolute z-10 mt-2 w-48 rounded-md border border-gray-700 bg-gray-800 shadow-lg">
            <button
              type="button"
              onClick={() => applyHeading(1)}
              className="flex w-full flex-row items-center px-4 py-2 text-left text-gray-100 hover:bg-gray-600"
            >
              <LuHeading1 className="mr-2 text-xl" /> Heading 1
            </button>
            <button
              type="button"
              onClick={() => applyHeading(2)}
              className="flex w-full flex-row items-center px-4 py-2 text-left text-gray-100 hover:bg-gray-600"
            >
              <LuHeading2 className="mr-2 text-xl" /> Heading 2
            </button>
            <button
              type="button"
              onClick={() => applyHeading(3)}
              className="flex w-full flex-row items-center px-4 py-2 text-left text-gray-100 hover:bg-gray-600"
            >
              <LuHeading3 className="mr-2 text-xl" /> Heading 3
            </button>
            <button
              type="button"
              onClick={() => applyList("bullet")}
              className="flex w-full flex-row items-center px-4 py-2 text-left text-gray-100 hover:bg-gray-600"
            >
              <LuList className="mr-2 text-xl" /> Bullet list
            </button>
            <button
              type="button"
              onClick={() => applyList("ordered")}
              className="flex w-full flex-row items-center px-4 py-2 text-left text-gray-100 hover:bg-gray-600"
            >
              <LuListOrdered className="mr-2 text-xl" /> Numbered list
            </button>
            <button
              type="button"
              onClick={() => applyList("paragraph")}
              className="flex w-full flex-row items-center px-4 py-2 text-left text-gray-100 hover:bg-gray-600"
            >
              <LuPilcrow className="mr-2 text-xl" /> Paragraph
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleBold().run()}
        className={`rounded-md p-2 text-gray-100 hover:bg-gray-600 ${
          editor?.isActive("bold") ? "bg-gray-600" : ""
        }`}
      >
        <FaBold />
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        className={`rounded-md p-2 text-gray-100 hover:bg-gray-600 ${
          editor?.isActive("italic") ? "bg-gray-600" : ""
        }`}
      >
        <FaItalic />
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        className={`rounded-md p-2 text-gray-100 hover:bg-gray-600 ${
          editor?.isActive("underline") ? "bg-gray-600" : ""
        }`}
      >
        <FaUnderline />
      </button>

      {/* Color Picker */}
      <div className="flex w-10 flex-row items-center justify-center">
        <FaPalette className="pointer-events-none absolute mx-4 text-gray-200" />
        <input
          type="color"
          onChange={(e) =>
            editor?.chain().focus().setColor(e.target.value).run()
          }
          className="cursor-pointer rounded-md bg-gray-700 px-[5px] pt-[11px]"
          title="Text Color"
        />
      </div>

      {/* Highlight Picker */}
      <div className="flex w-10 flex-row items-center justify-center">
        <FaHighlighter className="pointer-events-none absolute mx-4 text-gray-200" />
        <input
          type="color"
          onChange={handleHighlight}
          className="cursor-pointer rounded-md bg-gray-700 px-[5px] pt-[11px]"
          title="Text Highlight"
        />
      </div>

      <button
        type="button"
        onClick={() => setIsLinkModalOpen(true)}
        className="rounded-md p-2 text-gray-100 hover:bg-gray-600"
        title="Add Link"
      >
        <FaLink />
      </button>

      {isLinkModalOpen && (
        <div
          ref={linkModalRef}
          className="absolute z-10 mt-2 w-60 rounded-md border border-gray-700 bg-gray-800 p-4 shadow-lg"
        >
          <div className="flex flex-row">
            <div className="mb-2 rounded-md rounded-r-none border border-r-0 border-gray-700 bg-gray-900 p-3 text-gray-100">
              <FaLink />
            </div>
            <input
              type="text"
              placeholder="Enter URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="mb-2 w-full rounded-md rounded-l-none border border-l-0 border-gray-700 bg-gray-900 p-2 text-gray-100 focus:outline-none"
            />
          </div>

          <label className="mb-2 flex items-center space-x-2">
            <input
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="form-checkbox bg-gray-900 text-gray-600"
            />
            <span className="text-gray-100">Open in new tab</span>
          </label>
          <button
            type="button"
            onClick={handleSetLink}
            className="w-full rounded-md bg-purple-600 p-2 text-gray-100 hover:bg-purple-700"
          >
            Set Link
          </button>
        </div>
      )}
    </div>
  )
}

export default Toolbar
