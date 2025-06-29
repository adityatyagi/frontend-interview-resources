/**
 * 
"What is a prototype?"
Definition: A prototype is an object that exists on every object in JavaScript
Purpose: Inheritance and shared properties

"How does inheritance work in JavaScript?"
Definition: Prototypal inheritance
Purpose: Reusable code and shared properties

Everything in JS is an object
To prove it, if we check __proto__ of a number, we get the prototype of the number and if we check the __proto__ of the prototype, we get the prototype of the prototype - which is object
i.e. num.__proto__.__proto__ === Object.prototype

The same goes for String, Boolean, Array, etc.
i.e. str.__proto__.__proto__ === Object.prototype

The same goes for functions
i.e. func.__proto__.__proto__ === Object.prototype


"What's the difference between properties and methods in inheritance?"

Properties (Instance Variables):
    Where: Defined in constructor with this.property
    Inheritance: Via Parent.call(this, args)
    Memory: Each instance has its own copy


Methods (Prototype Functions):
    Where: Defined on Parent.prototype
    Inheritance: Via Object.create(Parent.prototype)
    Memory: Shared across all instances


 // Properties: Each instance needs its own data
Animal.call(this, name);  // this.name = name (unique per instance)

// Methods: All instances can share the same function
Dog.prototype = Object.create(Animal.prototype);  // Shared greet() method

 */
const obj = {
    name: 'John',
    age: 30,
    greet: function() {
        console.log(`Hello, my name is ${this.name}`);
    }
}

console.log(obj);

const num = 2;
console.log(num);

// Prototype Chaining

const person = {
    name: 'John',
    age: 30,
    greet: function() {
        console.log(`Hello, my name is ${this.name}`);
    }
}

const additionalProperties = {
    name: 'Jane',
    city: 'New York',
    country: 'USA'
}

// not recommeded to do in production
console.log(person.country); // undefined, because country is not in person and it is also not in person.__proto__ and person.__proto__.__proto__ (so and and so forth till it hits Object.prototype)

// but what if we want to add additional properties to person
person.__proto__ = additionalProperties;
console.log(person.country); // USA, because country is now in person.__proto__

console.log('name', person.name); // this will print John because the "name" key is found in the person object itself and the code did not had to go to the person.__proto__ to find it. Hence, the order of the key matters


// This is how inheritance works in JavaScript


// Function Consructors and new keyword in JS
/*
 Function Constructor in javascript is used to create objects
 */

 function Animal(name) {
    this.name = name;
    
    // Instance method - each instance gets its own copy
    this.greet2 = function() {
        console.log(`Hello, my name is ${this.name} from greet2`);
    }
}

// Prototype method - all instances share the same function
Animal.prototype.greet = function() {
    console.log(`Hello, my name is ${this.name}`);
}

 // the "new" keyword does the following:
 // 1. creates a new object
 // 2. sets the prototype of the object to the prototype of the function
 // 3. calls the function with the new object as the this context
 // 4. returns the new object

 const dog = new Animal('Dog');
 console.log(dog.__proto__ === Animal.prototype); // true
 console.log(dog);
 dog.greet();   
 dog.greet2();

 // changing the prototype of the constructor function also changes the "constructor" property of the object

 // constructor function
 function Dog(name, breed) {
    Animal.call(this, name);  // Inherits: this.name AND this.greet2
    this.breed = breed;
 }

 Dog.prototype = Object.create(Animal.prototype);  // Inherits: greet method

 // setting the constructor property of the object to the constructor function
 Dog.prototype.constructor = Dog;

 const dog1 = new Dog('Rex', 'Labrador');
 const dog2 = new Dog('Buddy', 'Golden');

 // Instance methods (different copies)
 console.log(dog1.greet2 === dog2.greet2); // false
 dog1.greet2(); // "Hello, my name is Rex from greet2"
 dog2.greet2(); // "Hello, my name is Buddy from greet2"

 // Prototype methods (same function)
 console.log(dog1.greet === dog2.greet); // true
 dog1.greet(); // "Hello, my name is Rex"
 dog2.greet(); // "Hello, my name is Buddy"

 /**
  * Modern Alternative (ES6 Classes):
  * class Animal {
    constructor(name) {
        this.name = name;  // Instance property
    }
    
    greet() {  // Prototype method
        console.log(`Hello, my name is ${this.name}`);
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);  // Calls Animal.call(this, name)
        this.breed = breed;
    }
    // greet() method is automatically inherited
}
  */

// what is the difference between prototype and __proto__?
/**
 * __proto__ works as a getter for the prototype property of an object. it is used for inheritance and allows to access the prototype chain
 * prototype is the property that exists on the constructor function and helps to set properties and methods on the prototype of the object. it is used to setup inheritance for the objects created by the constructor function. It defines properties and methods that are shared across all instances of the object created by the constructor function.
 * 
 * What is setPrototypeOf?
 * setPrototypeOf is a method that allows to set the prototype of an object. it is used to set the prototype of an object to a new object.
 * 
 * What is Object.create?
 * Object.create is a method that allows to create a new object with a given prototype. it is used to create a new object with a given prototype.
 * 
 * What is Object.getPrototypeOf?
 * Object.getPrototypeOf is a method that allows to get the prototype of an object. it is used to get the prototype of an object.
 */

const animalSound = {
    bark: function() {
        console.log('Woof');
    }
}

const cat = {
    purr: function() {
        console.log('purr');
    }
}

const dog3 = Object.create(animalSound);
console.log(dog3);
dog3.bark();

// setting the prototype of the object to the prototype of the cat
Object.setPrototypeOf(dog3, cat);
console.log(dog3);
dog3.purr();

// an object with a prototype
const objectWithoutPrototype = Object.create(null);
console.log(objectWithoutPrototype);

// output based questions
function A(){};
A.prototype.num = 1;

function B(){};
B.prototype = Object.create(A.prototype);
B.prototype.num = 2;

function C(){};
C.prototype = Object.create(B.prototype);
C.prototype.num = 3;

const a = new A();
const b = new B();
const c = new C();
console.log(a.num);
console.log(b.num);
console.log(c.num);

// Machine coding: How do you deep clone an object?
const sampleObject = {
    name: 'John',
    age: 30,
    address: {
        city: 'New York',
    }
}

const deepCloneObj = structuredClone(sampleObject);
deepCloneObj.address.city = 'Los Angeles';
console.log('deepCloneObj', deepCloneObj);
console.log('sampleObject', sampleObject);

function deepClone(obj) {
    // check if the object is an object or null - base case
    if(typeof obj !== 'object' || obj === null) {
        return obj;
    } 

    // check if the object is an array
    if(Array.isArray(obj)) {
        return obj.map(deepClone);
    }

    // if the object is an object, we need to clone it
    const clone = {};
    for(let key in obj) {
        clone[key] = deepClone(obj[key]);
    }
    return clone;
}

const deepCloneObj2 = deepClone(sampleObject);
deepCloneObj2.address.city = 'Los Angeles';
console.log('deepCloneObj2', deepCloneObj2);
console.log('sampleObject', sampleObject);



