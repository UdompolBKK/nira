<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NuxtLink to="/" class="text-gray-400 hover:text-gray-600">
              <Icon name="lucide:arrow-left" class="w-5 h-5" />
            </NuxtLink>
            <h1 class="text-xl font-bold text-gray-900">AI Bot Admin</h1>
          </div>
          <span class="text-sm text-gray-500">{{ user?.email }}</span>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Tabs -->
      <div class="flex gap-2 mb-8 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          :class="activeTab === tab.id
            ? 'bg-gray-900 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'"
        >
          {{ tab.icon }} {{ tab.name }}
        </button>
      </div>

      <!-- Bots Tab -->
      <div v-if="activeTab === 'bots'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900">จัดการ AI Bot</h2>
          <button
            @click="openBotModal()"
            class="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
          >
            + เพิ่ม Bot
          </button>
        </div>

        <!-- Bot List -->
        <div class="grid gap-4">
          <div
            v-for="bot in botList"
            :key="bot.id"
            class="bg-white rounded-xl p-5 border border-gray-200"
            :class="{ 'ring-2 ring-purple-500': bot.isDefault }"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <!-- Avatar -->
                <div class="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden">
                  <img
                    v-if="bot.avatar"
                    :src="bot.avatar"
                    :alt="bot.name"
                    class="w-full h-full object-cover"
                  />
                  <Icon v-else name="lucide:bot" class="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-gray-900">{{ bot.name }}</h3>
                    <span
                      v-if="bot.isDefault"
                      class="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      Default
                    </span>
                    <span
                      v-if="bot.isActive"
                      class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full"
                    >
                      Active
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 mt-1">{{ bot.description }}</p>
                  <p class="text-xs text-gray-400 mt-1">
                    Training: {{ bot.trainingCount || 0 }} ตัวอย่าง
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <!-- Set Default -->
                <button
                  v-if="!bot.isDefault"
                  @click="setDefaultBot(bot.id)"
                  class="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                  title="ตั้งเป็น Default"
                >
                  ตั้งเป็น Default
                </button>
                <!-- Train -->
                <button
                  @click="openTrainingModal(bot)"
                  class="px-3 py-1.5 text-xs text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50"
                >
                  🎓 Train AI
                </button>
                <!-- Edit -->
                <button
                  @click="openBotModal(bot)"
                  class="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Icon name="lucide:pencil" class="w-4 h-4" />
                </button>
                <!-- Delete -->
                <button
                  @click="handleDeleteBot(bot.id)"
                  class="p-2 text-gray-400 hover:text-red-500"
                >
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- System Prompt Preview -->
            <div class="mt-4 p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">System Prompt:</p>
              <p class="text-sm text-gray-700 line-clamp-2">{{ bot.systemPrompt }}</p>
            </div>
          </div>

          <div v-if="botList.length === 0" class="text-center py-12 text-gray-500">
            ยังไม่มี Bot กดเพิ่ม Bot เพื่อสร้างใหม่
          </div>
        </div>
      </div>

      <!-- Analytics Tab -->
      <div v-if="activeTab === 'analytics'" class="space-y-6">
        <div v-if="loadingAnalytics" class="text-center py-12">
          <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-400 mx-auto" />
        </div>

        <template v-else-if="analytics">
          <!-- Stats Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-xl p-4 border border-gray-200">
              <p class="text-2xl font-bold text-gray-900">{{ analytics.totalChats }}</p>
              <p class="text-sm text-gray-500">แชททั้งหมด</p>
            </div>
            <div class="bg-white rounded-xl p-4 border border-gray-200">
              <p class="text-2xl font-bold text-gray-900">{{ analytics.totalMessages }}</p>
              <p class="text-sm text-gray-500">ข้อความทั้งหมด</p>
            </div>
            <div class="bg-white rounded-xl p-4 border border-gray-200">
              <p class="text-2xl font-bold text-gray-900">{{ analytics.avgMessagesPerChat }}</p>
              <p class="text-sm text-gray-500">เฉลี่ย/แชท</p>
            </div>
            <div class="bg-white rounded-xl p-4 border border-gray-200">
              <p class="text-2xl font-bold text-red-600">{{ analytics.riskDistribution.critical + analytics.riskDistribution.high }}</p>
              <p class="text-sm text-gray-500">เสี่ยงสูง</p>
            </div>
          </div>

          <!-- Risk Distribution -->
          <div class="bg-white rounded-xl p-6 border border-gray-200">
            <h3 class="font-medium text-gray-900 mb-4">การกระจายความเสี่ยง</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <span class="text-sm w-20">ต่ำ (0-0.3)</span>
                <div class="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    class="h-full bg-green-500 rounded-full"
                    :style="{ width: getRiskPercent('low') + '%' }"
                  />
                </div>
                <span class="text-sm w-12 text-right">{{ analytics.riskDistribution.low }}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-sm w-20">กลาง (0.4-0.6)</span>
                <div class="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    class="h-full bg-yellow-500 rounded-full"
                    :style="{ width: getRiskPercent('medium') + '%' }"
                  />
                </div>
                <span class="text-sm w-12 text-right">{{ analytics.riskDistribution.medium }}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-sm w-20">สูง (0.7-0.9)</span>
                <div class="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    class="h-full bg-orange-500 rounded-full"
                    :style="{ width: getRiskPercent('high') + '%' }"
                  />
                </div>
                <span class="text-sm w-12 text-right">{{ analytics.riskDistribution.high }}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-sm w-20">วิกฤต (1.0)</span>
                <div class="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    class="h-full bg-red-500 rounded-full"
                    :style="{ width: getRiskPercent('critical') + '%' }"
                  />
                </div>
                <span class="text-sm w-12 text-right">{{ analytics.riskDistribution.critical }}</span>
              </div>
            </div>
          </div>

          <!-- Popular Bot Skins -->
          <div class="bg-white rounded-xl p-6 border border-gray-200">
            <h3 class="font-medium text-gray-900 mb-4">Bot ยอดนิยม</h3>
            <div class="space-y-2">
              <div
                v-for="item in analytics.popularBotSkins"
                :key="item.skin"
                class="flex items-center justify-between py-2"
              >
                <span class="text-sm">{{ BOT_SKINS[item.skin]?.emoji }} {{ BOT_SKINS[item.skin]?.name }}</span>
                <span class="text-sm text-gray-500">{{ item.count }} แชท</span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Prompts Tab -->
      <div v-if="activeTab === 'prompts'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900">Prompt Templates</h2>
          <button
            @click="showPromptModal = true; editingPrompt = null"
            class="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
          >
            + เพิ่ม Prompt
          </button>
        </div>

        <div class="grid gap-4">
          <div
            v-for="prompt in promptTemplates"
            :key="prompt.id"
            class="bg-white rounded-xl p-4 border border-gray-200"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-lg">{{ BOT_SKINS[prompt.botSkin]?.emoji }}</span>
                  <span class="font-medium">{{ prompt.name }}</span>
                  <span
                    v-if="prompt.isActive"
                    class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full"
                  >
                    Active
                  </span>
                </div>
                <p class="text-sm text-gray-500 mt-1">Version {{ prompt.version }}</p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editPrompt(prompt)"
                  class="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Icon name="lucide:pencil" class="w-4 h-4" />
                </button>
              </div>
            </div>
            <p class="text-sm text-gray-600 mt-3 line-clamp-2">{{ prompt.systemPrompt }}</p>
          </div>
        </div>
      </div>

      <!-- Knowledge Tab -->
      <div v-if="activeTab === 'knowledge'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900">Knowledge Base</h2>
          <button
            @click="showKnowledgeModal = true; editingKnowledge = null"
            class="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
          >
            + เพิ่มความรู้
          </button>
        </div>

        <div class="grid gap-4">
          <div
            v-for="entry in knowledgeEntries"
            :key="entry.id"
            class="bg-white rounded-xl p-4 border border-gray-200"
          >
            <div class="flex items-start justify-between">
              <div>
                <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {{ entry.category }}
                </span>
                <h4 class="font-medium mt-2">{{ entry.title }}</h4>
                <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ entry.content }}</p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editKnowledge(entry)"
                  class="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Icon name="lucide:pencil" class="w-4 h-4" />
                </button>
                <button
                  @click="handleDeleteKnowledge(entry.id)"
                  class="p-2 text-gray-400 hover:text-red-500"
                >
                  <Icon name="lucide:trash-2" class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="flex gap-1 mt-3">
              <span
                v-for="keyword in entry.keywords.slice(0, 5)"
                :key="keyword"
                class="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded"
              >
                {{ keyword }}
              </span>
            </div>
          </div>

          <div v-if="knowledgeEntries.length === 0" class="text-center py-12 text-gray-500">
            ยังไม่มีข้อมูลใน Knowledge Base
          </div>
        </div>
      </div>

      <!-- Conversations Tab -->
      <div v-if="activeTab === 'conversations'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900">บทสนทนาเสี่ยงสูง</h2>
          <button
            @click="loadConversations"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            รีเฟรช
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="conv in conversations"
            :key="conv.id"
            class="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div class="p-4 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="conv.maxRiskScore >= 1 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'"
                >
                  Risk: {{ (conv.maxRiskScore * 100).toFixed(0) }}%
                </span>
                <span class="text-sm text-gray-500">{{ BOT_SKINS[conv.botSkin]?.emoji }} {{ BOT_SKINS[conv.botSkin]?.name }}</span>
                <span class="text-xs text-gray-400">{{ formatDate(conv.createdAt) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="conv.reviewed" class="text-xs text-green-600">Reviewed</span>
                <button
                  v-else
                  @click="reviewConversation(conv)"
                  class="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200"
                >
                  Review
                </button>
              </div>
            </div>

            <div class="p-4 max-h-60 overflow-y-auto space-y-3">
              <div
                v-for="(msg, idx) in conv.messages.slice(-6)"
                :key="idx"
                class="flex"
                :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="max-w-[80%] px-3 py-2 rounded-lg text-sm"
                  :class="msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'"
                >
                  {{ msg.content }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="conversations.length === 0" class="text-center py-12 text-gray-500">
            ไม่พบบทสนทนาที่มีความเสี่ยงสูง
          </div>
        </div>
      </div>
    </main>

    <!-- Prompt Modal -->
    <Transition name="fade">
      <div
        v-if="showPromptModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="showPromptModal = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-100">
            <h3 class="text-lg font-medium">{{ editingPrompt ? 'แก้ไข Prompt' : 'เพิ่ม Prompt ใหม่' }}</h3>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bot Skin</label>
              <select v-model="promptForm.botSkin" class="w-full border border-gray-200 rounded-lg px-3 py-2">
                <option v-for="(skin, key) in BOT_SKINS" :key="key" :value="key">
                  {{ skin.emoji }} {{ skin.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อ Template</label>
              <input
                v-model="promptForm.name"
                type="text"
                class="w-full border border-gray-200 rounded-lg px-3 py-2"
                placeholder="เช่น Default, Friendly, Professional"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
              <textarea
                v-model="promptForm.systemPrompt"
                rows="8"
                class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="คำสั่งสำหรับ AI..."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Greeting Message</label>
              <input
                v-model="promptForm.greeting"
                type="text"
                class="w-full border border-gray-200 rounded-lg px-3 py-2"
                placeholder="ข้อความทักทายเมื่อเริ่มแชท"
              />
            </div>

            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                v-model="promptForm.isActive"
                class="rounded"
              />
              <label for="isActive" class="text-sm text-gray-700">เปิดใช้งาน (Active)</label>
            </div>
          </div>

          <div class="p-6 border-t border-gray-100 flex gap-3 justify-end">
            <button
              @click="showPromptModal = false"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              ยกเลิก
            </button>
            <button
              @click="savePrompt"
              :disabled="saving"
              class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {{ saving ? 'กำลังบันทึก...' : 'บันทึก' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Knowledge Modal -->
    <Transition name="fade">
      <div
        v-if="showKnowledgeModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="showKnowledgeModal = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-100">
            <h3 class="text-lg font-medium">{{ editingKnowledge ? 'แก้ไขความรู้' : 'เพิ่มความรู้ใหม่' }}</h3>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
              <input
                v-model="knowledgeForm.category"
                type="text"
                class="w-full border border-gray-200 rounded-lg px-3 py-2"
                placeholder="เช่น วิธีการรับมือความเครียด, FAQ"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">หัวข้อ</label>
              <input
                v-model="knowledgeForm.title"
                type="text"
                class="w-full border border-gray-200 rounded-lg px-3 py-2"
                placeholder="หัวข้อความรู้"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">เนื้อหา</label>
              <textarea
                v-model="knowledgeForm.content"
                rows="6"
                class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="เนื้อหาความรู้ที่ AI จะใช้ตอบ..."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Keywords (คั่นด้วย comma)</label>
              <input
                v-model="knowledgeForm.keywordsText"
                type="text"
                class="w-full border border-gray-200 rounded-lg px-3 py-2"
                placeholder="เครียด, วิตกกังวล, นอนไม่หลับ"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ใช้กับ Bot</label>
              <div class="flex flex-wrap gap-2 mt-2">
                <label
                  v-for="(skin, key) in BOT_SKINS"
                  :key="key"
                  class="flex items-center gap-2 px-3 py-1.5 border rounded-lg cursor-pointer"
                  :class="knowledgeForm.botSkins.includes(key) ? 'border-gray-900 bg-gray-50' : 'border-gray-200'"
                >
                  <input
                    type="checkbox"
                    :value="key"
                    v-model="knowledgeForm.botSkins"
                    class="hidden"
                  />
                  <span>{{ skin.emoji }} {{ skin.name }}</span>
                </label>
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-gray-100 flex gap-3 justify-end">
            <button
              @click="showKnowledgeModal = false"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              ยกเลิก
            </button>
            <button
              @click="saveKnowledge"
              :disabled="saving"
              class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {{ saving ? 'กำลังบันทึก...' : 'บันทึก' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Bot Modal (Add/Edit) -->
    <Transition name="fade">
      <div
        v-if="showBotModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="showBotModal = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
          <!-- Header -->
          <div class="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">{{ editingBot ? 'แก้ไข Bot' : 'เพิ่ม Bot ใหม่' }}</h3>
            <button @click="showBotModal = false" class="p-1 text-gray-400 hover:text-gray-600">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <div class="p-5 space-y-5">
            <!-- Avatar Upload - Centered, click to upload -->
            <div class="flex flex-col items-center">
              <div
                @click="triggerAvatarUpload"
                class="relative cursor-pointer group"
              >
                <div class="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-purple-400 transition-colors">
                  <img
                    v-if="botForm.avatar"
                    :src="botForm.avatar"
                    alt="Bot avatar"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="text-center">
                    <Icon name="lucide:image-plus" class="w-8 h-8 text-gray-400 mx-auto" />
                    <span class="text-xs text-gray-400 block mt-1">เลือกรูป</span>
                  </div>
                  <!-- Overlay on hover when has image -->
                  <div v-if="botForm.avatar" class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="lucide:camera" class="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <input
                type="file"
                ref="avatarInput"
                accept="image/*"
                class="hidden"
                @change="handleAvatarUpload"
              />
              <p class="text-xs text-gray-500 mt-2">คลิกเพื่อเลือกรูป (PNG, JPG ไม่เกิน 2MB)</p>
              <p v-if="uploadingAvatar" class="text-xs text-purple-600 mt-1 animate-pulse">กำลังอัพโหลด...</p>
            </div>

            <!-- Bot Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">ชื่อ Bot</label>
              <input
                v-model="botForm.name"
                type="text"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                placeholder="เช่น น้องกวิน"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">คำอธิบาย</label>
              <input
                v-model="botForm.description"
                type="text"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                placeholder="เช่น เพื่อน Gen Z ที่เข้าใจ"
              />
            </div>

            <!-- System Prompt -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">System Prompt</label>
              <textarea
                v-model="botForm.systemPrompt"
                rows="5"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow resize-none"
                placeholder="คำสั่งสำหรับ AI เช่น 'คุณคือ...'"
              />
            </div>

            <!-- Greeting Message -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Greeting Message</label>
              <input
                v-model="botForm.greeting"
                type="text"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                placeholder="ข้อความทักทายเมื่อเริ่มใช้งาน"
              />
            </div>

            <!-- Options -->
            <div class="flex items-center gap-6 pt-2">
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" v-model="botForm.isActive" class="w-4 h-4 rounded text-purple-600 focus:ring-purple-500" />
                <span class="text-sm text-gray-700">เปิดใช้งาน</span>
              </label>
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" v-model="botForm.isDefault" class="w-4 h-4 rounded text-purple-600 focus:ring-purple-500" />
                <span class="text-sm text-gray-700">ตั้งเป็น Default</span>
              </label>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-5 border-t border-gray-100 flex gap-3">
            <button
              @click="showBotModal = false"
              class="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
            >
              ยกเลิก
            </button>
            <button
              @click="saveBot"
              :disabled="saving || !botForm.name"
              class="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ saving ? 'กำลังบันทึก...' : 'บันทึก' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Training Modal (Chat-based Training with Summary Save) -->
    <Transition name="fade">
      <div
        v-if="showTrainingModal && trainingBot"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="showTrainingModal = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="p-4 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">{{ trainingBot.emoji }}</span>
              <div>
                <h3 class="font-medium text-gray-900">Train: {{ trainingBot.name }}</h3>
                <p class="text-xs text-gray-500">สอน AI ให้ตอบตามที่คุณต้องการ</p>
              </div>
            </div>
            <button @click="showTrainingModal = false" class="p-2 text-gray-400 hover:text-gray-600">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <!-- Training Examples List -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            <div class="bg-purple-50 rounded-lg p-4 text-sm">
              <p class="font-medium text-purple-900 mb-2">วิธี Train AI:</p>
              <ol class="text-purple-700 space-y-1 list-decimal list-inside">
                <li>เพิ่ม "สถานการณ์" - เมื่อ user พูดแบบนี้...</li>
                <li>กำหนด "การตอบที่ดี" - AI ควรตอบแบบนี้...</li>
                <li>ใส่ Keywords เพื่อให้ AI จับคำได้</li>
              </ol>
            </div>

            <!-- Training Form -->
            <div class="bg-gray-50 rounded-xl p-4 space-y-3">
              <h4 class="font-medium text-gray-900">เพิ่มตัวอย่างการตอบ</h4>

              <div>
                <label class="block text-xs text-gray-500 mb-1">สถานการณ์ (เมื่อ user พูดเกี่ยวกับ...)</label>
                <input
                  v-model="trainingForm.scenario"
                  type="text"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="เช่น user บอกว่ารู้สึกเหนื่อยมาก"
                />
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-1">ตัวอย่างข้อความจาก user</label>
                <input
                  v-model="trainingForm.userMessage"
                  type="text"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="เช่น วันนี้เหนื่อยมากเลย ไม่ไหวแล้ว"
                />
              </div>

              <div>
                <label class="block text-xs text-gray-500 mb-1">การตอบที่ดี (AI ควรตอบ)</label>
                <textarea
                  v-model="trainingForm.idealResponse"
                  rows="3"
                  class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  placeholder="เช่น เข้าใจเลย วันนี้คงหนักมาก หยุดพักสักครู่ก็ได้นะ ✨"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Keywords (คั่นด้วย ,)</label>
                  <input
                    v-model="trainingForm.keywords"
                    type="text"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="เหนื่อย, ไม่ไหว, หนัก"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">หมวดหมู่</label>
                  <select
                    v-model="trainingForm.category"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="greeting">ทักทาย</option>
                    <option value="support">ให้กำลังใจ</option>
                    <option value="crisis">วิกฤต/เสี่ยง</option>
                    <option value="general">ทั่วไป</option>
                    <option value="farewell">ลา</option>
                  </select>
                </div>
              </div>

              <button
                @click="addTrainingExampleHandler"
                :disabled="!trainingForm.scenario || !trainingForm.idealResponse || saving"
                class="w-full py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {{ saving ? 'กำลังบันทึก...' : '+ เพิ่มตัวอย่าง' }}
              </button>
            </div>

            <!-- Existing Examples -->
            <div v-if="currentBotExamples.length > 0" class="space-y-3">
              <h4 class="font-medium text-gray-900">ตัวอย่างที่บันทึกแล้ว ({{ currentBotExamples.length }})</h4>

              <div
                v-for="example in currentBotExamples"
                :key="example.id"
                class="bg-white border border-gray-200 rounded-lg p-3"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {{ getCategoryLabel(example.category) }}
                    </span>
                    <p class="text-sm font-medium text-gray-900 mt-1">{{ example.scenario }}</p>
                    <div class="mt-2 space-y-1">
                      <p class="text-xs text-gray-500">User: "{{ example.userMessage }}"</p>
                      <p class="text-xs text-green-700">Bot: "{{ example.idealResponse }}"</p>
                    </div>
                    <div class="flex gap-1 mt-2">
                      <span
                        v-for="kw in example.keywords"
                        :key="kw"
                        class="text-xs px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded"
                      >
                        {{ kw }}
                      </span>
                    </div>
                  </div>
                  <button
                    @click="deleteTrainingExampleHandler(example.id)"
                    class="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Icon name="lucide:trash-2" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-500 text-sm">
              ยังไม่มีตัวอย่างการสอน เริ่มเพิ่มได้เลย
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-gray-100 flex justify-between items-center">
            <p class="text-xs text-gray-500">
              ข้อมูลที่บันทึกจะถูกใช้เป็น context ให้ AI ตอบได้ดีขึ้น
            </p>
            <button
              @click="showTrainingModal = false"
              class="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
            >
              เสร็จสิ้น
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { BOT_SKINS, type BotSkin } from '~/composables/useAIBot'
import type { PromptTemplate, KnowledgeEntry, ChatAnalytics } from '~/composables/useAdminBot'
import type { BotConfig, TrainingExample } from '~/composables/useBotConfig'

definePageMeta({
  middleware: 'superadmin'
})

useHead({
  title: 'AI Bot Admin - Nira'
})

const { user } = useAuth()
const {
  knowledgeEntries,
  promptTemplates,
  conversations,
  getKnowledgeEntries,
  createKnowledgeEntry,
  updateKnowledgeEntry,
  deleteKnowledgeEntry,
  getPromptTemplates,
  createPromptTemplate,
  updatePromptTemplate,
  getAnalytics,
  getHighRiskConversations,
  markConversationReviewed
} = useAdminBot()

const {
  bots: botList,
  trainingExamples: currentBotExamples,
  getBots,
  createBot,
  updateBot,
  deleteBot,
  getTrainingExamples,
  addTrainingExample,
  deleteTrainingExample
} = useBotConfig()

// State
const activeTab = ref<'bots' | 'analytics' | 'prompts' | 'knowledge' | 'conversations'>('bots')
const tabs = [
  { id: 'bots', name: 'Bots', icon: '🤖' },
  { id: 'analytics', name: 'Analytics', icon: '📊' },
  { id: 'prompts', name: 'Prompts', icon: '💬' },
  { id: 'knowledge', name: 'Knowledge', icon: '📚' },
  { id: 'conversations', name: 'Conversations', icon: '👀' }
]

const saving = ref(false)
const loadingAnalytics = ref(false)
const analytics = ref<ChatAnalytics | null>(null)
const uploadingAvatar = ref(false)
const avatarInput = ref<HTMLInputElement | null>(null)

// Modals
const showPromptModal = ref(false)
const showKnowledgeModal = ref(false)
const showBotModal = ref(false)
const showTrainingModal = ref(false)
const editingPrompt = ref<PromptTemplate | null>(null)
const editingKnowledge = ref<KnowledgeEntry | null>(null)
const editingBot = ref<BotConfig | null>(null)
const trainingBot = ref<BotConfig | null>(null)

// Forms
const promptForm = ref({
  botSkin: 'genz' as BotSkin,
  name: '',
  systemPrompt: '',
  greeting: '',
  fallbackResponses: [] as string[],
  isActive: true,
  version: 1
})

const knowledgeForm = ref({
  category: '',
  title: '',
  content: '',
  keywordsText: '',
  botSkins: ['genz'] as BotSkin[],
  isActive: true
})

const botForm = ref({
  name: '',
  avatar: '',
  description: '',
  systemPrompt: '',
  greeting: '',
  isDefault: false,
  isActive: true
})

const trainingForm = ref({
  scenario: '',
  userMessage: '',
  idealResponse: '',
  keywords: '',
  category: 'support' as TrainingExample['category']
})

// Load data
const loadAnalytics = async () => {
  loadingAnalytics.value = true
  analytics.value = await getAnalytics(30)
  loadingAnalytics.value = false
}

const loadConversations = async () => {
  await getHighRiskConversations(0.7, 50)
}

// Risk percent calculation
const getRiskPercent = (level: 'low' | 'medium' | 'high' | 'critical') => {
  if (!analytics.value) return 0
  const total = analytics.value.totalChats || 1
  return Math.round((analytics.value.riskDistribution[level] / total) * 100)
}

// Edit functions
const editPrompt = (prompt: PromptTemplate) => {
  editingPrompt.value = prompt
  promptForm.value = {
    botSkin: prompt.botSkin,
    name: prompt.name,
    systemPrompt: prompt.systemPrompt,
    greeting: prompt.greeting,
    fallbackResponses: prompt.fallbackResponses || [],
    isActive: prompt.isActive,
    version: prompt.version
  }
  showPromptModal.value = true
}

const editKnowledge = (entry: KnowledgeEntry) => {
  editingKnowledge.value = entry
  knowledgeForm.value = {
    category: entry.category,
    title: entry.title,
    content: entry.content,
    keywordsText: entry.keywords.join(', '),
    botSkins: entry.botSkins,
    isActive: entry.isActive
  }
  showKnowledgeModal.value = true
}

// Save functions
const savePrompt = async () => {
  saving.value = true

  const data = {
    botSkin: promptForm.value.botSkin,
    name: promptForm.value.name,
    systemPrompt: promptForm.value.systemPrompt,
    greeting: promptForm.value.greeting,
    fallbackResponses: promptForm.value.fallbackResponses,
    isActive: promptForm.value.isActive,
    version: editingPrompt.value ? editingPrompt.value.version + 1 : 1
  }

  if (editingPrompt.value) {
    await updatePromptTemplate(editingPrompt.value.id, data)
  } else {
    await createPromptTemplate(data)
  }

  saving.value = false
  showPromptModal.value = false
  editingPrompt.value = null
  await getPromptTemplates()

  // Reset form
  promptForm.value = {
    botSkin: 'genz',
    name: '',
    systemPrompt: '',
    greeting: '',
    fallbackResponses: [],
    isActive: true,
    version: 1
  }
}

const saveKnowledge = async () => {
  saving.value = true

  const data = {
    category: knowledgeForm.value.category,
    title: knowledgeForm.value.title,
    content: knowledgeForm.value.content,
    keywords: knowledgeForm.value.keywordsText.split(',').map(k => k.trim()).filter(Boolean),
    botSkins: knowledgeForm.value.botSkins,
    isActive: knowledgeForm.value.isActive
  }

  if (editingKnowledge.value) {
    await updateKnowledgeEntry(editingKnowledge.value.id, data)
  } else {
    await createKnowledgeEntry(data)
  }

  saving.value = false
  showKnowledgeModal.value = false
  editingKnowledge.value = null
  await getKnowledgeEntries()

  // Reset form
  knowledgeForm.value = {
    category: '',
    title: '',
    content: '',
    keywordsText: '',
    botSkins: ['genz'],
    isActive: true
  }
}

const handleDeleteKnowledge = async (id: string) => {
  if (!confirm('ต้องการลบความรู้นี้?')) return
  await deleteKnowledgeEntry(id)
  await getKnowledgeEntries()
}

const reviewConversation = async (conv: any) => {
  const notes = prompt('บันทึกการ Review (ถ้ามี):')
  await markConversationReviewed(conv.id, notes || '')
  await loadConversations()
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ============ Bot Functions ============

const openBotModal = (bot?: BotConfig) => {
  if (bot) {
    editingBot.value = bot
    botForm.value = {
      name: bot.name,
      avatar: bot.avatar || '',
      description: bot.description,
      systemPrompt: bot.systemPrompt,
      greeting: bot.greeting,
      isDefault: bot.isDefault,
      isActive: bot.isActive
    }
  } else {
    editingBot.value = null
    botForm.value = {
      name: '',
      avatar: '',
      description: '',
      systemPrompt: '',
      greeting: '',
      isDefault: false,
      isActive: true
    }
  }
  showBotModal.value = true
}

const saveBot = async () => {
  saving.value = true

  try {
    let success: boolean | string | null

    if (editingBot.value) {
      success = await updateBot(editingBot.value.id, botForm.value)
    } else {
      success = await createBot(botForm.value)
    }

    if (success) {
      showBotModal.value = false
      editingBot.value = null
    } else {
      alert('ไม่สามารถบันทึกได้ กรุณาตรวจสอบสิทธิ์การใช้งาน')
    }
  } catch (err) {
    console.error('Error saving bot:', err)
    alert('เกิดข้อผิดพลาดในการบันทึก')
  } finally {
    saving.value = false
  }
}

const setDefaultBot = async (botId: string) => {
  await updateBot(botId, { isDefault: true })
}

const handleDeleteBot = async (id: string) => {
  if (!confirm('ต้องการลบ Bot นี้?')) return
  await deleteBot(id)
}

// Trigger file input click
const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

// Handle avatar upload to Firebase Storage
const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Check file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('ไฟล์ต้องไม่เกิน 2MB')
    return
  }

  // Check file type
  if (!file.type.startsWith('image/')) {
    alert('กรุณาเลือกไฟล์รูปภาพ')
    return
  }

  uploadingAvatar.value = true

  try {
    const { uploadFile } = useFirebaseStorage()

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || 'png'
    const path = `bot-avatars/${timestamp}.${extension}`

    // Upload to Firebase Storage
    const { url } = await uploadFile(path, file)

    // Set avatar URL
    botForm.value.avatar = url
  } catch (err) {
    console.error('Upload error:', err)
    alert('เกิดข้อผิดพลาดในการอัพโหลด')
  } finally {
    uploadingAvatar.value = false
  }
}

// ============ Training Functions ============

const openTrainingModal = async (bot: BotConfig) => {
  trainingBot.value = bot
  showTrainingModal.value = true
  // Load existing training examples for this bot
  await getTrainingExamples(bot.id)
}

const addTrainingExampleHandler = async () => {
  if (!trainingBot.value) return

  saving.value = true
  await addTrainingExample({
    botId: trainingBot.value.id,
    scenario: trainingForm.value.scenario,
    userMessage: trainingForm.value.userMessage,
    idealResponse: trainingForm.value.idealResponse,
    keywords: trainingForm.value.keywords.split(',').map(k => k.trim()).filter(Boolean),
    category: trainingForm.value.category,
    isActive: true
  })
  saving.value = false

  // Reset form
  trainingForm.value = {
    scenario: '',
    userMessage: '',
    idealResponse: '',
    keywords: '',
    category: 'support'
  }

  // Reload examples
  await getTrainingExamples(trainingBot.value.id)
  // Reload bots to update training count
  await getBots()
}

const deleteTrainingExampleHandler = async (id: string) => {
  if (!trainingBot.value) return
  if (!confirm('ต้องการลบตัวอย่างนี้?')) return

  await deleteTrainingExample(id, trainingBot.value.id)
  await getTrainingExamples(trainingBot.value.id)
  await getBots()
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    greeting: 'ทักทาย',
    support: 'ให้กำลังใจ',
    crisis: 'วิกฤต',
    general: 'ทั่วไป',
    farewell: 'ลา'
  }
  return labels[category] || category
}

// Load initial data
onMounted(async () => {
  await Promise.all([
    getBots(),
    loadAnalytics(),
    getPromptTemplates(),
    getKnowledgeEntries(),
    loadConversations()
  ])
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
