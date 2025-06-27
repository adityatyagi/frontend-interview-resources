// Questions on Debouncing 
// Debouncing: send a API call only after a set time (delay) after the last event was done
// it limits the exection of a function call and waits for a certain amount of time before calling it again

// Example:
// 1. Search bar: send a API call only after the user has stopped typing for a certain amount of time
// 2. Window resize: send a API call only after the user has stopped resizing the window for a certain amount of time
// 3. Scroll: send a API call only after the user has stopped scrolling for a certain amount of time

// "Debouncing is a performance optimization technique that delays the execution of a function until after a specified period of inactivity. It's particularly crucial for handling high-frequency events like user input, window resizing, or API calls."



function initApp() {
    // create a button UI and add debouncing as follows:
    // show "button pressed X times" every time the button is pressed
    // increase "Triggered Y times" count after a debouncing delay of 800ms
    // i.e. functionTriggerCount will increase 800ms after we have stopped the last button click
  
    // Enhanced Debounce function implementation with leading and trailing options
    // Closure Pattern: The timeoutId variable is captured in a closure, maintaining state between function calls
    // Higher-Order Function: Returns a new function that wraps the original, enabling composition
    // Context Preservation: Uses func.apply(this, args) to maintain the correct this context and pass all arguments
    // Memory Management: Properly clears previous timeouts to prevent memory leaks


    // normal debounce
    // function debounce(func, delay) {
    //   let timeoutId;
  
    //   return function (...args) {
    //     // Clear the previous timeout
    //     clearTimeout(timeoutId);
  
    //     // Set a new timeout
    //     timeoutId = setTimeout(() => {
    //       func.apply(this, args);
    //     }, delay);
    //   };
    // }
    
    // advanced debounce
    function debounce(func, delay, options = {}) {
        // input validations
        if (typeof func !== "function") {
          throw new TypeError("Expected a function");
        }
    
        if (typeof delay !== "number" && delay < 0) {
          throw new TypeError("Expected delay to be a positive number");
        }
    
        // get the options with the deault options
        const { leading = false, trailing = true } = options;
    
        // vars to track
        let timeoutId;
        let lastAgrs, lastThis;
        let result;
    
        function invokeFunc() {
          // get the saved args and context
          let args = lastAgrs;
          let thisArg = lastThis;
    
          // clear the last args and context as we are invoking the function
          lastArgs = lastThis = undefined;
    
          //  Execute the function with proper context
          result = func.apply(thisArg, args);
          return result;
        }
    
        function startTimer() {
          return setTimeout(() => {
            if (trailing && lastArgs) {
              invokeFunc();
            }
            timeoutId = undefined;
          }, delay);
        }
    
        // utility method to cancel the
        function cancel() {
          if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
            timeoutId = undefined;
          }
          lastArgs = lastThis = undefined;
        }
    
        function debounced(...args) {
          // store agruments and context
          lastAgrs = args;
          lastThis = this;
    
          // clear exisiting timeoutId
          if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
          }
    
          // handle leading - immedidate exection
          if (leading && timeoutId === undefined) {
            return invokeFunc();
          }
    
          // start timer for trailing edge
          timeoutId = startTimer();
          return result;
        }
    
        // attach utility methods
        debounced.cancel = cancel;
    
        return debounced;
      }

    // Simple debounce for comparison (original implementation)
    function simpleDebounce(func, delay) {
      let timeoutId;
  
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    }
  
    let buttonPressCount = 0;
    let functionTriggerCount = 0;
    let leadingCount = 0;
    let trailingCount = 0;
    
    function onClick() {
      buttonPressCount++;
      buttonCountDisplay.textContent = `Button pressed ${buttonPressCount} times`;
    }
  
    function mockAPIcall() {
      functionTriggerCount++;
      triggerCountDisplay.textContent = `Triggered ${functionTriggerCount} times`;
    }
    
    function leadingAPIcall() {
      leadingCount++;
      leadingCountDisplay.textContent = `Leading triggered ${leadingCount} times`;
    }
    
    function trailingAPIcall() {
      trailingCount++;
      trailingCountDisplay.textContent = `Trailing triggered ${trailingCount} times`;
    }
    
    // Create UI elements
    const button = document.createElement("button");
    button.textContent = "Click Me";
    button.style.padding = "10px 20px";
    button.style.fontSize = "16px";
    button.style.margin = "20px";
    document.body.appendChild(button);
  
    const buttonCountDisplay = document.createElement("div");
    buttonCountDisplay.id = "buttonCount";
    buttonCountDisplay.style.margin = "10px";
    document.body.appendChild(buttonCountDisplay);
  
    const triggerCountDisplay = document.createElement("div");
    triggerCountDisplay.id = "triggerCount";
    triggerCountDisplay.style.margin = "10px";
    document.body.appendChild(triggerCountDisplay);
    
    const leadingCountDisplay = document.createElement("div");
    leadingCountDisplay.id = "leadingCount";
    leadingCountDisplay.style.margin = "10px";
    leadingCountDisplay.style.color = "blue";
    document.body.appendChild(leadingCountDisplay);
    
    const trailingCountDisplay = document.createElement("div");
    trailingCountDisplay.id = "trailingCount";
    trailingCountDisplay.style.margin = "10px";
    trailingCountDisplay.style.color = "green";
    document.body.appendChild(trailingCountDisplay);
    
    // Create different debounced functions to demonstrate options
    const debouncedMockApiCall = simpleDebounce(mockAPIcall, 800);
    const leadingDebounced = debounce(leadingAPIcall, 800, { leading: true, trailing: false });
    const trailingDebounced = debounce(trailingAPIcall, 800, { leading: false, trailing: true });


/**
 * Key Points for Interview
    1. Leading Only Happens Once
    Leading executes only on the first call when timeoutId === undefined
    After the first call, timeoutId is set, so leading won't execute again until the timer completes
    2. Trailing Always Happens
    Trailing executes after the delay if there are pending arguments
    Timer keeps restarting with each new call

    // Time: 0ms    → Click 1 → Leading executes immediately
    // Time: 100ms  → Click 2 → Timer restarts (no leading)
    // Time: 200ms  → Click 3 → Timer restarts (no leading)
    // Time: 300ms  → Click 4 → Timer restarts (no leading)
    // Time: 1100ms → Timer expires → Trailing executes

 */
    const bothDebounced = debounce(() => {
      console.log("Both leading and trailing executed");
    }, 800, { leading: true, trailing: true });
  
    button.addEventListener("click", () => {
      onClick();
    //   debouncedMockApiCall();
    //   leadingDebounced();
    //   trailingDebounced();
      bothDebounced();
    });
  }
  
  if (document.readyState === "loading") {
    // Wait for DOM to be ready
    document.addEventListener("DOMContentLoaded", () => {
      // DOMContentLoaded fires when:
      // ✅ HTML is fully parsed
      // ✅ DOM tree is constructed
      // ✅ All <script> tags are executed
      // ❌ NOT waiting for images, CSS, or iframes to load
  
      initApp();
    });
  } else {
    initApp();
  }


// Q: "What's the difference between debouncing and throttling?"
// A: "Debouncing waits for a pause in events before executing, while throttling ensures execution at regular intervals. Debouncing is ideal for search inputs where we want to wait for the user to finish typing. Throttling is better for scroll events where we want consistent updates."


// Q: "Where would you use this in production?"
// A: "Common use cases include:
// Search APIs: Wait for user to finish typing before making requests
// Window resize handlers: Debounce expensive layout calculations
// Form validation: Delay validation until user stops typing
// Infinite scroll: Debounce scroll events to prevent excessive API calls
// Auto-save: Save form data after user stops editing"


// Q: "How would you handle edge cases?"
// A: "I'd add:
// Input validation for func and delay parameters
// A leading option to execute immediately on first call
// A trailing option to control final execution
// Proper cleanup in component unmount scenarios
// Error handling for the wrapped function"

// Enhanced debounce with leading/trailing options:
// - leading: true - executes on the leading edge (first call)
// - trailing: true - executes on the trailing edge (after delay)
// - Both can be used together for different use cases
// - Includes cancel(), flush(), and pending() utility methods