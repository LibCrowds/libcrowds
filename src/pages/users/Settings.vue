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
                v-for="category in settings"
                :key="category.id"
                :active="active === category.id"
                @click.native="active = category.id">
                {{ category.label }}
              </b-list-group-item>
            </b-list-group>

          </div>
          <div class="col-md-8">

            <card-form
              v-if="active === 'profile'"
              :header="'Profile Settings'"
              :submitText="'Update Profile'"
              :endpoint="endpoint"
              :schema="profileFormSchema"
              :model="profileFormModel">
            </card-form>

            <avatar-form
              v-if="active === 'avatar'"
              :header="'Avatar Settings'"
              :submitText="'Update Avatar'"
              :type="'circle'"
              :endpoint="endpoint"
              :model="avatarFormModel">
            </avatar-form>

            <card-form
              v-if="active === 'security'"
              :header="'Security Settings'"
              :submitText="'Update Password'"
              :endpoint="endpoint"
              :schema="securityFormSchema"
              :model="securityFormModel">
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
      settings: [
        { label: 'Profile', id: 'profile' },
        { label: 'Avatar', id: 'avatar' },
        { label: 'Security', id: 'security' }
      ],
      active: 'profile',
      profileFormModel: {},
      avatarFormModel: {},
      securityFormModel: {},
      profileFormSchema: {
        fields: [
          {
            model: 'fullname',
            label: 'Full name',
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
      },
      securityFormSchema: {
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

  components: {
    BasicLayout,
    AvatarForm,
    CardForm
  },

  computed: {
    endpoint: function () {
      return `account/${this.profileFormModel.name}/update`
    }
  },

  metaInfo: {
    title: 'User Settings'
  },

  methods: {
    /**
     * Set the form data.
     */
    setData (data) {
      this.username = data.username
      this.profileFormModel = data.form
      this.avatarFormModel = data.upload_form
      this.securityFormModel = data.password_form
      this.profileFormModel.btn = 'Profile'
      this.avatarFormModel.btn = 'Upload'
      this.securityFormModel.btn = 'Password'
    }
  },

  beforeRouteEnter (to, from, next) {
    const username = to.params.username
    pybossaApi.get(`account/${username}/update`).then(r => {
      r.data.username = username
      next(vm => vm.setData(r.data))
    }).catch(err => {
      console.log(err)
      window.location.path = '/404'
    })
  },

  beforeRouteUpdate (to, from, next) {
    const username = to.params.username
    this.profileFormModel = {}
    this.avatarFormModel = {}
    this.securityFormModel = {}
    pybossaApi.get(`account/${username}/update`).then(r => {
      r.data.username = username
      this.setData(r.data)
      next()
    }).catch(err => {
      console.log(err)
      window.location.path = '/404'
    })
  }
}
</script>
