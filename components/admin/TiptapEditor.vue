<template>
  <div class="tiptap-editor">
    <!-- Toolbar -->
    <div class="toolbar bg-gray-50 border border-gray-200 rounded-t-xl p-2 flex flex-wrap items-center gap-1">
      <!-- Text formatting -->
      <div class="flex items-center gap-1 pr-2 border-r border-gray-200">
        <button
          type="button"
          @click="editor?.chain().focus().toggleBold().run()"
          :class="['toolbar-btn', { 'is-active': editor?.isActive('bold') }]"
          title="ตัวหนา (Ctrl+B)"
        >
          <Icon name="lucide:bold" class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().toggleItalic().run()"
          :class="['toolbar-btn', { 'is-active': editor?.isActive('italic') }]"
          title="ตัวเอียง (Ctrl+I)"
        >
          <Icon name="lucide:italic" class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().toggleUnderline().run()"
          :class="['toolbar-btn', { 'is-active': editor?.isActive('underline') }]"
          title="ขีดเส้นใต้ (Ctrl+U)"
        >
          <Icon name="lucide:underline" class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().toggleStrike().run()"
          :class="['toolbar-btn', { 'is-active': editor?.isActive('strike') }]"
          title="ขีดทับ"
        >
          <Icon name="lucide:strikethrough" class="w-4 h-4" />
        </button>
      </div>

      <!-- Headings -->
      <div class="flex items-center gap-1 px-2 border-r border-gray-200">
        <button
          type="button"
          @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="['toolbar-btn', { 'is-active': editor?.isActive('heading', { level: 1 }) }]"
          title="หัวข้อ 1"
        >
          <span class="text-xs font-bold">H1</span>
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="['toolbar-btn', { 'is-active': editor?.isActive('heading', { level: 2 }) }]"
          title="หัวข้อ 2"
        >
          <span class="text-xs font-bold">H2</span>
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="['toolbar-btn', { 'is-active': editor?.isActive('heading', { level: 3 }) }]"
          title="หัวข้อ 3"
        >
          <span class="text-xs font-bold">H3</span>
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().setParagraph().run()"
          :class="['toolbar-btn', { 'is-active': editor?.isActive('paragraph') }]"
          title="ย่อหน้า"
        >
          <Icon name="lucide:pilcrow" class="w-4 h-4" />
        </button>
      </div>

      <!-- Lists -->
      <div class="flex items-center gap-1 px-2 border-r border-gray-200">
        <button
          type="button"
          @click="editor?.chain().focus().toggleBulletList().run()"
          :class="['toolbar-btn', { 'is-active': editor?.isActive('bulletList') }]"
          title="รายการแบบจุด"
        >
          <Icon name="lucide:list" class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().toggleOrderedList().run()"
          :class="['toolbar-btn', { 'is-active': editor?.isActive('orderedList') }]"
          title="รายการแบบตัวเลข"
        >
          <Icon name="lucide:list-ordered" class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().toggleBlockquote().run()"
          :class="['toolbar-btn', { 'is-active': editor?.isActive('blockquote') }]"
          title="อ้างอิง"
        >
          <Icon name="lucide:quote" class="w-4 h-4" />
        </button>
      </div>

      <!-- Alignment -->
      <div class="flex items-center gap-1 px-2 border-r border-gray-200">
        <button
          type="button"
          @click="editor?.chain().focus().setTextAlign('left').run()"
          :class="['toolbar-btn', { 'is-active': editor?.isActive({ textAlign: 'left' }) }]"
          title="ชิดซ้าย"
        >
          <Icon name="lucide:align-left" class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().setTextAlign('center').run()"
          :class="['toolbar-btn', { 'is-active': editor?.isActive({ textAlign: 'center' }) }]"
          title="กึ่งกลาง"
        >
          <Icon name="lucide:align-center" class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().setTextAlign('right').run()"
          :class="['toolbar-btn', { 'is-active': editor?.isActive({ textAlign: 'right' }) }]"
          title="ชิดขวา"
        >
          <Icon name="lucide:align-right" class="w-4 h-4" />
        </button>
      </div>

      <!-- Insert -->
      <div class="flex items-center gap-1 px-2 border-r border-gray-200">
        <button
          type="button"
          @click="addLink"
          :class="['toolbar-btn', { 'is-active': editor?.isActive('link') }]"
          title="เพิ่มลิงก์"
        >
          <Icon name="lucide:link" class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="showMediaPicker = true"
          class="toolbar-btn"
          title="แทรกรูปภาพ"
        >
          <Icon name="lucide:image" class="w-4 h-4" />
        </button>
      </div>

      <!-- Other -->
      <div class="flex items-center gap-1 pl-2">
        <button
          type="button"
          @click="editor?.chain().focus().setHorizontalRule().run()"
          class="toolbar-btn"
          title="เส้นแบ่ง"
        >
          <Icon name="lucide:minus" class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().undo().run()"
          class="toolbar-btn"
          title="ย้อนกลับ (Ctrl+Z)"
          :disabled="!editor?.can().undo()"
        >
          <Icon name="lucide:undo-2" class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="editor?.chain().focus().redo().run()"
          class="toolbar-btn"
          title="ทำซ้ำ (Ctrl+Y)"
          :disabled="!editor?.can().redo()"
        >
          <Icon name="lucide:redo-2" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Editor Content -->
    <EditorContent
      :editor="editor"
      class="editor-content border border-t-0 border-gray-200 rounded-b-xl bg-white"
    />

    <!-- Media Picker Modal -->
    <AdminMediaPicker
      v-model="showMediaPicker"
      @select="handleMediaSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const showMediaPicker = ref(false)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      }
    }),
    Image.configure({
      inline: false,
      allowBase64: false,
      HTMLAttributes: {
        class: 'editor-image'
      }
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'editor-link'
      }
    }),
    Placeholder.configure({
      placeholder: props.placeholder || 'เริ่มเขียนเนื้อหา...'
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    Underline
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-lg max-w-none focus:outline-none p-6 min-h-[400px]'
    }
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

// Watch for external content changes
watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.getHTML() !== newValue) {
    editor.value.commands.setContent(newValue, false)
  }
})

// Cleanup on unmount
onBeforeUnmount(() => {
  editor.value?.destroy()
})

const addLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href
  const url = window.prompt('ใส่ URL:', previousUrl)

  if (url === null) return

  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

// Handle image selection from Media Picker
const handleMediaSelect = (file: { url: string }) => {
  if (file.url) {
    editor.value?.chain().focus().setImage({ src: file.url }).run()
  }
}
</script>

<style>
.toolbar-btn {
  @apply p-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
}

.toolbar-btn.is-active {
  @apply bg-gray-200 text-pink-600;
}

.editor-content .ProseMirror {
  @apply min-h-[400px] outline-none;
}

.editor-content .ProseMirror p.is-editor-empty:first-child::before {
  @apply text-gray-400 float-left h-0 pointer-events-none;
  content: attr(data-placeholder);
}

/* Editor styles */
.editor-content .ProseMirror {
  @apply p-6;
}

.editor-content .ProseMirror h1 {
  @apply text-3xl font-bold mb-4 mt-6;
}

.editor-content .ProseMirror h2 {
  @apply text-2xl font-bold mb-3 mt-5;
}

.editor-content .ProseMirror h3 {
  @apply text-xl font-bold mb-2 mt-4;
}

.editor-content .ProseMirror p {
  @apply mb-4 leading-relaxed;
}

.editor-content .ProseMirror ul {
  @apply list-disc list-inside mb-4 space-y-1;
}

.editor-content .ProseMirror ol {
  @apply list-decimal list-inside mb-4 space-y-1;
}

.editor-content .ProseMirror blockquote {
  @apply border-l-4 border-pink-400 pl-4 italic text-gray-600 my-4;
}

.editor-content .ProseMirror hr {
  @apply my-6 border-gray-200;
}

.editor-content .ProseMirror .editor-image {
  @apply max-w-full h-auto rounded-xl my-4 mx-auto block;
}

.editor-content .ProseMirror .editor-link {
  @apply text-pink-600 underline hover:text-pink-800;
}

.editor-content .ProseMirror code {
  @apply bg-gray-100 px-1 py-0.5 rounded text-pink-600 text-sm;
}

.editor-content .ProseMirror pre {
  @apply bg-gray-900 text-gray-100 p-4 rounded-xl my-4 overflow-x-auto;
}

.editor-content .ProseMirror pre code {
  @apply bg-transparent text-gray-100 p-0;
}
</style>
