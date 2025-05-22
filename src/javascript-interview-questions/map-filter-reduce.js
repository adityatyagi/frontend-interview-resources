// .map() method in JavaScript does not modify the original array — it returns a new array with the results of applying a function to each element.
let arr = [1,2,3];
let multiplyBy3 = arr.map((val, index, originalArray) => {
    return val*3;
})

console.log('multiplyBy3', multiplyBy3);

let filteredArray = arr.filter((val, index, originalArray) => {
    return val > 2;
})
console.log('filteredArray', filteredArray);


let sumOfArr = arr.reduce((acc, currentValue, currentIndex, originalArray) => acc + currentValue, 0)
console.log('sumOfArr', sumOfArr);

// POLYFILLS 

// MAP
// for reference
// Array.map((item, index, array) => { return newArray })
// "M.I.T. → Map, Iterate, Transform"
// M = Map setup: Start with a new array.
// I = Iterate: Loop through original array.
// T = Transform: Use cb(item, i, arr) to push transformed results.

Array.prototype.myMap = function(cb) {
    // this = the array on which map is being called on
    let newArray = [];
    for (let index = 0; index < this.length; index++) {
        const element = this[index];

        // push the result of the cb into newArray
        newArray.push(cb(element, index, this));
        
    }

    // return the new array with updated values
    return newArray;
}

const arrForMyMap = [2,3,4,5,6];
const resultForMyMap = arrForMyMap.myMap((item) => {
    return item * 10;
});
console.log('resultForMyMap', resultForMyMap);


// FILTER
// [].filter((item, index, array) => {...}) - returns only those elements in a new array which passes the predicate of the cb
// “Filter picks who fits.”
// "F.I.T. → Filter, Iterate, Test"
// F = Filter setup: Start with an empty result array.
// I = Iterate: Loop through the original array.
// T = Test: Use cb(item, i, arr) to test each item — if true, push.

Array.prototype.myFilter = function(cb) {
    let newArray = [];

    for (let index = 0; index < this.length; index++) {
        const element = this[index];

        // push the element if it passes the predicate of the cb
        if(cb(element, index, this)) {
            newArray.push(element);
        }
        
    }

    return newArray;
}

const arrayForMyFilter = [1,2,3,4,5,6,7,8,9,10];
const resultForMyFilter = arrayForMyFilter.myFilter((item) => item % 2 === 0);
console.log('resultForMyFilter', resultForMyFilter);


// reduce
// [].reduce((acc, currentItem, index, array) => { returns finalAcc }, initialValue);
// ICE - init, cb, each
// “If you pass an init, start at zero. If you don’t, use the first and go slow.”
Array.prototype.myReduce = function (cb, initialValue) {
    let accumulator, startIndex;

    if(initialValue !== undefined) {
        accumulator = initialValue;
        startIndex = 0;
    } else {
        accumulator = this[0];
        startIndex = 1;
    }


    for(let i=startIndex; i<this.length; i++) {
        // if there is no initial value, thexn accumulator = first element of the array
        accumulator = cb(accumulator, this[i], i, this);
    }

    return accumulator;
} 

const arrForMyReduce = [10, 20, 30];
const resultForMyReduce = arrForMyReduce.myReduce((acc, curr) => {
    return acc + curr;
});
console.log('resultForReduce', resultForMyReduce);


