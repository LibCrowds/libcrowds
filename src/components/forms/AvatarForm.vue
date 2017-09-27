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
      <div id="preview" ref="preview"></div>

      <div class="mt-2">
        <b-form-file
          ref="file"
          accept="image/*"
          v-model="form.model.avatar"
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
      file: null,
      croppie: null
    }
  },

  props: {
    header: {
      type: String,
      default: 'Avatar'
    },
    form: {
      type: Object,
      required: true
    },
    submitText: {
      type: String,
      default: 'Submit'
    },
    cropType: {
      type: String,
      default: 'circle'
    },
    viewportWidth: {
      type: Number,
      default: 300
    },
    viewportHeight: {
      type: Number,
      default: 300
    }
  },

  components: {
    Loading
  },

  computed: {
    loading: function () {
      return isEmpty(this.form.model)
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
      delete this.form.model.id

      // The Content-Type is removed so that the avatar is handled properly
      pybossaApi.post(this.form.endpoint, this.form.model, {
        headers: {
          'X-CSRFToken': this.form.model.csrf,
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
      reader.readAsDataURL(this.form.model.avatar)
    }
  },

  mounted () {
    const previewEl = this.$refs.preview
    this.croppie = new Croppie(previewEl, {
      viewport: {
        width: this.viewportWidth,
        height: this.viewportHeight,
        type: this.cropType
      },
      enableOrientation: true,
      update: (data) => {
        this.form.model.x1 = Math.floor(data.points[0])
        this.form.model.y1 = Math.floor(data.points[1])
        this.form.model.x2 = Math.floor(data.points[2])
        this.form.model.y2 = Math.floor(data.points[3])
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

  #preview {
    height: 400px;
  }
}
</style>
