<template>
  <card-base :title="title" :description="description">
    <b-card-body v-if="canDelete">
      <b-alert show variant="danger" class="mb-0">
        <strong>Danger:</strong> Deleting a template is final, there is no
        undo!
      </b-alert>
    </b-card-body>
    <b-card-body v-else-if="!loading">
      <b-alert show variant="warning" class="mb-0">
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
import { notifications } from '@/mixins/notifications'
import { metaTags } from '@/mixins/metaTags'
import { fetchTemplateById } from '@/mixins/fetchTemplateById'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'templates-dashboard',

  mixins: [ notifications, metaTags, fetchTemplateById ],

  data () {
    return {
      title: 'Delete',
      description: 'Permanently delete the template.',
      canDelete: false,
      loading: true
    }
  },

  computed: {
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
     * Delete the project.
     */
    deleteTemplate () {
      const endpoint = `/api/user/${this.currentUser.id}`
      const templates = this.currentUser.info.templates
      const infoClone = JSON.parse(JSON.stringify(this.currentUser.info))
      infoClone.templates = templates.filter(tmpl => {
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
          return this.$axios.$put(endpoint, { info: infoClone })
        }
      }).then(result => {
        if (result) {
          this.notifySuccess({
            message: 'Template deleted'
          })
          this.$store.dispatch('UPDATE_CURRENT_USER', this.$axios)
          this.$router.push({
            name: 'account-name-templates',
            params: {
              name: this.currentUser.name
            }
          })
        }
      })
    }
  },

  created () {
    this.$axios.$get('/api/project', {
      params: {
        all: 1,
        info: `template_id::${this.currentTemplate.id}`
      }
    }).then(data => {
      this.canDelete = data.length < 1
      this.loading = false
    })
  }
}
</script>
