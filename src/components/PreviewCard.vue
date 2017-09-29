<template>
  <b-card
    class="preview-card"
    :header="'Preview'">
    <b-card>
      <div
        v-for="(field, index) in previewFields"
        :key="`preview-field-${index}`"
        :class="field.class">

        <span
          v-if="field.format === 'date'">
          {{ field.value | formatDate }}
        </span>

        <span
          v-else-if="field.format === 'markdown'"
          v-html="marked(field.value)">
        </span>

        <span v-else>
          {{ field.value }}
        </span>

      </div>
    </b-card>
  </b-card>
</template>

<script>
import marked from 'marked'

export default {
  data: function () {
    return {
      placeholders: {
        short: 'Vivamus sit amet mattis lacus',
        long: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          congue turpis et enim volutpat, at maximus lectus pulvinar. Proin
          euismod ante non nunc varius, quis porttitor eros consectetur.`,
        date: new Date().toISOString()
      }
    }
  },

  props: {
    fields: {
      type: Array,
      required: true,
      validator: allFields => {
        const validFields = allFields.filter(field => {
          return 'value' in field && 'placeholder' in field
        })
        return validFields.length === allFields.length
      }
    }
  },

  computed: {
    previewFields: function () {
      return this.fields.map(field => {
        field.value = field.value || this.placeholders[field.placeholder]
        return field
      })
    }
  },

  methods: {
    /**
     * Markdown processor.
     */
    marked
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

.preview-card {
  @extend .bg-light;

  * {
    &:not(:last-child) {
      margin-bottom: 1rem;
    }

    p:last-child {
      margin-bottom: 0;
    }
  }

  .title {
    font-size: $font-size-base;
    font-family: $font-family-base;
    font-weight: 600;
    text-transform: uppercase;
    color: $gray-600;
  }

  .info {
    font-size: $font-size-sm;
    font-style: italic;
    color: $gray-300;
  }
}
</style>
pybossaform
