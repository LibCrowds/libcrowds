import localConfig from '@/local.config'

/**
 * Return the metadata for social media cards.
 * @param {Object} metadata
 *   The required metadata.
 */
function socialCards ({ url, siteName, title, description, image, imageAlt }) {
  const tags = [
    // Open Graph
    {
      hid: 'og:site_name',
      property: 'og:site_name',
      content: siteName
    },
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
    {
      hid: 'og:url',
      property: 'og:url',
      content: url
    },

    // Twitter
    {
      hid: 'twitter:card',
      name: 'twitter:card',
      content: 'summary'
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

  if (localConfig.hasOwnProperty('twitter')) {
    tags.push({
      hid: 'twitter:site',
      name: 'twitter:site',
      content: localConfig.twitter
    })
  }

  return tags
}

/**
 * A mixin to add basic metadata to the page.
 */
export const metaTags = {
  head () {
    const bgImg = require('~/assets/img/app-background.jpg')
    const image = localConfig.libcrowdsHost + bgImg
    const url = localConfig.libcrowdsHost

    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.description
        },
        ...socialCards({
          url: url,
          siteName: localConfig.brand,
          title: localConfig.brand,
          description: localConfig.description,
          image: image,
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
    const collectionRoute = this.$router.resolve({
      name: 'collection-short_name',
      params: {
        short_name: collection.short_name
      }
    })
    const url = localConfig.libcrowdsHost + collectionRoute.href

    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.description
        },
        ...socialCards({
          url: url,
          siteName: localConfig.brand,
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
    const collection = this.$store.state.currentProject
    const project = this.$store.state.currentProject
    let image = project.info && project.info.thumbnail_url
      ? project.info.thumbnail_url
      : null
    const projectRoute = this.$router.resolve({
      name: 'collection-short_name-projects-id-presenter',
      params: {
        short_name: collection.short_name,
        id: project.id,
        presenter: collection.info.presenter
      }
    })
    const url = localConfig.libcrowdsHost + projectRoute.href

    if (image && image.startsWith('/uploads')) {
      image = localConfig.pybossaHost + image
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
          url: url,
          siteName: localConfig.brand,
          title: project.name,
          description: project.description,
          image: image,
          imageAlt: `${project.name} image`
        })
      ]
    }
  }
}
