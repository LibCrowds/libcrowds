import localConfig from '@/local.config'

/**
 * A mixin to add collection meta tags to the page.
 */
export const collectionMetaTags = {
  head () {
    const collection = this.$store.state.currentCollection
    const image = collection.info && collection.info.background
      ? collection.info.background
      : null

    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.description
        },
        // Open Grapg
        { name: 'og:title', content: collection.name },
        { name: 'og:description', content: collection.description },
        { name: 'og:type', content: 'website' },
        { name: 'og:image', content: image },
        // Twitter Card
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: localConfig.contact.twitter },
        { name: 'twitter:title', content: collection.name },
        { name: 'twitter:description', content: collection.description },
        { name: 'twitter:image', content: image },
        { name: 'twitter:image:alt', content: `${collection.name} image` }
      ]
    }
  }
}
