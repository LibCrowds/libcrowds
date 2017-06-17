import Vue from 'vue'
import Icon from 'vue-awesome/components/Icon'
import users from 'ionicons/dist/svg/ios-people-outline.svg'
import projects from 'ionicons/dist/svg/ios-desktop-outline.svg'
import taskruns from 'ionicons/dist/svg/ios-create-outline.svg'

Vue.component('icon', Icon)

Icon.register({
  'users': {
    width: 512,
    height: 512,
    raw: users
  }
})

Icon.register({
  'taskruns': {
    width: 512,
    height: 512,
    raw: taskruns
  }
})

Icon.register({
  'projects': {
    width: 512,
    height: 512,
    raw: projects
  }
})
