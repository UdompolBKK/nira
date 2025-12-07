/**
 * SEO Composable
 * จัดการ Meta Tags, Open Graph, Twitter Cards, และ JSON-LD Structured Data
 */

interface SEOConfig {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'place'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  keywords?: string[]
}

interface HotelSEO {
  name: string
  description?: string
  image?: string
  address?: string
  province?: string
  priceStart?: number
  rating?: number
  reviewCount?: number
  facilities?: string[]
  phone?: string
  website?: string
  slug?: string
}

interface ArticleSEO {
  title: string
  excerpt?: string
  image?: string
  publishedAt?: string
  modifiedAt?: string
  author?: string
  tags?: string[]
  slug?: string
}

interface ProvinceSEO {
  name: string
  description?: string
  image?: string
  hotelCount?: number
  region?: string
  slug?: string
}

export const useSEO = () => {
  const route = useRoute()
  const config = useRuntimeConfig()

  const siteUrl = 'https://petcango.com'
  const siteName = 'PetCanGo'
  const defaultImage = `${siteUrl}/common/og-image.jpg`
  const defaultDescription = 'แพลตฟอร์มค้นหาที่พักสัตว์เลี้ยงที่ใหญ่ที่สุดในประเทศไทย รวบรวมโรงแรมและรีสอร์ทที่รับสัตว์เลี้ยงกว่า 550+ แห่ง ครอบคลุม 77 จังหวัด พาน้องเที่ยว ไม่ต้องห่วง'

  /**
   * สร้าง Meta Tags พื้นฐาน
   */
  const setBasicMeta = (options: SEOConfig) => {
    const {
      title,
      description,
      image = defaultImage,
      url = `${siteUrl}${route.fullPath}`,
      type = 'website',
      keywords = ['ที่พักสัตว์เลี้ยง', 'โรงแรมหมาเข้าได้', 'รีสอร์ทพาหมาเข้าได้', 'pet friendly hotel thailand']
    } = options

    useHead({
      title: `${title} | ${siteName}`,
      htmlAttrs: {
        lang: 'th'
      },
      meta: [
        // Basic Meta
        { name: 'description', content: description },
        { name: 'keywords', content: keywords.join(', ') },
        { name: 'author', content: siteName },
        { name: 'robots', content: 'index, follow' },

        // Open Graph
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: url },
        { property: 'og:type', content: type },
        { property: 'og:site_name', content: siteName },
        { property: 'og:locale', content: 'th_TH' },

        // Twitter Cards
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },

        // Additional
        { name: 'theme-color', content: '#000000' },
        { name: 'msapplication-TileColor', content: '#000000' }
      ],
      link: [
        { rel: 'canonical', href: url }
      ]
    })
  }

  /**
   * JSON-LD: Organization Schema (สำหรับหน้าหลัก)
   */
  const setOrganizationSchema = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteName,
      alternateName: 'เพ็ทแคนโก',
      url: siteUrl,
      logo: `${siteUrl}/common/logodog-min-1.png`,
      description: defaultDescription,
      foundingDate: '2020',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'contact@petcango.com',
        availableLanguage: ['Thai', 'English']
      },
      sameAs: [
        'https://www.facebook.com/petcango',
        'https://www.instagram.com/petcango'
      ]
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema)
        }
      ]
    })
  }

  /**
   * JSON-LD: WebSite Schema with SearchAction
   */
  const setWebsiteSchema = () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
      description: defaultDescription,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema)
        }
      ]
    })
  }

  /**
   * JSON-LD: Hotel/LodgingBusiness Schema
   */
  const setHotelSchema = (hotel: HotelSEO) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LodgingBusiness',
      name: hotel.name,
      description: hotel.description || `${hotel.name} - ที่พักรับสัตว์เลี้ยงใน${hotel.province}`,
      image: hotel.image,
      url: `${siteUrl}/hotels/${hotel.slug}`,
      telephone: hotel.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: hotel.address,
        addressLocality: hotel.province,
        addressRegion: hotel.province,
        addressCountry: 'TH'
      },
      priceRange: hotel.priceStart ? `฿${hotel.priceStart}+` : undefined,
      aggregateRating: hotel.rating && hotel.reviewCount ? {
        '@type': 'AggregateRating',
        ratingValue: hotel.rating,
        reviewCount: hotel.reviewCount,
        bestRating: 5,
        worstRating: 1
      } : undefined,
      amenityFeature: hotel.facilities?.map(facility => ({
        '@type': 'LocationFeatureSpecification',
        name: facility,
        value: true
      })),
      petsAllowed: true
    }

    // Remove undefined values
    const cleanSchema = JSON.parse(JSON.stringify(schema))

    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(cleanSchema)
        }
      ]
    })
  }

  /**
   * JSON-LD: Article Schema (สำหรับบทความ)
   */
  const setArticleSchema = (article: ArticleSEO) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      image: article.image,
      url: `${siteUrl}/blogs/${article.slug}`,
      datePublished: article.publishedAt,
      dateModified: article.modifiedAt || article.publishedAt,
      author: {
        '@type': 'Organization',
        name: siteName,
        url: siteUrl
      },
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/common/logodog-min-1.png`
        }
      },
      keywords: article.tags?.join(', '),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteUrl}/blogs/${article.slug}`
      }
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema)
        }
      ]
    })
  }

  /**
   * JSON-LD: BreadcrumbList Schema
   */
  const setBreadcrumbSchema = (items: { name: string; url: string }[]) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`
      }))
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema)
        }
      ]
    })
  }

  /**
   * JSON-LD: FAQPage Schema
   */
  const setFAQSchema = (faqs: { question: string; answer: string }[]) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema)
        }
      ]
    })
  }

  /**
   * JSON-LD: ItemList Schema (สำหรับ listing pages)
   */
  const setItemListSchema = (items: { name: string; url: string; image?: string; position: number }[]) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: items.map(item => ({
        '@type': 'ListItem',
        position: item.position,
        name: item.name,
        url: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
        image: item.image
      }))
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema)
        }
      ]
    })
  }

  /**
   * SEO สำหรับหน้าหลัก
   */
  const setHomeSEO = () => {
    setBasicMeta({
      title: 'ค้นหาที่พักสัตว์เลี้ยง โรงแรมรับสุนัข แมว กว่า 550+ แห่ง',
      description: defaultDescription,
      keywords: [
        'ที่พักสัตว์เลี้ยง',
        'โรงแรมหมาเข้าได้',
        'รีสอร์ทพาหมาเข้าได้',
        'ที่พักพาแมวเข้าได้',
        'pet friendly hotel thailand',
        'โรงแรมรับสัตว์เลี้ยง',
        'ที่พักพาหมาไปเที่ยว',
        'รีสอร์ทรับสุนัข'
      ]
    })
    setOrganizationSchema()
    setWebsiteSchema()
  }

  /**
   * SEO สำหรับหน้าที่พัก
   */
  const setHotelSEO = (hotel: HotelSEO) => {
    const provinceName = hotel.province || ''
    const title = `${hotel.name} - ที่พักสัตว์เลี้ยง${provinceName}`
    const description = hotel.description ||
      `${hotel.name} ที่พักรับสัตว์เลี้ยงใน${provinceName} ${hotel.priceStart ? `ราคาเริ่มต้น ${hotel.priceStart} บาท/คืน` : ''} พร้อมสิ่งอำนวยความสะดวกครบครัน`

    setBasicMeta({
      title,
      description,
      image: hotel.image,
      type: 'place',
      keywords: [
        hotel.name,
        `ที่พักสัตว์เลี้ยง${provinceName}`,
        `โรงแรมหมาเข้าได้${provinceName}`,
        `รีสอร์ทพาหมาเข้าได้${provinceName}`,
        'pet friendly hotel',
        ...(hotel.facilities || [])
      ]
    })

    setHotelSchema(hotel)

    setBreadcrumbSchema([
      { name: 'หน้าหลัก', url: '/' },
      { name: 'จังหวัด', url: '/all-province' },
      { name: provinceName, url: `/hotels/${hotel.slug?.split('/')[0]}` },
      { name: hotel.name, url: `/hotels/${hotel.slug}` }
    ])
  }

  /**
   * SEO สำหรับหน้าจังหวัด
   */
  const setProvinceSEO = (province: ProvinceSEO) => {
    const title = `ที่พักสัตว์เลี้ยงใน${province.name} ${province.hotelCount ? `${province.hotelCount} แห่ง` : ''}`
    const description = province.description ||
      `รวมที่พักรับสัตว์เลี้ยงใน${province.name} ${province.hotelCount ? `มากกว่า ${province.hotelCount} แห่ง` : ''} โรงแรม รีสอร์ท วิลล่า พร้อมรีวิวจากผู้ใช้จริง`

    setBasicMeta({
      title,
      description,
      image: province.image,
      keywords: [
        `ที่พักสัตว์เลี้ยง${province.name}`,
        `โรงแรมหมาเข้าได้${province.name}`,
        `รีสอร์ทพาหมาเข้าได้${province.name}`,
        `${province.name} pet friendly`,
        `ที่พักหมา${province.name}`,
        `พาหมาเที่ยว${province.name}`
      ]
    })

    setBreadcrumbSchema([
      { name: 'หน้าหลัก', url: '/' },
      { name: 'จังหวัด', url: '/all-province' },
      { name: province.name, url: `/hotels/${province.slug}` }
    ])
  }

  /**
   * SEO สำหรับหน้าบทความ
   */
  const setArticleSEO = (article: ArticleSEO) => {
    setBasicMeta({
      title: article.title,
      description: article.excerpt || article.title,
      image: article.image,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.modifiedAt,
      keywords: article.tags || []
    })

    setArticleSchema(article)

    setBreadcrumbSchema([
      { name: 'หน้าหลัก', url: '/' },
      { name: 'บทความ', url: '/blogs' },
      { name: article.title, url: `/blogs/${article.slug}` }
    ])
  }

  return {
    setBasicMeta,
    setOrganizationSchema,
    setWebsiteSchema,
    setHotelSchema,
    setArticleSchema,
    setBreadcrumbSchema,
    setFAQSchema,
    setItemListSchema,
    setHomeSEO,
    setHotelSEO,
    setProvinceSEO,
    setArticleSEO,
    siteUrl,
    siteName,
    defaultImage,
    defaultDescription
  }
}
