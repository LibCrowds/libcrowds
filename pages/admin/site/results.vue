<template>
  <card-base
    :title="title"
    :description="description"
    docs="/admin/results/">

    <p slot="guidance">
      Some options for managing results Annotations for each published
      microsite are presented below.
    </p>
    <p slot="guidance">
      Use the <strong>Analyse All</strong> buttons to re-run the analysis
      process for all results. This will probably take a long time and should
      only really be used for migration purposes.
    </p>
    <p slot="guidance">
      The <strong>Analyse Empty</strong> buttons will re-run the analysis
      process for all results that have not previously been analysed. This
      might have happened if one of your servers went down at a cruicial
      moment.
    </p>

    <b-table
      hover
      striped
      show-empty
      responsive
      :dark="darkMode"
      :items="tabileItems"
      :fields="tableFields">
      <template slot="iri" slot-scope="row">
        <a :href="row.item.iri">{{ row.item.iri }}</a>
      </template>
      <template slot="action" slot-scope="row">
          <span v-if="row.item.iri.length">
            <b-btn
              variant="success"
              size="sm"
              class="my-1 mr-1"
              @click="analyseEmpty(row.item.id)">
              Analyse Empty
            </b-btn>
            <b-btn
              variant="success"
              size="sm"
              class="my-1"
              @click="analyseAll(row.item.id)">
              Analyse All
            </b-btn>
            <download-annotation-data
              :container-iri="row.item.iri"
              :scope="row.item.scope">
            </download-annotation-data>
          </span>
          <b-btn
            v-else
            variant="warning"
            :to="{
              name: 'admin-collection-short_name-annotations',
              params: {
                short_name: row.item.shortName
              }
            }">
            Setup Results Annotations
          </b-btn>
      </template>
    </b-table>

  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import DownloadAnnotationData from '@/components/data/DownloadAnnotationData'

export default {
  layout: 'admin-site-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Results',
      description: 'Manage the results analysis process.',
      tableFields: {
        name: {
          label: 'Name'
        },
        iri: {
          label: 'IRI'
        },
        action: {
          label: 'Actions',
          class: 'text-center'
        }
      }
    }
  },

  components: {
    CardBase,
    DownloadAnnotationData
  },

  computed: {
    publishedCollections () {
      return this.$store.state.publishedCollections
    },

    tabileItems () {
      return this.publishedCollections.map(collection => {
        return {
          id: collection.id,
          name: collection.name,
          shortName: collection.short_name,
          scope: 'Results',
          iri: collection.info.annotations.hasOwnProperty('results')
            ? collection.info.annotations.results
            : ''
        }
      })
    }
  },

  methods: {
    /**
     * Analyse all results.
     * @param {Number} id
     *   The category ID.
     */
    analyseAll (id) {
      this.$swal({
        title: `Analyse all`,
        html: 'You are about to run the results analysis process for all ' +
          'results associated with this collection.' +
          '<br><br>This will delete all current Annotations, apart from ' +
          'those that have been manually modified, before recreating them ' +
          'according to the current results analysis process.' +
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
          'unanalysed results associated with this collection microsite.' +
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
  },

  mounted () {
    this.$store.dispatch('UPDATE_PUBLISHED_COLLECTIONS', this.$axios)
  }
}
</script>
