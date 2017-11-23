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

        // Open Graph
        { name: 'og:title', content: localConfig.brand },
        { name: 'og:description', content: localConfig.description },
        { name: 'og:type', content: 'website' },
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

        // Open Graph
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

/**
 * A mixin to add project meta tags to the page.
 */
export const projectMetaTags = {
  head () {
    const project = this.$store.state.currentProject
    let image = project.info && project.info.thumbnail_url
      ? project.info.thumbnail_url
      : null

    if (image && image.startsWith('/uploads')) {
      image = localConfig.pybossa.host + image
    }

    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.description
        },

        // Open Graph
        { name: 'og:title', content: project.name },
        { name: 'og:description', content: project.description },
        { name: 'og:type', content: 'website' },
        { name: 'og:image', content: image },

        // Twitter Card
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: localConfig.contact.twitter },
        { name: 'twitter:title', content: project.name },
        { name: 'twitter:description', content: project.description },
        { name: 'twitter:image', content: image },
        { name: 'twitter:image:alt', content: `${project.name} image` }
      ]
    }
  }
}
