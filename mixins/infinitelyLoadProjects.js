import merge from 'lodash/merge'

export const infinitelyLoadProjects = {
  data () {
    return {
      projects: [],
      defaultSearchParams: {
        limit: 20,
        published: true,
        all: 1
      }
    }
  },

  methods: {
    async infinitelyLoadProjects ($state) {
      // Merge search params with defaults and last ID
      let lastId = 0
      if (this.projects.length) {
        lastId = this.projects[this.projects.length - 1].id
      }
      const params = merge(this.defaultSearchParams, this.searchParams, {
        last_id: lastId
      })

      try {
        // Get project data
        const projectData = await this.$axios.$get('/api/project', {
          params: params
        })

        // Loading complete
        if (!projectData.length) {
          $state.complete()
          return
        }

        // Enrich projects with stats
        const statsData = await this.$axios.$get('/api/projectstats', {
          project_id: projectData.map(project => project.id)
        })
        const enrichedProjects = projectData.map((project, idx) => {
          return merge(statsData[idx], project)
        })

        console.log(enrichedProjects)

        this.projects = this.projects.concat(enrichedProjects)
        $state.loaded()
      } catch (err) {
        this.$nuxt.error({ statusCode: err.statusCode, message: err.message })
      }
    }
  }
}
