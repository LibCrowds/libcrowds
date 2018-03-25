<template>
  <div id="admin-dashboard">
    <card-base :title="title" :description="description" class="mb-3">
      <b-btn
        size="sm"
        variant="success"
        class="float-md-right"
        slot="controls"
        @click="refresh">
        Refresh
      </b-btn>
    </card-base>

    <b-card-group
      deck
      class="mb-3">
      <b-card
        bg-variant="primary"
        text-variant="white"
        class="text-center">
        <p class="display-4 mb-0">{{ counts.nNewTaskRuns }}</p>
        <p class="card-text">
          {{ 'Contribution' | pluralize(counts.nNewTaskRuns) }}
        </p>
      </b-card>
      <b-card
        bg-variant="success"
        text-variant="white"
        class="text-center">
        <p class="display-4 mb-0">{{ counts.nNewTasks }}</p>
        <p class="card-text">
          {{ 'Task' | pluralize(counts.nNewTasks) }} created
        </p>
      </b-card>
      <b-card
        bg-variant="info"
        text-variant="white"
        class="text-center">
        <p class="display-4 mb-0">{{ counts.nPublishedProjects }}</p>
        <p class="card-text">
          {{ 'Project' | pluralize(counts.nPublishedProjects) }} published
        </p>
      </b-card>
    </b-card-group>

    <card-base
      title="Contributions"
      description="The number of contributions made this week"
      class="mb-3 card-overflow">
      <b-row no-gutters class="chart-row">
        <b-col lg="8" class="pt-2">
          <line-chart
            unit="contribution"
            :options="chartOptions"
            :chart-data="sortByLabel(newTaskRuns)">
          </line-chart>
        </b-col>
        <b-col class="details-column">
          <ul
            v-if="groupedFeed.hasOwnProperty('UserContribution')"
            class="list-unstyled">
            <li
              v-for="(item, index) in groupedFeed['UserContribution']"
              :key="index">
              <small-avatar
                :info="item.info"
                class="mr-1">
              </small-avatar>
              <small>
                <nuxt-link
                  :to="{
                    name: 'account-name',
                    params: {
                      name: item.name
                    }
                  }">
                  {{ item.fullname }}
                </nuxt-link>
                contributed to
                <nuxt-link
                  :to="{
                    name: 'admin-project-short_name-details',
                    params: {
                      short_name: item.project_short_name
                    }
                  }">
                  {{ item.project_name }}
                </nuxt-link>
                {{ item.updated | moment('L') }}
              </small>
            </li>
          </ul>
          <p class="text-center mt-1" v-else>
            <small>
              No details from the update feed
            </small>
          </p>
        </b-col>
      </b-row>
    </card-base>

    <card-base
      title="New Tasks"
      description="The number of tasks added this week"
      class="mb-3 card-overflow">
      <b-row no-gutters class="chart-row">
        <b-col lg="8" class="pt-2">
          <bar-chart
            unit="task"
            :options="chartOptions"
            :chart-data="sortByLabel(newTasks)">
          </bar-chart>
        </b-col>
        <b-col class="details-column">
          <ul
            v-if="groupedFeed.hasOwnProperty('Task')"
            class="list-unstyled">
            <li
              v-for="(item, index) in groupedFeed['Task']"
              :key="index">
              <small-avatar
                :info="item.info"
                class="mr-1">
              </small-avatar>
              <small>
                Tasks were added to
                <nuxt-link
                  :to="{
                    name: 'admin-project-short_name-details',
                    params: {
                      short_name: item.short_name
                    }
                  }">
                  {{ item.name }}
                </nuxt-link>
                {{ item.updated | moment('L') }}
              </small>
            </li>
          </ul>
          <p class="text-center mt-1" v-else>
            <small>
              No details from the update feed
            </small>
          </p>
        </b-col>
      </b-row>
    </card-base>

    <b-card-group
      deck
      class="mb-3 card-overflow">
      <b-card
        bg-variant="primary"
        text-variant="white"
        class="text-center">
        <p class="display-4 mb-0">{{ counts.nNewUsers }}</p>
        <p class="card-text">
          New {{ 'user' | pluralize(counts.nNewUsers) }}
        </p>
      </b-card>
      <b-card
        bg-variant="success"
        text-variant="white"
        class="text-center">
        <p class="display-4 mb-0">{{ counts.nReturningUsers }}</p>
        <p class="card-text">
          Returning {{ 'user' | pluralize(counts.nReturningUsers) }}
        </p>
      </b-card>
      <b-card
        bg-variant="info"
        text-variant="white"
        class="text-center">
        <p class="display-4 mb-0">{{ counts.nActiveUsers }}</p>
        <p class="card-text">
          Active {{ 'user' | pluralize(counts.nActiveUsers) }}
        </p>
      </b-card>
    </b-card-group>

    <card-base
      title="New Users"
      description="The number of users that signed up this week"
      class="mb-3 card-overflow">
      <b-row no-gutters class="chart-row">
        <b-col lg="8" class="pt-1">
          <line-chart
            unit="user"
            :options="chartOptions"
            :chart-data="sortByLabel(newUsers)">
          </line-chart>
        </b-col>
        <b-col class="details-column">
          <ul
            v-if="groupedFeed.hasOwnProperty('User')"
            class="list-unstyled">
            <li
              v-for="(item, index) in groupedFeed['User']"
              :key="index">
              <small-avatar
                :info="item.info"
                class="mr-1">
              </small-avatar>
              <small>
                <nuxt-link
                  :to="{
                    name: 'account-name',
                    params: {
                      name: item.name
                    }
                  }">
                  {{ item.fullname }}
                </nuxt-link>
                joined
                {{ item.updated | moment('L') }}
              </small>
            </li>
          </ul>
          <p class="text-center mt-1" v-else>
            <small>
              No details from the update feed
            </small>
          </p>
        </b-col>
      </b-row>
    </card-base>

    <card-base
      title="Returning Users"
      description="The number of users returning for a number days in a row
        this week"
      class="mb-3 card-overflow">
      <b-card-body class="pt-2 px-0 chart-row">
        <bar-chart
          unit="user"
          :options="chartOptions"
          :chart-data="returningUsers">
        </bar-chart>
      </b-card-body>
    </card-base>

    <card-base
      title="Active Users"
      description="The number of users that contributed to a project this week"
      class="mb-3 card-overflow">
      <chart-legend
        :items="[ 'Anonymous', 'Authenticated' ]"
        slot="controls"
        class="float-md-right">
      </chart-legend>
      <b-card-body class="pt-2 px-0 chart-row">
        <bar-chart
          unit="user"
          :options="stackedChartOptions"
          :chart-data="stackedUserData">
        </bar-chart>
      </b-card-body>
    </card-base>

    <div role="tablist" class="mb-3">
      <b-card
        no-body
        :bg-variant="darkMode ? 'dark' : null"
        :text-variant="darkMode ? 'white' : null"
        class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn
            block
            href="#"
            v-b-toggle.draftprojects
            variant="primary">
            {{ counts.nDraftProjects }}
            Draft {{ 'project' | pluralize(counts.nDraftProjects) }}
          </b-btn>
        </b-card-header>
        <b-collapse
          id="draftprojects"
          accordion="projects-accordion"
          role="tabpanel">
          <b-card-body>
            <p class="card-text">
              <ul class="list-unstyled">
                <li
                  v-for="project in draftProjects"
                  :key="project.id"
                  class="mb-2">
                  <small>
                    <strong>
                      {{ project.day | moment('L') }}:
                    </strong>
                    <nuxt-link
                      :to="{
                        name: 'admin-project-short_name-details',
                        params: {
                          short_name: project.short_name
                        }
                      }">
                      {{ project.p_name }}
                    </nuxt-link>
                    created by
                    <nuxt-link
                      :to="{
                        name: 'account-name',
                        params: {
                          name: project.u_name
                        }
                      }">
                      {{ project.u_name }}
                    </nuxt-link>
                  </small>
                </li>
              </ul>
            </p>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card
        no-body
        :bg-variant="darkMode ? 'dark' : null"
        :text-variant="darkMode ? 'white' : null"
        class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn
            block
            href="#"
            v-b-toggle.publishedprojects
            variant="primary">
            {{ counts.nPublishedProjects }}
            Published {{ 'project' | pluralize(counts.nPublishedProjects) }}
          </b-btn>
        </b-card-header>
        <b-collapse
          id="publishedprojects"
          accordion="projects-accordion"
          role="tabpanel">
          <b-card-body>
            <p class="card-text">
              <ul class="list-unstyled">
                <li
                  v-for="project in publishedProjects"
                  :key="project.id"
                  class="mb-2">
                  <small>
                    <strong>
                      {{ project.day | moment('L') }}:
                    </strong>
                    <nuxt-link
                      :to="{
                        name: 'admin-project-short_name-details',
                        params: {
                          short_name: project.short_name
                        }
                      }">
                      {{ project.p_name }}
                    </nuxt-link>
                    published by
                    <nuxt-link
                      :to="{
                        name: 'account-name',
                        params: {
                          name: project.u_name
                        }
                      }">
                      {{ project.u_name }}
                    </nuxt-link>
                  </small>
                </li>
              </ul>
            </p>
          </b-card-body>
        </b-collapse>
      </b-card>
      <b-card
        no-body
        :bg-variant="darkMode ? 'dark' : null"
        :text-variant="darkMode ? 'white' : null"
        class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn
            block
            href="#"
            v-b-toggle.updatedprojects
            variant="primary">
            {{ counts.nUpdatedProjects }}
            Updated {{ 'project' | pluralize(counts.nUpdatedProjects) }}
          </b-btn>
        </b-card-header>
        <b-collapse
          id="updatedprojects"
          accordion="projects-accordion"
          role="tabpanel">
          <b-card-body>
            <p class="card-text">
              <ul class="list-unstyled">
                <li
                  v-for="project in updatedProjects"
                  :key="project.id"
                  class="mb-2">
                  <small>
                    <strong>
                      {{ project.day | moment('L') }}:
                    </strong>
                    <nuxt-link
                      :to="{
                        name: 'admin-project-short_name-details',
                        params: {
                          short_name: project.short_name
                        }
                      }">
                      {{ project.p_name }}
                    </nuxt-link>
                    owned by
                    <nuxt-link
                      :to="{
                        name: 'account-name',
                        params: {
                          name: project.u_name
                        }
                      }">
                      {{ project.u_name }}
                    </nuxt-link>
                  </small>
                </li>
              </ul>
            </p>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import { metaTags } from '@/mixins/metaTags'
import SmallAvatar from '@/components/avatars/Small'
import LineChart from '@/components/charts/Line'
import BarChart from '@/components/charts/Bar'
import ChartLegend from '@/components/charts/Legend'
import CardBase from '@/components/cards/Base'

export default {
  layout: 'admin-site-dashboard',

  mixins: [ metaTags ],

  data () {
    return {
      title: 'Dashboard',
      description: 'Monitor the past week\'s activity.',
      chartOptions: {
        height: '100%'
      },
      stackedChartOptions: {
        height: '100%',
        stackBars: true
      },
      alerts: []
    }
  },

  asyncData ({ app, error, router }) {
    return app.$axios.$get('/admin/dashboard').then(stats => {
      console.log(stats)
      return {
        activeAnon: stats.active_anon_last_week,
        activeAuth: stats.active_users_last_week,
        returningUsers: stats.returning_users_week,
        newUsers: stats.new_users_week,
        newTaskRuns: stats.new_task_runs_week,
        newTasks: stats.new_tasks_week,
        updateFeed: stats.update_feed.map(item => {
          // Convert UNIX timestamps
          item.updated = new Date(item.updated * 1000)
          return item
        }),
        draftProjects: stats.draft_projects_last_week,
        publishedProjects: stats.published_projects_last_week,
        updatedProjects: stats.update_projects_last_week
      }
    }).catch(err => {
      error(err)
    })
  },

  components: {
    LineChart,
    BarChart,
    SmallAvatar,
    ChartLegend,
    CardBase
  },

  computed: {
    counts () {
      const nActiveAnon = this.countSeries(this.activeAnon)
      const nActiveAuth = this.countSeries(this.activeAuth)
      return {
        nActiveAnon: nActiveAnon,
        nActiveAuth: nActiveAuth,
        nActiveUsers: nActiveAnon + nActiveAuth,
        nReturningUsers: this.countSeries(this.returningUsers),
        nNewUsers: this.countSeries(this.newUsers),
        nNewTaskRuns: this.countSeries(this.newTaskRuns),
        nNewTasks: this.countSeries(this.newTasks),
        nDraftProjects: this.draftProjects.length,
        nPublishedProjects: this.publishedProjects.length,
        nUpdatedProjects: this.updatedProjects.length
      }
    },

    stackedUserData () {
      const anonData = this.sortByLabel(this.activeAnon)
      const authData = this.sortByLabel(this.activeAuth)
      const allLabels = anonData.labels.concat(this.activeAnon.labels)
      const uniqueLabels = [...new Set(allLabels)]
      const anon = uniqueLabels.map(label => {
        const anonIdx = anonData.labels.indexOf(label)
        return anonIdx > -1 ? anonData.series[0][anonIdx] : 0
      })
      const auth = uniqueLabels.map(label => {
        const authIdx = authData.labels.indexOf(label)
        return authIdx > -1 ? authData.series[0][authIdx] : 0
      })
      return {
        labels: uniqueLabels,
        series: [anon, auth]
      }
    },

    groupedFeed () {
      return groupBy(this.updateFeed, item => item.action_updated)
    }
  },

  methods: {
    /**
     * Return the sum of a series.
     * @param {Object} stat
     *   The stat.
     */
    countSeries (stat) {
      return stat.series[0].reduce((sum, value) => {
        return sum + value
      })
    },

    /**
     * Refresh the dashboard.
     */
    refresh () {
      this.$axios.$get('/admin/dashboard', {
        params: {
          refresh: 1
        }
      }).then(data => {
        data.status = 'info'
        this.$notifications.flash(data)
      }).catch(err => {
        this.$nuxt.error(err)
      })
    },

    /**
     * Ensure that stats appear in date order.
     *
     * This should really be fixed within by PYBOSSA but for now we can do it
     * here (and it may be useful as a backup anyway).
     * @param {Object} data
     *   The stats data.
     */
    sortByLabel (data) {
      let combinedData = data.labels.map((label, idx) => {
        return {
          label: label,
          item: data.series[0][idx]
        }
      })
      combinedData.sort((a, b) => {
        if (moment(a.label).isBefore(b.label)) {
          return -1
        } else if (a.label === b.label) {
          return 0
        } else {
          return 1
        }
      })
      for (let i = 0; i < combinedData.length; i++) {
        data.labels[i] = combinedData[i].label
        data.series[0][i] = combinedData[i].item
      }
      return data
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-row {
  height: 300px;
  max-height: 300px;
}

.details-column {
  display: none;
  padding: 0 1rem;

  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.5rem 0;
  }

  @include media-breakpoint-up(lg) {
    overflow-y: auto;
    display: block;
  }
}
</style>