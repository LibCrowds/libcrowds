<template>
  <div class="z3950-presenter">
    <div class="row p-4">
      <div class="col-sm-12 col-lg-6">

        <b-card no-block>
          <img v-if="currentTask" :src="currentTask.info.url">
          <loading
            v-else
            text="Loading image">
          </loading>
        </b-card>

      </div>
      <div class="col-sm-12 col-lg-6 mt-3 mt-lg-0">

        <card-form
          v-if="!searchResults.length"
          no-submit
          :header="header"
          :submitText="form.submitText"
          :form="form"
          @submit="form.onSubmit">

          <div slot="top" v-if="selectedRecord">
            {{ selectedRecord }}
          </div>

        </card-form>

        <b-card
          v-else
          no-block>
          <template slot="header">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-0">{{ header }}</h6>
              <b-button
                variant="info"
                size="sm"
                class="float-right"
                @click="searchResults = []">
                Search Again
              </b-button>
            </div>
          </template>
          <transition-group appear
            tag="div"
            class="list-group">
            <b-list-group-item
              v-for="(record, index) in searchResults"
              :key="`result-${index}`">
              <h5 class="mb-1">{{ record.title }}</h5>
              <p class="mb-1">{{ record.author }}</p>
              <footer>
                <b-button
                  variant="secondary"
                  size="sm"
                  @click="viewFullRecord(record)">
                  View Full Record
                </b-button>
                <b-button
                  variant="success"
                  size="sm"
                  @click="selectedRecord = record">
                  Select Record
                </b-button>
              </footer>
            </b-list-group-item>
          </transition-group>
        </b-card>

      </div>
    </div>

    <b-modal
      ref="modal"
      title="Full record"
      size="lg">
      <pre>
        <code ref="modalcontent">
        </code>
      </pre>
    </b-modal>

  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import intersection from 'lodash/intersection'
import Loading from '@/components/Loading'
import pybossaApi from '@/api/pybossa'
import CardForm from '@/components/forms/CardForm'

export default {
  data: function () {
    return {
      header: 'What is this item?',
      tasks: [],
      searchResults: [],
      currentTask: null,
      selectedRecord: null,
      searchForm: {
        submitText: 'Search',
        onSubmit: this.onSearch,
        endpoint: '/z3950/search/oclc/json',
        method: 'get',
        model: {
          'title': '',
          'author': '',
          'year': '',
          'isbn': ''
        },
        schema: {
          fields: [
            {
              model: 'title',
              label: 'Title',
              type: 'input',
              inputType: 'text',
              placeholder: 'Search by title'
            },
            {
              model: 'author',
              label: 'Author',
              type: 'input',
              inputType: 'text',
              placeholder: 'Search by author'
            },
            {
              model: 'year',
              label: 'Year',
              type: 'input',
              inputType: 'text',
              placeholder: 'Search by year'
            },
            {
              model: 'isbn',
              label: 'ISBN',
              type: 'input',
              inputType: 'text',
              placeholder: 'Search by ISBN'
            }
          ]
        }
      },
      shelfmarkForm: {
        submitText: 'Submit',
        onSubmit: this.onSubmit,
        endpoint: '/api/taskrun',
        method: 'post',
        model: {
          'shelfmark': null
        },
        schema: {
          fields: [
            {
              model: 'shelfmark',
              label: 'Shelfmark',
              type: 'input',
              inputType: 'text'
            }
          ]
        }
      }
    }
  },

  props: {
    project: {
      type: Object,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    },
    collectionConfig: {
      type: Object,
      required: true
    }
  },

  components: {
    Loading,
    CardForm
  },

  computed: {
    buttons: function () {
      return {
        like: !isEmpty(this.currentUser)
      }
    },
    form: function () {
      return !this.selectedRecord ? this.searchForm : this.shelfmarkForm
    }
  },

  methods: {
    /**
     * Load a record into the modal.
     * @param {Object} record
     *   The record.
     */
    viewFullRecord (record) {
      console.log(JSON.stringify(record.full, null, 2))
      this.$refs.modalcontent.innerHTML = JSON.stringify(record.full, null, 2)
      this.$refs.modal.show()
    },

    /**
     * Load the next 100 tasks.
     */
    loadTasks () {
      const url = `/api/project/${this.project.id}/newtask?limit=100`
      return new Promise((resolve, reject) => {
        pybossaApi.get(url).then(r => {
          resolve(Array.isArray(r.data) ? r.data : [r.data])
        })
      })
    },

    /**
     * Handle the task liked event.
     * @param {Object} task
     *   The task.
     */
    onTaskLiked (task) {
      if (task.liked) {
        pybossaApi.post(`/api/favorites`, { task_id: task.id }).then(() => {
          this.messageBus.$emit('success', 'Task liked')
        })
      } else {
        pybossaApi.delete(`/api/favorites/${task.id}`).then(() => {
          this.messageBus.$emit('success', 'Task unliked!')
        })
      }
    },

    /**
     * Build a query from the form data.
     */
    buildQuery () {
      let model = this.searchForm.model
      let trusted = [
        'DLC', 'CUY', 'ZCU', 'HMY', 'PULEA', 'YUL', 'CNEAL',
        'CGU', 'COO', 'AMH', 'AUT', 'NSL', 'SLY', 'L2U', 'OCLCA',
        'OCLCQ', 'OCLCF', 'OCLCO', 'BLSTP'
      ].join(' or ')
      return `(1,1183)="eng"and(1,6119)="(${trusted})"` +
             `and(1,4)="${model.title}"` +
             `and(1,1003)="${model.author}"` +
             `and(1,31)="${model.year}"` +
             `and(1,7)="${model.isbn.trim().replace(/-/g, '')}"`
    },

    /**
     * Perform a search.
     */
    search (position = 1) {
      const searchQuery = this.buildQuery()
      const fullQuery = `query=${searchQuery}&position=${position}`
      const url = `${this.searchForm.endpoint}?${fullQuery}`
      console.log(url)
      pybossaApi.get(url).then(r => {
        this.searchResults = this.processResults(r.data.data)
      })
    },

    /**
     * Return a field or concatenated subfields.
     * @param {Object} result
     *  The result.
     * @param {Number} tag
     *  The field tag.
     * @param {Array} codes
     *  The subfield codes.
     */
    getField (result, tag, codes = null) {
      let fields = result.fields.filter(f => {
        return f.hasOwnProperty(tag)
      })

      if (fields.length && !codes && typeof fields[0][tag] !== 'object') {
        // Return header field
        return fields[0][tag]
      }

      return fields.map(f => {
        return f[tag]['subfields'].map(sf => {
          let arr = intersection(Object.keys(sf), codes)
          if (arr.length || !codes) {
            return sf[arr[0]]
          }
          return ''
        }).join(' ')
      }).join(' ')
    },

    /**
     * Process search results
     * @param {Array} results
     *  The search results.
     */
    processResults (results) {
      return results.map(r => {
        return {
          title: this.getField(r, 245, ['a', 'b']),
          author: this.getField(r, 110),
          full: r
        }
      })
    },

    /**
     * Handle the search event.
     * @param {Object} task
     *   The task.
     */
    onSearch () {
      this.search()
    },

    /**
     * Handle the submit event.
     * @param {Object} task
     *   The task.
     */
    onSubmit () {
      this.search()
    }
  },

  created () {
    this.loadTasks().then(tasks => {
      this.tasks = tasks
      if (this.tasks.length) {
        this.currentTask = this.tasks[0]
      }
    })
  }
}
</script>

<style lang="scss">
.z3950-presenter {
  .list-group-item {
    transition: all 500ms ease;
  }

  .v-enter,
  .v-leave-to {
    -webkit-transform: translateY(20px);
    transform: translateY(20px);
    opacity: 0;
  }
}
</style>
