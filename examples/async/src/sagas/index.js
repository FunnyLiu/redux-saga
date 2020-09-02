import { take, put, call, fork, select } from 'redux-saga/effects'
import fetch from 'isomorphic-fetch'
import * as actions from '../actions'
import { selectedRedditSelector, postsByRedditSelector } from '../reducers/selectors'

export function fetchPostsApi(reddit) {
  return fetch(`https://www.reddit.com/r/${reddit}.json`)
    .then(response => response.json())
    .then(json => json.data.children.map(child => child.data))
}

export function* fetchPosts(reddit) {
  // creates the dispatch Effect
  yield put(actions.requestPosts(reddit))
  //make asynchronous calls
  const posts = yield call(fetchPostsApi, reddit)
  yield put(actions.receivePosts(reddit, posts))
}

export function* invalidateReddit() {
  while (true) {
    const { reddit } = yield take(actions.INVALIDATE_REDDIT)
    yield call(fetchPosts, reddit)
  }
}
// 对选中reddit进行监听
export function* nextRedditChange() {
  while (true) {
    const prevReddit = yield select(selectedRedditSelector)
    // 等待actions.SELECT_REDDIT，再往下执行
    yield take(actions.SELECT_REDDIT)

    const newReddit = yield select(selectedRedditSelector)
    const postsByReddit = yield select(postsByRedditSelector)
    // 如果不是同一个，再执行到fetchPosts
    if (prevReddit !== newReddit && !postsByReddit[newReddit]) yield fork(fetchPosts, newReddit)
  }
}

export function* startup() {
  // 选择指定调用器
  const selectedReddit = yield select(selectedRedditSelector)
  //以 非阻塞调用 的形式执行 fetchPosts
  yield fork(fetchPosts, selectedReddit)
}

export default function* root() {
  yield fork(startup)
  // 监听onchange
  yield fork(nextRedditChange)
  // 监听刷新refresh按钮
  yield fork(invalidateReddit)
}
