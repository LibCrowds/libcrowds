<template>
  <card-base :title="title" :description="description">
    <div class="float-md-right" slot="controls">
      <b-btn
        variant="success"
        class="my-1"
        size="sm"
        :to="{
          name: 'admin-collection-short_name-volumes-new',
          params: {
            short_name: this.collection.short_name
          }
        }">
        New
      </b-btn>
    </div>

    <p slot="guidance">
      Volumes provide the initial input used to generate tasks and group
      tasks. For example, a volume may contain a reference to a IIIF manifest
      URI via which the location of images can be retrieved and used to
      generate a set of tasks. Volumes also help with the aggregation of
      results data.
    </p>
    <p slot="guidance">
      The volumes currently available for this collection microsite are listed
      below.
    </p>

    <volumes-table :volumes="volumes">
      <template slot="action" slot-scope="volume">
        <b-btn
          variant="warning"
          size="sm"
          @click="deleteVolume(volume.item.id, $event)">
          Delete
        </b-btn>
        <b-btn
          variant="success"
          size="sm"
          :to="{
            name: 'admin-collection-short_name-volumes-id',
            params: {
              short_name: collection.short_name,
              id: volume.item.id
            }
          }">
          Update
        </b-btn>
      </template>
    </volumes-table>

  </card-base>
</template>

<script>
import { fetchCollectionByName } from '@/mixins/fetchCollectionByName'
import { metaTags } from '@/mixins/metaTags'
import VolumesTable from '@/components/tables/Volumes'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-collection-dashboard',

  mixins: [ fetchCollectionByName, metaTags ],

  data () {
    return {
      title: 'Volumes',
      description: `Manage the volumes for the collection.`
    }
  },

  asyncData ({ params, app, error }) {
    const endpoint = `/lc/categories/${params.short_name}/volumes`
    return app.$axios.$get(endpoint).then(data => {
      return {
        volumes: data.volumes
      }
    })
  },

  components: {
    CardBase,
    VolumesTable
  },

  computed: {
    collection () {
      return this.$store.state.currentCollection
    }
  },

  methods: {
    /**
     * Delete a volume.
     * @param {String} id
     *   The volume ID.
     * @param {Object} evt
     *   The event.
     */
    async deleteVolume (id, evt) {
      evt.target.setAttribute('disabled', true)

      const noProjects = await this.hasNoProjects(id)
      if (!noProjects) {
        evt.target.removeAttribute('disabled')
        this.$swal({
          title: 'Cannot Delete',
          text: 'This volume is already attached to projects and therefore ' +
            'cannot be deleted.',
          type: 'warning'
        }).catch(err => {
          // Refactor if vue-sweetalert gets updated to swal v.7
          if (
            !(typeof err === 'string' ||
            (typeof err === 'object' && err.hasOwnProperty('dismiss')))
          ) {
            this.$nuxt.error(err)
          }
        })
        return
      }

      const infoClone = JSON.parse(JSON.stringify(this.collection.info))
      infoClone.volumes = this.collection.info.volumes.filter(vol => {
        return vol.id !== id
      })

      this.$swal({
        title: `Delete Volume`,
        text: `Are you sure you want to delete this volume?`,
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.$axios.$put(`/api/category/${this.collection.id}`, {
            info: infoClone
          })
        }
      }).then(result => {
        if (result) {
          this.$notifications.success({
            message: 'Volume deleted'
          })
          this.$store.dispatch('UPDATE_CURRENT_COLLECTION', result)
          this.volumes = this.volumes.filter(vol => (vol.id !== id))
        }
      }).catch(err => {
        // Refactor if vue-sweetalert gets updated to swal v.7
        if (
          !(typeof err === 'string' ||
          (typeof err === 'object' && err.hasOwnProperty('dismiss')))
        ) {
          this.$nuxt.error(err)
        }
      }).then(() => {
        evt.target.removeAttribute('disabled')
      })
    },

    /**
     * Check that a volume is not assigned to any projects.
     * @param {id} id
     *   The volume ID.
     */
    async hasNoProjects (id) {
      const projectsData = await this.$axios.get('/api/project', {
        params: {
          category_id: this.collection.id,
          all: 1,
          info: {
            volume_id: id
          }
        }
      })
      return projectsData.data.length < 1
    }
  }
}
</script>
