<template>
  <b-card
    class="avatar-form"
    :header="header"
    show-footer>

    <b-alert
      show
      :variant="status === 'error' ? 'danger' : status"
      v-for="msg in flashMsg"
      :key="msg"
      key="flash">
      {{ msg }}
    </b-alert>

    <loading
      v-if="loading"
      text="Loading form">
    </loading>

    <span v-else>
      <div ref="preview"></div>

      <div class="mt-2">
        <b-form-file
          ref="file"
          accept="image/*"
          v-model="model.avatar"
          @input="onInput">
        </b-form-file>
      </div>

    </span>

    <template slot="footer">
      <b-button
        variant="success"
        class="float-right"
        @click="submit">
        {{ submitText }}
      </b-button>
    </template>

  </b-card>
</template>

<script>
import Croppie from 'croppie'
import isEmpty from 'lodash/isEmpty'
import pybossaApi from '@/api/pybossa'
import Loading from '@/components/Loading'

export default {
  data: function () {
    return {
      status: null,
      flash: '',
      croppie: null,
      file: null
    }
  },

  props: {
    endpoint: {
      type: String,
      required: true
    },
    header: {
      type: String,
      default: 'Avatar'
    },
    model: {
      type: Object,
      required: true
    },
    submitText: {
      type: String,
      default: 'Submit'
    },
    type: {
      type: String,
      default: 'circle'
    }
  },

  components: {
    Loading
  },

  computed: {
    loading: function () {
      return isEmpty(this.model)
    },

    flashMsg: function () {
      // To handle disappearing and multiple alerts
      return this.flash ? [this.flash] : []
    }
  },

  methods: {
    /**
     * Submit the form.
     */
    submit () {
      this.flash = ''

      // See https://github.com/LibCrowds/vue-pybossa-frontend/issues/100
      delete this.model.id

      // The Content-Type is removed so that the avatar is handled properly
      pybossaApi.post(this.endpoint, this.model, {
        headers: {
          'X-CSRFToken': this.model.csrf,
          'Content-Type': null
        },
        transformRequest: [function (data) {
          return data
        }]
      }).then(r => {
        if (r.data.status !== 'success') {
          this.flash = r.data.flash
          this.status = r.data.status
        }
      })
    },

    /**
     * Load the image on file input.
     */
    onInput () {
      const reader = new FileReader()
      reader.onload = (evt) => {
        this.croppie.bind({
          url: evt.target.result
        })
      }
      reader.readAsDataURL(this.model.avatar)
    }
  },

  mounted () {
    const previewEl = this.$refs.preview
    this.croppie = new Croppie(previewEl, {
      viewport: {
        width: '100%',
        height: 300,
        type: this.type
      },
      boundary: {
        width: 300,
        height: 300
      },
      enableOrientation: true,
      update: (data) => {
        this.model.x1 = Math.floor(data.points[0])
        this.model.y1 = Math.floor(data.points[1])
        this.model.x2 = Math.floor(data.points[2])
        this.model.y2 = Math.floor(data.points[3])
      }
    })
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';
@import '~croppie/croppie';

.avatar-form {
  label {
    font-size: $font-size-sm;
  }

  .custom-file {
    width: 100%;
  }
}
</style>
