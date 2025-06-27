function init(){
/**
 * Event Bubbling/Event Propagation: the event starts from the innermost element and bubbles up to the outermost element
 * Event Capturing/Trickling: the event starts from the outermost element and captures down to the innermost element
 * Event Delegation: the event is handled by the parent element instead of the child element
 * Event that do not bubble: focus, blur, load, unload, error, resize, scroll, etc.
 *
 * Event Propagation Phases
    Capturing Phase (Phase 1): Event travels from root to target
    Target Phase (Phase 2): Event reaches the target element
    Bubbling Phase (Phase 3): Event travels back up from target to root


    "How do you stop event propagation?"
        e.stopPropagation(): Stops bubbling/capturing
        e.stopImmediatePropagation(): Stops all handlers
        e.preventDefault(): Prevents default behavior


    
    What is Event Delegation?
        Event delegation is a technique where you attach a single event listener to a parent element instead of multiple listeners to individual child elements. It leverages event bubbling to handle events efficiently.


    Memory Aid:
    Think of event delegation like a mail sorting system:
    Instead of having individual mailboxes for each house
    You have one central mailbox that sorts mail based on the address
    New houses automatically get their mail sorted without adding new mailboxes


    Common Interview Questions:
        "When would you use event delegation?"
            Large lists/tables with many similar elements
            Dynamic content that gets added/removed
            Performance-critical applications
            When you need to handle events on elements that don't exist yet
            "What are the trade-offs?"
            Pros: Performance, memory efficiency, dynamic content support
            Cons: Slightly more complex code, need to check target element

    Handling different types of elements:
            if (e.target.matches('.delete-btn')) {
            handleDelete(e.target);
        } else if (e.target.matches('.edit-btn')) {
            handleEdit(e.target);
        }

    Using .closest() to find the target element:
        const todoItem = e.target.closest('.todo-item');
        if (todoItem) {
            console.log('Todo item clicked:', todoItem.dataset.id);
        }

        <button data-action="save" data-id="123">Save</button>

        // difference between e.target and e.currentTarget and this.target
        // this.target is the element that the event listener is attached to (when the event bubbles up, the "this" changes i.e. this = currentTarget)
 */

const div = document.querySelector('#div');
const form = document.querySelector('#form');
const button = document.querySelector('#button');

// Add debugging to see if elements are found
console.log('Elements found:', { div, form, button });

div.addEventListener('click', (e) => {
    console.log('div clicked');
    // console.log('Event phase:', e.eventPhase); // 1=capturing, 2=target, 3=bubbling
    // console.log('Target:', e.target.id);
    // console.log('Current target:', e.currentTarget.id);
}, {
    capture: false,
});

form.addEventListener('click', (e) => {
    console.log('form clicked');
}, {
    capture: false,
});

button.addEventListener('click', (e) => {
    console.log('button clicked');
    e.stopPropagation();
}, {
    capture: false,
});
}
/**
 * Event Capturing Order Explanation
    When you use capture: true, the event listener runs during the capturing phase (Phase 1), which means the event travels from the root down to the target. 

 * But wait! You're only seeing div -> button -> form because:
    Only the div has capture: true - so it runs during capturing phase
    Form and button have default (bubbling) - so they run during bubbling phase (3)
 */

// ===== EVENT DELEGATION EXAMPLE =====
function initEventDelegation() {
    console.log('=== EVENT DELEGATION EXAMPLE ===');
    
    // Create a container with multiple buttons
    const container = document.createElement('div');
    container.id = 'button-container';
    container.innerHTML = `
        <h3>Event Delegation Demo</h3>
        <button class="action-btn" data-action="save">Save</button>
        <button class="action-btn" data-action="delete">Delete</button>
        <button class="action-btn" data-action="edit">Edit</button>
        <button class="action-btn" data-action="share">Share</button>
    `;
    document.body.appendChild(container);
    
    // ❌ BAD APPROACH: Adding listeners to each button individually
    // This is inefficient and doesn't work for dynamically added buttons
    const buttons = container.querySelectorAll('.action-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            console.log('Individual listener:', e.target.dataset.action);
        });
    });
    
    // ✅ GOOD APPROACH: Event delegation using bubbling
    // Single listener on parent handles all child events
    container.addEventListener('click', (e) => {
        // Check if the clicked element is a button with our class
        if (e.target.matches('.action-btn')) {
            const action = e.target.dataset.action;
            console.log('Event delegation:', action);
            
            // Handle different actions
            switch(action) {
                case 'save':
                    console.log('Saving data...');
                    break;
                case 'delete':
                    console.log('Deleting item...');
                    break;
                case 'edit':
                    console.log('Opening edit mode...');
                    break;
                case 'share':
                    console.log('Opening share dialog...');
                    break;
            }
        }
    });
    
    // Demonstrate dynamic content handling
    setTimeout(() => {
        const newButton = document.createElement('button');
        newButton.className = 'action-btn';
        newButton.dataset.action = 'print';
        newButton.textContent = 'Print';
        container.appendChild(newButton);
        console.log('Added new button dynamically');
    }, 2000);
}

// ===== ADVANCED EVENT DELEGATION EXAMPLE =====
function initAdvancedEventDelegation() {
    console.log('=== ADVANCED EVENT DELEGATION ===');
    
    const todoList = document.createElement('div');
    todoList.id = 'todo-list';
    todoList.innerHTML = `
        <h3>Todo List (Event Delegation)</h3>
        <div class="todo-item" data-id="1">
            <span class="todo-text">Learn JavaScript</span>
            <button class="delete-btn" data-id="1">Delete</button>
            <button class="complete-btn" data-id="1">Complete</button>
        </div>
        <div class="todo-item" data-id="2">
            <span class="todo-text">Master Event Delegation</span>
            <button class="delete-btn" data-id="2">Delete</button>
            <button class="complete-btn" data-id="2">Complete</button>
        </div>
        <div class="todo-item" data-id="3">
            <span class="todo-text">Ace the Interview</span>
            <button class="delete-btn" data-id="3">Delete</button>
            <button class="complete-btn" data-id="3">Complete</button>
        </div>
    `;
    document.body.appendChild(todoList);
    
    // Single event listener handles multiple button types
    todoList.addEventListener('click', (e) => {
        const target = e.target;
        const todoItem = target.closest('.todo-item');

        // Check if the clicked element is a todo item
        if (!todoItem) {
            console.log('Clicked outside todo items');
            return;
        }; 
        
        const todoId = todoItem.dataset.id;
        
        if (target.matches('.delete-btn')) {
            console.log(`Deleting todo ${todoId}`);
            todoItem.remove();
        } else if (target.matches('.complete-btn')) {
            console.log(`Completing todo ${todoId}`);
            todoItem.style.textDecoration = 'line-through';
            target.textContent = 'Completed';
            target.disabled = true;
        } else if (target.matches('.todo-text')) {
            console.log(`Editing todo ${todoId}`);
            target.contentEditable = true;
            target.focus();
        }
    });
    
    // Handle contentEditable blur
    todoList.addEventListener('blur', (e) => {
        if (e.target.matches('.todo-text')) {
            e.target.contentEditable = false;
            console.log('Todo updated:', e.target.textContent);
        }
    }, true); // Use capturing to handle blur event
}

// should close on clicking on the negative space around it
function createModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.setAttribute('data-modal-id', 'main-modal');
    
    // Overlay styling

// Fixed vs Absolute for Modals:
// 1. Viewport vs Parent Container:
// Fixed: Positions relative to the viewport (browser window)
// Absolute: Positions relative to the nearest positioned parent
// 2. Scrolling Behavior:
// Fixed: Stays in place when page scrolls
// Absolute: Moves with the page when scrolling

/**
 * "When would you use fixed vs absolute positioning?"
    Fixed Positioning:
        Modals and overlays (covers entire viewport)
        Sticky headers/footers (stays in place when scrolling)
        Full-screen elements (tooltips, notifications)
        Elements that should ignore scroll

    Absolute Positioning:
        Tooltips (relative to trigger element)
        Dropdown menus (relative to parent)
        Positioned within containers
        Elements that should move with scroll
 */

/** "How do you handle modal positioning on mobile?"
 * // Fixed works consistently across devices
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';  // Viewport width
    modal.style.height = '100vh'; // Viewport height
    */

    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Darker overlay
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.style.backdropFilter = 'blur(5px)'; // Modern blur effect
    modal.style.transition = 'opacity 0.3s ease-in-out';
    modal.style.opacity = '0';

    // Prevent background scroll
    document.body.style.overflow = 'hidden';

    // Absolute modal doesn't prevent scroll
    // Background content can still scroll
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            border-radius: 12px;
            padding: 32px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            transform: scale(0.9);
            transition: transform 0.3s ease-in-out;
            position: relative;
        ">
            <h2 style="
                margin: 0 0 16px 0;
                color: #333;
                font-size: 24px;
                font-weight: 600;
            ">Modal Title</h2>
            <p style="
                margin: 0 0 24px 0;
                color: #666;
                line-height: 1.6;
                font-size: 16px;
            ">This is a modal with proper overlay styling. Click outside or use the close button to dismiss it.</p>
            <button class="close-btn" data-action="close-modal" style="
                background: #007bff;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background-color 0.2s ease;
            ">Close Modal</button>
        </div>
    `;

    document.body.appendChild(modal);
    

    /**
     * Memory Aid:
        Think of it like photography:
        setTimeout = giving the camera time to focus before taking the picture
        CSS transition = only works when the subject actually moves
        Same frame = like trying to take a before/after photo simultaneously
        This pattern is crucial for smooth UI animations and is a common interview topic for frontend developers!
    */

    // Animate in
    // setTimeout(() => {
    //     modal.style.opacity = '1';
    //     const modalContent = modal.querySelector('.modal-content');
    //     modalContent.style.transform = 'scale(1)';
    // }, 10);

    // ✅ Better than setTimeout
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(1)';
    });
}

function closeModal(modal) {
    // Animate out
    modal.style.opacity = '0';
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        modal.remove();
    }, 300);

    // Not better than setTimeout for closing animation
    // requestAnimationFrame doesn't wait for transitions
    // requestAnimationFrame(() => {
    //     modal.remove();
    // });
}



// Event delegation for all modal interactions
function initModalEventDelegation() {
    // Single event listener on document for all modal interactions
    document.addEventListener('click', (e) => {
        const target = e.target;
        
        // Handle modal open button
        if (target.matches('[data-action="open-modal"]')) {
            createModal();
            return;
        }
        
        // Handle modal close button
        if (target.matches('[data-action="close-modal"]')) {
            const modal = target.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
            return;
        }
        
        // Handle overlay click (close modal when clicking outside content)
        if (target.matches('.modal')) {
            closeModal(target);
            return;
        }
    });
    
    // Handle keyboard events (Escape key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal');
            if (modal) {
                closeModal(modal);
            }
        }
    });
}

// Create a button to open the modal
function createModalButton() {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999;
    `;
    
    const openModalBtn = document.createElement('button');
    openModalBtn.textContent = 'Open Modal';
    openModalBtn.setAttribute('data-action', 'open-modal');
    openModalBtn.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    // Hover effects
    openModalBtn.addEventListener('mouseenter', () => {
        openModalBtn.style.transform = 'translateY(-2px)';
        openModalBtn.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
    });
    
    openModalBtn.addEventListener('mouseleave', () => {
        openModalBtn.style.transform = 'translateY(0)';
        openModalBtn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    });
    
    buttonContainer.appendChild(openModalBtn);
    document.body.appendChild(buttonContainer);
}

if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => {
        init();
        initEventDelegation();
        initAdvancedEventDelegation();
        initModalEventDelegation();
        createModalButton();
    });
} else {
    init();
    initEventDelegation();
    initAdvancedEventDelegation();
    initModalEventDelegation();
    createModalButton();
}