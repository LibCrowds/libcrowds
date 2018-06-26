<template>
  <card-base
    :title="title"
    :description="description"
    docs="/collections/forum/">

    <p slot="guidance">
      Use the form below to select a primary topic to be integrated with the
      collection microsite.
    </p>
    <hr class="my-1">

    <pybossa-form
      v-if="localConfig.flarum && localConfig.flarum.url"
      submit-text="Update"
      :form="form"
      @success="onSuccess">
    </pybossa-form>

    <b-container v-else>
      <b-alert
        show
        variant="info"
        class="m-2">
        Forum integration has not been enabled in application's the main
        configuration file.
      </b-alert>
    </b-container>

  </card-base>
</template>

<script>
import pick from 'lodash/pick'
import localConfig from '@/local.config'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { metaTags } from '@/mixins/metaTags'
import PybossaForm from '@/components/forms/PybossaForm'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags ],

  data () {
    return {
      title: 'Forum Integration',
      description: 'Manage forum integration for the collection microsite.',
      localConfig: localConfig
    }
  },

  asyncData ({ app, error }) {
    const forumTagsEndpoint = localConfig.flarum && localConfig.flarum.url
      ? `${localConfig.flarum.url}/api/tags`
      : ''

    if (!forumTagsEndpoint) {
      return {
        forumTags: []
      }
    }

    return app.$axios.$get(forumTagsEndpoint).then(response => {
      return {
        forumTags: response.data.map(tag => {
          return {
            id: tag.attributes.slug,
            name: tag.attributes.name
          }
        })
      }
    }).catch(err => {
      // This is most likely a CORS issue with the forum endpoint, if in
      // development use a fake forum topic instead
      if (process.env.NODE_ENV === 'development') {
        return {
          forumTags: [
            {
              id: 'fake-forum-topic',
              name: 'Fake forum topic (only shown in development)'
            }
          ]
        }
      } else {
        app.$notifications.flash({
          status: 'error',
          message: `Error loading forum tags: ${err.message}`
        })
        return {
          forumTags: []
        }
      }
    })
  },

  components: {
    PybossaForm,
    CardBase
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    form () {
      return {
        endpoint: `/api/category/${this.collection.id}`,
        method: 'put',
        model: pick(this.collection, 'info'),
        schema: {
          fields: [
            {
              model: 'info.forum.tag',
              label: 'Primary topic',
              type: 'select',
              disabled: () => !localConfig.flarum || !localConfig.flarum.url,
              hint: localConfig.flarum && localConfig.flarum.url
                ? 'The forum topic to integrate with the collection microsite'
                : 'To select a related forum topic Flarum integration ' +
                  'should be enabled in application\'s the main ' +
                  'configuration file',
              values: this.forumTags ? this.forumTags : []
            },
            {
              model: 'info.forum.url',
              label: 'Forum URL',
              type: 'input',
              inputType: 'text',
              visible: false
            }
          ]
        }
      }
    }
  },

  methods: {
    /**
     * Handle form submission success.
     */
    onSuccess () {
      this.$notifications.success({
        message: 'Forum integration settings updated'
      })
    }
  }
}
</script>
