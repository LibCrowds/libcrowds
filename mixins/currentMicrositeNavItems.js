import localConfig from '@/local.config'

/**
 * A mixin for the current collection microsite nav items.
 */
export const currentMicrositeNavItems = {
  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    forumUrl () {
      const baseUrl = localConfig.flarum.url
      if (
        baseUrl &&
        this.currentCollection.info.forum &&
        this.currentCollection.info.forum.tag
      ) {
        return baseUrl + '/t/' + this.currentCollection.info.forum.tag
      }
    },

    currentMicrositeNavItems () {
      const isMicrositePath = this.$route.path.indexOf('/collection') === 0

      if (!this.currentCollection.id || !isMicrositePath) {
        return []
      }

      const items = [
        {
          label: 'Home',
          link: {
            name: 'collection-short_name',
            params: {
              short_name: this.currentCollection.short_name
            }
          }
        },
        {
          label: 'About',
          link: {
            name: 'collection-short_name-about',
            params: {
              short_name: this.currentCollection.short_name
            }
          }
        },
        {
          label: 'Take Part',
          link: {
            name: 'collection-short_name-projects',
            params: {
              short_name: this.currentCollection.short_name
            }
          }
        },
        {
          label: 'Data',
          link: {
            name: 'collection-short_name-data',
            params: {
              short_name: this.currentCollection.short_name
            }
          }
        },
        {
          label: 'Browse',
          link: {
            name: 'collection-short_name-browse',
            params: {
              short_name: this.currentCollection.short_name
            }
          }
        }
      ]

      // Add the forum URL if configured
      if (typeof this.forumUrl !== 'undefined') {
        items.push({
          label: 'Discuss',
          external: true,
          link: this.forumUrl
        })
      }

      return items
    }
  }
}
