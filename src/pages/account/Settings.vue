<template>
  <div id="user-settings">
    <basic-layout
      :background="'faded'"
      navbarType="light"
      :navbarInvertable="false">

      <div class="container mt-5 mb-3">
        <div class="row">
          <div class="col-md-4">

            <b-list-group class="mb-3">
              <b-list-group-item
                action
                v-for="form in forms"
                :key="`form-${form.id}-chooser`"
                :active="activeFormId === form.id"
                @click.native="activeFormId = form.id">
                {{ form.label }}
              </b-list-group-item>
            </b-list-group>

          </div>
          <div class="col-md-8">

            <card-form
              v-for="form in forms"
              :key="`form-${form.id}`"
              v-if="activeFormId === form.id && activeFormId !== 'avatar'"
              :header="`${form.label} Settings`"
              :submitText="'Update'"
              :endpoint="endpoints[form.id]"
              :schema="form.schema"
              :model="form.model">
            </card-form>

            <avatar-form
              v-if="activeFormId === 'avatar'"
              :header="'Avatar Settings'"
              :submitText="'Update Avatar'"
              :type="'circle'"
              :endpoint="endpoints[forms.avatar.id]"
              :model="forms.avatar.model">
            </avatar-form>

          </div>
        </div>
      </div>

    </basic-layout>
  </div>
</template>

<script>
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'
import AvatarForm from '@/components/forms/AvatarForm'
import BasicLayout from '@/components/layouts/Basic'

export default {
  data: function () {
    return {
      activeFormId: 'profile',
      forms: {
        profile: {
          id: 'profile',
          label: 'Profile',
          model: {},
          schema: {
            fields: [
              {
                model: 'fullname',
                label: 'Full name',
                type: 'input',
                inputType: 'text'
              },
              {
                model: 'name',
                label: 'Username',
                type: 'input',
                inputType: 'text'
              },
              {
                model: 'email_addr',
                label: 'Email',
                type: 'input',
                inputType: 'email'
              }
            ]
          }
        },
        security: {
          id: 'security',
          label: 'Security',
          model: {},
          schema: {
            fields: [
              {
                model: 'current_password',
                label: 'Current Password',
                type: 'input',
                inputType: 'password'
              },
              {
                model: 'new_password',
                label: 'New Password',
                type: 'input',
                inputType: 'password'
              },
              {
                model: 'confirm',
                label: 'Confirm New Password',
                type: 'input',
                inputType: 'password'
              }
            ]
          }
        },
        avatar: {
          id: 'avatar',
          label: 'Avatar',
          model: {},
          schema: {}
        }
      }
    }
  },

  components: {
    BasicLayout,
    AvatarForm,
    CardForm
  },

  metaInfo: {
    title: 'User Settings'
  },

  computed: {
    endpoints: function () {
      return {
        profile: `account/${this.$store.state.currentUser.name}/update`,
        avatar: `account/${this.$store.state.currentUser.name}/update`,
        security: `account/${this.$store.state.currentUser.name}/update`
      }
    }
  },

  methods: {
    /**
     * Set core data.
     * @param {Object} data
     *   The data.
     */
    setData (data) {
      this.forms.profile.model = data.form
      this.forms.avatar.model = data.upload_form
      this.forms.security.model = data.password_form
      this.forms.profile.model.btn = 'Profile'
      this.forms.avatar.model.btn = 'Upload'
      this.forms.security.model.btn = 'Password'
    }
  },

  beforeRouteEnter (to, from, next) {
    pybossaApi.get(`account/${to.params.username}/update`).then(r => {
      next(vm => vm.setData(r.data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    this.forms.profile.model = {}
    this.forms.avatar.model = {}
    this.forms.security.model = {}
    pybossaApi.get(`account/${to.params.username}/update`).then(r => {
      this.setData(r.data)
      next()
    })
  }
}
</script>
