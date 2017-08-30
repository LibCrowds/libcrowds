<template>
  <div id="account-settings">
    <basic-layout :background="'geometry'">

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
                  {{ form.header }}
                </b-list-group-item>
              </b-list-group>
            </b-card>

          </div>
          <div class="col-md-8">

            <avatar-form
              v-if="activeFormId === 'avatar'"
              :header="forms.avatar.header"
              :submitText="'Update Avatar'"
              :type="'circle'"
              :endpoint="forms.avatar.endpoint"
              :model="forms.avatar.model">
            </avatar-form>

            <card-form
              v-for="form in forms"
              :key="`form-${form.id}`"
              v-if="activeFormId === form.id && activeFormId !== 'avatar'"
              :header="form.header"
              :submitText="form.submitText"
              :form="form.form">
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
      models: {
        profile: {},
        security: {},
        api: {},
        avatar: {}
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
    forms: function () {
      return {
        profile: {
          id: 'profile',
          header: 'Profile',
          submitText: 'Update Profile',
          form: {
            endpoint: `account/${this.$store.state.currentUser.name}/update`,
            method: 'post',
            model: this.models.profile,
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
          }
        },
        security: {
          id: 'security',
          header: 'Security',
          submitText: 'Update Password',
          form: {
            endpoint: `account/${this.$store.state.currentUser.name}/update`,
            method: 'post',
            model: this.models.security,
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
          }
        },
        api: {
          id: 'api',
          header: 'API',
          submitText: 'Reset API Key',
          form: {
            endpoint: `account/${this.$store.state.currentUser.name}/resetapikey`,
            method: 'post',
            model: this.models.api,
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
          }
        },
        avatar: {
          id: 'avatar',
          header: 'Avatar',
          endpoint: `account/${this.$store.state.currentUser.name}/update`,
          model: this.models.avatar,
          schema: {}
        }
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
      this.models = {
        profile: data.form,
        security: data.password_form,
        api: data.api_form,
        avatar: data.upload_form
      }
      this.models.profile.btn = 'Profile'
      this.models.avatar.btn = 'Upload'
      this.models.security.btn = 'Password'
      this.models.api.api_key = data.user.api_key
    },

    /**
     * Clear core data.
     */
    clearData () {
      this.models = {
        profile: {},
        security: {},
        api: {},
        avatar: {}
      }
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
