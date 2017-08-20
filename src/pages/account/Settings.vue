<template>
  <div id="account-settings">
    <basic-layout
      :background="'geometry'"
      navbarType="light"
      :navbarInvertable="false">

      <div class="container mt-5 mb-3">
        <div class="row">
          <div class="col-md-4">
            <b-card
            no-block
            id="settings-menu"
            class="mb-3"
            :header="'Personal Settings'">
              <b-list-group>
                <b-list-group-item
                  action
                  v-for="form in forms"
                  :key="`form-${form.id}-chooser`"
                  :active="activeFormId === form.id"
                  @click.native="activeFormId = form.id">
                  {{ form.label }}
                </b-list-group-item>
              </b-list-group>
            </b-card>

          </div>
          <div class="col-md-8">

            <avatar-form
              v-if="activeFormId === 'avatar'"
              :header="'Avatar'"
              :submitText="'Update Avatar'"
              :type="'circle'"
              :endpoint="endpoints[forms.avatar.id]"
              :model="forms.avatar.model">
            </avatar-form>

            <card-form
              v-for="form in forms"
              :key="`form-${form.id}`"
              v-if="activeFormId === form.id && activeFormId !== 'avatar'"
              :header="form.label"
              :submitText="form.submitText"
              :endpoint="endpoints[form.id]"
              :schema="form.schema"
              :model="form.model">
            </card-form>

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
          submitText: 'Update Profile',
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
          submitText: 'Update Password',
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
        api: {
          id: 'api',
          label: 'API',
          submitText: 'Reset API Key',
          model: {},
          schema: {
            fields: [
              {
                model: 'api_key',
                label: 'API Key',
                type: 'input',
                inputType: 'text',
                readonly: true
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
    title: 'Account Settings'
  },

  computed: {
    endpoints: function () {
      return {
        profile: `account/${this.$store.state.currentUser.name}/update`,
        avatar: `account/${this.$store.state.currentUser.name}/update`,
        security: `account/${this.$store.state.currentUser.name}/update`,
        api: `account/${this.$store.state.currentUser.name}/resetapikey`
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
      this.forms.api.model = data.api_form
      this.forms.api.model.api_key = data.user.api_key
      this.forms.profile.model.btn = 'Profile'
      this.forms.avatar.model.btn = 'Upload'
      this.forms.security.model.btn = 'Password'
    },

    /**
     * Clear core data.
     */
    clearData () {
      this.forms.profile.model = {}
      this.forms.avatar.model = {}
      this.forms.security.model = {}
      this.forms.api.model = {}
    }
  },

  beforeRouteEnter (to, from, next) {
    let data = {}
    pybossaApi.get(`account/${to.params.username}/update`).then(r => {
      data = r.data
      return pybossaApi.get(`account/${to.params.username}/`)
    }).then(r => {
      data.user = r.data.user
      return pybossaApi.get(`account/${to.params.username}/resetapikey`)
    }).then(r => {
      data.api_form = r.data.form
      next(vm => vm.setData(data))
    })
  },

  beforeRouteUpdate (to, from, next) {
    this.clearData()
    let data = {}
    pybossaApi.get(`account/${to.params.username}/update`).then(r => {
      data = r.data
      return pybossaApi.get(`account/${to.params.username}/`)
    }).then(r => {
      data.user = r.data.user
      return pybossaApi.get(`account/${to.params.username}/resetapikey`)
    }).then(r => {
      data.api_form = r.data.form
      this.setData(data)
      next()
    })
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

#settings-menu {
  .card-header {
    text-align: center;
  }

  .list-group-item {
    cursor: default;
    border-left: none;
    border-right: none;

    &:first-child {
      border-top: none;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .card-block {
    display: flex;
    flex-direction: column;
  }
}
</style>
