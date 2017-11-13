<template>
  <form-base
    class="image-upload-form"
    :header="header"
    :show-footer="showFooter"
    :no-body="noBody"
    :no-border="noBorder"
    :show-cancel="showCancel"
    :cancel-text="cancelText"
    :processing="processing"
    :submit-text="submitText"
    @submit="submit"
    @cancel="$emit('cancel')">

    <div id="preview" ref="preview" @click="onPreviewClick"></div>

    <div class="mt-2">
      <b-form-file
        id="image-upload-form-file"
        ref="formfile"
        accept="image/*"
        v-model="model[fileField]"
        @input="onInput">
      </b-form-file>
    </div>

  </form-base>
</template>

<script>
import keys from 'lodash/keys'
import intersection from 'lodash/intersection'
import axios from 'axios'
import { notifications } from '@/mixins/notifications'
import localConfig from '@/local.config'
import FormBase from '@/components/forms/Base'

export default {
  data () {
    return {
      file: null,
      croppie: null,
      processing: false
    }
  },

  mixins: [ notifications ],

  components: {
    FormBase
  },

  props: {
    endpoint: {
      type: String,
      required: true
    },
    model: {
      type: Object,
      required: true,
      validator: (value) => {
        const required = ['x1', 'x2', 'y1', 'y2']
        return intersection(required, keys(value)).length === required.length
      }
    },
    method: {
      type: String,
      default: 'POST',
      validator: (value) => {
        return ['POST', 'PUT'].indexOf(value.toUpperCase()) > -1
      }
    },
    fileField: {
      type: String,
      default: 'file'
    },
    cropType: {
      type: String,
      default: 'circle',
      validator: (value) => {
        return ['circle', 'square'].indexOf(value) > -1
      }
    },
    viewportWidth: {
      type: Number,
      default: 300
    },
    viewportHeight: {
      type: Number,
      default: 300
    },
    header: {
      type: String,
      default: ''
    },
    submitText: {
      type: String,
      default: 'Submit'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    noBody: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    /**
     * Submit the form.
     */
    submit () {
      this.processing = true
      let formData = new FormData()
      for (let field in this.model) {
        formData.append(field, this.model[field])
      }

      axios({
        baseURL: localConfig.pybossa.host,
        url: this.endpoint,
        method: this.method,
        data: formData,
        headers: {
          'X-CSRFToken': this.model.csrf
        },
        withCredentials: true
      }).then(data => {
        this.notifySuccess({
          message: 'The image should be refreshed in a few minutes'
        })
      }).catch(err => {
        this.$nuxt.error(err)
      }).then(() => {
        this.processing = false
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
      reader.readAsDataURL(this.model[this.fileField])
    },

    /**
     * Click the form file input on preview click if no image loaded.
     */
    onPreviewClick () {
      if (!this.file) {
        this.$refs.formfile.$el.querySelector('input').click()
      }
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
@import '~assets/style/settings';
@import '~croppie/croppie';

.image-upload {
  .custom-file {
    width: 100%;
  }

  #preview {
    height: 400px;
  }
}
</style>
