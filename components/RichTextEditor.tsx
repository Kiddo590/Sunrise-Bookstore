'use client'

import { useEffect, useRef } from 'react'
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Indent,
  Italic,
  Link,
  List,
  ListOrdered,
  Outdent,
  Pilcrow,
  Quote,
  Redo2,
  Undo2,
} from 'lucide-react'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
  /** Bold/Italic/Undo/Redo only — for short fields like a hero slide heading. */
  compact?: boolean
}

type CommandButton = {
  label: string
  icon: React.ComponentType<{ size?: number }>
  command: string
  value?: string
  /** Also shown in compact mode. */
  compact?: boolean
}

const commands: CommandButton[] = [
  { label: 'Bold', icon: Bold, command: 'bold', compact: true },
  { label: 'Italic', icon: Italic, command: 'italic', compact: true },
  { label: 'Link', icon: Link, command: 'createLink' },
  { label: 'Bulleted list', icon: List, command: 'insertUnorderedList' },
  { label: 'Numbered list', icon: ListOrdered, command: 'insertOrderedList' },
  { label: 'Outdent', icon: Outdent, command: 'outdent' },
  { label: 'Indent', icon: Indent, command: 'indent' },
  { label: 'Quote', icon: Quote, command: 'formatBlock', value: 'blockquote' },
  { label: 'Code block', icon: Code2, command: 'formatBlock', value: 'pre' },
  { label: 'Undo', icon: Undo2, command: 'undo', compact: true },
  { label: 'Redo', icon: Redo2, command: 'redo', compact: true },
]

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write a detailed description...',
  minHeight = 180,
  compact = false,
}: Props) {
  const visibleCommands = compact ? commands.filter(c => c.compact) : commands
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editorRef.current) return
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  function syncValue() {
    onChange(editorRef.current?.innerHTML ?? '')
  }

  function runCommand(command: string, commandValue?: string) {
    editorRef.current?.focus()
    if (command === 'createLink') {
      const url = window.prompt('Enter link URL')
      if (!url) return
      document.execCommand(command, false, url)
    } else {
      document.execCommand(command, false, commandValue)
    }
    syncValue()
  }

  function formatBlock(value: string) {
    runCommand('formatBlock', value)
  }

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    syncValue()
  }

  return (
    <div className="border border-line rounded-xl overflow-hidden bg-paper focus-within:border-rust">
      <div className="flex flex-wrap items-center gap-1 border-b border-line bg-paper2 px-2 py-2">
        {!compact && (
          <>
            <button
              type="button"
              title="Paragraph"
              onClick={() => formatBlock('p')}
              className="h-8 px-2 rounded border border-line bg-paper text-xs font-semibold text-ink hover:bg-white flex items-center gap-1"
            >
              <Pilcrow size={15} />
              Paragraph
            </button>
            <button
              type="button"
              title="Heading 1"
              onClick={() => formatBlock('h2')}
              className="h-8 w-8 rounded border border-line bg-paper text-ink hover:bg-white flex items-center justify-center"
            >
              <Heading1 size={16} />
            </button>
            <button
              type="button"
              title="Heading 2"
              onClick={() => formatBlock('h3')}
              className="h-8 w-8 rounded border border-line bg-paper text-ink hover:bg-white flex items-center justify-center"
            >
              <Heading2 size={16} />
            </button>
            <span className="h-8 w-px bg-line mx-1" />
          </>
        )}
        {visibleCommands.map(({ label, icon: Icon, command, value: commandValue }) => (
          <button
            key={label}
            type="button"
            title={label}
            onClick={() => runCommand(command, commandValue)}
            className="h-8 w-8 rounded border border-line bg-paper text-ink hover:bg-white flex items-center justify-center"
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-label={placeholder}
        data-placeholder={placeholder}
        onInput={syncValue}
        onBlur={syncValue}
        onPaste={handlePaste}
        className="rich-editor px-4 py-3 text-sm text-ink bg-paper focus:outline-none overflow-y-auto"
        style={{ minHeight }}
        suppressContentEditableWarning
      />
      <style jsx>{`
        .rich-editor:empty::before {
          content: attr(data-placeholder);
          color: #6d6d6d;
        }
        .rich-editor ul,
        .rich-editor ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .rich-editor blockquote {
          border-left: 3px solid #f68b1e;
          padding-left: 0.75rem;
          margin: 0.75rem 0;
          color: #6d6d6d;
        }
        .rich-editor pre {
          background: #f1f1f1;
          border: 1px solid #e0e0e0;
          border-radius: 0.5rem;
          padding: 0.75rem;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  )
}
