// normal function -> will point to "this" of the parent object
// arrow functin -> will point to the "this" of the parent normal function
// this -> browser = window obj
// this -> nodejs = globalThis
globalThis.addressFromGlobalScope = 'Address from global scope in nodejs process'
const user = {
    name: "Aditya Tyagi",
    age: 25,
    greet: function () {
        console.log(`Hello, my name is ${this.name}`);
        const arrowFunction = () => {
            console.log(`I am ${this.age} years old`);
        };
        arrowFunction();
    },
    address: () => {
        console.log(`${globalThis.addressFromGlobalScope}`)
    }
};

user.greet();
user.address();


// for class
class User {
    constructor(name) {
        this.username = name;
    }

    printName() {
        // this in class points to everything there is in the constructor
        console.log(this.username);
    }
}

const user1 = new User('aditya');
user1.printName();


// makeUser() is a regular function call — not a method
// So, this inside makeUser() refers to the global object (or undefined in strict mode).
// In browser: this === window
// In Node.js (strict mode): this === undefined
function makeUser() {
    return {
        name: 'test',
        ref: this
    }
}


function makeUser2() {
    return {
        name: 'test',
        ref: function() {
            return this;
        }
    }
}
const makeUserObj = makeUser();
console.log(makeUserObj);
const makeUserObj2 = makeUser2();
console.log(makeUserObj);


const user3 = {
    name: 'aditya tyagi',
    logMessage() {
        console.log(this.name);
    }
}

console.log(user3);

// The "this" Context
// The key thing to understand is t
/*

Real-World Analogy
Think of it like a TV remote:

The remote (function) is the same physical object
But its behavior depends on where you point it (context)
Pointing at TV1 or TV2 changes which TV responds, even though it's the same remote
The function is like the remote - same code in memory, but its behavior (this context) depends on how you "point" it (how you call it).
Why "this" is Lost
The difference is in the invocation pattern:

When called as user3.logMessage()

JavaScript sees the dot notation
Sets this to the object before the dot (user3)
When called as standaloneFunctionReference()

There's no dot notation
No object context is provided
this defaults to undefined (strict mode) or window/global (non-strict)

// These point to the same function in memory:
const standaloneFunctionReference = user3.logMessage;
setTimeout(standaloneFunctionReference, 1000);
*/

setTimeout(user3.logMessage, 1000);

/*
Arrow Function Context:

The setTimeout function is called with an arrow function: () => { user3.logMessage() }.
Arrow functions do not create their own this. Instead, they "capture" the this value from their enclosing scope.
Enclosing Scope:

The enclosing scope of the arrow function is the file or function where setTimeout is called.
In this case, the this inside the arrow function is the same as the this in the surrounding context where setTimeout is defined.
*/
setTimeout(() => {
    // console.log(this.name);  // Here this would be window/global
    user3.logMessage(); // here "this" would not matter as it is being called directly on the user object
}, 1000);


setTimeout(function() {
    user3.logMessage();
}, 1000);
setTimeout(user3.logMessage.bind(user3), 1000);


// Example 1: Where arrow function's this DOES matter
const user33 = {
    name: 'aditya tyagi',
    delayedGreet: function() {
        setTimeout(() => {
            console.log(this.name);  // Here 'this' refers to user3
        }, 1000);
    }
};

// Example 2: Regular function for comparison
const user4 = {
    name: 'aditya tyagi',
    delayedGreet: function() {
        setTimeout(function() {
            console.log(this.name);  // Here 'this' is window/global
        }, 1000);
    }
};
/*
Why this is window/global
Regular Function Context

In JavaScript, regular functions create their own this context
The value of this depends on how the function is called, not where it's defined
setTimeout Callback Execution

When setTimeout executes the callback function, it calls it as a standalone function
It's effectively like this:

// What you write
setTimeout(function() {
    console.log(this.name);
}, 1000);

// How it's effectively executed
let callbackFunction = function() {
    console.log(this.name);
};
callbackFunction(); // Called without any context

*/


// calculator

let calculator = {
    read(){
        console.log('this', this); //<-object this
        this.a = 10;
        this.b = 12;
    },
    sum() {
        return this.a+this.b;
    }
}
calculator.read();
console.log(calculator.sum());



// tricky
globalThis.length = 4;
function callback() {
    console.log(globalThis.length);
}

const objjj = {
    length: 99,
    method(fn) {
        fn();
    }
}


const objjjk = {
    length: 99,
    method() {
        console.log(arguments);
        arguments[0](); // [callback, 2, 3]
        // when callback is called on object i.e array [] -> this.length = length of array
    }
}

objjj.method(callback);
objjjk.method(callback, 2, 3);


// implement calc


const calc = {
    total: 0,
    add(num){
        this.total += num;
        return this;
    },
    multiply(num) {
        this.total *= num;
        return this;
    },
    subtract(num) {
        this.total -= num;
        return this;
    },
}
const result = calc.add(10).multiply(5).subtract(30).add(10);
console.log('result', result.total);




