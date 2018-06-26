<template>
  <card-base :title="title" :description="description">
    <pybossa-form
      submit-text="Update"
      :form="form"
      @success="updateCurrentUser">
      <div slot="bottom" class="d-flex">
        <no-ssr>
          <toggle-button
            v-if="currentUser.info"
            v-model="currentUser.info.hide_tutorials"
            :labels="true"
            class="mb-0">
          </toggle-button>
        </no-ssr>
        <label class="ml-1">
          Prevent tutorials from displaying automatically when projects are
          opened
        </label>
      </div>
    </pybossa-form>
  </card-base>
</template>

<script>
import pick from 'lodash/pick'
import PybossaForm from '@/components/forms/PybossaForm'
import { metaTags } from '@/mixins/metaTags'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'account-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Preferences',
      description: 'Set your account preferences.'
    }
  },

  components: {
    PybossaForm,
    CardBase
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    form () {
      return {
        endpoint: `api/user/${this.currentUser.id}`,
        method: 'put',
        model: pick(
          this.currentUser,
          'info'
        ),
        schema: {
          fields: []
        }
      }
    }
  },

  methods: {
    /**
     * Trigger an update of the current user.
     */
    updateCurrentUser () {
      this.$store.dispatch('UPDATE_CURRENT_USER', this.$axios)
      this.$notifications.success({ message: 'Preferences updated' })
    }
  }
}
</script>
