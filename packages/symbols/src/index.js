const createSymbol = name => `@@redux-saga/${name}`
// 通过symbol-like类型管理部分私有变量
export const CANCEL = createSymbol('CANCEL_PROMISE')
export const CHANNEL_END_TYPE = createSymbol('CHANNEL_END')
export const IO = createSymbol('IO')
export const MATCH = createSymbol('MATCH')
export const MULTICAST = createSymbol('MULTICAST')
export const SAGA_ACTION = createSymbol('SAGA_ACTION')
export const SELF_CANCELLATION = createSymbol('SELF_CANCELLATION')
export const TASK = createSymbol('TASK')
export const TASK_CANCEL = createSymbol('TASK_CANCEL')
export const TERMINATE = createSymbol('TERMINATE')

export const SAGA_LOCATION = createSymbol('LOCATION')
