import { manageSession } from '@/utils/auth'

export default function ({ isServer, store, req }) {
  if (isServer && req) {
    manageSession(store, req.headers.cookie)
  }
}
