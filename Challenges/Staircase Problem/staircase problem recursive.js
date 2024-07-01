const cache = [1, 1];
function Factorial(n) {
  if (!(n in cache)) {
    let res = cache[cache.length - 1];
    for (let i = cache.length; i < n; ++i) {
      cache[i] = res *= i;
    }
    cache[n] = res * n;
  }
  return cache[n];
}
function nPr(n, r) {
  return Factorial(n) / Factorial(n - r);
}
function nCr(n, r) {
  return Factorial(n) / (Factorial(r) * Factorial(n - r));
}
function nChooseRPermutations(choices, r) {
  function incrementIndices(indices, n) {
    // start with last index
    const last = indices.length - 1;
    // increment last index
    ++indices[last];
    // work backwards
    let i = last;
    while (i >= 0) {
      // increment index again if equal to a higher index
      while (indices.slice(0, i).includes(indices[i])) {
        ++indices[i]; // increment index
      }
      const end = n;
      // check if index is still less than end
      if (indices[i] < end) {
        // reset lower index if necessary
        if (++i < indices.length) {
          indices[i] = 0;
        } else {
          // done
          break;
        }
      } else {
        // move to higher index and increment it
        ++indices[--i];
      }
    }
  }
  // P(n, r) = n!/(n-r)!
  const n = choices.length;
  const permutationCount = nPr(n, r);
  const indexList = Array.from(new Array(r).keys());
  const permutations = new Array(permutationCount);
  for (let c = 0; c < permutationCount; ++c) {
    // Create new permutation
    // - Map indices to actual values
    permutations[c] = indexList.map((i) => choices[i]);
    // Increment the indices
    incrementIndices(indexList, n);
  }
  return permutations;
}

/**
 * Imagine a frog sitting on the top of a staircase which has steps number of steps in it.
 * A frog can jump down over the staircase and at 1 single jump it can go from 1 to maxJumpLength steps down.
 * Your task is to write a function which will calculate the total amount of all possible ways that the frog can go from top to the bottom.
 *
 * Example
 * For staircase with steps=3 and maxJumpLength=3 a frog can jump steps like:
 * 1-1-1 or 1-2 or 2-1 or 3. Which gives 4 possible jump ways.
 * _
 *  |_     1
 *    |_   1
 *      |_ 1
 * so there are actually 4 steps here, or rather 4 platforms, which is different from my original thinking
 *
 *
 * And for staircase with steps=4 and maxJumpLength=3 a frog can jump steps like:
 * 1-1-1-1 or 1-1-2 or 1-2-1 or 2-1-1 or 2-2 or 3-1 or 1-3. Which gives 7 possible jump ways.
 */

/**
 * @param {number} steps - from 1 to 200 : amount of steps in a staircase.
 * @param {number} maxJumpLength - from 1 to 200 : top limit of how many steps a frog can jump down at 1 time.
 * @param {number} currentStep - from 0 to steps.
 */
function recursive(steps, maxJumpLength, currentStep) {
  // hands not working well

  // handle the base case (end goal)
  // currentStep can't be less than 0, so use less than sign
  // i'm pretty sure the instructions mentioned " but you should consider the real amount of steps passed over. "
  // this might mean that if the jump goes *over* 0 (the last step), then it should be counted? that seems to be the case
  // soooo how to keep track of counts with all this information

  // if the path ends up at 0, that path is counted
  if (currentStep === 0) {
    return 1;
  }
  // if the path goes beyond 0, then it's an unnecessary path.
  if (currentStep < 0) {
    return 0;
  }
  // we know the base case is step=0, and what we want returned is the number of jumps (count). so we'll need to keep track of these somehow
  // for a recursive function, we typically keep track of these in the parameter list
  // variable naming is important. i added current to keep in mind that this step and count are relevant to the current iteration of the recursive call
  // next we do the loop

  // since our recursive function is only calculating 1 iteration, we no longer need the while loop, which makes everything easier to think about
  // we could add stepsLeft to the parameter list, but we could also calculate it with currentStep and steps

  // let's visualize this to check that it makes sense
  // steps = 5 (0 not included)
  // if currentStep = 3
  // _            0
  //  |_          1
  //    |_        2
  //      |_      3
  //        |_    4
  //          |_  5
  // stepsLeft = 5-3 = 2, that checks out to me i think
  // no, i think ihave it backwards, steps left would just be the current step since we are jumping up instead of down. i guess that makes it easier as well
  // dunno why i didn't realize this sooner, maybe just woke up
  // oh well, we probably don't need stepsLeft anyways, if `i` is less than currentStep...
  // yeah we don't need this loop at all.
  // the looping part is going to become recursive calls. so instead of checking how many steps are left, we can just leave it to the base case.
  // if currentStep==0, then there's no steps left..

  // what we DO need to calculate are the valid jumps.. oh, we need the for loop back
  // no no wait, we can just let the base case handle that lmao. i'm trying to preoptimize. whatever, it's javascript
  // should this be a classic for loop again?
  let passes = 0;
  for (let i = 1; i <= maxJumpLength; i++) {
    // steps and maxJumpLength don't change. currentStep would be itself minus the jump, currentCount would be +1 i presume
    // so we leave the loop as is, because i still needs to start at 1 and end at maxJumpLength. *here* we could do the preoptimization, but it's fine
    // uh oh, what did i do
    // oooh i'm mixing return values. ok, bouta wipe this whole video lmao. i'm all over the place

    // if the return value is true, add 1... if it's false add 0... otherwise return the accumulation of jumps... that all checks out.
    // true=1 and false=0 when casting. so let's just use the actual numbers
    // whew, close call
    passes += recursive(steps, maxJumpLength, currentStep - i);
    // now we need to figure this part out. we want the sum of all combinations.
    // a big problem is about to come up, but let's just add the results together and return them

    // so first big problem is... adding 1 to currentCount each time is incorrect. if there's only 1 type of jumping involved (maxJumpLength=1),
    // then there can only be 1 combo, 1 1 1 1 1
    // so, we might need a way to track the "kind" of jump being performed. and only add a count if the kind is different from the last one
  }

  // 

  // might need this in a bit
  // if (passes > 1) {
  //   passes -= 1;
  // }

  // if the jump is valid, add to count, if valid number of counts > 1, subtract 1?
  // if we count the number of new paths after the recursive count, then this would be doable. otherwise, it seems impossible
  // so, instead of keeping track of currentCount in the parameter list, we can return tally it up after the for loops
  // the base case will act as a pass or fail check. if the jump lands at 0, that path passes. otherwise it fails
  // then we can count the number of passes

  // _            0
  //  |_          1
  //    |_        2
  //      |_      3
  //        |_    4
  //          |_  5

  // starting at step=5, and maxJumpLength=2, let's simulate our recursive calls
  // recursive(steps=5, maxJumpLength=2, currentStep=5-1=4, currentCount=0+1); jump=1
  // recursive(steps=5, maxJumpLength=2, currentStep=5-2=3, currentCount=0+1); jump=2
  // gonna need a bigger test case
  // if we jump=1, then there will be 2 more paths available (+1)
  // we can then jump=1 or jump=2
  // if we jump=1, then there will be 2 more paths available (+1)
  // if we jump=2, then there will be 2 more paths available (+1)
  // i'm going to make the naive assumption that number of new paths available each time is maxJumpLength-1
  // let's try that
  // of course, that only holds if the base case isn't hit... so maybe we should count jumps *after* the recursive call, instead of before

  return passes;
  // now we should connect this to the main function. we're not sure what to return from here yet, so i'm going to put a return statement in the loop
  // this means 1 iteration will occur, so let's throw a console log and then connect everything
}

/**
 * Function should return a number - BigInt (because some results can be really big) of all possible ways the frog can go down the staircase.
 * All inputs will be valid. maxJumpLength can be bigger than steps but you should consider the real amount of steps passed over.
 * @param {number} steps - from 1 to 200 : amount of steps in a staircase.
 * @param {number} maxJumpLength - from 1 to 200 : top limit of how many steps a frog can jump down at 1 time.
 */
function main(steps, maxJumpLength) {
  // we should start at the last step, with a currentcount of 1? or 0?
  // in the code we wrote, it should be 1, so i guess we'll keep it like that for now
  // actually, we can add it as a default value since it should always start at 1 from the beginning
  // so this first call really needs to act like the first iteration of the "loop". we could throw if statements and stuff into the recursive function,
  // but that just adds complexity. it's easier to do the first iteration here. so for the first iteration.. if we are starting with the first jump...
  // ok nevermind, we would need the for loop. maybe we can just start at 0 jumps and hope our recursive function handles it still
  // yeah that was better. i don't think it will cause any problems moving forward, but we'll see.
  return recursive(steps, maxJumpLength, steps);

  // a jump of 0 goes nowhere..
  // but if maxJumpLength=1, this breaks the loop
  // so let's add 1 to i inside the body instead
  // that should work like a classic for loop

  // next is to work on multiple jumps
  // we could start at the top of the staircase and consider every possible jump combination going down, but this would lead to very large
  // amounts of combinations that don't end up at the bottom of the staircase. you can imagine the scenario in your head. however, if we
  // start at the bottom step and work backwards, we can ignore combinations that don't make sense
  let step = steps;

  // the number of steps doesn't include the goal.. so let's make the goal be step=0, since the restrictions set min step to 1
  // steps = 2;
  // maxJumpLength = 1;

  //_     step 0
  // |_   step 1
  //   |_ step 2
  // there's only 1 possible way to get from step 2 to step 1
  // and only 1 possible way to get from step 1 to step 0 (which isn't technically a step)

  // let's first count the number of combinations just for the bottom step
  let count = 0;
  let stepsLeft = steps; // 2 jumps are needed to scale the staircase
  while (stepsLeft > 0) {
    // it might be better to mutate this for loop a bit. i usually tell people not to do this, because it typically ends up making things
    // harder to think about. but in this case, we want `i` to correspond to a jump/step, which means it must start at 1
    for (let i = 1; i <= maxJumpLength; i++) {
      // we want to check if the jump will take the frog from the current step to the goal (step 1)
      if (i <= stepsLeft) {
        count++;
      }
    }
    // we get 1 jump for the first step, which checks out. the next step should also get 1 jump, but now we need some kind of loop
    // for now, we'll focus on just 1 combination
    stepsLeft--;
  }
  // so for jumps of 1, this should hold true for any number of steps
  // that was the easy part. now, when jump count can be greater than 1, there will be multiple combinations (paths), and we must consider each of them
  // if you've studied algorithms before, then this starts looking like a classic recursive divide by conquer problem

  return count;
}

function test(steps, maxJumpLength, expectedValue) {
  const actual = main(steps, maxJumpLength);
  console.log(
    actual === expectedValue ? 'PASS' : 'FAIL',
    `steps=${steps} maxJumpLength=${maxJumpLength}: expected=${expectedValue} actual=${actual}`
  );
  // not at all sure what kind of problem to set up for this
  // actually this might just be a bunch of factorials
  // thinking
  // steps=4
  // maxJumpLength=3
  //          1                      2           3
  //   1      2      3        1      2    -    1 - -
  // 1 2 -  1 - -  - - -    1 - -  - - -
  // 1 -
  // paths=7
  // 3*3
  // i'm not a math guy. so i hate this.
  // maybe we can turn the recursive function into a stack based iterative approach
  // instead of recursive call, shove state into a stack or queue
  // doesn't sound fun. so anyways. next is dynamic programming technique
  // with dynamic programming, we have a table instead of stacks
  //   steps
  //   4 3 2 1 0
  // 1 1 1 1 1 1
  // 2 1 3 3 3 2
  // 3 1 4 4 4 3
  // ^ jump kind
  // then we iteratively mutate the table as we consider each cell
  // backtracking if needed
  // something like that, but i'm hungry. maybe i'll tackle this again after eating.

  console.log(Factorial(maxJumpLength));
}

// start with easiest test case. 1 step, max jump of 1
test(1, 1, 1);
// a maxJumpLength larger than steps shouldn't change the result
test(1, 2, 1);

// add a step, but only allow 1 step per jump
// expected jumps should equal steps <- this is actually correct
// lol that was way wrong. we were supposed to count the number of PATHS, not steps. i'm sure anyone watching this is malding, but bear with me
// getting that part wrong didn't really change the process all that much
test(2, 1, 1);
test(3, 1, 1);
test(4, 1, 1);

// add a jump
// expected jumps should equal ???
test(2, 2, 2); // probably only 2 ways, this builds upon the jump=1 scenario, 2 jumps will clear the staircase at once
test(3, 2, 3); // this adds another step to the mix, there's still combo=1 for jump=1,
// _
//  |_
//    |_
//      |_  i counted 3 combos, the typical jump=1, then a jumps=1,2 and 2,1
// at this point, we could try to devise a way to count total jumps for every jump length using if statements and loops,
// but a recursive function with base cases would make it easier. the base case is typically the end goal, which would be
// step=0 in our solution. so let's start building a separate recursive function for that
test(4, 2, 5); // this is hard to visualize

// 1 1 1 1
// 1 1 2
// 1 2 1
// 2 1 1
// 2 2
//
// this is classic permutation i guess. it was

// _            0
//  |_          1
//    |_        2
//      |_      3
//        |_    4

// this is the first test case we are given. the above tests we assume are correct, but this one failed.. so
test(1, 3, 1); // pass. oh right, we still have that return statement
test(2, 3, 2); // pass  1s and 2
test(3, 3, 4); // pass

test(4, 3, 7); // will probably work. it did. so we're probably about done.
// all that's left is edge cases, which i'm not too interested in. let me try plugging this into the site

// so everything is passing. looks we brute forced this problem
// so what's next? next we could think about how to optimize the looping routines.
// or, we can consider that this might just be a math counting problem. perhaps we can throw the values into a permutation function

// we want permutations i believe
