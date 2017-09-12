<template>
  <div id="z3950-presenter">
    <div class="row p-4">

      <div class="col-sm-12 col-lg-6">
        <b-card no-block>
          <img v-if="currentTask" :src="currentTask.info.url" class="img-fluid">
          <loading v-else text="Loading image"></loading>
        </b-card>
      </div>

      <div class="col-sm-12 col-lg-6 mt-3 mt-lg-0">
        <b-card no-block>

          <div class="card-block pb-0" v-if="alerts.length">
            <b-alert
              show
              v-for="alert in alerts"
              :variant="alert.type"
              :key="alert.msg"
              class="mb-1">
              {{ alert.msg }}
            </b-alert>
          </div>

          <template slot="header">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-0">{{ header }}</h6>
              <b-button
                v-if="searchResults.length || selectedRecord"
                variant="info"
                size="sm"
                class="float-right"
                @click="reset">
                Search Again
              </b-button>
            </div>
          </template>

          <transition name="fade" mode="out-in" appear>
            <div key="search" v-if="stage == 'search'" class="card-block">
              <vue-form-generator :schema="form.schema" :model="form.model">
              </vue-form-generator>
            </div>

            <div
              key="results"
              v-if="stage == 'results' && !processing"
              class="list-group">
              <b-list-group-item
                v-for="(record, index) in searchResults"
                :key="`result-${index}`"
                class="p-2">
                <div class="d-flex flex-row w-100">
                  <div class="w-75">
                    <h5 class="mb-0">
                      <a :href="record.externalLink" target="_blank">
                        {{ record.title }}
                      </a>
                    </h5>
                    <p class="mb-0">{{ record.author }}</p>
                    <p class="mb-0">
                      <small>{{ record.physdesc }}</small>
                    </p>
                    <p class="mb-0">
                      <small>
                        {{ record.publisher }}{{ record.pubyear }}
                      </small>
                    </p>
                  </div>
                  <div class="w-25 d-flex">
                    <div class="result-buttons">
                      <b-button
                        variant="success"
                        size="sm"
                        @click="selectedRecord = record">
                        Select
                      </b-button>
                    </div>
                  </div>
                </div>
              </b-list-group-item>
            </div>

            <div key="submit" v-if="selectedRecord" class="card-block">
              <div v-if="selectedRecord">
                <h5 class="mb-1">{{ selectedRecord.title }}</h5>
                <p class="mb-0">{{ selectedRecord.author }}</p>
                <p class="mb-0">
                  <small>{{ selectedRecord.physdesc }}</small>
                </p>
                <p class="mb-2">
                  <small>
                    {{ selectedRecord.publisher }}{{ selectedRecord.pubyear }}
                  </small>
                </p>
              </div>
              <vue-form-generator
                :schema="shelfmarkForm.schema"
                :model="shelfmarkForm.model">
              </vue-form-generator>
            </div>
          </transition>

          <template slot="footer">
            <div class="d-flex justify-content-between">
              <b-button
                v-b-toggle.collapsecomment
                class="p-0"
                variant="link">
                Add a comment
              </b-button>
              <div>
                <b-button variant="secondary" @click="onSkip">
                  Skip / Not Found
                </b-button>
                <b-button
                  v-if="stage !== 'results'"
                  variant="success"
                  @click="onSubmit">
                  <span v-if="!processing">{{ stage | capitalize }}</span>
                  <div v-else class="sk-three-bounce">
                    <div class="sk-child sk-bounce1"></div>
                    <div class="sk-child sk-bounce2"></div>
                    <div class="sk-child sk-bounce3"></div>
                  </div>
                </b-button>
              </div>
            </div>
            <b-collapse id="collapsecomment" class="mt-1">
              <textarea
                class="form-control"
                ref="comments"
                rows="3"
                placeholder="Enter your comment...">
              </textarea>
            </b-collapse>
          </template>
        </b-card>

        <div
          v-if="stage == 'results'"
          class="d-flex align-items-center mt-2 mb-0 d-flex flex-column">
          <b-pagination
            variant="info"
            size="sm"
            :total-rows="pagination.total"
            :per-page="pagination.perPage"
            v-model="pagination.page"
            @change="onPageChange">
          </b-pagination>
          <p>
            <small>
              Showing
              {{ (pagination.page - 1) * pagination.perPage + 1 }}
              to
              {{ pagination.page * pagination.perPage + 1 }}
              of
              {{ pagination.total }}
            </small>
          </p>
        </div>
      </div>
    </div>

    <b-modal ref="modal" title="Full record" size="lg">
      <pre>
        <code ref="modalcontent">
        </code>
        </pre>
    </b-modal>

  </div>
</template>

<script>
import sweetalert from 'sweetalert'
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/plus'
import isEmpty from 'lodash/isEmpty'
import mapValues from 'lodash/mapValues'
import intersection from 'lodash/intersection'
import Loading from '@/components/Loading'
import pybossaApi from '@/api/pybossa'

export default {
  data: function () {
    return {
      processing: false,
      header: 'What is this item?',
      tasks: [],
      searchResults: [],
      currentTask: null,
      selectedRecord: null,
      alerts: [],
      pagination: {},
      searchForm: {
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
        model: {
          'shelfmark': null
        },
        schema: {
          fields: [
            {
              model: 'shelfmark',
              label: 'Shelfmark',
              type: 'input',
              inputType: 'text',
              placeholder: 'Enter the shelfmark'
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
    Loading
  },

  computed: {
    buttons: function () {
      return {
        like: !isEmpty(this.currentUser)
      }
    },
    stage: function () {
      if (!this.searchResults.length && !this.selectedRecord) {
        return 'search'
      } else if (this.searchResults.length && !this.selectedRecord) {
        return 'results'
      } else if (this.selectedRecord) {
        return 'submit'
      }
    },
    form: function () {
      if (!this.searchResults.length && !this.selectedRecord) {
        return this.searchForm
      } else {
        return this.shelfmarkForm
      }
    }
  },

  methods: {
    /**
     * Load a record into the modal.
     * @param {Object} record
     *   The record.
     */
    viewFullRecord (record) {
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
      this.processing = true
      const searchQuery = this.buildQuery()
      const fullQuery = `query=${searchQuery}&position=${position}`
      const url = `/z3950/search/oclc/json?${fullQuery}`
      pybossaApi.get(url).then(r => {
        if (r.data.n_records === 0) {
          this.alerts.push({ msg: 'No results', type: 'info' })
        } else if (r.data.status !== 'success') {
          this.alerts.push({ msg: r.data.message, type: r.data.status })
        } else {
          this.alerts = []
          this.searchResults = this.processResults(r.data.data)
          this.pagination = {
            page: r.data.position,
            perPage: r.data.size,
            total: r.data.total,
            summary: ''
          }
        }
        this.processing = false
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

      if (!fields.length) {
        return ''
      }

      // Header field
      if (String(tag).match(/00\d/i)) {
        return fields[0][tag]
      }

      return fields.map(f => {
        return f[tag]['subfields'].map(sf => {
          if (!codes) {
            return Object.values(sf)
          }
          let arr = intersection(Object.keys(sf), codes)
          if (arr.length) {
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
        let worldcatBase = 'https://www.worldcat.org/title/apis/oclc/'
        let controlNumber = this.getField(r, '001').replace(/^\D+/g, '')
        return {
          controlNumber: controlNumber,
          externalLink: `${worldcatBase}${controlNumber}`,
          title: this.getField(r, 245, ['a', 'b']),
          author: (
            this.getField(r, 100) ||
            this.getField(r, 110) ||
            this.getField(r, 111)
          ),
          physdesc: this.getField(r, 300),
          publisher: (
            this.getField(r, 260, ['b']) +
            this.getField(r, 264, ['b'])
          ),
          pubyear: (
            this.getField(r, 260, ['c']) +
            this.getField(r, 264, ['c'])
          ),
          full: r
        }
      })
    },

    /**
     * Handle the page change event.
     * @param {Number} n
     *   The page number.
     */
    onPageChange (n) {
      this.search(n)
    },

    /**
     * Handle the skip button click.
     */
    onSkip () {
      sweetalert({
        title: 'Skip Task',
        text: 'Are you sure you want to skip this task?',
        type: 'warning',
        showCancelButton: true,
        closeOnConfirm: false
      },
        () => {
          this.submit({
            oclc: '',
            shelfmark: '',
            comments: this.$refs.comments.value
          })
          sweetalert.close()
        })
    },

    /**
     * Handle the submit button click.
     */
    onSubmit () {
      if (this.stage === 'search') {
        this.search()
      } else if (this.stage === 'submit') {
        this.submit({
          oclc: this.selectedRecord.controlNumber,
          shelfmark: this.shelfmarkForm.model.shelfmark,
          comments: this.$refs.comments.value
        })
      }
    },

    /**
     * Submit a task run.
     * @param {Object} answer
     *   The answer.
     */
    submit (answer) {
      const taskrun = JSON.stringify({
        'project_id': this.project.id,
        'task_id': this.currentTask.id,
        'info': answer
      })
      pybossaApi.post(`/api/taskrun`, taskrun).then(r => {
        console.log(r)
        this.$store.dispatch('NOTIFY', {
          msg: 'Answer saved, thanks!',
          type: 'success'
        })
        this.reset()
        this.nextTask()
      })
    },

    /**
     * Load the next task.
     */
    nextTask () {
      if (this.tasks.length) {
        this.reset()
        this.currentTask = this.tasks.shift()
      } else {
        this.loadTasks().then(tasks => {
          this.tasks = tasks
          this.nextTask()
        })
      }
    },

    /**
     * Reset the task.
     */
    reset () {
      this.searchResults = []
      this.selectedRecord = null
      this.alerts = []
      this.pagination = {}
      this.searchForm.model = mapValues(this.searchForm.model, () => '')
      this.$refs.comments.value = ''
    }
  },

  created () {
    this.nextTask()
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';
@import '~spinkit/scss/spinners/7-three-bounce';

#z3950-presenter {
  div {
    transition: opacity 400ms ease;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 400ms ease;
  }

  .fade-enter>*,
  .fade-leave-to>* {
    opacity: 0;
  }

  .card {
    h5 {
      font-size: 1rem;
    }
  }

  .sk-three-bounce {
    margin: 0;

    .sk-child {
      background-color: $white;
      width: 0.8rem;
      height: 0.8rem;
    }
  }

  code {
    font-size: $font-size-sm;
  }

  .list-group-item {
    border-right: none;
    border-left: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &:last-child {
      border-bottom: none;
    }

    .remove {
      align-self: flex-end;
      background: transparent;
      border: none;
      color: lighten($gray-light, 15%);
      padding: 0;
    }

    .result-buttons {
      align-self: flex-end;
      margin-left: auto;
    }
  }
}
</style>
