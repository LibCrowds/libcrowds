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
        You cannot delete this template as projects are already using it.
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
import { fetchCollectionAndTmpl } from '@/mixins/fetchCollectionAndTmpl'

export default {
  layout: 'admin-template-dashboard',

  mixins: [ metaTags, fetchCollectionAndTmpl ],

  data () {
    return {
      title: 'Delete',
      description: 'Permanently delete the template.'
    }
  },

  asyncData ({ app, params, error, store }) {
    return app.$axios.$get('/api/project', {
      parems: {
        info: {
          template_id: params.id
        }
      }
    }).then(data => {
      return {
        canDelete: data.length === 0
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
      const infoClone = JSON.parse(JSON.stringify(this.currentCollection.info))
      infoClone.templates = infoClone.templates.filter(tmpl => {
        return tmpl.id !== this.currentTemplate.id
      })
      this.$swal({
        title: `Delete Template`,
        text: `Are you sure you want to delete this template?`,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.$axios.$post('/api/category', {
            info: infoClone
          })
        }
      }).then(data => {
        this.$notifications.success({ message: 'Template deleted' })
        this.$router.push({
          name: 'admin-template-short_name',
          params: {
            short_name: this.currentCollection.short_name
          }
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
