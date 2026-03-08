"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Underline as UnderlineIcon,
  Undo,
  Redo,
  Type,
} from "lucide-react";
import { AIRewriteButton } from "@/components/admin/ai-rewrite-button";
import { useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

const MenuButton = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
}: {
  onClick: (e: React.MouseEvent) => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "p-2 rounded-md transition-all duration-200 flex items-center justify-center hover:bg-gold/10 hover:text-gold",
      isActive ? "bg-gold/20 text-gold" : "text-muted-foreground",
      disabled && "opacity-50 cursor-not-allowed",
    )}
  >
    {children}
  </button>
);

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  className,
  error,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-gold underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4",
          "prose-p:my-1 prose-headings:font-serif prose-headings:text-gold",
          "prose-ul:list-disc prose-ol:list-decimal",
        ),
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 bg-background overflow-hidden transition-all duration-300 focus-within:border-gold/50 focus-within:ring-1 focus-within:ring-gold/20 shadow-sm",
        error && "border-destructive",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1 border-b border-border/40 bg-muted/20">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </MenuButton>

        <div className="w-px h-6 bg-border/50 mx-1" />

        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Type className="h-4 w-4 text-xs font-bold" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </MenuButton>

        <div className="w-px h-6 bg-border/50 mx-1" />

        <MenuButton
          onClick={addLink}
          isActive={editor.isActive("link")}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </MenuButton>

        <div className="w-px h-6 bg-border/50 mx-1" />

        <AIRewriteButton
          text={editor.getHTML()}
          onRewrite={(newText) => {
            editor.commands.setContent(newText);
          }}
          className="hover:bg-gold/10 hover:text-gold"
        />

        <div className="grow" />

        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </MenuButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
