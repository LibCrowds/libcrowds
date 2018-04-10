import { getShortname } from '@/mixins/getShortname'

export const customExportSchema = {
  mixins: [ getShortname ],

  computed: {
    customExportSchema () {
      const collection = this.$store.state.currentCollection
      const templates = typeof collection.info === 'undefined'
        ? []
        : collection.info.templates

      return {
        fields: [
          {
            model: 'name',
            label: 'Name',
            type: 'input',
            inputType: 'text',
            onChanged: (model, newVal, oldVal, field) => {
              const newSn = this.getShortname(newVal)
              const oldSn = this.getShortname(oldVal)
              if (!model.short_name || model.short_name === oldSn) {
                model.short_name = newSn
              }
            },
            hint: 'The name of the custom export.'
          },
          {
            model: 'short_name',
            label: 'Short Name',
            type: 'input',
            inputType: 'text',
            hint: 'An identifier used in the filenames of downloaded files.'
          },
          {
            model: 'motivation',
            label: 'Motivation',
            type: 'vueMultiSelect',
            values: [
              { id: 'describing', name: 'Describing' },
              { id: 'tagging', name: 'Tagging' },
              { id: 'commenting', name: 'Commenting' }
            ],
            hint: 'The annotation motivation.',
            selectOptions: {
              label: 'name',
              trackBy: 'id'
            }
          },
          {
            model: 'root_template_id',
            label: 'Root Template',
            type: 'vueMultiSelect',
            values: templates,
            hint: 'The root template (leave blank to include everything).',
            selectOptions: {
              label: 'name',
              trackBy: 'id'
            }
          },
          {
            model: 'include',
            label: 'Include',
            type: 'vueMultiSelect',
            values: templates,
            hint: 'Include additional templates not already within the ' +
              'chosen hierarchy.',
            selectOptions: {
              label: 'name',
              trackBy: 'id',
              multiple: true
            }
          }
        ]
      }
    }
  }
}
