// lexical scope - a variable defined outside the function is accessible inside the inner fun but the reverse is not true
// closure: combinations of a function bundled together with references to its surrounding state (the lexical env). Closure is created EVERY TIME a function is created at the function creation time
// closure helps JS functions to have private vars - Real-World Pattern (Module Pattern)
// closure: This is useful for encapsulation, data hiding, and controlled access.
// Follows the principle of least privilege: expose only what’s necessary.
// Closure scope chain: local, outer scope, global
// different between the closure and scope

function subscribe(){
    const name = 'aditya';
    function displayName(){  // <-- closure
        console.log('name', name);
    }
    displayName();
}

subscribe();

// Module pattern
const bankBalance = (function(){
    // encapsulated -  Encapsulation means bundling data (like variables) and the code that operates on that data (like functions) into a single unit.
    // A function can encapsulate variables, making them internal details. Only specific functions can access or modify those variables.
    let _balance = 100; // private variable - encapsulated, not accessible outside

    // we can also have private methods/functions
    function _add100000ToBalance() {
        console.log('calling');
        _balance += 100000;
    }

    return {
        deposit(amount) {
            _balance += amount;
        },
        withdraw(amount) {
            if(amount <= _balance) {
                _balance -= amount;
                
            }
        },
        getBalance() {
            return _balance;
        },
        add100000ToBalance() {
            console.log('here');
            
            _add100000ToBalance();
        } 
    }
})();


console.log(bankBalance.getBalance());
bankBalance.deposit(200)
console.log(bankBalance.getBalance());
bankBalance.withdraw(50)
console.log(bankBalance.getBalance());

bankBalance.add100000ToBalance()
console.log('-----', bankBalance.getBalance());


// console.log(bankBalance._balance); // undefined (can't access directly)


// createBase
function createBase(baseWith) {
    return function (numToAddToBase) {
        return baseWith + numToAddToBase;
    }
}

const createBaseWith6 = createBase(6);
console.log(createBaseWith6(10));
console.log(createBaseWith6(21));


// time optimizations
function findIndex() {
    let _a = [];
    for (let index = 0; index < 1000000; index++) {
        _a[index] = index*index;
    }

    // the loop and the array will remain same for all the calls for findIndex
    // we can compute the array once and use it via closure
    return function (i){
        console.log(_a[i]);
    }
}

const findValueOnIndex = findIndex();
console.time();
findValueOnIndex(10);
findValueOnIndex(50);
findValueOnIndex(80);
findValueOnIndex(90);
console.timeEnd()


function testSetTimeoutClosure() {
    for (var index = 0; index < 5; index++) {

        // Each call to inner() creates a new closure
        // The closedIndex parameter captures the current value of index at that moment
        // The setTimeout callback maintains access to its own unique closedIndex value
        function inner(closedIndex) {
            setTimeout(() => {
                console.log(closedIndex);
            }, 1000); 
        }
        inner(index)
     }
}



testSetTimeoutClosure();

console.log('-------make it run only once');

// make it run only once

let view;
function likeTheVideo() {
    let isLiked = false;
    function runOnce() {
        if(isLiked) return;
        isLiked = true;
        view ='rc';
        console.log('liked!', view);
    }
    return runOnce;
}

let isSubScribed = likeTheVideo();
isSubScribed();
isSubScribed();
isSubScribed();
isSubScribed();
isSubScribed();

// once pollyfill - lodash
function once(fn) {
    let called = false;
    let result;

    return function (...args) {
        if (called) return result;
        called = true;
        // The use of apply ensures that the function maintains the correct this context from where it's called. This is particularly important when the wrapped function is a method on an object that needs to access its properties via this.

        // Without apply, the function would lose its context and this would either point to the global object (in non-strict mode) or be undefined (in strict mode).
        result = fn.apply(this, args);
        return result;
    };
}
const printNums = (a, b) => console.log(a,b);
const printNumsOnce = once(printNums);
printNumsOnce(1,2);
printNumsOnce(1,2);
printNumsOnce(1,2);
printNumsOnce(1,2);


// In a browser:
// var name = 'arrow' would create a property on the global window object
// this.name in the arrow function would access window.name

// In Node.js:
// var name = 'arrow' doesn't create a property on the global object
// this in a module scope is not the global object
// Therefore, this.name is undefined
// var name = 'arrow';
global.name = 'arrow' 
const obj = {
    name: "John",
    greet: function(message) {
        console.log(`${message}, ${this.name}`);
    },
    greetArrow: (message) => {
        console.log(`${message}, ${global.name}`);
    }
};

// Using once with a method
const greetOnce = once(obj.greet);
const greetOnceArrow = once(obj.greetArrow);
obj.greetOnce = greetOnce;
obj.greetOnceArrow = greetOnceArrow;

// This will work correctly because 'this' is preserved
obj.greetOnce("Hello"); // Output: "Hello, John"

obj.greetOnceArrow('Hello');


console.log('momize pollyfill');


// memoize the function i.e. the function should store the computations for the args and if the same args are sent, we send the previous result, else compute the new one and save in cache
function memoizeFunction(fn, context) {
    let resultCache = {};

    return function (...args) {
        // convert the args into string for the key of the cache
        const argsKey = JSON.stringify(args);
        console.log(argsKey);

        const keyExist = !!resultCache[argsKey];

        if(!keyExist) {
            resultCache[argsKey] = fn.apply(context || this, args);
        }
        console.log(resultCache);
        
        return resultCache[argsKey];
        
    }
}
// momize pollyfill
function expenseCall(num1, num2) {
    for (let index = 0; index < 10000000; index++) {}
    return num1 + num2
}

const memoizedExpenseCall = memoizeFunction(expenseCall);
console.time('1');
memoizedExpenseCall(1,2);
console.timeEnd('1')

console.time('2');
memoizedExpenseCall(1,2);
console.timeEnd('2')



