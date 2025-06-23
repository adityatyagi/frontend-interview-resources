// // sync vs async
// // js - single threaded language
// // single threaded v/s multi threaded


// // callback hell
// console.log('start')
// function f1(cb) {
//     setTimeout(() => {
//         cb("f1");
//     }, 1000);
// }

// function f2(cb) {
//     setTimeout(() => {
//         cb("f2");
//     }, 500);
// }

// function f3(cb) {
//     setTimeout(() => {
//         cb("f3");
//     }, 300);
// }

// // callback hell
// f1(function(message) {
//     console.log(message);
//     // cb functions maintain thier own context with new "this"
//     f2(function(message){
//         console.log(message);
//         f3(function(message){
//             console.log(message);
//         })
//     })
// })
// console.log('end');


// // simple promise
// const testPromise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         let result = true;
//         if(result){
//             resolve('success');
//         } else {
//             reject(new Error('failed!!!'));
//         }
//     }, 1000);
// });

// testPromise.then(res => console.log(res)).catch(e => console.log(e));

// // resolve and rejects
// const resolvedPromise = Promise.resolve('success2');
// const rejectedPromise = Promise.reject('failled');

// resolvedPromise.then(res => console.log(res)).catch(e => console.log(e));
// rejectedPromise.then(res => console.log(res)).catch(e => console.log(e));



// function f1P(message) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(message);
//         }, 1000);
//     })
// }
// function f2P(message) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(message);
//         }, 1000);
//     })
// }

// function f3P(message) {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(message);
//         }, 1000);
//     })
// }


// // Promise chaining
// f1P('from f1')
//   .then((message1) => {
//     console.log(message1);
//     return f2P('from f2');
//   })
//   .then((message2) => {
//     console.log(message2);
//     return f3P('from f3');
//   })
//   .then((message3) => {
//     console.log(message3);
//   })
//   .catch((err) => {
//     console.error("Error:", err);
//   });


//   // PROMISE COMBINATORS - Quick Study Notes
  
//   // Promise.all([p1, p2, p3]) 🎯 "ALL OR NOTHING"
//   // - Executes all promises in PARALLEL
//   // - Resolves when ALL promises resolve (with array of results)
//   // - Rejects immediately if ANY promise rejects (fail-fast)
//   // - Use case: When you need ALL operations to complete successfully
//   // - Mnemonic: "ALL for one, one FAILS ALL" 💥
  
//   // Promise.allSettled([p1, p2, p3]) 🏁 "ALL SETTLED, NEVER FRETTED"
//   // - Executes all promises in parallel
//   // - ALWAYS resolves (never rejects)
//   // - Returns array of objects: {status: 'fulfilled'/'rejected', value/reason}
//   // - Use case: When you want results of all promises regardless of success/failure
//   // - Mnemonic: "SETTLED like dust - everything gets reported" 📊
  
//   // Promise.any([p1, p2, p3]) 🏆 "ANY WIN WINS"
//   // - Executes all promises in parallel
//   // - Resolves as soon as ANY promise resolves (first success wins)
//   // - Rejects only if ALL promises reject (AggregateError)
//   // - Use case: When you need just ONE successful result (fastest wins)
//   // - Mnemonic: "ANY success is GOOD ENOUGH" ✨
  
//   // Promise.race([p1, p2, p3]) 🏃 "RACE TO THE FINISH"
//   // - Executes all promises in parallel
//   // - Settles as soon as ANY promise settles (first to finish wins - success OR failure)
//   // - Use case: Timeouts, fastest response wins, or cancellation patterns
//   // - Mnemonic: "First to cross the line WINS (good or bad)" 🚩


//   const promise1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("Promise 1");
//     }, 1000);
//   });

//   const promise2 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("Promise 2");
//     }, 2000);
//   });

//   const promise3 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("Promise 3");
//     }, 3000);
//   });

//   // Promise.all - All for one, one fails all
//   Promise.all([promise1, promise2, promise3]).then((results) => {
//     console.log(results);
//   }).catch((err) => {
//     console.log(err);
//   });

//   // Promise.allSettled - settled like dust - everything gets reported
//   Promise.allSettled([promise1, promise2, promise3]).then((results) => {
//     console.log(results);
//   }).catch((err) => {
//     console.log(err);
//   });

//   // Promise.any - any success is good enough, but fails if all fail
//   Promise.any([promise1, promise2, promise3]).then((results) => {
//     console.log(results);
//   }).catch((err) => {
//     console.log(err);
//   });

//   // Promise.race - race to the finish, first to finish wins - success or failure
//   Promise.race([promise1, promise2, promise3]).then((results) => {
//     console.log(results);
//   }).catch((err) => {
//     console.log(err);
//   });


  // Questions on Promises
  
  // EXECUTION ORDER EXPLANATION 🧠
  // Expected output: start → 1 -> 3 → end → success
  // WHY? Promise constructor runs SYNCHRONOUSLY!
  
  console.log('start');                    // 1️⃣ SYNC: Prints immediately
  const promise4 = new Promise((resolve, reject) => {
    // ☝️ THIS FUNCTION IS THE "EXECUTOR" 
    // The executor function: (resolve, reject) => { ... }
    // It's the callback function passed to new Promise()
    console.log('1');                      // 2️⃣ SYNC: Executor runs immediately! 
    resolve('success');
    console.log('3');                    // 3️⃣ SYNC: Resolution is queued to microtask
  });

  console.log('end');                      // 4️⃣ SYNC: Prints immediately
  async function testPromise() {
    const response = await promise4;       // 5️⃣ ASYNC: Waits for microtask queue
    console.log(response);                 // 6️⃣ ASYNC: Prints after call stack is empty
  }

  testPromise();
  
  // 🔑 KEY CONCEPT: Promise CONSTRUCTOR runs synchronously
  // Only .then() callbacks and await resolutions are asynchronous
  // Common interview trap: "Is Promise creation async?" → NO!
  
  // 📚 WHAT IS THE "EXECUTOR"?
  // new Promise(EXECUTOR_FUNCTION)
  // new Promise((resolve, reject) => { ... })
  //             ↑ THIS IS THE EXECUTOR ↑
  // 
  // The executor is:
  // - The function you pass to new Promise()
  // - Takes 2 parameters: resolve and reject functions
  // - Runs IMMEDIATELY when Promise is created (not async!)
  // - Contains your promise logic (what should happen)
  
  // CALL STACK vs MICROTASK QUEUE:
  // Call Stack: start → 1 → end → (empty)
  // Microtask Queue: success (waits for call stack to be empty)
  


  console.log('--------------------------------');

  console.log('start 2');

  /**
   * 
   * Memory trick: "Function-wrapped Promises are LAZY 🦥 - they wait to be called!"
     The executor always runs immediately when new Promise() is encountered, but the timing of when that line is reached depends on your code structure!
   */
  const testPromiseFunc2 = () => {
    return new Promise((resolve, reject) => {
      console.log('in testPromiseFunc2');
      resolve('success 2');
    })
  }

  console.log('middle');
  

  testPromiseFunc2().then((res) => {
    console.log(res);
  })

  console.log('end 2');

  // OUTPUT:
  // start 2
  // middle
  // in testPromiseFunc2
  // end 2
  // success 2

  // PROMISE EXECUTION ORDER EXPLANATION 🧠
  // Expected output: start 2 → middle → in testPromiseFunc2 → end 2 → success 2
  // WHY? Promise constructor runs SYNCHRONOUSLY!



    console.log('----------PROMISE CHAINING----------------------');


    function job1(state) {
      return new Promise((resolve, reject) => {
        console.log('promise chaining (creation)');
        if(state) {
            resolve('promise chaning MAIN response');
        } else {
            reject('promise chaning MAIN error');
        }
      })
    }

    let promiseJob = job1(false); // prints "in job1" as promise is created here

    promiseJob
    .then((res) => {
      console.log('promise chaning  success 1 in job', res);
    }).then((res) => {
      console.log('promise chaning  success 2 in job');
    }).then((res) => {
      console.log('promise chaning  success 3 in job');
    }).catch((error) => {
      console.log('promise chaning  error 4 in job', error);
      // throw new Error('promise chaning error 4 in job');.
    }).then((res) => {
      console.log('promise chaning  success 5 in job');
    });

    // OUTPUT:
    // success 1 in job
    // success 2 in job
    // success 3 in job
    // success 5 in job

    // PROMISE CHAINING EXPLANATION 🧠
    // Expected output: success 1 in job → success 2 in job → success 3 in job → success 5 in job
    // WHY? Promise chaining allows you to chain multiple .then() callbacks together
    // Each .then() returns a new promise, so the next .then() can only run after the previous one resolves

    // 🤔 WHY DOES .catch() NOT END THE CHAIN?
    // 
    // COMMON MISCONCEPTION: ".catch() terminates the promise chain"
    // REALITY: ".catch() returns a NEW PROMISE and continues the chain!"
    //
    // 🔗 PROMISE CHAIN FLOW EXPLANATION:
    // 
    // job1() → REJECTS with 'promise chaning MAIN error'
    //    ↓
    // .then() → SKIPPED (because promise rejected)
    //    ↓
    // .then() → SKIPPED (because promise rejected) 
    //    ↓
    // .then() → SKIPPED (because promise rejected)
    //    ↓
    // .catch() → HANDLES ERROR ✅ → RETURNS NEW RESOLVED PROMISE
    //    ↓         (doesn't throw = success!)
    // .then() → RUNS because .catch() returned resolved promise!
    //
    // 🔑 KEY CONCEPTS:
    // 1. .catch() is just .then(null, errorHandler)
    // 2. .catch() RETURNS a new promise
    // 3. If .catch() doesn't throw, it returns RESOLVED promise
    // 4. Next .then() sees resolved promise and runs
    // 5. Chain only ends if you don't attach more handlers
    //
    // 💡 TO ACTUALLY END CHAIN AFTER ERROR:
    // .catch((error) => {
    //   console.log('Handled error:', error);
    //   throw error; // ← Re-throw to keep chain rejected
    // })
    //
    // 🔄 PROMISE TRANSFORMATION:
    // Each .then()/.catch() creates a NEW promise:
    // Original Promise → .then() → New Promise → .catch() → New Promise → .then()
    //
    // Memory trick: ".catch() is a HEALER 🩹 - it fixes errors and lets life continue!"

// QUESTION:
// Create a promise that resolves to "FIRST"
// Create a second promise that resolves the FIRST promise
// Output of the resolution of SECOND promise is passed to the FIRST promise

const firstPromise = new Promise((resolve, reject) => {
  resolve('FIRST');
})

const secondPromise = new Promise((resolve, reject) => {
  resolve(firstPromise);
})

secondPromise.then((outputOfSecondPromise) => {
  return outputOfSecondPromise; // this will be the FIRST promise - "firstPromise"
}).then((responseOfFirstPromise) => {
  console.log(responseOfFirstPromise);
})

// OUTPUT:
// FIRST


function loadJson(url) {
  return fetch(url).then((response) => {
    if(response.status === 200) {
      // Key Concepts:
      // Each .then() callback MUST return a value to pass to the next .then()
      // response.json() returns a Promise, not the actual JSON data
      // The next .then() automatically waits for that Promise to resolve
      // If you don't return, the next .then() receives undefined
      return response.json(); // ← Returns Promise<JSON>
    } else {
      throw new Error('Failed to load JSON');
    }
  })
}

// .then/.catch  -> async / await
loadJson('https://jsonplaceholder.typicode.com/todos/1').catch((error) => {
  console.log(error);
});

async function loadJsonAsync(url) {
  try {
    let response = await fetch(url);
    if(response.status === 200) {
      let data = await response.json();
      return data;
    } else {
      throw new Error('Failed to load JSON');
    }
  } catch (e) {
    console.error(e);
  }
}

loadJson('https://jsonplaceholder.typicode.com/todos/1')
.then((data) => {
  console.log(data);
})
.catch((error) => {
  console.log(error);
});


// create 3 promises that accept a value and return a transformed result
const promise1 = (value) => new Promise((resolve, reject) => {
  console.log(`Promise 1 received: ${value}`);
  resolve(`promise 1 result: ${value * 2}`);
});

const promise2 = (value) => new Promise((resolve, reject) => {
  console.log(`Promise 2 received: ${value}`);
  resolve(`promise 2 result: ${value} + 10`);
});

const promise3 = (value) => new Promise((resolve, reject) => {
  console.log(`Promise 3 received: ${value}`);
  resolve(`promise 3 result: ${value} completed!`);
});

const promiseArray = [promise1, promise2, promise3];

// solve promise recursively - sequential execution
function solvePromise(promiseArray, initialValue) {
  if (promiseArray.length === 0) {
    return Promise.resolve(initialValue);
  }
  
  // Get the first promise function from the array
  const currentPromise = promiseArray.shift();
  
  // Execute current promise with initialValue
  return currentPromise(initialValue)
    .then((result) => {
      console.log(`Intermediate result: ${result}`);
      // Recursively call with remaining promises and current result
      return solvePromise(promiseArray, result);
    })
    .catch((error) => {
      console.error('Error in promise chain:', error);
      throw error;
    });
}

// Alternative iterative solution using reduce
function solvePromiseIterative(promiseArray, initialValue) {
  return promiseArray.reduce((currentPromise, promiseFn) => {
    return currentPromise.then((result) => {
      console.log(`Intermediate result: ${result}`);
      return promiseFn(result);
    });
  }, Promise.resolve(initialValue));
}

// Test the recursive solution
console.log('=== Testing Recursive Solution ===');
solvePromise([...promiseArray], 1)
  .then((finalResult) => {
    console.log(`Final result: ${finalResult}`);
  })
  .catch((error) => {
    console.error('Final error:', error);
  });

// Test the iterative solution
console.log('\n=== Testing Iterative Solution ===');
solvePromiseIterative([...promiseArray], 1)
  .then((finalResult) => {
    console.log(`Final result: ${finalResult}`);
  })
  .catch((error) => {
    console.error('Final error:', error);
  });

// DEMONSTRATION: Why we need spread operator
console.log('\n=== Demonstration: Original Array vs Spread ===');

// Check original array before any calls
console.log('Original promiseArray before calls:', promiseArray.length, 'promises');

// If we used promiseArray directly (DON'T DO THIS):
// solvePromise(promiseArray, 1)  // This would mutate the original array
// solvePromiseIterative(promiseArray, 1)  // This would fail because promise1 is gone!

// Instead, we use spread operator to create copies
console.log('Using spread operator creates copies, original array stays intact:');
console.log('Before first call - promiseArray length:', promiseArray.length);
solvePromise([...promiseArray], 1);  // Creates copy, original unchanged
console.log('After first call - promiseArray length:', promiseArray.length);
solvePromiseIterative([...promiseArray], 1);  // Creates another copy, original still unchanged
console.log('After second call - promiseArray length:', promiseArray.length);


// Promise pollyfill implementation


function PromisePolyfill(executor) {
  let onResolve, onReject;
  let isResolved = false;
  let resolvedValue;
  let isRejected = false;
  let rejectedValue;

  // while resolving, we can send additional data
  function resolve(resValue) {

    // check if the promise is already resolved or rejected
    if(!isResolved && !isRejected) {
      isResolved = true;
      resolvedValue = resValue;
    }

    // check onResolve callback is set
    if(onResolve) {
      onResolve(resValue);
    }
  }

  // while rejecting, we can send additional data
  function reject(rejValue) {

    // check if the promise is already resolved or rejected
    if(!isResolved && !isRejected) {
      isRejected = true;
      rejectedValue = rejValue;
    }

    // check onReject callback is set
    if(onReject) {
      onReject(rejValue);
    }
  }
  this.then = function(thisCallback){
    onResolve = thisCallback;

    // if already resolved, call the callback immediately
    if(isResolved) {
      onResolve(resolvedValue);
    }

    return this;
  };
  this.catch = function(catchCallback){
    onReject = catchCallback;

    // if already rejected, call the callback immediately
    if(isRejected) {
      onReject(rejectedValue);
    }

    return this;
  };

  executor(resolve, reject);
}

const newMyPromise = new PromisePolyfill((resolve, reject) => {
  
  // When you comment out the setTimeout, the resolve('resolved') is called synchronously (immediately), but the .then() callback hasn't been set up yet because it's called after the Promise constructor.
  // setTimeout(() => {
    resolve('resolved');
  // }, 1000);
});

/**
 * onResolve -->(res) => {
      console.log(res);
   }

   onReject --> (error) => {
    console.log(error);
  }
 */
newMyPromise
.then((res) => {
  console.log(res);
}).catch((error) => {
  console.log(error);
})



PromisePolyfill.resolve = (val) => {
  return new PromisePolyfill((resolve, reject) => {
    resolve(val);
  })
}

PromisePolyfill.reject = (val) => {
  return new PromisePolyfill((resolve, reject) => {
    reject(val);
  })
}


// Pollyfill for Promise.all
Promise.allPollyfill = (promiseArray) => {
  return new Promise((resolve, reject) => {
    let result = [];
    if(promiseArray.length === 0) {
      resolve(result);
      return;
    }

    let pending = promiseArray.length;

    promiseArray.forEach((promise, index) => {
      promise.then((res) => {
        result[index] = res;
        pending--;
        if(pending === 0) {
          resolve(result);
        }
      }).catch((error) => {})
    });

  })
}

// write code to test the promise.allPollyfill

const promise11 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('promise 11');
  }, 1000);
})

const promise22 = new Promise((resolve, reject) => { 
  setTimeout(() => {
    resolve('promise 22');
  }, 2000);
})

const promise33 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('promise 33');
  }, 3000);
})

const promiseArray1 = [promise11, promise22, promise33];

Promise.allPollyfill(promiseArray1).then((res) => {
  console.log(res);
}).catch((error) => {
  console.log(error);
})