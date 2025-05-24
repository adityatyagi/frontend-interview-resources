// what is currying - func(a,b) => func(a)(b)
// currying expects 1 argument at a time and returns a new function that expects the next argument
// currying (Function composition) vs partial application (pre-fill some args)
    // currying number of nested functions depends on the number of args
        // f(1,2,3,4) -> f(1)(2)(3)(4)
    // partial application transforms the function into a function with smaller parity i.e. pre-filling some arguments
        // f(1,2,3,4) -> f(1,2)(3)(4)

function f(a) {
    return function(b) {
        return `${a} ${b}`;
    }
}

console.log(f(4)(5));

function sum(a) {
    return function(b) {
        return function(c) {
            return a+b+c;
        }
    }
}

console.log(sum(1)(2)(3));


function evaluate(operation) {
    return function(b) {
        return function(c) {
            switch (operation) {
                case 'sum':
                    return b+c;
                case 'multiply':
                    return b*c;
                case 'diff':
                        return b-c;
                default:
                    return 'invalid operation'
            }
        }
    }
}

console.log(evaluate('sum')(1)(2))
console.log(evaluate('diff')(4)(2))
console.log(evaluate('multiply')(2)(2))

const mul = evaluate('multiply');
const diff = evaluate('diff');
const add = evaluate('sum');

console.log(add(2)(3));
console.log(diff(20)(3));
console.log(mul(20)(3));

// infinite currying sum(1)(2)(3)(4)(....)()

function sumInfinite(a) {
    return function(b) {
        if(b) return sumInfinite(a+b);
        return a;
    }
}

console.log(sumInfinite(1)(2)(8)(9)());

// pollyfill for curried
// 🔁 "Take one arg, return a new function. Repeat until all args are gathered."
function curry(f) {
    return function curried(...args) {
        console.log('collecting args', args);
        
      if (args.length >= f.length) {
        return f(...args);
      } else {

        // the next argument 
        return (...next) => {
            console.log('next arg', next);
            return curried(...args, ...next);
        }
      }
    };
  }

  function add2(a, b, c) {
    return a + b + c;
  }

  const curriedAdd = curry(add2);

console.log(curriedAdd(1)(2)(3)); // 6


// partial pollyfill - Pre-fill specific arguments
// Partial application pre-fills some arguments of a function and returns a function that waits for the rest.
function partial(fn, ...fixedArgs) {
    return (...restArgs) => fn(...fixedArgs, ...restArgs)
}

function multiply1(a, b, c) {
    return a * b * c;
  }

const mulBy2 = partial(multiply1, 2);
console.log(mulBy2(3,4))



// recursion: https://kcwebdev.blogspot.com/2020/08/yet-another-take-on-recursion.html
function rsum(arr) {
    // base case
    // Now, you know the answer involves calling rsum within rsum. And the trick is it has to stop at one point. 

    // Let's consider... How do we know the answer? Think about it. At what point, do we know the right answer? Or in other words, what is the "smallest" problem that we can reduce this to? 

    // The answer is... when we know we just have ONE element in the array. Like [4]. There is nothing to sum, so we just return the item.
    if(arr.length === 1) return arr[0];
    // when to call rsum
    return arr[0] + rsum(arr.slice(1));
    // what to do with the result
}

console.log('rsum', rsum([1,2,3,4]));