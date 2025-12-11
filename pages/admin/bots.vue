<template>
  <div class="p-8">
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

    <!-- Training Modal (Chat-based Training) -->
    <Transition name="fade">
      <div
        v-if="showTrainingModal && trainingBot"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="showTrainingModal = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden">
          <!-- Header with Tabs -->
          <div class="p-4 border-b border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden">
                  <img
                    v-if="trainingBot.avatar"
                    :src="trainingBot.avatar"
                    :alt="trainingBot.name"
                    class="w-full h-full object-cover"
                  />
                  <Icon v-else name="lucide:bot" class="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 class="font-medium text-gray-900">Train: {{ trainingBot.name }}</h3>
                  <p class="text-xs text-gray-500">สอน AI ให้จดจำและเรียนรู้ได้เอง</p>
                </div>
              </div>
              <button @click="showTrainingModal = false" class="p-2 text-gray-400 hover:text-gray-600">
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>

            <!-- Training Mode Tabs -->
            <div class="flex gap-2">
              <button
                @click="trainingMode = 'chat'"
                class="px-3 py-1.5 text-sm rounded-lg transition-colors"
                :class="trainingMode === 'chat' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                💬 สนทนา
              </button>
              <button
                @click="trainingMode = 'examples'; loadBotMemories()"
                class="px-3 py-1.5 text-sm rounded-lg transition-colors"
                :class="trainingMode === 'examples' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                🧠 ความจำ ({{ botMemories.length }})
              </button>
            </div>
          </div>

          <!-- Chat Training Mode -->
          <template v-if="trainingMode === 'chat'">
            <!-- Chat Messages Area -->
            <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              <!-- Welcome message -->
              <div v-if="trainingChat.length === 0" class="text-center py-8">
                <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <img
                    v-if="trainingBot.avatar"
                    :src="trainingBot.avatar"
                    :alt="trainingBot.name"
                    class="w-full h-full object-cover rounded-full"
                  />
                  <Icon v-else name="lucide:bot" class="w-8 h-8 text-purple-400" />
                </div>
                <h4 class="font-medium text-gray-900 mb-2">สอน AI ผ่านการสนทนา</h4>
                <p class="text-sm text-gray-500 max-w-md mx-auto mb-3">
                  AI จะเรียนรู้และจำได้เอง! ลองสั่งให้จำอะไรสักอย่าง เช่น:
                </p>
                <div class="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                  <span class="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">"เป็นผู้ชายนะ พูดครับ"</span>
                  <span class="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">"จำไว้ว่าฉันชื่อกวิน"</span>
                  <span class="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">"ชอบใช้ emoji เยอะๆ"</span>
                </div>
              </div>

              <!-- Chat messages -->
              <div
                v-for="(msg, idx) in trainingChat"
                :key="idx"
                class="flex"
                :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
              >
                <div
                  v-if="msg.role === 'assistant'"
                  class="flex gap-2 max-w-[85%]"
                >
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      v-if="trainingBot.avatar"
                      :src="trainingBot.avatar"
                      :alt="trainingBot.name"
                      class="w-full h-full object-cover"
                    />
                    <Icon v-else name="lucide:bot" class="w-4 h-4 text-purple-400" />
                  </div>
                  <div class="space-y-2">
                    <div
                      class="px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm"
                      :class="msg.isEdited ? 'bg-green-100 text-green-900' : msg.memorySaved ? 'bg-purple-50 text-gray-900 shadow-sm border border-purple-200' : 'bg-white text-gray-900 shadow-sm'"
                    >
                      {{ msg.content }}
                    </div>
                    <!-- Memory saved indicator (auto-learned) -->
                    <div v-if="msg.memorySaved" class="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-lg">
                      <Icon name="lucide:brain" class="w-3 h-3 text-purple-600" />
                      <span class="text-xs text-purple-700">จำได้แล้ว: {{ msg.savedMemory }}</span>
                    </div>
                  </div>
                </div>

                <div
                  v-else
                  class="max-w-[85%] px-4 py-2.5 bg-gray-900 text-white rounded-2xl rounded-tr-sm text-sm"
                >
                  {{ msg.content }}
                </div>
              </div>

              <!-- AI Typing indicator -->
              <div v-if="isAiTyping" class="flex justify-start">
                <div class="flex gap-2 max-w-[85%]">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      v-if="trainingBot.avatar"
                      :src="trainingBot.avatar"
                      :alt="trainingBot.name"
                      class="w-full h-full object-cover"
                    />
                    <Icon v-else name="lucide:bot" class="w-4 h-4 text-purple-400" />
                  </div>
                  <div class="px-4 py-3 bg-white rounded-2xl rounded-tl-sm shadow-sm">
                    <div class="flex gap-1">
                      <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                      <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                      <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat Input -->
            <div class="p-4 border-t border-gray-100 bg-white">
              <form @submit.prevent="sendTrainingMessage" class="flex gap-2">
                <input
                  v-model="trainingInput"
                  type="text"
                  class="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="พิมพ์ข้อความเหมือน user จริง..."
                  :disabled="isAiTyping"
                />
                <button
                  type="submit"
                  :disabled="!trainingInput.trim() || isAiTyping"
                  class="px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="lucide:send" class="w-5 h-5" />
                </button>
              </form>
              <p class="text-xs text-gray-400 mt-2 text-center">
                AI จะจดจำเองเมื่อคุณสั่งให้จำ/เปลี่ยน เช่น "พูดแบบผู้ชาย" "จำว่าฉันชื่อ..."
              </p>
            </div>
          </template>

          <!-- Memories List Mode -->
          <template v-else>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
              <!-- Memories List -->
              <div v-if="botMemories.length > 0" class="space-y-3">
                <div
                  v-for="memory in botMemories"
                  :key="memory.id"
                  class="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-xs px-2 py-0.5 rounded"
                          :class="{
                            'bg-purple-100 text-purple-700': memory.category === 'personality',
                            'bg-blue-100 text-blue-700': memory.category === 'preference',
                            'bg-green-100 text-green-700': memory.category === 'fact',
                            'bg-orange-100 text-orange-700': memory.category === 'instruction'
                          }"
                        >
                          {{ getMemoryCategoryLabel(memory.category) }}
                        </span>
                      </div>

                      <!-- Memory content -->
                      <div class="flex items-start gap-2">
                        <Icon name="lucide:brain" class="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <p class="text-sm text-gray-900">{{ memory.memory }}</p>
                      </div>

                      <!-- Source message if available -->
                      <div v-if="memory.sourceMessage" class="mt-2 pl-6">
                        <p class="text-xs text-gray-400">จากข้อความ: "{{ memory.sourceMessage }}"</p>
                      </div>
                    </div>
                    <button
                      @click="deleteBotMemory(memory.id)"
                      class="p-1 text-gray-400 hover:text-red-500 ml-2"
                    >
                      <Icon name="lucide:trash-2" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-12 text-gray-500">
                <Icon name="lucide:brain" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p class="text-sm">ยังไม่มีความจำ</p>
                <p class="text-xs mt-1">ไปที่แท็บ "สนทนา" แล้วสั่งให้ AI จำอะไรสักอย่าง</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="p-4 border-t border-gray-100 flex justify-between items-center">
              <p class="text-xs text-gray-500">
                {{ botMemories.length }} ความจำที่บันทึก
              </p>
              <button
                @click="showTrainingModal = false"
                class="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
              >
                เสร็จสิ้น
              </button>
            </div>
          </template>
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
  layout: 'admin',
  middleware: 'admin'
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

// Chat-based training state
interface TrainingChatMessage {
  role: 'user' | 'assistant'
  content: string
  isEditing?: boolean
  isEdited?: boolean
  isSaved?: boolean
  memorySaved?: boolean  // AI automatically saved this as memory
  savedMemory?: string   // What memory was saved
}
const trainingMode = ref<'chat' | 'examples'>('chat')
const trainingChat = ref<TrainingChatMessage[]>([])
const trainingInput = ref('')
const isAiTyping = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

// Bot memories state
interface BotMemory {
  id: string
  botId: string
  memory: string
  category: string
  createdAt: Date
  isActive: boolean
  sourceMessage?: string
}
const botMemories = ref<BotMemory[]>([])

// Load data
const loadAnalytics = async () => {
  loadingAnalytics.value = true
  analytics.value = await getAnalytics(30)
  loadingAnalytics.value = false
}

const loadConversations = async () => {
  await getHighRiskConversations(0.7, 50)
}

// Load bot memories from API
const loadBotMemories = async () => {
  if (!trainingBot.value) return

  try {
    const response = await $fetch<{ memories: BotMemory[] }>('/api/bot/memories', {
      method: 'GET',
      query: { botId: trainingBot.value.id }
    })
    botMemories.value = response.memories || []
  } catch (err) {
    console.error('Error loading memories:', err)
    botMemories.value = []
  }
}

// Delete a bot memory
const deleteBotMemory = async (memoryId: string) => {
  if (!confirm('ต้องการลบความจำนี้?')) return

  try {
    await $fetch('/api/bot/memories', {
      method: 'DELETE',
      body: { memoryId }
    })
    // Reload memories
    await loadBotMemories()
  } catch (err) {
    console.error('Error deleting memory:', err)
    alert('เกิดข้อผิดพลาดในการลบ')
  }
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
  trainingMode.value = 'chat'
  trainingChat.value = []
  trainingInput.value = ''
  // Load existing training examples for this bot
  await getTrainingExamples(bot.id)
}

// Send message to AI for training - Now uses train-chat API with auto-learning!
const sendTrainingMessage = async () => {
  if (!trainingInput.value.trim() || !trainingBot.value || isAiTyping.value) return

  const userMessage = trainingInput.value.trim()
  trainingInput.value = ''

  // Add user message to chat
  trainingChat.value.push({
    role: 'user',
    content: userMessage
  })

  // Scroll to bottom
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }

  // Show typing indicator
  isAiTyping.value = true

  try {
    // Call train-chat API - AI can now auto-learn and save memories!
    const response = await $fetch<{
      response: string
      memorySaved: boolean
      savedMemory?: string
    }>('/api/bot/train-chat', {
      method: 'POST',
      body: {
        message: userMessage,
        botId: trainingBot.value.id,
        history: trainingChat.value.slice(0, -1).map(m => ({
          role: m.role,
          content: m.content
        }))
      }
    })

    // Add AI response with memory info
    trainingChat.value.push({
      role: 'assistant',
      content: response.response,
      isEditing: false,
      isEdited: false,
      isSaved: false,
      memorySaved: response.memorySaved,
      savedMemory: response.savedMemory
    })
  } catch (err) {
    console.error('AI response error:', err)
    trainingChat.value.push({
      role: 'assistant',
      content: 'ขอโทษด้วยนะ ตอนนี้มีปัญหาเล็กน้อย ลองใหม่อีกครั้งนะ',
      isEditing: false,
      isEdited: false,
      isSaved: false
    })
  } finally {
    isAiTyping.value = false
    // Scroll to bottom
    await nextTick()
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }
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

const getMemoryCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    personality: 'บุคลิกภาพ',
    preference: 'ความชอบ',
    fact: 'ข้อเท็จจริง',
    instruction: 'คำสั่ง'
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
