import BootstrapVue from 'bootstrap-vue'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/twitter'
import 'vue-awesome/icons/github'
import 'vue-awesome/icons/envelope'

import collection from '@/test/fixtures/collection.json'
import { mount, createLocalVue } from 'vue-test-utils'
import AppFooter from '@/components/footers/App'

describe('App footer', () => {
  let localVue = null
  let wrapper = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.component('icon', Icon)
    wrapper = mount(AppFooter, {
      localVue,
      propsData: {
        collections: [ collection ]
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
