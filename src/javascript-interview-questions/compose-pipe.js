// Compose "RIGHT TO LEFT"
/**
 * "What is function composition?"
    Definition: Combining multiple functions into a single function
    Direction: Right to left execution (mathematical composition)
    Purpose: Create reusable, composable function pipelines
    
    "When would you use function composition?"
        Data transformation pipelines
        Middleware patterns
        Functional programming
        Clean, readable code


 */

function addFive(num) {
    return num + 5;
}

function multiplyByTwo(num) {
    return num * 2;
}

function subtractThree(num) {
    return num - 3;
}

function compose(...fns) {
    return function(arg) {
       return fns.reduceRight((acc, fn) => fn(acc), arg);
    }
}

const addFiveAndMultiplyByTwoAndSubtractThree = compose(addFive, multiplyByTwo, subtractThree);

console.log('compose',addFiveAndMultiplyByTwoAndSubtractThree(10));

// Pipe - "LEFT TO RIGHT"
function pipe(...fns) {
    return function(arg) {
        return fns.reduce((acc, fn) => fn(acc), arg);
    }
}

const addFiveAndMultiplyByTwoAndSubtractThreePipe = compose(addFive, multiplyByTwo, subtractThree);

console.log('pipe', addFiveAndMultiplyByTwoAndSubtractThreePipe(10));


function compose3(...fns) {
    return function(arg) {
        let result = arg;
        // Process from right to left
        for(let i = fns.length - 1; i >= 0; i--) {
            result = fns[i](result);
        }
        return result;
    }
}

const addFiveAndMultiplyByTwoAndSubtractThreeCompose3 = compose3(addFive, multiplyByTwo, subtractThree);

console.log(addFiveAndMultiplyByTwoAndSubtractThreeCompose3(10));