<template>
  <card-base
    :title="title"
    :description="description">
    <b-card-body>
      <b-alert
        v-if="canDelete"
        show
        variant="danger"
        class="mb-0">
        <strong>Danger:</strong> Deleting a template is final, there is no
        undo!
      </b-alert>
      <b-alert
        v-else
        show variant="warning"
        class="mb-0">
        You cannot delete this template as a version of it has already been
        approved.
      </b-alert>
    </b-card-body>

    <b-card-footer>
      <div class="d-flex">
        <b-btn
          variant="danger"
          class="ml-auto"
          :disabled="!canDelete"
          @click="deleteTemplate">
          Delete
        </b-btn>
      </div>
    </b-card-footer>
  </card-base>
</template>

<script>
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'

export default {
  layout: 'admin-template-dashboard',

  mixins: [ metaTags, fetchCollectionByName ],

  data () {
    return {
      title: 'Delete',
      description: 'Permanently delete the template.'
    }
  },

  asyncData ({ app, params, error, store }) {
    const endpoint = `/lc/templates/${params.id}/delete`
    return app.$axios.$get(endpoint).then(data => {
      store.dispatch('UPDATE_CURRENT_TEMPLATE', data.template)
      return {
        canDelete: data.can_delete,
        csrf: data.csrf
      }
    })
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    currentTemplate () {
      return this.$store.state.currentTemplate
    },

    currentUser () {
      return this.$store.state.currentUser
    }
  },

  components: {
    CardBase
  },

  methods: {
    /**
     * Delete the template.
     */
    deleteTemplate () {
      const endpoint = `/lc/templates/${this.currentTemplate.id}/delete`
      this.$swal({
        title: `Delete Template`,
        text: `Are you sure you want to delete this template?`,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.$axios.$get(endpoint).then(data => {
            return this.$axios.$post(endpoint, {
              csrf: data.csrf
            })
          })
        }
      }).then(data => {
        this.$notifications.flash(data)
        this.$router.push({
          name: 'admin-template'
        })
      }).catch(err => {
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$nuxt.error(err)
        }
      })
    }
  }
}
</script>
