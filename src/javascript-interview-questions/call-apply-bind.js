
import readline from 'readline';

// call -  - bind the obj/this context and takes the args as [] - invokes fun
// apply - bind the obj/this context and takes the args as [] - invokes fun
// bind - returns a fun that can be executed later with the set context for this
var obj = {
    name: 'aditya'
}

function displayName(age) {
    console.log('Hello ' + this.name + ' age is ' + age);
}

// without the .call i.e. explicit binding, this -> window (browser) and global (in node) and undefined in strict mode
displayName.call(obj, 24);
displayName.apply(obj, [24, 26]);

var age = 10;
const sample = {
    name: 'Aditya',
    age: 24,
    printName() {
        console.log(`${this.name} is ${this.age} years old`);
    }
}

const person2 = {
    name: 'Pr',
    age: 69
}
sample.printName();
sample.printName.call(person2);
sample.printName.apply(person2);
sample.printName.bind(person2)();



// ques
var status = 'available';

setTimeout(function(){
    const status = 'idle';
    const data = {
        status: 'not available',
        getStatus() {
            return this.status
        }
    }

    console.log(data.getStatus());
    console.log(data.getStatus.call(this));
}, 1000);

// setTimeout(() => {
//     console.log(this)
// }, 1000);

// setTimeout(function(){
//     console.log(this)
// }, 1000);


// At module level
console.log(this);  // {}

const obj100 = {
    method: function() {
        /*
        Strict mode mainly affects regular functions, not arrow functions
        Inherits this from enclosing scope (module.exports)
        Cannot be rebound with call, apply, or bind
        More predictable in lexical scoping
        */
        setTimeout(() => {
            console.log(this);  // obj100
        }, 1000);
        
        /* 
        Regular Function
        Gets its own this binding
        Value depends on how function is called
        In Node.js setTimeout, refers to Timeout object
        Can be rebound using call, apply, or bind
        */
        setTimeout(function() {
            console.log(this);  // Timeout object
        }, 1000);
    }
};

// obj100.method();


const arrowFn = () => {
    console.log(this);
};

const obj3 = { name: 'test' };

// None of these will change 'this'
arrowFn.call(obj3);    // this still refers to original scope
arrowFn.apply(obj3);   // this still refers to original scope
arrowFn.bind(obj3)();  // this still refers to original scope


const regularFn = function() {
    console.log(this);
};

const objForRegFun = { name: 'test' };

// All of these will change 'this' to objForRegFun
regularFn.call(objForRegFun);    // this = objForRegFun
regularFn.apply(objForRegFun);   // this = objForRegFun
regularFn.bind(objForRegFun)();  // this = objForRegFun


const newperson = {
    name: 'John',
    // Arrow function
    greetArrow: () => {
        // console.log(`Hello, ${this.name}`); // 'this' is from enclosing scope - global (undefined in strict mode)
    },
    // Regular function
    greetRegular: function() {
        console.log(`Hello, ${this.name}`); // 'this' is newperson
    }
};

const othernewPerson = { name: 'Jane' };

// Arrow function - this cannot be rebound
newperson.greetArrow.call(othernewPerson);  // Hello, undefined
newperson.greetArrow.apply(othernewPerson); // Hello, undefined
newperson.greetArrow.bind(othernewPerson)(); // Hello, undefined

// Regular function - this can be rebound
newperson.greetRegular.call(othernewPerson);  // Hello, Jane
newperson.greetRegular.apply(othernewPerson); // Hello, Jane
newperson.greetRegular.bind(othernewPerson)(); // Hello, Jane

const animals = [
    {
        species: 'lion',
        name: 'king'
    },
    {
        species: 'cat',
        name: 'queen'
    }
]

function printAnimals(i) {
    this.print = function () {
        console.log(`${i} ${this.species} ${this.name}`);
    }
    this.print();
}

console.log('-------print animals--------');


// Iterator yields:
// animals.entries()
// [0, { species: 'lion', name: 'king' }]
// [1, { species: 'cat', name: 'queen' }]
for(let [index, item] of animals.entries()) {
    console.log(item);
    printAnimals.call(item, index)
}


// append an array to another array
// concat - provides a completely new array instead of changing the original array
const arr1 = [1,2,3];
const arr2 = [4,5,6];
console.log(arr1.concat(arr2))
console.log([...arr1, ...arr2])
console.log([...arr1, ...arr2])

arr1.push.apply(arr1, arr2);
console.log(arr1); // changed the orignial arr1


// find min max number in array
const numbers = [5,6,7,8,9, 10];

// null because it does not need any context
console.log(Math.max.apply(null, numbers));
console.log(Math.max(...numbers));

// loop based - check max
let max = -Infinity;
let min = Infinity;
for (let index = 0; index < numbers.length; index++) {
    if(numbers[index] > max) {
        max = numbers[index];
    }
    if(numbers[index] < min) {
        min = numbers[index];
    }
}
console.log('max', max);
console.log('min', min);


// questions
console.log('------------ques-------------')
function rest(){
    console.log(this); // global/undefined
}

let userTest = {
    g: rest.bind(null)
}

userTest.g() // the rest will be bound to "null"


console.log('------------ques bound chaining-------------')
function boundChaining() {
        console.log(this.boundedName);
}

// once a function is bounded to an object it will always be bound to that. 
boundChaining = boundChaining.bind({boundedName: 'aditya'}).bind({boundedName: 'anna'});
boundChaining(); // aditya


console.log('---check password---');


function checkPassword(success, failed) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter password', (pass) => {
        rl.close();
        if (pass === 'hello') {
            success();
        } else {
            failed();
        }
    })
}

let userPasswordCheck = {
    name: 'aditya',
    loginSuccess() {
        console.log(`${this.name} logged in`);
    },
    loginFail() {
        console.log(`${this.name} logged failed`);
        
    }
}

// giving userPasswordCheck.loginSuccess as a callback = standaloneFunctionReference which looses the reference to its objecth
// checkPassword(userPasswordCheck.loginSuccess.bind(userPasswordCheck), userPasswordCheck.loginFail.bind(userPasswordCheck));


console.log('-------- partial application for login -------');

function checkPasswordPartial(success, failed) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter password', (pass) => {
        rl.close();
        if (pass === 'hello') {
            success();
        } else {
            failed();
        }
    })
}

let userPasswordCheckPartial = {
    name: 'aditya',
    login(result) {
        console.log(`${this.name} ${result ? 'login success' : 'login failed'} `);
    }
}

checkPasswordPartial(userPasswordCheckPartial.login.bind(userPasswordCheckPartial, true),userPasswordCheckPartial.login.bind(userPasswordCheckPartial, false))


console.log('-----arrow functions with call/apply/bind-----')
//  Cannot be rebound with call, apply, or bind
const ageForTest = 10;
const personT = {
    name: 'John',
    age: 30,
    printAgeArrow: () => {
        console.log(`Arrow Function: ${this.age}`); // 'this' refers to the enclosing scope, undefined in strict mode in nodejs, else window in 
    },
    printAgeRegular: function() {
        console.log(`Regular Function: ${this.age}`); // 'this' refers to the personT object
    }
};

const personT2 = {
    name: 'Mark',
    age: 45,
};
// personT.printAgeArrow.call(personT2); // Arrow Function: undefined - error
personT.printAgeRegular.call(personT2); // Regular Function: 45
// we can't manipulate the context of an arrow function using call, apply, bind


// POLLYFILLS for CALL APPLY BIND
// reference
// 1. function.call(objectToReferTo, args1, args2, ...argsN)
// 2. obj.function.call(objectToReferTo, args1, args2, ...argsN)

// 1. CALL
Function.prototype.myCall = function(context = {}, ...args) {
    // ensure myCall is being called on a function
    if(typeof this !== 'function') {
        throw new Error(this + ' is not callable');
    }

    // add the function to which the object (context) needs to be binded to the OBJECT itself
    // {
    //     fn() {
    //         ...
    //     }
    // }
    context.fn = this;
    context.fn(...args)
}

Function.prototype.myApply = function(context = {}, args=[]) {
    // ensure myCall is being called on a function
    if(typeof this !== 'function') {
        throw new Error(this + ' is not callable');
    }

    // add the function to which the object (context) needs to be binded to the OBJECT itself
    // {
    //     fn() {
    //         ...
    //     }
    // }
    context.fn = this;
    context.fn(...args)
}



Function.prototype.myBind = function(context = {}, ...args) {
    // ensure myCall is being called on a function
    if(typeof this !== 'function') {
        throw new Error(this + ' is not callable');
    }
    // add the function to which the object (context) needs to be binded to the OBJECT itself
    // {
    //     fn() {
    //         ...
    //     }
    // }
    context.fn = this;
    return function (...newArgs) {
        context.fn(...args, ...newArgs)
    }

}


const car = {
    color: 'Red',
    price: '3000'
};

function printCarDetails(name, model) {
    console.log(`Car Name: ${name}, Model: ${model}, Color: ${this.color} , Price: ${this.price}`);
}

// Invoke the function with .myCall binding to the car object
printCarDetails.myCall(car, 'Tesla', 'ModelS');
printCarDetails.myApply(car, ['Tesla', 'ModelS']);
printCarDetails.myBind(car, 'Tesla', 'ModelS')();











