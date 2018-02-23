<template>
  <card-base :title="title" :description="description">
    <div slot="controls" class="float-md-right">
      <b-btn
        variant="success"
        size="sm"
        class="my-1"
        @click="analyseAll">
        Analyse All
      </b-btn>
    </div>

    <results-table
      :project="project">
      <template slot="action" scope="result">
        <b-btn
          variant="info"
          size="sm"
          @click="showDetails(result.item)">
          {{ result.item._showDetails ? 'Hide Details' : 'Show Details' }}
        </b-btn>
        <b-btn
          variant="success"
          size="sm"
          @click="analyse(result.item, $event)">
          Analyse
        </b-btn>
      </template>
    </results-table>
  </card-base>
</template>

<script>
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'
import { metaTags } from '@/mixins/metaTags'
import ResultsTable from '@/components/tables/Results'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ fetchProjectAndCollection, metaTags ],

  data () {
    return {
      title: 'Results',
      description: 'Check the project\'s results.'
    }
  },

  components: {
    ResultsTable,
    CardBase
  },

  computed: {
    project () {
      return this.$store.state.currentProject
    },

    collection () {
      return this.$store.state.currentCollection
    }
  },

  methods: {
    /**
     * Analyse all results.
     */
    analyseAll () {
      this.$swal({
        title: `Reanalyse`,
        html: 'Running this analysis will overwrite all current ' +
          'results.<br>Are you sure you want to continue?',
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const presenter = this.collection.info.presenter
          return this.$axios.$post(`/lc/analysis/${presenter}`, {
            all: 1,
            project_short_name: this.project.short_name
          })
        }
      }).then(result => {
        if (result) {
          this.$notifications.success({ message: result.message })
        }
      })
    },

    /**
     * Analyse a result.
     * @param {Object} result
     *   The result.
     * @param {Object} evt
     *   The event.
     */
    analyse (result, evt) {
      evt.target.disabled = true
      const presenter = this.collection.info.presenter
      return this.$axios.$post(`/lc/analysis/${presenter}`, {
        project_short_name: this.project.short_name,
        result_id: result.id,
        event: 'task_completed'
      }).then(result => {
        evt.target.disabled = false
        this.$notifications.success({ message: result.message })
      }).catch(err => {
        this.$nuxt.error(err)
      })
    },

    /**
     * Show the details for a result.
     * @param {Object} result
     *   The result.
     */
    showDetails (result) {
      result._showDetails = !result._showDetails
    }
  }
}
</script>
