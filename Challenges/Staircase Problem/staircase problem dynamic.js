/**
 * @param {number} steps - from 1 to 200 : amount of steps in a staircase.
 * @param {number} maxJumpLength - from 1 to 200 : top limit of how many steps a frog can jump down at 1 time.
 */
function main(steps, maxJumpLength) {
  const table = new Array(steps + 1);
  for (let step = 0; step < steps + 1; step++) {
    table[step] = BigInt(0);
    let min = Math.min(maxJumpLength, step);
    for (let jump_dist = 1; jump_dist <= min; jump_dist++) {
      const target_step = step - jump_dist;
      if (target_step === 0) {
        table[step] += BigInt(1);
      }
      if (target_step > 0) {
        table[step] += table[target_step];
      }
    }
  }
  return table[table.length - 1];
}

function test(steps, maxJumpLength, expectedValue) {
  const actual = main(steps, maxJumpLength);
  console.log(
    actual === expectedValue ? 'PASS' : 'FAIL',
    `steps=${steps} maxJumpLength=${maxJumpLength}: expected=${expectedValue} actual=${actual}`
  );
}

test(1, 1, 1n);
test(1, 2, 1n);

test(2, 1, 1n);
test(3, 1, 1n);
test(4, 1, 1n);

test(2, 2, 2n);
test(3, 2, 3n);
test(4, 2, 5n);

test(1, 3, 1n);
test(2, 3, 2n);
test(3, 3, 4n);
test(4, 3, 7n);

test(84, 26, 9671402305519268090871688n);
test(96, 57, 39614081257132163299213836288n);
