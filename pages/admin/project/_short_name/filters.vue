<template>
  <card-base
    :title="title"
    :description="description"
    docs="/projects/filters/">

    <p slot="guidance">
      Filters are used to help users more easily locate the types of project
      that they're interested in. Use the form below to select some filters
      for the project.
    </p>
    <hr class="my-1">

    <b-card-body>
      <span v-if="hasFilters">
        <div
          v-for="(tag, index) in currentCollection.info.project_filters"
          :key="index"
          class="mb-2">
          <label>{{ tag.name | capitalize }}</label>
          <multiselect
            :id="tag.name"
            v-model="project.info.filters[tag.name]"
            :options="options[tag.name] || []"
            :taggable="true"
            @tag="addFilter">
          </multiselect>
        </div>
      </span>
      <p v-else class="lead my-2 text-center">
        No filters have been enabled for this collection.
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
      title: 'Project Filters',
      description: 'Set the filters used to help locate the project',
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
      project.info.filters = project.info.filters || {}
      return project
    },

    hasFilters () {
      return this.currentCollection.info.project_filters.length
    }
  },

  methods: {
    /**
     * Update the project's filters.
     */
    async submit () {
      this.processing = true

      // Remove null filters
      this.project.info.filters = pickBy(this.project.info.filters, identity)

      try {
        await this.$axios.$put(`/api/project/${this.project.id}`, {
          info: this.project.info
        })
      } catch (err) {
        this.$nuxt.error(err)
      } finally {
        this.processing = false
      }
      this.$notifications.success({ message: 'Filters updated' })
    },

    /**
     * Add a new filter.
     * @param {String} value
     *   The new filter value.
     * @param {String} name
     *   The filter name (from the multiselect id).
     */
    addFilter (value, name) {
      if (Array.isArray(this.options[name])) {
        this.options[name].push(value)
      } else {
        this.options[name] = [value]
      }
      this.project.info.filters[name] = value
    }
  },

  mounted () {
    // Get all current filters for the collection.
    const catShortName = this.currentCollection.short_name
    const endpoint = `/lc/categories/${catShortName}/project-filters`
    return this.$axios.$get(endpoint).then(data => {
      this.options = data.filters
    }).catch(err => {
      this.$nuxt.error(err)
    })
  }
}
</script>
