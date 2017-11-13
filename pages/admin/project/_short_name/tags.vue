<template>
  <card-base
    :title="title"
    help="Set the tags used to filter and organise projects">

    <b-card-body>
      <span v-if="hasTags">
        <div
          v-for="(value, tag) in collection.info.tags"
          :key="tag"
          class="mb-2">
          <label>{{ tag | capitalize }}</label>
          <multiselect
            placeholder="Select one"
            v-model="project.info.tags[tag]"
            :options="value.options">
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
import isEmpty from 'lodash/isEmpty'
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'
import { notifications } from '@/mixins/notifications'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ fetchProjectAndCollection, notifications ],

  data () {
    return {
      title: 'Tags',
      processing: false
    }
  },

  head () {
    return {
      title: this.title
    }
  },

  components: {
    CardBase
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    },

    project () {
      const project = this.$store.state.currentProject
      project.info.tags = project.info.tags || {}
      return project
    },

    hasTags () {
      return !isEmpty(this.collection.info.tags)
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
      this.notifySuccess({ message: 'Tags updated' })
    }
  }
}
</script>
