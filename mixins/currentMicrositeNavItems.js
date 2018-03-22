/**
 * A mixin for the current collection microsite nav items.
 */
export const currentMicrositeNavItems = {
  computed: {
    currentMicrositeNavItems () {
      const micrositeShortName = this.$route.path.startsWith('/collection')
        ? this.$route.path.replace(/^(\/collection\/)/, '').split('/')[0]
        : null
      if (!micrositeShortName) {
        return []
      }
      return [
        {
          label: 'Home',
          link: {
            name: 'collection-short_name',
            params: {
              short_name: micrositeShortName
            }
          }
        },
        {
          label: 'About',
          link: {
            name: 'collection-short_name-about',
            params: {
              short_name: micrositeShortName
            }
          }
        },
        {
          label: 'Take Part',
          link: {
            name: 'collection-short_name-projects',
            params: {
              short_name: micrositeShortName
            }
          }
        },
        {
          label: 'Data',
          link: {
            name: 'collection-short_name-data',
            params: {
              short_name: micrositeShortName
            }
          }
        }
      ]
    }
  }
}
