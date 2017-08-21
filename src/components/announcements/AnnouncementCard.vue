<template>
  <b-card class="announcement-card">
    <div class="card-title">
      <span v-if="announcement.title">
        {{ announcement.title }}
      </span>
      <span v-else-if="showPlaceholders">
        {{ placeholders.title }}
      </span>
    </div>
    <div class="card-text announcement-created">
      <span v-if="announcement.created">
        {{ announcement.created | formatDate }}
      </span>
      <span v-else-if="showPlaceholders">
        {{ placeholders.created | formatDate }}
      </span>
    </div>
    <hr class="my-1">
    <div class="card-text announcement-body">
      <span
        v-if="announcement.body"
        v-html="marked(announcement.body)">
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
    announcement: {
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

.announcement-card {
  border: none;

  .card-title {
    font-size: $font-size-base;
    font-family: $font-family-base;
    font-weight: 600;
    text-transform: uppercase;
    color: $gray-dark;
  }

  .announcement-created {
    font-size: $font-size-sm;
    font-style: italic;
    color: $gray-light;
  }

  .announcement-body {
    p:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
