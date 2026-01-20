import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
// To add more features like Underline, you'll need to install and import them:
// import Underline from '@tiptap/extension-underline';

// --- Toolbar Component ---
// This component renders the buttons and interacts with the editor instance.
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  // A helper function for a reusable button
  const EditorButton = ({ onClick, isActive, icon, title, disabled = false }) => (
    <button
      type="button" // Important to prevent form submission
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors text-sm font-medium ${
        isActive ? 'bg-gray-700 text-white' : 'text-gray-600 hover:bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 border-b p-2 rounded-t-lg bg-gray-100">
      <EditorButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={<span className="font-bold">B</span>}
        title="Bold (Ctrl+B)"
      />
      <EditorButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={<span className="italic">I</span>}
        title="Italic (Ctrl+I)"
      />
      <EditorButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={<span className="line-through">S</span>}
        title="Strikethrough"
      />
      <EditorButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        icon={<u>U</u>}
        title="Underline"
      />
      
      
      <span className="w-px h-6 bg-gray-300 mx-1" aria-hidden="true" />
      
      <EditorButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={<span>&#8226; List</span>}
        title="Bullet List"
      />
      <EditorButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={<span>1. List</span>}
        title="Ordered List"
      />

      {/* Add more buttons here for other StarterKit features like Blockquote, Code Block, etc. */}
    </div>
  );
};


// --- Main TextEditor Component ---
const TextEditor = ({ initialContent, onChange }) => {
  const editor = useEditor({
    extensions: [
      // StarterKit provides the basic set of features (H1-H6, P, Bold, Italic, Lists, etc.)
      StarterKit,
      // If you install Underline, uncomment this:
      // Underline, 
    ],
    content: initialContent, 
    
    // Capture content on every change
    onUpdate: ({ editor }) => {
      // Get the final HTML string
      const htmlContent = editor.getHTML();
      onChange(htmlContent); 
    },
    
    // Editor properties for general styling/behavior (Optional)
    editorProps: {
      attributes: {
        // Apply the base class for Tiptap content
        class: 'focus:outline-none',
      },
    },
  });

  return (
    <div className="border border-gray-300 rounded-lg shadow-sm">
      <MenuBar editor={editor} />
      
      {/* The 'prose' class from the @tailwindcss/typography plugin 
        styles the raw HTML output (H1, P, UL, LI, etc.). 
      */}
      <div className="prose max-w-none p-4 min-h-[150px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TextEditor;