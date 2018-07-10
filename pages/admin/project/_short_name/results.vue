<template>
  <card-base
    :title="title"
    :description="description"
    docs="/projects/results/">

    <div slot="controls" class="float-md-right">
      <b-btn
        variant="success"
        size="sm"
        class="my-1"
        :disabled="!validWebhook"
        @click="analyseAll">
        Analyse All
      </b-btn>
    </div>

    <p slot="guidance">
      This page lists all of the raw results data that has been generated for
      the project. It can be used to monitor the outcome of the automated
      results analysis process, or to trigger analysis for particular
      sets of tasks.
    </p>

    <b-alert
      v-if="!validWebhook && !loading"
      show
      variant="danger"
      class="mb-0">
      Results analysis cannot currently be triggered via this page as the
      project's webhook is invalid.
    </b-alert>

    <infinite-loading-table
      show-details
      :fields="tableFields"
      :search-params="{
        project_id: currentProject.id,
        all: 1
      }"
      domain-object="result">
      <template slot="action" slot-scope="row">
        <b-btn
          variant="success"
          size="sm"
          :disabled="!validWebhook"
          @click="analyse(row.item, $event)">
          Analyse
        </b-btn>
      </template>
    </infinite-loading-table>

  </card-base>
</template>

<script>
import { fetchProjectAndCollection } from '@/mixins/fetchProjectAndCollection'
import { metaTags } from '@/mixins/metaTags'
import InfiniteLoadingTable from '@/components/tables/InfiniteLoading'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-project-dashboard',

  mixins: [ fetchProjectAndCollection, metaTags ],

  data () {
    return {
      title: 'Results',
      description: 'Check the project\'s results.',
      loading: true,
      validWebhook: false,
      tableFields: {
        id: {
          label: 'ID'
        },
        created: {
          label: 'created',
          class: 'text-center d-none d-md-table-cell',
          sortable: true
        }
      }
    }
  },

  components: {
    InfiniteLoadingTable,
    CardBase
  },

  computed: {
    currentProject () {
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
          return this.$axios.$post(this.currentProject.webhook, {
            all: 1,
            project_short_name: this.currentProject.short_name
          }).catch(err => {
            this.$notifications.error({ message: err.message })
          })
        }
      }).then(result => {
        if (result) {
          this.$notifications.success({ message: result.message })
        }
      }).catch(err => {
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$nuxt.error(err)
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
      return this.$axios.$post(this.currentProject.webhook, {
        project_short_name: this.currentProject.short_name,
        result_id: result.id,
        event: 'task_completed'
      }).then(result => {
        evt.target.disabled = false
        this.$notifications.success({ message: result.message })
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  },

  mounted () {
    this.$axios.$get(this.currentProject.webhook).then(result => {
      this.validWebhook = true
    }).catch(() => {
      console.warn(`Invalid Webhook: ${this.currentProject.webhook}`)
    }).then(() => {
      this.loading = false
    })
  }
}
</script>
