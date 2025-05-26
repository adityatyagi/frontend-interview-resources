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

setTimeout(() => {
    console.log(this)
}, 1000);

setTimeout(function(){
    console.log(this)
}, 1000);


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

obj100.method();


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






