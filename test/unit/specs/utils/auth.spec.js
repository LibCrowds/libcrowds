import { manageSession } from '~/utils/auth'

describe('manageSession', () => {
  let store = null
  let name = null
  let otherCookie = null
  let sessionCookie = null
  let diffSessionCookie = null

  beforeEach(() => {
    name = 'joebloggs'
    store = {
      state: {
        currentUser: {
          name: name
        }
      },
      dispatch: jest.fn()
    }
    sessionCookie = `remember_token=${name}|123`
    diffSessionCookie = `remember_token=someoneelse|123`
    otherCookie = 'session=abc123'
  })

  it('updates if session and no current user', () => {
    store.state.currentUser = null
    manageSession(store, sessionCookie)
    expect(store.dispatch.mock.calls[0][0]).toBe('UPDATE_CURRENT_USER')
  })

  it('updates if no session and current user', () => {
    manageSession(store, '')
    expect(store.dispatch.mock.calls[0][0]).toBe('UPDATE_CURRENT_USER')
  })

  it('updates if session is for a different user', () => {
    manageSession(store, diffSessionCookie)
    expect(store.dispatch.mock.calls[0][0]).toBe('UPDATE_CURRENT_USER')
  })

  it('does not update if no session and no current user', () => {
    store.state.currentUser = null
    manageSession(store, '')
    expect(store.dispatch.mock.calls.length).toBe(0)
  })

  it('does not update session and current user', () => {
    manageSession(store, sessionCookie)
    expect(store.dispatch.mock.calls.length).toBe(0)
  })

  it('updates if session and no current user and multiple cookies', () => {
    store.state.currentUser = null
    let allCookies = [otherCookie, sessionCookie, otherCookie].join(';')
    manageSession(store, allCookies)
    expect(store.dispatch.mock.calls[0][0]).toBe('UPDATE_CURRENT_USER')
  })

  it('updates if session is for a different user and multiple cookies', () => {
    let allCookies = [otherCookie, diffSessionCookie, otherCookie].join(';')
    manageSession(store, allCookies)
    expect(store.dispatch.mock.calls[0][0]).toBe('UPDATE_CURRENT_USER')
  })

  it('does not update session and current user and multiple cookies', () => {
    let allCookies = [otherCookie, sessionCookie, otherCookie].join(';')
    manageSession(store, allCookies)
    expect(store.dispatch.mock.calls.length).toBe(0)
  })
})
