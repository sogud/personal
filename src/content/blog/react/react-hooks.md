---
title: "react hook 原理"
description: "<<< @/docs/posts/react/react-hooks/hooks_1.js"
pubDate: "2026-03-08T12:10:47.210Z"
tags: ["react"]
---



```js
let hook = null;
let isMount = true

function useState(initialState) {
  if (isMount) {
    hook = {
      state: initialState,
      action: null
    }
  }
  if (hook.action) {
    hook.state = hook.action(hook.state)
  }
  return [hook.state, dispatchAction]
}
function dispatchAction(action) {
  if (hook.action === null) {
    hook.action = action;
  }
  schedule();
}
// 调度器
function schedule() {
  App();
  isMount = false
}
function App() {
  const [count, updateCount] = useState(0)
  return render('button', {
    onclick: () => updateCount(e => e + 10),
    innerText: count
  })
}

function render(nodeType, props) {
  const root = document.getElementById('root');
  const dom = document.createElement(nodeType);

  for (let attr in props) {
    dom[attr] = props[attr];
  }

  root.innerHTML = '';
  root.append(dom);
}
schedule()
```



```js

let hook = null
let isMount = true
let watchArr

function useState(initialState) {
  if (isMount) {
    hook = {
      state: initialState,
      action: null
    }
  }
  if (hook.action) {
    hook.state = hook.action(hook.state)
  }
  return [hook.state, dispatchAction]
}
function dispatchAction(action) {
  if (hook.action === null) {
    hook.action = action
  }
  schedule()
}

function useEffect(fn, watch) {
  debugger
  let isChange = true
  if (watchArr) {
    isChange = !watch.every((e, i) => e === watchArr[i])
  }
  if (isChange) {
    watchArr = watch
    fn()
  }
}

function App(params) {
  const [count, updateCount] = useState(0)
  let aa = 0
  useEffect(() => {
    console.log('useEffect:', count);
  })
  return render('button', {
    innerText: count,
    onclick: () => updateCount(e => e + 10)
  })
}

function schedule(params) {
  App()
  isMount = false
}

schedule()

function render(nodeType, props) {
  const root = document.getElementById('root')
  let dom = document.createElement(nodeType)
  for (const key in props) {
    dom[key] = props[key]
  }
  root.innerHTML = ''
  root.append(dom)
}
```



```js

let hook = null
let isMount = true

function useState(initialState) {
  if (isMount) {
    hook = {
      state: initialState,
      action: null
    }
  }
  if (hook.action) {
    hook.state = hook.action(hook.state)
  }
  return [hook.state, dispatchAction]
}
function dispatchAction(action) {
  if (hook.action === null) {
    hook.action = action
  }
  schedule()
}

function App(params) {
  const [count, updateCount] = useState(0)
  return <button onClick={() => updateCount(e => e + 20)}>{count}</button>;
}

function schedule() {
  render();
  isMount = false
}

schedule()
function render() {
  ReactDOM.render(App(), document.getElementById('root'));
}
```



```js


let memoizedState = [];
let currentCursor = 0;

function useState(initialState) {
  memoizedState[currentCursor] = memoizedState[currentCursor] || {
    state: initialState,
    action: null
  };
  const cursor = currentCursor
  currentCursor++

  if (memoizedState[cursor].action) {
    memoizedState[cursor].state = memoizedState[cursor].action(memoizedState[cursor].state)
    memoizedState[cursor].action = null
  }
  return [memoizedState[cursor].state, dispatchAction.bind(null, cursor)]
}

function dispatchAction(cursor, action) {
  if (memoizedState[cursor].action === null) {
    memoizedState[cursor].action = action
  }
  schedule()
}

function App(params) {
  const [count, updateCount] = useState(0)
  const [count2, updateCount2] = useState(0)

  return (
    <div>
      <button onClick={() => updateCount(e => e + 10)}>{count}</button>
      <button onClick={() => updateCount2(e => e + 20)}>{count2}</button>
    </div>
  )
}

function schedule() {
  currentCursor = 0
  render();
}

schedule()

function render() {
  ReactDOM.render(App(), document.getElementById('root'));
}
```



```js
let isMount = true;
let workInProgressHook = null;

const fiber = {
  stateNode: App,
  memoizedState: null,
};

function useState(initialState) {
  let hook;
  if (isMount) {
    hook = {
      memoizedState: initialState,
      next: null,  // 链表
      queue: {   // 存储action的环形队列
        pending: null,
      },
    };
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
  } else {
    // console.log('~~~ workInProgressHook', workInProgressHook)
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }
  // 执行 action
  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;
    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== hook.queue.pending.next);
    hook.queue.pending = null;
  }
  hook.memoizedState = baseState;
  // return [baseState, dispatchAction.bind(null, hook.queue)];
  return [baseState, (action) => dispatchAction(hook.queue, action)];
}

function dispatchAction(queue, action) {
  const update = {
    action,
    next: null,
  };
  if (queue.pending === null) {
    // u0 -> u0
    update.next = update;
  } else {
    // u0 -> u1 ; u1 -> u0
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  queue.pending = update;
  schedule();
}

// 调度器
function schedule() {
  debugger
  workInProgressHook = fiber.memoizedState;
  render();
  isMount = false;
}

function App(params) {
  const [count, updateCount] = useState(0);
  const [count2, updateCount2] = useState(1);
  const [count3, updateCount3] = useState(2);
  console.log('isMount', isMount);
  console.log('count', count);
  console.log('count2', count2);

  return (
    <div>
      <button onClick={() => updateCount(e => e + 10)}>{count}</button>
      <button onClick={() => updateCount2(e => e + 20)}>{count2}</button>
    </div>
  )
}

schedule()

function render() {
  ReactDOM.render(fiber.stateNode(), document.getElementById('root'));
}
```



