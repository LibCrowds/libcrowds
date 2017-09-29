<template>
  <b-card class="publication-card">
    <div class="card-title">
      <span v-if="publication.title">
        {{ publication.title }}
      </span>
      <span v-else-if="showPlaceholders">
        {{ placeholders.title }}
      </span>
    </div>
    <div class="card-text publication-created">
      <span v-if="publication.created">
        {{ publication.created | formatDate }}
      </span>
      <span v-else-if="showPlaceholders">
        {{ placeholders.created | formatDate }}
      </span>
    </div>
    <hr class="my-1">
    <div class="card-text publication-body">
      <span
        v-if="publication.body"
        v-html="marked(publication.body)">
      </span>
      <span
        v-else-if="showPlaceholders"
        v-html="marked(placeholders.body)">
      </span>
    </div>
  </b-card>
</template>

<script>
import marked from 'marked'

export default {
  data: function () {
    return {
      placeholders: {
        title: 'Title',
        created: '2017-08-21T17:08:39.192021',
        body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.`
      }
    }
  },

  props: {
    publication: {
      type: Object,
      required: true
    },
    showPlaceholders: {
      type: Boolean,
      default: false
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

.publication-card {

  .card-title {
    font-size: $font-size-base;
    font-family: $font-family-base;
    font-weight: 600;
    text-transform: uppercase;
    color: $gray-1000;
  }

  .publication-created {
    font-size: $font-size-sm;
    font-style: italic;
    color: $gray-600;
  }

  .publication-body {
    p:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
