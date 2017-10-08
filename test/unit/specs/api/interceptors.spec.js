import addCsrfHeader from '@/api/interceptors/addCsrfHeader'
import handleErrors from '@/api/interceptors/handleErrors'
import handleFlash from '@/api/interceptors/handleFlash'
import router from '@/router'
import store from '@/store'

jest.mock('@/router', () => ({
  push: jest.fn()
}))

jest.mock('@/store', () => ({
  dispatch: jest.fn()
}))

describe('Interceptors', () => {
  describe('addCsrfHeader', () => {
    it('adds the CSRF header when it exists', () => {
      const token = 'token'
      const request = {
        data: {
          csrf: token
        },
        headers: {}
      }
      addCsrfHeader(request)
      expect(request.headers['X-CSRFToken']).toBe(token)
    })

    it('does not add the CSRF header when it does not exist', () => {
      const request = {
        data: {},
        headers: {}
      }
      addCsrfHeader(request)
      expect(request.headers['X-CSRFToken']).toBe(undefined)
    })
  })

  describe('handleErrors', () => {
    it('handles non-200 errors', () => {
      const status = 404
      const error = {
        response: {
          status: status
        }
      }
      handleErrors(error)
      expect(router.push).toBeCalledWith({ name: status })
    })

    it('handles network errors', () => {
      const error = {
        request: {}
      }
      handleErrors(error)
      expect(router.push).toBeCalledWith({ name: 598 })
    })

    it('handles request setup errors', () => {
      const error = {}
      handleErrors(error)
      expect(router.push).toBeCalledWith({ name: 500 })
    })
  })

  describe('handleFlash', () => {
    it('dispatches notification from flash message', () => {
      const status = 'info'
      const flash = 'Something happened'
      const response = {
        data: {
          status: status,
          flash: flash
        }
      }
      handleFlash(response)
      expect(store.dispatch).toBeCalledWith('NOTIFY', {
        msg: flash,
        type: status
      })
    })

    it('does not dispatch notification for error flash message', () => {
      const status = 'error'
      const flash = 'Something happened'
      const response = {
        data: {
          status: status,
          flash: flash
        }
      }
      handleFlash(response)
      expect(store.dispatch).not.toHaveBeenCalled()
    })
  })
})
