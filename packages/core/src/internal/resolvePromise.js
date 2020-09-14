import * as is from '@redux-saga/is'
import { CANCEL } from '@redux-saga/symbols'
// 异步控制流，在promise.then后回调套入
export default function resolvePromise(promise, cb) {
  const cancelPromise = promise[CANCEL]

  if (is.func(cancelPromise)) {
    cb.cancel = cancelPromise
  }

  promise.then(cb, error => {
    cb(error, true)
  })
}
