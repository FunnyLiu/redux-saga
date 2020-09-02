/* eslint-disable no-constant-condition */

import { take, put, call, fork, race, cancelled } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import { INCREMENT_ASYNC, INCREMENT, CANCEL_INCREMENT_ASYNC, COUNTDOWN_TERMINATED } from '../actionTypes'

const action = type => ({ type })

/*eslint-disable no-console*/
export const countdown = secs => {
  console.log('countdown', secs)
  //若要通知 channel 事件源已结束，你可以使用 END 通知传入的 subscriber 。
  return eventChannel(listener => {
    const iv = setInterval(() => {
      secs -= 1
      console.log('countdown', secs)
      // 订阅每一次的秒数
      if (secs > 0) listener(secs)
      else {
        // 若要通知 channel 事件源已结束，你可以使用 END 通知传入的 subscriber 。
        listener(END)
        clearInterval(iv)
        console.log('countdown terminated')
      }
    }, 1000)
    return () => {
      clearInterval(iv)
      console.log('countdown cancelled')
    }
  })
}

export function* incrementAsync({ value }) {
  // 调用倒计时
  const chan = yield call(countdown, value)
  try {
    while (true) {
      // 拿到秒数
      let seconds = yield take(chan)
      // 向 Store 发起一个 action
      yield put({ type: INCREMENT_ASYNC, value: seconds })
    }
  } finally {
    // 创建一个 Effect，用来命令 middleware 返回该 generator 是否已经被取消。
    // 通常你会在 finally 区块中使用这个 Effect 来运行取消时专用的代码
    if (!(yield cancelled())) {
      yield put(action(INCREMENT))
      yield put(action(COUNTDOWN_TERMINATED))
    }
    //关闭 channel，意味着不再允许做放入操作。所有未被处理的 taker 都将被以 END 为参数调用。
    chan.close()
  }
}
//异步增加按钮后逻辑
export function* watchIncrementAsync() {
  try {
    while (true) {
      // 监听
      // 异步增加按钮被点击后
      const action = yield take(INCREMENT_ASYNC)
      // starts a 'Race' between an async increment and a user cancel action
      // if user cancel action wins, the incrementAsync will be cancelled automatically
      // 如果取消倒计时按钮被点击后，则取消
      yield race([call(incrementAsync, action), take(CANCEL_INCREMENT_ASYNC)])
    }
  } finally {
    console.log('watchIncrementAsync terminated')
  }
}

export default function* rootSaga() {
  yield fork(watchIncrementAsync)
}
