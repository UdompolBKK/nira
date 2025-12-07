import { orderBy, limit } from 'firebase/firestore'

export interface SearchResult {
  id: string
  type: 'hotel' | 'province' | 'blog'
  title: string
  subtitle?: string
  image?: string
  url: string
}

export const useGlobalSearch = () => {
  const { getCollection } = useFirestore()

  const searchQuery = ref('')
  const isSearching = ref(false)
  const results = ref<SearchResult[]>([])

  // Cache data to avoid multiple requests
  const cachedHotels = ref<any[]>([])
  const cachedProvinces = ref<any[]>([])
  const cachedBlogs = ref<any[]>([])
  const isCacheLoaded = ref(false)

  /**
   * Load and cache all searchable data
   */
  const loadSearchData = async () => {
    if (isCacheLoaded.value) return

    try {
      const [hotels, provinces, blogs] = await Promise.all([
        getCollection('hotels', orderBy('createdAt', 'desc'), limit(200)),
        getCollection('provinces', orderBy('name', 'asc')),
        getCollection('blogs', orderBy('createdAt', 'desc'), limit(100))
      ])

      cachedHotels.value = hotels.filter((h: any) => h.status === 'published')
      cachedProvinces.value = provinces
      cachedBlogs.value = blogs.filter((b: any) => b.status === 'published')
      isCacheLoaded.value = true
    } catch (err) {
      console.error('Failed to load search data:', err)
    }
  }

  /**
   * Perform search across hotels, provinces, and blogs
   */
  const search = async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 2) {
      results.value = []
      return []
    }

    isSearching.value = true
    const searchTerm = query.toLowerCase().trim()

    // Load cache if not already loaded
    if (!isCacheLoaded.value) {
      await loadSearchData()
    }

    const searchResults: SearchResult[] = []

    // Search provinces (show first for relevance)
    const matchedProvinces = cachedProvinces.value
      .filter((p: any) => {
        const nameMatch = p.name?.toLowerCase().includes(searchTerm)
        const nameEnMatch = p.nameEn?.toLowerCase().includes(searchTerm)
        return nameMatch || nameEnMatch
      })
      .slice(0, 5)
      .map((p: any) => ({
        id: p.id,
        type: 'province' as const,
        title: p.name,
        subtitle: `${p.hotelCount || 0} ที่พัก`,
        image: p.image || p.coverImage,
        url: `/hotels/${p.slug}`
      }))

    // Search hotels
    const matchedHotels = cachedHotels.value
      .filter((h: any) => {
        const nameMatch = h.name?.toLowerCase().includes(searchTerm)
        const descMatch = h.description?.toLowerCase().includes(searchTerm)
        const provinceMatch = h.province?.name?.toLowerCase().includes(searchTerm)
        return nameMatch || descMatch || provinceMatch
      })
      .slice(0, 5)
      .map((h: any) => ({
        id: h.id,
        type: 'hotel' as const,
        title: h.name,
        subtitle: h.province?.name || '',
        image: h.images?.[0] || h.coverImage || h.mainImage,
        url: `/hotels/${h.province?.slug || 'unknown'}/${h.slug}`
      }))

    // Search blogs
    const matchedBlogs = cachedBlogs.value
      .filter((b: any) => {
        const titleMatch = b.title?.toLowerCase().includes(searchTerm)
        const excerptMatch = b.excerpt?.toLowerCase().includes(searchTerm)
        const categoryMatch = b.category?.toLowerCase().includes(searchTerm)
        return titleMatch || excerptMatch || categoryMatch
      })
      .slice(0, 3)
      .map((b: any) => ({
        id: b.id,
        type: 'blog' as const,
        title: b.title,
        subtitle: b.category || 'บทความ',
        image: b.featuredImage || b.image || b.coverImage,
        url: `/blogs/${b.slug}`
      }))

    // Combine results
    searchResults.push(...matchedProvinces)
    searchResults.push(...matchedHotels)
    searchResults.push(...matchedBlogs)

    results.value = searchResults
    isSearching.value = false

    return searchResults
  }

  /**
   * Clear search results
   */
  const clearSearch = () => {
    searchQuery.value = ''
    results.value = []
  }

  /**
   * Debounced search
   */
  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  const debouncedSearch = (query: string, delay = 300) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    searchQuery.value = query

    if (!query || query.length < 2) {
      results.value = []
      return
    }

    searchTimeout = setTimeout(() => {
      search(query)
    }, delay)
  }

  return {
    searchQuery,
    isSearching,
    results,
    search,
    debouncedSearch,
    clearSearch,
    loadSearchData
  }
}
