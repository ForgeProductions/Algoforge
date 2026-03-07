let x = 10;
let y = 20;
let sum = x + y;
console.log("Sum is:", sum);

function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

let res = factorial(3);
console.log("Factorial:", res);