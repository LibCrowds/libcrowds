class Flarum {
  login () {
    console.log('log in')
  }

  register () {
    console.log('register')
  }

  logout () {
    console.log('log out')
  }
}

export default (ctx, inject) => {
  const options = '<%= options %>'

  // Create new axios instance
  const flarum = new Flarum(options)

  // Inject as $flarum
  ctx.$flarum = flarum
  inject('flarum', flarum)
}
