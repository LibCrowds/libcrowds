import localConfig from '@/local.config'

/**
 * Return the metadata for social media cards.
 * @param {Object} metadata
 *   The required metadata.
 */
function socialCards ({ title, description, image, imageAlt }) {
  return [
    // Open Graph
    {
      hid: 'og:title',
      property: 'og:title',
      content: title
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: description
    },
    {
      hid: 'og:type',
      property: 'og:type',
      content: 'website'
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: image
    },
    {
      hid: 'og:image:alt',
      property: 'og:image:alt',
      content: imageAlt
    },

    // Twitter
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary'
    },
    {
      hid: 'twitter:site',
      name: 'twitter:site',
      content: localConfig.contact.twitter
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: title
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: description
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: image
    },
    {
      hid: 'twitter:image:alt',
      name: 'twitter:image:alt',
      content: imageAlt
    }
  ]
}

/**
 * A mixin to add basic metadata to the page.
 */
export const metaTags = {
  head () {
    const bgImg = require('~/assets/img/app-background.jpg')

    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.description
        },
        ...socialCards({
          title: localConfig.brand,
          description: localConfig.description,
          image: bgImg,
          imageAlt: `${localConfig.brand} image`
        })
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
        ...socialCards({
          title: collection.name,
          description: collection.description,
          image: image,
          imageAlt: `${collection.name} image`
        })
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
        ...socialCards({
          title: project.name,
          description: project.description,
          image: image,
          imageAlt: `${project.name} image`
        })
      ]
    }
  }
}
