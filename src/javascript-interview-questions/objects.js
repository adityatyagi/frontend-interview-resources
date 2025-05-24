// two key with the same name, the last key will be considered and its value will be considered
// keys of object will ALWAYS be a "string" -> [object Object]
// JSON.stringigy JSON.parse - localStorage key and values both are strings
// destructuring in objects
// questions on object refrencing
// shallow copy vs deep copy
// pollyfill for JSON.stringify and JSON.parse
// how to clone an object?
// how to create a deep copy of an object

// delete only works on objects and not on local variables
 function a(b) {
    // delete b; // Delete of an unqualified identifier in strict mode. - ERROR in strict mode
    return b;
 }
 
 a(2);

 // add a property on object with spaces in keys
 // dynamic properties = use [variableName] in keys

 let person = {
    name: 'aditya'
 }

 person['name of wife'] = 'naina';
 console.log('person', person);

 for(const key in person) {
    console.log(key);
    console.log(person[key]);
 }


 function multiplyBy2(obj) {
    // multiplies all numeric property values by 2
    for(let key in obj) {
        let val = obj[key];        
        if(typeof val === 'number') {
            obj[key] = 2 * obj[key];
        }
    }
    return obj;
 }

 let nums = {
    a: 100,
    b: 200,
    title: 'name'
 }

console.log(multiplyBy2(nums));


const settings = {
    username: "aditya",
    level: 9,
    health: 10
}

const data = JSON.stringify(settings, ["level", "health"]);
console.log(data); // will only stringify level & health and ignore username
console.log(typeof data); // string


const shape = {
    radius: 10,
    diameter() {
        return this.radius * 2
    },
    permimeter: () => 2 * Math.PI * this.radius
}

console.log((shape.diameter())); // 20
// console.log((shape.permimeter())); // error as this.radius is undefined due to arrow function
// for arrow function, in nodejs process - this = global and in browser this = window (NaN)

// Visual Representation:
// Initial state:s
// person2 → { name: 'liala' } ← members[0]

// After person2.name = null:
// person2 → { name: null } ← members[0]

// After person2 = null:
// person2 → null
// members[0] → { name: 'liala' }

// The key concept here is that objects in JavaScript are passed by reference. When we store the object in the members array, it stores a reference to the object, not a copy. Setting person2 = null only breaks the reference from the person2 variable but doesn't affect the object itself or other references to it.
let person2 = {
    name: 'liala'
}
const members = [person2];
person2 = null;
console.log(members);


const val = {n: 10};
const mulVal = (x = {...val}) => {
    console.log(x.n *= 2);
}
mulVal()
mulVal()
mulVal(val)
mulVal(val)

// deep copy of an object
let user1 = {
    name: 'aditya',
    address: {
        city: 'delhi',
        line1: 'Test'
    }
}

// deep
let user2 = JSON.parse(JSON.stringify(user1))
user2.address.city = 'CHD';
console.log(user2); // deep changes made
console.log(user1); // unchanged

// shallow copy
let user3 = Object.assign({}, user1);
user3.address.city = 'BLR';
console.log(user3);
console.log(user1);


// Pollyfill for JSON.stringify() - convert to string the object keys and values

function myStringify(value) {
    if (value === null) return "null";
  
    const type = typeof value;
  
    if (type === "number" || type === "boolean") {
      return String(value);
    }
  
    if (type === "string") {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
  
    if (type === "function" || type === "undefined" || type === "symbol") {
      return undefined;
    }
  
    if (Array.isArray(value)) {
      const result = value.map((item) => {
        const str = myStringify(item);
        return str === undefined ? "null" : str;
      });
      return `[${result.join(",")}]`;
    }
  
    if (type === "object") {
      const result = [];
  
      for (let key in value) {
        // skip symbol keys and non-enumerables
        if (typeof key === "symbol" || typeof value[key] === "function" || typeof value[key] === "undefined" || typeof value[key] === "symbol") {
          continue;
        }
  
        const valStr = myStringify(value[key]);
        if (valStr !== undefined) {
          result.push(`"${key}":${valStr}`);
        }
      }
  
      return `{${result.join(",")}}`;
    }
  
    return undefined; // fallback for unknown types
  }
  

/*
You should mention that this is a simplified polyfill — the native JSON.stringify() also handles:

    toJSON() methods
    circular references (throws error)
    custom replacer functions
    space argument for indentation

In interviews, be ready to:
    Explain recursive traversal of nested objects/arrays.
    Describe how primitive vs object types are handled.
    Talk about edge cases (e.g., handling undefined).
*/


// -----------------------------
// JSON.stringify() — Primitives vs Objects
// -----------------------------

/*
Primitives are directly converted into JSON string equivalents.

  - string      → wrapped in double quotes
  - number      → serialized, except NaN/Infinity → "null"
  - boolean     → true / false
  - null        → "null"
  - undefined   → 
      - top-level: returns undefined
      - in object: property is skipped
      - in array: replaced with null
  - function & symbol → treated like undefined

Examples:
*/

JSON.stringify("hello")           // '"hello"'
JSON.stringify(42)                // '42'
JSON.stringify(NaN)               // 'null'
JSON.stringify(undefined)         // undefined
JSON.stringify([1, undefined])    // '[1,null]'
JSON.stringify({ a: undefined })  // '{}'

/*
Objects & Arrays are recursively traversed.

  - Objects: each key-value pair is serialized unless value is:
      - undefined
      - function
      - symbol

  - Arrays: each index is serialized;
      - undefined/function/symbol → becomes null

Examples:
*/

JSON.stringify({ a: 1, b: undefined }) // '{"a":1}'
JSON.stringify([1, undefined, 2])      // '[1,null,2]'
JSON.stringify({ user: { name: "Alice", age: 25 } })
// '{"user":{"name":"Alice","age":25}}'

/*
Object wrappers like `new String()`, `new Number()`:
  → JSON.stringify calls `.valueOf()` on them

Examples:
*/

JSON.stringify(new String("hi"))      // '"hi"'
JSON.stringify(new Boolean(false))    // 'false'

/*
🧠 Summary:
- Primitives: returned as-is (with exceptions like undefined)
- Objects: traversed recursively
- undefined, functions, symbols are skipped or converted to null
- Boxed primitives get `.valueOf()` called

✨ Key Rule: Primitives are values; Objects/Arrays are containers that get walked through
*/










 