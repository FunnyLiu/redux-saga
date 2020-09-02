# Run locally
`npm start`

# Open in browser
[Click here](https://codesandbox.io/s/github/redux-saga/redux-saga/tree/master/examples/async)


# 解读

Action：State的变化，会导致View的变化。但是，用户接触不到State，只能接触到View。所以，State的变化必须是View导致的。Action就是View发出的通知，表示State应该要发生变化了。



Reducer：Store收到Action以后，必须给出一个新的State，这样View才会发生变化。这种State的计算过程就叫做Reducer。Reducer是一个函数，它接受Action和当前State作为参数，返回一个新的State。

Sagas: 真正控制异步操作的地方，通过generator配合while(true)来监听action从而做指定操作，通过redux-saga提供的一系列api来完成各种操作。




