<template>
  <div id="admin-dashboard">
    <b-card no-body>
      <div
        slot="header"
        class="mb-0 d-flex align-items-center justify-content-between">
        <span>
          <h6 class="mb-0">{{ title }}</h6>
          <p class="text-muted mb-0">
            <small>
              Monitor the activity on the platform for the past week.
            </small>
          </p>
        </span>
        <b-btn
          size="sm"
          variant="success"
          @click="refresh">
          Refresh
        </b-btn>
      </div>
      <div class="card-body">
        <ul class="list-unstyled" id="activity-list">
          <li v-for="(item, index) in updateFeed" :key="index">
            <p class="d-flex flex-row align-items-center">

              <small-avatar :domain-object="item" class="mr-1"></small-avatar>

              <small v-if="item.action_updated == 'Project'">
                <nuxt-link
                  :to="{
                    name: 'admin-project-short_name-settings',
                    params: {
                      short_name: item.short_name
                    }
                  }">
                  {{ item.name }}
                </nuxt-link>
                was created
                {{ item.updated | moment('calendar') }}
              </small>

              <small v-else-if="item.action_updated == 'Blog'">
                A new blog post was published for
                <nuxt-link
                  :to="{
                    name: 'admin-project-short_name-settings',
                    params: {
                      short_name: item.short_name
                    }
                  }">
                  {{ item.name }}
                </nuxt-link>
                {{ item.updated | moment('calendar') }}
              </small>

              <small v-else-if="item.action_updated == 'Task'">
                New tasks were added to
                <nuxt-link
                  :to="{
                    name: 'admin-project-short_name-settings',
                    params: {
                      short_name: item.short_name
                    }
                  }">
                  {{ item.name }}
                </nuxt-link>
                {{ item.updated | moment('calendar') }}
              </small>

              <small v-else-if="item.action_updated == 'TaskCompleted'">
                A task was completed for
                <nuxt-link
                  :to="{
                    name: 'admin-project-short_name-settings',
                    params: {
                      short_name: item.short_name
                    }
                  }">
                  {{ item.name }}
                </nuxt-link>
                {{ item.updated | moment('calendar') }}
              </small>

              <small v-else-if="item.action_updated == 'UserContribution'">
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
                    name: 'admin-project-short_name-settings',
                    params: {
                      short_name: item.project_short_name
                    }
                  }">
                  {{ item.project_name }}
                </nuxt-link>
                {{ item.updated | moment('calendar') }}
              </small>

              <small v-else-if="item.action_updated == 'User'">
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
                {{ item.updated | moment('calendar') }}
              </small>

              <small v-else>
                Untracked event
              </small>

            </p>
          </li>
        </ul>
      </div>
    </b-card>

    <line-chart
      class="mt-3"
      header="Contributions"
      unit="contribution"
      :chart-data="newTaskRuns">
    </line-chart>

    <b-card-group
      deck
      class="mt-3">
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

    <line-chart
      class="mt-3"
      header="New users"
      unit="user"
      :chart-data="newUsers">
    </line-chart>
    <line-chart
      class="mt-3"
      header="Returning Users"
      unit="user"
      :chart-data="returningUsers">
    </line-chart>
    <line-chart
      class="mt-3"
      header="Active Anonymous Users"
      unit="user"
      :chart-data="activeAnon">
    </line-chart>
    <line-chart
      class="mt-3"
      header="Active Authenticated Users"
      unit="user"
      :chart-data="activeAuth">
    </line-chart>

    <div role="tablist" class="mt-3">
      <b-card no-body class="mb-1">
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
                      {{ project.day | moment('DD/MM/YYYY') }}:
                    </strong>
                    <nuxt-link
                      :to="{
                        name: 'admin-project-short_name-settings',
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
      <b-card no-body class="mb-1">
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
                      {{ project.day | moment('DD/MM/YYYY') }}:
                    </strong>
                    <nuxt-link
                      :to="{
                        name: 'admin-project-short_name-settings',
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
      <b-card no-body class="mb-1">
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
                      {{ project.day | moment('DD/MM/YYYY') }}:
                    </strong>
                    <nuxt-link
                      :to="{
                        name: 'admin-project-short_name-settings',
                        params: {
                          short_name: project.short_name
                        }
                      }">
                      {{ project.p_name }}
                    </nuxt-link>
                    updated by
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

    <b-card
  </div>
</template>

<script>
import { notifications } from '@/mixins/notifications'
import SmallAvatar from '@/components/avatars/Small'
import LineChart from '@/components/charts/Line'

export default {
  layout: 'admin-site-dashboard',

  mixins: [ notifications ],

  data () {
    return {
      title: 'Dashboard'
    }
  },

  async asyncData ({ app, error }) {
    return app.$axios.$get('/admin/dashboard').then(data => {
      return {
        activeAnon: data.active_anon_last_week,
        activeAuth: data.active_users_last_week,
        returningUsers: data.returning_users_week,
        newUsers: data.new_users_week,
        newTaskRuns: data.new_task_runs_week,
        newTasks: data.new_tasks_week,
        updateFeed: data.update_feed.map(item => {
          // Convert epoch timestamp to ISO string
          const d = new Date(0)
          d.setUTCSeconds(item.updated)
          item.updated = d.toISOString()
          return item
        }),
        draftProjects: data.draft_projects_last_week,
        publishedProjects: data.published_projects_last_week,
        updatedProjects: data.update_projects_last_week
      }
    }).catch(err => {
      error(err)
    })
  },

  head () {
    return {
      title: this.title
    }
  },

  components: {
    LineChart,
    SmallAvatar
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
        this.flash(data)
      }).catch(err => {
        this.$nuxt.error(err)
      })
    }
  }
}
</script>
