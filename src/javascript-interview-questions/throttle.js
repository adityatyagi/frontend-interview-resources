document.addEventListener("DOMContentLoaded", () => {
  // create a button UI and add throttle as follows:
  // show "button pressed X times" every time the button is pressed
  // increase "Triggered Y times" count after a throttle delay of 800ms
  // i.e. functionTriggerCount will increase 800ms after we have stopped the last button click

  const button = document.createElement("button");
  button.textContent = "click";
  button.style.margin = "10px 10px";
  button.style.padding = "10px 20px";
  button.style.fontSize = "16px";
  document.body.appendChild(button);

  const buttonCountDisplay = document.createElement("div");
  buttonCountDisplay.id = "buttonCount";
  buttonCountDisplay.style.margin = "10px";
  document.body.appendChild(buttonCountDisplay);

  const triggerCountDisplay = document.createElement("div");
  triggerCountDisplay.id = "triggerCount";
  triggerCountDisplay.style.margin = "10px";
  document.body.appendChild(triggerCountDisplay);

  let buttonPressCount = 0;
  let functionTriggerCount = 0;

  function onClick() {
    buttonPressCount++;
    buttonCountDisplay.textContent = `Button pressed ${buttonPressCount} times`;
  }

  function mockAPIcall() {
    functionTriggerCount++;
    triggerCountDisplay.textContent = `Triggered ${functionTriggerCount} times`;
  }

  button.addEventListener("click", onClick);

  // Basic Throttle Implementation
  // Throttle ensures a function is called at most once in a specified time period
  // 
  // FOLLOW-UP QUESTIONS you might get asked:
  // 1. What's the difference between throttle and debounce?
  //    - Throttle: Executes function at regular intervals (e.g., every 100ms)
  //    - Debounce: Waits until user stops calling function for specified time before executing
  //
  // 2. When would you use throttle vs debounce?
  //    - Throttle: Search suggestions, scroll events, resize events
  //    - Debounce: Search input, form validation, window resize
  //
  // 3. How would you implement leading/trailing options?
  //    - Leading: Execute on first call, then throttle
  //    - Trailing: Throttle, then execute on last call
  //
  // 4. How would you handle edge cases like changing delay dynamically?
  // 5. How would you implement cancel functionality?
  // 6. How would you test this implementation?
  // 7. What's the time complexity and space complexity?
  // 8. How would you handle multiple throttled functions with different delays?
  
  function throttle(func, delay) {
    let lastExecuted = 0; // Track when function was last executed
    let timeoutId = null; // For trailing execution
    
    return function (...args) {
      const now = Date.now();
      const context = this;
      
      // If enough time has passed since last execution, execute immediately
      if (now - lastExecuted >= delay) {
        func.apply(context, args);
        lastExecuted = now;
      } else {
        // Clear any existing timeout to prevent multiple trailing executions
        if (timeoutId) {
          clearTimeout(timeoutId);
          // Scenarios Without Timer Tracking:
          // Time 0ms: First call → Execute immediately
          // Time 100ms: Second call → Schedule timer A
          // Time 200ms: Third call → Schedule timer B (A still running)
          // Time 300ms: Fourth call → Schedule timer C (A and B still running)
          // Result: Multiple executions at different times
          // not resetting timeoutId = undefined, only clearing the timer

          // With Timer Tracking:
          // Time 0ms: First call → Execute immediately
          // Time 100ms: Second call → Schedule timer A
          // Time 200ms: Third call → Cancel timer A, Schedule timer B
          // Time 300ms: Fourth call → Cancel timer B, Schedule timer C
          
          
          // timeoutId is tracking existence of a timer
          // Result: Only one trailing execution
        }
        
        // Schedule execution for the remaining time
        const remainingTime = delay - (now - lastExecuted);
        timeoutId = setTimeout(() => {
          func.apply(context, args);
          lastExecuted = Date.now();
          timeoutId = null;
        }, remainingTime);
      }
    };
  }

  // Apply throttle to the mock API call
  const throttledAPIcall = throttle(mockAPIcall, 800);
  button.addEventListener("click", throttledAPIcall);

  // ADVANCED FOLLOW-UP IMPLEMENTATIONS you might be asked to show:

  // 1. Throttle with leading/trailing options
  function throttleAdvanced(func, delay, options = {}) {
    const { leading = true, trailing = true } = options;
    let lastExecuted = 0;
    let timeoutId = null;
    
    return function (...args) {
      const now = Date.now();
      const context = this;
      
      if (now - lastExecuted >= delay) {
        if (leading) {
          func.apply(context, args);
        }
        lastExecuted = now;
      } else if (trailing) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(context, args);
          lastExecuted = Date.now();
          timeoutId = null;
        }, delay - (now - lastExecuted));
      }
    };
  }


  // 2. Throttle with cancel functionality
  
  function throttleWithCancel(func, delay) {
    let lastExecuted = 0;
    let timeoutId = null;
    
    const throttled = function (...args) {
      // ... throttle logic
    };
    
    throttled.cancel = function() {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
    
    return throttled;
  }
  

  // 3. Throttle using requestAnimationFrame (for smooth animations)
  /*
  function throttleRAF(func) {
    let ticking = false;
    
    return function (...args) {
      if (!ticking) {
        requestAnimationFrame(() => {
          func.apply(this, args);
          ticking = false;
        });
        ticking = true;
      }
    };
  }
  */
});





