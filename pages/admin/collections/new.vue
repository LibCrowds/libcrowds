<template>

</template>

<script>

export default {
  layout: 'dashboards/admin',

  data () {
    return {
      form: {
        model: {
          'key': null,
          'name': null,
          'tagline': null,
          'description': null,
          'forumUrl': null,
          'presenter': null
        },
        schema: {
          fields: [
            {
              model: 'key',
              label: 'Key',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'name',
              label: 'Name',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'tagline',
              label: 'Tagline',
              type: 'input',
              inputType: 'text'
            },
            {
              model: 'description',
              label: 'Description',
              type: 'textArea',
              rows: 2
            },
            {
              model: '',
              label: 'Presenter',
              type: 'select',
              values: [
                'libcrowds-viewer',
                'z3950'
              ]
            }
          ]
        }
      }
    }
  },

  head () {
    return {
      title: `Collections`
    }
  }
}
</script>
