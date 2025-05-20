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
Array.myMap = function(callback){
    return 
}
