<template>
  <card-base :title="title" :description="description">

    <b-card-body>
      <span v-if="hasTags">
        <div
          v-for="(tag, index) in currentCollection.info.tags"
          :key="index"
          class="mb-2">
          <label>{{ tag.name | capitalize }}</label>
          <multiselect
            placeholder="Select one"
            v-model="project.info.tags[tag]"
            :options="options[tag.name] || []">
          </multiselect>
        </div>
      </span>

      <p v-else class="lead my-2 text-center">
        No tags have been enabled for this collection.
      </p>
    </b-card-body>

    <b-card-footer class="d-flex flex-row">
      <b-btn
        class="ml-auto"
        variant="success"
        :disabled="processing"
        @click="submit">
        Update
      </b-btn>
    </b-card-footer>

  </card-base>
</template>

<script>
import identity from 'lodash/identity'
import pickBy from 'lodash/pickBy'
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ fetchProjectAndCollection, metaTags ],

  data () {
    return {
      title: 'Tags',
      description: 'Set the tags used to filter and organise projects',
      processing: false,
      options: {}
    }
  },

  components: {
    CardBase
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    project () {
      const project = this.$store.state.currentProject
      project.info.tags = project.info.tags || {}
      return project
    },

    hasTags () {
      return this.currentCollection.info.tags.length
    }
  },

  methods: {
    /**
     * Update the project's tags.
     */
    async submit () {
      this.processing = true

      // Remove null tags
      this.project.info.tags = pickBy(this.project.info.tags, identity)

      try {
        await this.$axios.$put(`/api/project/${this.project.id}`, {
          info: this.project.info
        })
      } catch (err) {
        this.$nuxt.error(err)
      } finally {
        this.processing = false
      }
      this.$notifications.success({ message: 'Tags updated' })
    }
  },

  mounted () {
    // Get all current tags for the collection.
    const endpoint = `/lc/categories/${this.currentCollection.short_name}/tags`
    return this.$axios.$get(endpoint).then(data => {
      this.options = data.tags
    }).catch(err => {
      this.$nuxt.error(err)
    })
  }
}
</script>
