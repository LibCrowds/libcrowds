<template>
  <div id="z3950-presenter">

    <!-- Toolbar buttons -->
    <b-row class="mb-2 text-right">
      <b-col>
        <b-btn-group>
          <b-btn
            class="d-flex"
            variant="outline-primary"
            @click="$emit('help')">
            <icon name="question-circle"></icon>
          </b-btn>
          <b-btn
            class="d-flex"
            variant="outline-primary"
            @click="$emit('share')">
            <icon name="share-alt"></icon>
          </b-btn>
          <b-btn
            class="d-flex"
            variant="outline-primary"
            @click="$emit('tags')">
            <icon name="tags"></icon>
          </b-btn>
        </b-btn-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col lg="6">

        <!-- Image -->
        <b-card
          no-body
          :bg-variant="darkMode ? 'dark' : null"
          :text-variant="darkMode ? 'white' : null"
          v-if="task" >
          <img :src="task.info.url" class="img-fluid">
        </b-card>

        <b-btn
          v-if="extraTagLink.length"
          variant="link"
          @click="$emit('tags')">
          {{ extraTagLink }}
        </b-btn>

      </b-col>
      <b-col lg="6" class="mt-3 mt-lg-0">
        <b-card
          id="answer-card"
          no-body
          :bg-variant="darkMode ? 'dark' : null"
          :text-variant="darkMode ? 'white' : null">
          <!-- Alert -->
          <b-card-body
            class="pb-0"
            v-if="alert"
            :bg-variant="darkMode ? 'dark' : null"
            :text-variant="darkMode ? 'white' : null">
            <b-alert
              show
              :variant="alert.type"
              :key="alert.msg"
              class="mb-0">
              {{ alert.msg }}
            </b-alert>
          </b-card-body>

          <!-- Header -->
          <template slot="header">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-0">{{ header }}</h6>
              <b-btn
                v-if="searchQuery || selectedRecord"
                variant="warning"
                size="sm"
                class="float-right"
                @click="reset">
                Search Again
              </b-btn>
            </div>
          </template>

          <!-- Search Form -->
          <b-card-body
            v-show="stage == 'search'"
            :bg-variant="darkMode ? 'dark' : null"
            :text-variant="darkMode ? 'white' : null">
            <vue-form-generator
              ref="searchform"
              class="form-container"
              :class="darkMode ? 'form-dark' : null"
              :schema="form.schema"
              :model="form.model">
            </vue-form-generator>
          </b-card-body>

          <!-- Search Results -->
          <div id="search-results" v-if="stage == 'results'">
            <b-list-group>
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
                  <div class="w-25 d-flex flex-column justify-content-center">
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
            </b-list-group>
            <no-ssr>
              <infinite-loading
                ref="infiniteload"
                @infinite="onInfiniteLoad">
                <span slot="no-results">No results</span>
                <span slot="no-more">No more results</span>
              </infinite-loading>
            </no-ssr>
          </div>

          <!-- Reference Form -->
          <b-card-body
            v-show="stage == 'submit'"
            :bg-variant="darkMode ? 'dark' : null"
            :text-variant="darkMode ? 'white' : null">
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
              ref="smform"
              class="form-container"
              :schema="referenceForm.schema"
              :model="referenceForm.model">
            </vue-form-generator>
          </b-card-body>

          <!-- Footer -->
          <template slot="footer">
            <div id="footer-buttons">
              <b-btn
                v-b-toggle.collapsecomment
                variant="dark"
                v-html="noteButtonText">
              </b-btn>
              <b-btn
                variant="dark"
                @click="$emit('reject')"
                v-html="rejectButtonText">
              </b-btn>
              <b-btn
                v-if="stage !== 'results'"
                variant="success"
                @click="onSubmit"
                v-html="submitButtonText">
              </b-btn>
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
      </b-col>
    </b-row>

  </div>
</template>

<script>
import 'vue-awesome/icons/question-circle'
import 'vue-awesome/icons/info-circle'
import 'vue-awesome/icons/share-alt'
import 'vue-awesome/icons/tags'
import marked from 'marked'
import capitalize from 'capitalize'
import isEmpty from 'lodash/isEmpty'
import mapValues from 'lodash/mapValues'
import SocialMediaButtons from '@/components/buttons/SocialMedia'
import VueFormGenerator from 'vue-form-generator'

export default {
  data () {
    return {
      header: 'What is this item?',
      tutorialModalId: 'tutorial-modal',
      searchQuery: null,
      searchResults: [],
      selectedRecord: null,
      alert: null,
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
      referenceForm: {
        model: {
          'reference': null
        },
        schema: {
          fields: [
            {
              model: 'reference',
              label: 'Reference',
              type: 'input',
              inputType: 'text',
              placeholder: 'Enter the reference',
              required: true,
              validator: VueFormGenerator.validators.string
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
    task: {
      type: Object,
      required: true
    },
    projectTemplate: {
      type: Object,
      required: true
    }
  },

  components: {
    SocialMediaButtons
  },

  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },

    buttons () {
      return {
        like: !isEmpty(this.currentUser)
      }
    },

    collection () {
      return this.$store.state.currentCollection
    },

    shareText () {
      return marked(this.collection.info.presenter_options.share_text)
    },

    rejectButtonText () {
      const customText = this.collection.info.presenter_options.reject_button
      return typeof customText === 'undefined'
        ? 'Skip / Not Found'
        : marked(customText)
    },

    noteButtonText () {
      return marked(this.collection.info.presenter_options.note_button)
    },

    submitButtonText () {
      if (this.stage === 'submit') {
        return marked(this.collection.info.presenter_options.submit_button)
      }
      return capitalize(this.stage)
    },

    extraTagLink () {
      return this.collection.info.presenter_options.extra_tag_link
    },

    stage () {
      if (!this.searchQuery && !this.selectedRecord) {
        return 'search'
      } else if (this.searchQuery && !this.selectedRecord) {
        return 'results'
      } else if (this.selectedRecord) {
        return 'submit'
      }
    },

    form () {
      if (!this.searchQuery && !this.selectedRecord) {
        return this.searchForm
      } else {
        return this.referenceForm
      }
    },

    database () {
      if (this.projectTemplate.task) {
        return this.projectTemplate.task.database
      }
    },

    institutions () {
      if (this.projectTemplate.task) {
        return this.projectTemplate.task.institutions
      }
    }
  },

  methods: {
    /**
     * Handler to infinitely load results.
     * @param {Object} $state
     *   The vue-inifinite-loading state.
     */
    async onInfiniteLoad ($state) {
      const endpoint = `/z3950/search/${this.database}/json`
      try {
        const results = await this.$axios.$get(endpoint, {
          params: {
            query: this.searchQuery,
            position: this.searchResults.length + 1
          }
        })

        if (!results.data.length) {
          $state.complete()
          this.$emit('complete')
          return
        }

        const processedResults = this.processResults(results.data)
        this.searchResults = this.searchResults.concat(processedResults)
        $state.loaded()
      } catch (err) {
        this.$nuxt.error(err)
      }
    },

    /**
     * Build a query from the form data.
     */
    buildQuery () {
      let model = this.searchForm.model
      this.searchQuery = `(1,1183)="eng"` +
        `and(1,4)="${model.title}"` +
        `and(1,1003)="${model.author}"` +
        `and(1,31)="${model.year}"` +
        `and(1,7)="${model.isbn.trim().replace(/-/g, '')}"`
      if (Array.isArray(this.institutions)) {
        this.searchQuery += `and(1,6119)="(${this.institutions.join(' or ')})"`
      }
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
        if (code === '6' && subfield[code].indexOf('880') === 0) {
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
     * Handle the skip button click.
     */
    onSkip () {
      this.$swal({
        title: 'Skip Task',
        text: 'Are you sure you want to skip this task?',
        type: 'warning',
        reverseButtons: true,
        showCancelButton: true
      }).then(result => {
        if (result) {
          this.submit({
            control_number: '',
            reference: '',
            comments: this.$refs.comments.value
          })
        }
      }).catch(err => {
        if (typeof err === 'object' && err.hasOwnProperty('dismiss')) {
          this.$nuxt.error(err)
        }
      })
    },

    /**
     * Handle the submit button click.
     */
    onSubmit () {
      this.alert = null
      if (this.stage === 'search') {
        this.buildQuery()
      } else if (this.stage === 'submit' && this.$refs.smform.validate()) {
        this.submit({
          control_number: this.selectedRecord.controlNumber,
          reference: this.referenceForm.model.reference,
          form: this.searchForm.model,
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
      this.$emit('submit', this.project.id, this.task.id, answer)
      this.reset()
    },

    /**
     * Handle key up.
     * @param {Object} evt
     *   The event.
     */
    handleKeyup (evt) {
      if (evt.keyCode === 13) {
        this.onSubmit()
      }
    },

    /**
     * Reset the task.
     */
    reset () {
      this.searchQuery = null
      this.searchResults = []
      this.selectedRecord = null
      this.alert = null
      this.searchForm.model = mapValues(this.searchForm.model, () => '')
      this.referenceForm.model.reference = null
      this.$refs.comments.value = ''
    },

    /**
     * Markdown parser.
     */
    marked
  },

  mounted () {
    this.$refs.searchform.$el.addEventListener('keypress', this.handleKeyup)
    this.$refs.smform.$el.addEventListener('keypress', this.handleKeyup)
  },

  beforeDestroy () {
    this.$refs.searchform.$el.removeEventListener('keypress', this.handleKeyup)
    this.$refs.smform.$el.addEventListener('keypress', this.handleKeyup)
  }
}
</script>

<style lang="scss">
#z3950-presenter {
  div {
    transition: opacity 400ms ease;
  }

  .card {
    h5 {
      font-size: 1rem;
    }
  }

  code {
    font-size: $font-size-sm;
  }

  #share-text {
    text-transform: uppercase;
    font-size: $font-size-sm;
  }

  .list-group {
    overflow: auto;
  }

  .list-group-item {
    display: block;
    border-right: none;
    border-left: none;
    flex-direction: column;
    align-items: flex-start;

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

  #footer-buttons {
    display: flex;
    flex-direction: column-reverse;

    p {
      margin-bottom: 0;
    }

    .btn {
      margin: 0.5rem 0 ;
    }

    @include media-breakpoint-up(lg) {
      flex-direction: row;
      justify-content: space-between;

      .btn {
        margin: 0;
      }
    }
  }

  #search-results {
    max-height: 60vh;
    overflow-y: auto;
  }
}
</style>
