export default {
  SET_ITEM: (state, obj) => {
    state[obj.key] = obj.value
  },
  DELETE_ITEM: (state, key) => {
    state[key] = null
  },
  LOGIN: (state, user) => {
    state.currentUser = user
  },
  LOGOUT: (state) => {
    state.currentUser = {}
  }
}
