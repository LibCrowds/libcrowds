<template>
  <card-base :title="title" :description="description">
    <p slot="guidance">
      The table below can be used to identify any collections where the
      analysis process has not been successfully completed for all results.
    </p>

    <b-table
      hover
      striped
      show-empty
      responsive
      :dark="darkMode"
      :items="unanalysedResultsSummary"
      :fields="tableFields">
      <template slot="action" slot-scope="row">
        <b-btn
          variant="success"
          size="sm"
          class="my-1"
          @click="analyseEmpty(row.item.category_id)">
          Analyse Empty
        </b-btn>
        <b-btn
          variant="success"
          size="sm"
          class="my-1"
          @click="analyseAll(row.item.category_id)">
          Analyse All
        </b-btn>
      </template>
    </b-table>

  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-site-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Results',
      description: 'Trigger results analysis for categories.',
      tableFields: {
        category_name: {
          label: 'Name'
        },
        n_unanalysed: {
          label: 'Unanalysed Results',
          class: 'text-center d-none d-md-table-cell'
        },
        action: {
          label: 'Actions',
          class: 'text-center'
        }
      }
    }
  },

  asyncData ({ app, error }) {
    return app.$axios.$get('/lc/admin/results/unanalysed').then(data => {
      return {
        unanalysedResultsSummary: data.summary
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    CardBase
  },

  methods: {
    /**
     * Analyse all results.
     * @param {Number} id
     *   The category ID.
     */
    analyseAll (id) {
      this.$swal({
        title: `Reanalyse`,
        html: 'You are about to run the results analysis process for all ' +
          'of the collection\'s results ' +
          '<br><br>This will overwrite the data currently stored for all ' +
          'of results, apart from those that have been ' +
          'modified manually.' +
          '<br><br>Are you sure you want to continue?',
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const endpoint = `/lc/admin/results/analyse/all/${id}`
          return this.$axios.$get(endpoint).then(data => {
            return this.$axios.$post(endpoint, {
              csrf: data.csrf
            })
          })
        }
      }).then(data => {
        this.$notifications.flash(data)
      }).catch(err => {
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$nuxt.error(err)
        }
      })
    },

    /**
     * Analyse empty results.
     * @param {Number} id
     *   The category ID.
     */
    analyseEmpty (id) {
      this.$swal({
        title: `Reanalyse`,
        html: 'You are about to run the results analysis process for all ' +
          'of the collection\'s unanalysed results ' +
          '<br><br>Click OK to continue',
        type: 'info',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const endpoint = `/lc/admin/results/analyse/empty/${id}`
          return this.$axios.$get(endpoint).then(data => {
            return this.$axios.$post(endpoint, {
              csrf: data.csrf
            })
          })
        }
      }).then(data => {
        this.$notifications.flash(data)
      }).catch(err => {
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$nuxt.error(err)
        }
      })
    }
  }
}
</script>
