import BootstrapVue from 'bootstrap-vue'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/arrow-right'
import 'vue-awesome/icons/circle-thin'

import collection from '@/test/fixtures/collection.json'
import { mount, createLocalVue } from 'vue-test-utils'
import CollectionCard from '@/components/cards/Collection'

describe('Collection card', () => {
  let localVue = null
  let user = null
  let wrapper = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    localVue.component('icon', Icon)
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
