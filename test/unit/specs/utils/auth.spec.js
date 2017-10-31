import { updateSession } from '@/utils/auth'

describe('updateSession', () => {
  let currentUser = null
  let name = null
  let otherCookie = null
  let sessionCookie = null
  let diffSessionCookie = null

  beforeEach(() => {
    name = 'joebloggs'
    currentUser = {
      name: name
    }
    sessionCookie = `remember_token=${name}|123`
    diffSessionCookie = `remember_token=someoneelse|123`
    otherCookie = 'session=abc123'
  })

  it('returns true if there is a session and no current user', () => {
    const update = updateSession(null, sessionCookie)
    expect(update).toBe(true)
  })

  it('returns true if no session and a current user', () => {
    const update = updateSession(currentUser, '')
    expect(update).toBe(true)
  })

  it('returns true if session is for a different user', () => {
    const update = updateSession(currentUser, diffSessionCookie)
    expect(update).toBe(true)
  })

  it('returns false if no session and no current user', () => {
    const update = updateSession(null, '')
    expect(update).toBe(false)
  })

  it('returns false if session is for the current user', () => {
    const update = updateSession(currentUser, sessionCookie)
    expect(update).toBe(false)
  })

  it('returns true if session and no current user and multiple cookies', () => {
    let cookies = [otherCookie, sessionCookie, otherCookie].join(';')
    const update = updateSession(null, cookies)
    expect(update).toBe(true)
  })

  it('returns true if session is for another user and multiple cookies', () => {
    let cookies = [otherCookie, diffSessionCookie, otherCookie].join(';')
    const update = updateSession(currentUser, cookies)
    expect(update).toBe(true)
  })

  it('returns false if session matches and multiple cookies', () => {
    let cookies = [otherCookie, sessionCookie, otherCookie].join(';')
    const update = updateSession(currentUser, cookies)
    expect(update).toBe(false)
  })
})
