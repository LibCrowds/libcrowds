import manageSession from '@/api/interceptors/manageSession'

describe('manageSession', () => {
  let store = null
  let name = null
  let sessionCookie = null
  let differentSessionCookie = null

  beforeEach(() => {
    let name = 'joebloggs'
    store = {
      state: {
        currentUser: {
          name: name
        }
      },
      dispatch: jest.fn()
    }
    sessionCookie = `remember_token=${name}|123`
    differentSessionCookie = `remember_token=someoneelse|123`
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
    manageSession(store, differentSessionCookie)
    expect(store.dispatch.mock.calls[0][0]).toBe('UPDATE_CURRENT_USER')
  })

  it('does not update if no session and no current user', () => {
    store.state.currentUser = null
    manageSession(store, '')
    expect(store.dispatch.mock.calls.length).toBe(0)
  })
})