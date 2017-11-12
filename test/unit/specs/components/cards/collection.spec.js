import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/arrow-right'
import 'vue-awesome/icons/circle-thin'
import NuxtLink from '@/.nuxt/components/nuxt-link'

import collection from '@/test/fixtures/collection.json'
import { mount, createLocalVue } from 'vue-test-utils'
import CollectionCard from '@/components/cards/Collection'
import { routes } from '@/test/fixtures/routes'

describe('Collection card', () => {
  let localVue = null
  let wrapper = null
  let router = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.component('icon', Icon)
    localVue.component(NuxtLink.name, NuxtLink)
    localVue.use(VueRouter)
    router = new VueRouter({
      routes
    })
    wrapper = mount(CollectionCard, {
      localVue,
      propsData: {
        collection: collection
      }
    })
  })

  it('renders correctly', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
