<template>
  <div id="z3950-presenter">
    <div class="row p-4">

      <div class="col-sm-12 col-lg-6">
        <b-card
          no-body
          v-if="currentTask" >
          <img :src="currentTask.info.url" class="img-fluid">
        </b-card>
      </div>

      <div class="col-sm-12 col-lg-6 mt-3 mt-lg-0">
        <b-card no-body>

          <div class="card-body pb-0" v-if="alerts.length">
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
              <b-btn
                v-if="searchResults.length || selectedRecord"
                variant="info"
                size="sm"
                class="float-right"
                @click="reset">
                Search Again
              </b-btn>
            </div>
          </template>

          <transition name="fade" mode="out-in" appear>
            <div key="search" v-if="stage == 'search'" class="card-body">
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
                      <b-btn
                        variant="success"
                        size="sm"
                        @click="selectedRecord = record">
                        Select
                      </b-btn>
                    </div>
                  </div>
                </div>
              </b-list-group-item>
            </div>

            <div key="submit" v-if="selectedRecord" class="card-body">
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
            <div class="d-flex justify-content-between flex-column flex-xl-row">
              <b-btn
                v-b-toggle.collapsecomment
                class="p-0"
                variant="link">
                Add a comment
              </b-btn>
              <div
                class="d-flex d-xl-block flex-column justify-content-center">
                <b-btn
                  variant="outline-dark"
                  class="my-1"
                  @click="onSkip">
                  Skip / Not Found
                </b-btn>
                <b-btn
                  v-if="stage !== 'results'"
                  variant="success"
                  @click="onSubmit">
                  <span v-if="!processing">{{ stage | capitalize }}</span>
                  <div
                    v-else
                    class="sk-three-bounce w-100">
                    <div class="sk-child sk-bounce1"></div>
                    <div class="sk-child sk-bounce2"></div>
                    <div class="sk-child sk-bounce3"></div>
                  </div>
                </b-btn>
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
            :disabled="processing"
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
              {{
                Math.min(
                  pagination.page * pagination.perPage + 1,
                  pagination.total
                )
              }}
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
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/plus'
import isEmpty from 'lodash/isEmpty'
import mapValues from 'lodash/mapValues'

export default {
  data: function () {
    return {
      processing: false,
      header: 'What is this item?',
      searchResults: [],
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
    tasks: {
      type: Array,
      required: true
    },
    collectionConfig: {
      type: Object,
      required: true
    }
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },
    currentTask () {
      return this.tasks[0]
    },
    buttons () {
      return {
        like: !isEmpty(this.currentUser)
      }
    },
    stage () {
      if (!this.searchResults.length && !this.selectedRecord) {
        return 'search'
      } else if (this.searchResults.length && !this.selectedRecord) {
        return 'results'
      } else if (this.selectedRecord) {
        return 'submit'
      }
    },
    form () {
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
     * @param {Number} page
     *   The page number.
     */
    search (page = 1) {
      this.processing = true
      const searchQuery = this.buildQuery()
      let fullQuery = `query=${searchQuery}`
      if (page > 1 && this.pagination.perPage) {
        fullQuery += `&position=${(page - 1) * this.pagination.perPage + 1}`
      }
      const url = `/z3950/search/oclc/json?${fullQuery}`
      this.$pybossa.client.get(url).then(r => {
        if (r.data.n_records === 0) {
          this.alerts.push({ msg: 'No results', type: 'info' })
        } else if (r.data.status !== 'success') {
          this.alerts.push({ msg: r.data.message, type: r.data.status })
        } else {
          this.alerts = []
          this.searchResults = this.processResults(r.data.data)
          this.pagination = {
            page: Math.ceil(r.data.position / r.data.size),
            perPage: r.data.size,
            total: r.data.total,
            summary: ''
          }
        }
        this.processing = false
      })
    },

    /**
     * Parse a subfield.
     * @param {Object} subfield
     *  The subfield.
     * @param {Array} linkedFields
     *  Any linked fields.
     * @param {Array} codes
     *  The subfield codes.
     */
    parseSubfield (subfield, linkedFields, codes) {
      let res = ''
      for (let code in subfield) {
        if (code === '6' && subfield[code].startsWith('880')) {
          let linkIndex = parseInt(subfield[code].split('-')[1]) - 1
          res += linkedFields[linkIndex]['880']['subfields'].map((sf) => {
            return this.parseSubfield(sf)
          }).join(' ') + ' '
        } else if (code !== '6') {
          if (!codes || codes.indexOf(code) > -1) {
            res = subfield[code] + ' '
          }
        }
      }
      return res
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
      let res = ''

      // Store linked subfields for future reference
      let linkedFields = result.fields.filter((f) => f.hasOwnProperty('880'))

      for (let field of result.fields) {
        if (!field.hasOwnProperty(tag)) {
          continue
        }

        // Header field
        if (String(tag).match(/00\d/i)) {
          return field[tag]
        }

        // Concatenate chosen subfields
        for (let subfield of field[tag]['subfields']) {
          res += this.parseSubfield(subfield, linkedFields, codes)
        }
      }
      return res
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
          title: this.getField(r, 245, ['a', 'b', 'c']),
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
      this.$swal({
        title: 'Skip Task',
        text: 'Are you sure you want to skip this task?',
        type: 'warning',
        showCancelButton: true
      }).then(() => {
        this.submit({
          oclc: '',
          shelfmark: '',
          form: this.searchForm.model,
          comments: this.$refs.comments.value
        })
      }, (dismiss) => {
        this.$swal.close()
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
          form: this.searchForm.model,
          comments: this.$refs.comments.value
        })
      }
    },

    /**
     * Handle the task liked event.
     * @param {Object} task
     *   The task.
     */
    onTaskLiked (task) {
      this.$emit('taskliked', task.id, task.liked)
    },

    /**
     * Submit a task run.
     * @param {Object} answer
     *   The answer.
     */
    submit (answer) {
      this.$emit('submit', this.project.id, this.currentTask.id, answer)
      this.reset()
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
  }
}
</script>

<style lang="scss">
@import '~assets/style/main';
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
      color: $gray-400;
      padding: 0;
    }

    .result-buttons {
      align-self: flex-end;
      margin-left: auto;
    }
  }
}
</style>
