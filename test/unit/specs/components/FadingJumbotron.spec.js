import Vue from 'vue'
import FadingJumbotron from '@/components/FadingJumbotron'

describe('FadingJumbotron.vue', () => {
  it('should render bgImage as background image', () => {
    const Constructor = Vue.extend(FadingJumbotron)
    const vm = new Constructor({
      propsData: {
        bgImg: 'img.jpg'
      }
    }).$mount()
    expect(vm.$el.querySelector('.jumbotron').style.backgroundImage)
      .to.equal('url(http://localhost:9876/img.jpg)')
  })

  it('should render header as h1 text content', () => {
    const Constructor = Vue.extend(FadingJumbotron)
    const vm = new Constructor({
      propsData: {
        header: 'Hello'
      }
    }).$mount()
    expect(vm.$el.querySelector('.jumbotron h1').textContent)
      .to.equal('Hello')
  })

  it('should render scrollAnchor as href', () => {
    const Constructor = Vue.extend(FadingJumbotron)
    const vm = new Constructor({
      propsData: {
        scrollAnchor: '#anchor'
      }
    }).$mount()
    expect(vm.$el.querySelector('.jumbotron a').href)
      .to.equal('http://localhost:9876/context.html#anchor')
  })
})
