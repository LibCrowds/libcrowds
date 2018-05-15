<template>
  <modal-form
    :form="form"
    :modalId="modalId"
    title="Add a project filter"
    @submit="processForm"
    @shown="resetModel">
  </modal-form>
</template>

<script>
import localConfig from '@/local.config'
import VueFormGenerator from 'vue-form-generator'
import ModalForm from '@/components/forms/Modal'

export default {
  data () {
    return {
      form: {
        model: {}, // See resetModel()
        schema: {
          fields: [
            {
              model: 'purpose',
              label: 'Purpose',
              type: 'select',
              required: true,
              hint: 'The purpose of the AnnotationCollection.',
              values: [
                { id: 'results', name: 'Storing results' },
                { id: 'tags', name: 'Storing user tags' }
              ],
              hideNoneSelectedText: true,
              validator: VueFormGenerator.validators.required
            },
            {
              model: 'label',
              label: 'Label',
              type: 'input',
              inputType: 'text',
              required: true,
              hint: 'A human-readable label for the AnnotationCollection.',
              validator: VueFormGenerator.validators.string
            },
            {
              model: 'slug',
              label: 'Slug',
              type: 'input',
              inputType: 'text',
              required: true,
              hint: `Used to form part of the AnnotationCollection's IRI.`,
              validator: (value) => {
                const checkFunc = this.getAnnotationCollection
                return new Promise((resolve, reject) => {
                  if (!value.length) {
                    resolve([ 'This field is required!' ])
                  }

                  // Check that the IRI does not already exist
                  /* eslint-disable handle-callback-err */
                  checkFunc(value).then(r => {
                    resolve([
                      `An AnnotationCollection is already using this slug ` +
                      `(see ${r.data.id})`
                    ])
                  }).catch(err => {
                    // We don't know at this stage if the error is because
                    // of a 404 (which is what we want) or something else, but
                    // easiest to just resolve for now and any deal with any
                    // other errors during creation.
                    resolve()
                  })
                })
              }
            }
          ]
        }
      }
    }
  },

  components: {
    ModalForm
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

  methods: {
    /**
     * Process the AnnotationCollection form.
     */
    processForm () {
      const purpose = this.form.model.purpose
      const currentIri = this.collection.info.annotations[purpose]
      if (!currentIri) {
        this.addAnnotationCollection()
        return
      }

      return this.$swal({
        title: `Confirm`,
        html: `An AnnotationCollection is already linked to the collection
        microsite for this purpose:<br><br>
        <a href="${currentIri}" _target="blank">${currentIri}</a><br><br>
        Once AnnotationCollections have been generated for a particular
        purpose they should not normally be changed, especially without
        first migrating the data.<br><br>
        Are you sure you want to continue?`,
        type: 'question',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.addAnnotationCollection()
        }
      }).catch(err => {
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$notifications.error({ message: err.message })
        }
      })
    },

    /**
     * Add an AnnotationCollection.
     */
    addAnnotationCollection () {
      const libcrowdsHost = localConfig.libcrowdsHost
      const data = {
        type: [
          'AnnotationCollection',
          'BasicContainer'
        ],
        creator: `${libcrowdsHost}/api/category/${this.collection.id}`,
        label: this.form.model.label
      }
      const slug = this.form.model.slug
      return this.$explicates.createCollection(data, slug).then(r => {
        return this.updateCollection(r.data.id, this.form.model.purpose)
      }).catch(err => {
        this.$notifications.error({ message: err.message })
      })
    },

    /**
     * Store an AnnotationCollection IRI in the LibCrowds collection data.
     * @param {String} iri
     *   The AnnotationCollection IRI.
     * @param {String} purpose
     *   The purpose of the collection (e.g. "results").
     */
    updateCollection (iri, purpose) {
      const infoClone = JSON.parse(JSON.stringify(this.collection.info))
      infoClone.annotations[purpose] = iri
      return this.$axios.$put(`/api/category/${this.collection.id}`, {
        info: infoClone
      }).then(data => {
        this.$emit('success')
        this.$store.dispatch('UPDATE_CURRENT_COLLECTION', data)
      }).catch(err => {
        this.$notifications.error({ message: err.messag })
        this.deleteAnnotationCollection(iri)
      })
    },

    /**
     * Delete an AnnotationCollection.
     *
     * Only required if we fail to store the IRI in the collection metadata.
     * @param {String} iri
     *   The AnnotationCollection IRI.
     */
    deleteAnnotationCollection (iri) {
      this.$explicates.deleteCollection(iri).catch(err => {
        this.$notifications.error({ message: err.message })
      })
    },

    /**
     * Get an AnnotationCollection by slug.
     * @param {String} slug
     *   The AnnotationCollection IRI.
     */
    getAnnotationCollection (slug) {
      return this.$explicates.getCollectionBySlug(slug)
    },

    /**
     * Reset the model.
     */
    resetModel () {
      this.form.model = {
        purpose: '',
        slug: '',
        label: ''
      }
    }
  }
}
</script>
