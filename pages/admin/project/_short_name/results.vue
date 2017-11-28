<template>
  <card-base :title="title" :description="description">
    <b-btn
      slot="controls"
      variant="success"
      class="float-right"
      size="sm"
      @click="reanalyse">
      Reanalyse
    </b-btn>

    <results-table
      no-border
      :project="project">
      <template slot="action" scope="result">
      <b-btn
        variant="info"
        size="sm"
        @click="showDetails(result.item)">
        {{ result.item._showDetails ? 'Hide Details' : 'Show Details' }}
      </b-btn>
      </template>
    </results-table>
  </card-base>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'
import { metaTags } from '@/mixins/metaTags'
import ResultsTable from '@/components/tables/Results'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ fetchProjectAndCollection, notifications, metaTags ],

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
     * Reanalyse all results.
     */
    reanalyse () {
      this.$swal({
        title: `Reanalyse`,
        html: 'Running the reanalysis will overwrite all current ' +
          'results.<br>Are you sure you want to continue?',
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const presenter = this.collection.info.presenter
          return this.$axios.$post(`/libcrowds/analysis/${presenter}`, {
            all: 1,
            project_short_name: this.project.short_name
          })
        }
      }).then(result => {
        if (result) {
          this.notifySuccess({ message: result.message })
        }
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
