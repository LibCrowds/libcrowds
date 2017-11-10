<template>
  <b-modal
    ref="modal"
    :id="modalId"
    title="Add aoptions tag"
    @ok="handleOk"
    @hidden="reset">

    <form @submit="handleOk" class="px-2 pt-2">
      <b-form-group
        id="type"
        label="Type"
        :state="getState('type')"
        :feedback="this.errors['type']"
        horizontal>
        <multiselect
          tag-placeholder="Press enter to create a type"
          :taggable="true"
          :options="availableTypes"
          v-model="tag.type"
          @tag="addType">
          <span slot="noResult">
            No tags found, try changing the search query
          </span>
        </multiselect>
      </b-form-group>

      <b-form-group id="color" label="Colour" horizontal>
        <b-form-input v-model="tag.color" type="color"></b-form-input>
      </b-form-group>

      <b-form-group
        id="name"
        label="Name"
        :state="getState('name')"
        :feedback="this.errors['name']"
        horizontal>
        <b-form-input v-model="tag.name" type="text"></b-form-input>
      </b-form-group>
    </form>

  </b-modal>
</template>

<script>
import capitalize from 'capitalize'
import isEmpty from 'lodash/isEmpty'
import { notifications } from '@/mixins/notifications'

export default {
  mixins: [ notifications ],

  data () {
    return {
      tag: {
        name: '',
        type: '',
        color: '#2589BD'
      },
      newType: null,
      processing: false,
      errors: {}
    }
  },

  props: {
    modalId: {
      type: String,
      required: true
    },
    collection: {
      type: Object,
      required: true
    }
  },

  computed: {
    availableTypes () {
      const types = Object.keys(this.collection.info.tags)
      if (this.newType) {
        types.push(this.newType)
      }
      return types
    }
  },

  methods: {
    /**
     * Add a new Type
     * @param {String} newType
     *   The new type.
     */
    addType (newType) {
      this.newType = capitalize(newType)
      this.tag.type = this.newType
    },

    /**
     * Validate and submit on OK click.
     */
    handleOk (evt) {
      evt.preventDefault()

      // Validate
      this.errors = {}
      if (!this.tag.type) {
        this.errors['type'] = 'Please choose a type'
      }
      if (!this.tag.name) {
        this.errors['name'] = 'Please enter a name'
      }

      // Submit
      if (isEmpty(this.errors)) {
        this.addTag()
      } else {
        this.notify({
          type: 'warn',
          title: 'Invalid form data',
          message: 'Please correct the errors'
        })
      }
    },

    /**
     * Add the tag.
     */
    addTag () {
      this.processing = true
      const newTag = this.collection.info.tags[this.tag.type] || {}
      newTag.options = newTag.options || []

      // Optional as the modal can also be used for editing
      if (newTag.options.indexOf(this.tag.name) < 0) {
        newTag.options.push(this.tag.name)
      }

      newTag.color = this.tag.color
      this.collection.info.tags[this.tag.type] = newTag
      return this.$axios.$put(`/api/category/${this.collection.id}`, {
        info: this.collection.info
      }).then(data => {
        this.$refs.modal.hide()
        this.notify({
          type: 'success',
          title: 'Success',
          message: 'Tag added'
        })
        this.processing = false
        this.$emit('update', this.tag)
      })
    },

    /**
     * Get the state for a form field.
     * @param {String} field
     *   The form field.
     */
    getState (field) {
      return this.errors.hasOwnProperty(field) ? 'invalid' : 'valid'
    },

    /**
     * Reset the form.
     */
    reset () {
      this.errors = {}
      this.newType = null
      this.tag = {
        name: '',
        type: '',
        color: '#2589BD'
      }
    },

    show () {
      this.$refs.modal.show()
    }
  }
}
</script>
