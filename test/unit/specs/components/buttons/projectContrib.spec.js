import BootstrapVue from 'bootstrap-vue'

import { mount, createLocalVue } from 'vue-test-utils'
import ProjectContribButton from '@/components/buttons/ProjectContrib'

describe('ProjectContrib button', () => {
  let localVue = null
  let wrapper = null

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(BootstrapVue)
    wrapper = mount(ProjectContribButton, {
      localVue,
      propsData: {
        shortname: 'my_project'
      }
    })
  })

  it('is active by default', () => {
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('is disabled when status is completed', () => {
    wrapper.setProps({
      status: 'completed',
      shortname: 'my_project'
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })

  it('is disabled when status is cannot_completed', () => {
    wrapper.setProps({
      status: 'cannot_contribute',
      shortname: 'my_project'
    })
    const renderer = require('vue-server-renderer').createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      expect(str).toMatchSnapshot()
    })
  })
})
