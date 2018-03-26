/**
 * A mixin for the current collection microsite nav items.
 */
export const currentMicrositeNavItems = {
  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    currentMicrositeNavItems () {
      const isMicrositePath = this.$route.path.startsWith('/collection')

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
        }
      ]

      // Add the forum URL if configured
      if (this.currentCollection.info.forum) {
        items.push({
          label: 'Discuss',
          external: true,
          link: this.currentCollection.info.forum
        })
      }

      return items
    }
  }
}
