<template>
  <b-card
    class="avatar-form"
    :header="header"
    show-footer>

    <div id="preview" ref="preview"></div>

    <div class="mt-2">
      <b-form-file
        id="avatar-form-file"
        ref="file"
        accept="image/*"
        v-model="form.model.avatar"
        @input="onInput">
      </b-form-file>
    </div>

    <template slot="footer">
      <b-btn
        variant="success"
        class="float-right"
        @click="submit">
        {{ submitText }}
      </b-btn>
    </template>

  </b-card>
</template>

<script>
import axios from 'axios'
import { notifications } from '@/mixins/notifications'
import localConfig from '@/local.config'

export default {
  data () {
    return {
      status: null,
      file: null,
      croppie: null
    }
  },

  mixins: [ notifications ],

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

  methods: {
    /**
     * Submit the form.
     */
    submit () {
      let formData = new FormData()
      formData.append('x1', this.form.model.x1)
      formData.append('x2', this.form.model.x2)
      formData.append('y1', this.form.model.y1)
      formData.append('y2', this.form.model.y2)
      formData.append('csrf', this.form.model.csrf)
      formData.append('btn', 'Upload')
      formData.append('avatar', this.form.model.avatar)

      const url = `${localConfig.pybossa.host}/${this.form.endpoint}`
      axios.post(url, formData, {
        headers: {
          'X-CSRFToken': this.form.model.csrf
        },
        withCredentials: true
      }).then(data => {
        this.notify({
          title: 'Success',
          message: 'The image should be refreshed in a few minutes',
          type: 'success'
        })
      }).catch(err => {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      })
    },

    /**
     * Load the image on file input.
     */
    onInput () {
      const reader = new FileReader()
      reader.onload = (evt) => {
        this.file = evt.target.result
        this.croppie.bind({
          url: this.file
        })
      }
      reader.readAsDataURL(this.form.model.avatar)
    }
  },

  mounted () {
    const Croppie = require('croppie')
    const previewEl = this.$refs.preview
    this.croppie = new Croppie(previewEl, {
      viewport: {
        width: this.viewportWidth,
        height: this.viewportHeight,
        type: this.cropType
      },
      boundary: {
        width: '100%',
        height: 350
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
@import '~assets/style/settings';
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
