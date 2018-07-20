<template>
  <card-base
    :title="title"
    :description="description"
    docs="/collections/tags/">

    <p slot="guidance">
      Use the table below to delete tags. Note that the same word may be used
      to tag multiple items and therefore could appear multiple times in the
      table below, you can use the search button above to filter the
      table.
    </p>

    <b-form slot="controls" :class="darkMode ? 'form-dark' : null">
      <b-form-input
        v-model="searchString"
        class="search-control"
        size="sm"
        placeholder="Type to search">
      </b-form-input>
    </b-form>

    <b-table
      responsive
      striped
      hover
      show-empty
      :dark="darkMode"
      :items="tagAnnotations"
      :fields="tableFields">
      <template slot="action" slot-scope="row">
        <b-btn
          variant="warning"
          size="sm"
          @click="deleteTag(row.item)">
          Delete
        </b-btn>
      </template>
    </b-table>

    <infinite-load-annotations
      ref="infiniteload"
      v-if="hasTagAnnotations"
      v-model="tagAnnotations"
      :search-keys="searchKeys"
      :search-string="searchString"
      :container-iri="currentCollection.info.annotations.tags"
      no-results="It looks like nothing has been tagged yet!"
      no-more-results="">
    </infinite-load-annotations>

  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { metaTags } from '@/mixins/metaTags'
import InfiniteLoadAnnotations from '@/components/infiniteload/Annotations'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags ],

  data () {
    return {
      title: 'Item Tags',
      description: 'Manage item tags for the collection microsite.',
      tagAnnotations: [],
      tableFields: {
        'body.value': {
          label: 'Name'
        },
        action: {
          label: 'Action',
          class: 'text-center'
        }
      },
      searchKeys: [
        'body.value'
      ],
      searchString: ''
    }
  },

  components: {
    CardBase,
    InfiniteLoadAnnotations
  },

  computed: {
    currentCollection () {
      return this.$store.state.currentCollection
    },

    hasTagAnnotations () {
      return this.currentCollection.info.annotations.hasOwnProperty('tags')
    }
  },

  methods: {
    /**
     * Delete a tag.
     * @param {Object}
     *   The tag.
     */
    deleteTag (tag) {
      this.$swal({
        title: `Confirm`,
        html: `This tag will be removed permanently.<br><br>
        Are you sure you want to continue?`,
        type: 'question',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.$axios.$delete(tag.id)
        }
      }).then(r => {
        this.reset()
        this.$notifications.success({
          message: 'Tag deleted'
        })
      }).catch(err => {
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$notifications.error({ message: err.message })
        }
      })
    },

    /**
     * Reset the loaded items.
     */
    reset () {
      this.$refs.infiniteload.reset()
    }
  }
}
</script>
