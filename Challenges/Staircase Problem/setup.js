/**
 * @param {number} steps - from 1 to 200 : amount of steps in a staircase.
 * @param {number} maxJumpLength - from 1 to 200 : top limit of how many steps a frog can jump down at 1 time.
 */
function recursive(steps, maxJumpLength) {
  return steps;
}

function main(steps, maxJumpLength) {
  return recursive(steps, maxJumpLength);
}

function test(steps, maxJumpLength, expectedValue) {
  const actual = main(steps, maxJumpLength);
  console.log(
    actual === expectedValue ? 'PASS' : 'FAIL',
    `steps=${steps} maxJumpLength=${maxJumpLength}: expected=${expectedValue} actual=${actual}`
  );
}

// start with easy test cases and work your way up
test(1, 1, 1);
test(1, 2, 1);

test(2, 1, 1);
test(3, 1, 1);
test(4, 1, 1);

test(2, 2, 2);
test(3, 2, 3);

test(4, 2, 5);

test(1, 3, 1);
test(2, 3, 2);

// this is the first test case we are given
test(3, 3, 4);

// this is the second
test(4, 3, 7);
