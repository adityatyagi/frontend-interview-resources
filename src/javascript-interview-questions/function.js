// function declarations
// function expressions
// first class functions
// anon functions
// IIFE
// function hositing
// params vs args
// spread (passing - args) vs rest (params - receiving)
// callback function e.g. eventListners, .map(cb), .filter(cb), setTimeout
// arrow functions



// var is function-scoped
// It does not create a new scope for each iteration.

// So the same index variable is shared across all iterations.

// By the time setTimeout runs (after 1 second), the loop has already finished, and index is 5.

// Hence, this will print:  5 5 5 5 5 
for (var index = 0; index < 5; index++) {
    setTimeout(() => {
        console.log(index);
    }, 1000);
}

// let is block-scoped
// let creates a new binding of index for each iteration of the loop.

// So each arrow function inside setTimeout "remembers" the index from its own iteration.

// Output will be: 0 1 2 3 4 5
for (let index = 0; index < 5; index++) {
    setTimeout(() => {
        console.log(index);
    }, 1000);
}



var x = 21;

function testFunctionHoisting() {
    console.log('testFunctionHoisting', x); // this will be undefined because hoisting is a two part process - creation phase and execution phase which happens scope wise. in this inner function scope, x will be hoisted in "local" scope to undefined
    // hoisting initializes the whole code - global + local and then exectues
    // hence when we have a variable in the local scope, we will not "check" the global scope
    var x = 20;
}

testFunctionHoisting();