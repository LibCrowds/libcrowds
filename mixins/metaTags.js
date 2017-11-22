import localConfig from '@/local.config'

/**
 * A mixin to add basic metadata to the page.
 */
export const metaTags = {
  head () {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.description
        },
        // Open Grapg
        { name: 'og:title', content: localConfig.brand },
        { name: 'og:description', content: localConfig.description },
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: this.$router.resolve({ path: '/' }).route },
        // { name: 'og:image', content: 'https://i.imgur.com/PzEm5j2.png' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: localConfig.contact.twitter },
        { name: 'twitter:title', content: localConfig.brand },
        { name: 'twitter:description', content: localConfig.description }
        // { name: 'twitter:image', content: 'https://i.imgur.com/PzEm5j2.png' },
        // { name: 'twitter:image:alt', content: 'Nuxt.js Logo' }
      ]
    }
  }
}
