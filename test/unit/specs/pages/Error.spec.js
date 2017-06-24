import Vue from 'vue'
import VueRouter from 'vue-router'
import Icon from 'vue-awesome/components/Icon'
import router from '@/router'
import Error from '@/pages/Error'

describe('Error.vue', () => {
  Vue.use(VueRouter)
  Vue.component('icon', Icon)
  const Constructor = Vue.extend(Error)
  const vm = new Constructor({
    router,
    propsData: {
      title: '404',
      description: 'Uh oh'
    }
  }).$mount()

  it('renders the title correctly', () => {
    expect(vm.$el.querySelector('.error h1').textContent).to.equal('404')
  })

  it('renders the description correctly', () => {
    expect(vm.$el.querySelector('.error p.lead').textContent).to.equal('Uh oh')
  })
})
