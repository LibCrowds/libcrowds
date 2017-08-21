<template>
  <div id="help">
    <basic-layout :background="'geometry'">

      <div class="container my-5">
        <div class="row">
          <div class="col-md-4">
            <b-card
            no-block
            id="help-menu"
            class="mb-3"
            :header="'Help'">
              <b-list-group>
                <b-list-group-item
                  action
                  v-for="page in pages"
                  :key="page.id"
                  :active="activePage === page.id"
                  @click.native="activePage = page.id">
                  {{ page.label }}
                </b-list-group-item>
              </b-list-group>
            </b-card>

          </div>
          <div class="col-md-8">
            <component
              v-for="page in pages"
              :key="page.id"
              v-if="activePage === page.id"
              :is="page.component">
            </component>
          </div>
        </div>
      </div>

    </basic-layout>
  </div>
</template>

<script>
import BasicLayout from '@/components/layouts/Basic'
import API from '@/pages/help/sections/API'
import Cookies from '@/pages/help/sections/Cookies'
import Privacy from '@/pages/help/sections/Privacy'
import TOS from '@/pages/help/sections/TOS'

export default {
  data: function () {
    return {
      activePage: null,
      pages: [
        { id: 'api', label: 'API', component: API },
        { id: 'cookies', label: 'Cookies Policy', component: Cookies },
        { id: 'privacy', label: 'Privacy Policy', component: Privacy },
        { id: 'tos', label: 'Terms of Service', component: TOS }
      ]
    }
  },

  components: {
    BasicLayout
  },

  metaInfo: {
    title: 'Help'
  },

  methods: {
    /**
     * Set the active section.
     */
    setSection () {
      if ('section' in this.$route.query) {
        this.activePage = this.$route.query.section
      } else {
        this.activePage = this.pages[0].id
      }
    }
  },

  watch: {
    '$route' (to, from) {
      this.setSection()
    }
  },

  created () {
    this.setSection()
  }
}
</script>

<style lang="scss">
@import 'src/assets/style/main';

#help-menu {
  .card-header {
    text-align: center;
  }

  .list-group-item {
    cursor: default;
    border-left: none;
    border-right: none;

    &:first-child {
      border-top: none;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .card-block {
    display: flex;
    flex-direction: column;
  }
}
</style>
