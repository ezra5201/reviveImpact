// ==========================================================================
// HEADER MANAGER CLASS
// Manages the global header and secondary action bar for all pages
// ==========================================================================

class HeaderManager {
  // ==========================================================================
  // CONSTRUCTOR - Sets up the initial state
  // ==========================================================================
  constructor() {
    this.isInitialized = false;
  }

  // ==========================================================================
  // MAIN INITIALIZATION METHOD (UPDATED)
  // Called by each page to load the header and configure the secondary bar
  // ==========================================================================
  async init(pageConfig = null) {
    try {
      console.log('HeaderManager.init called with config:', pageConfig);
      
      // Step 1: Load the shared header HTML from shared-header.html
      await this.loadHeaderTemplate();
      
      // Step 2: Setup secondary action bar based on page-specific configuration
      if (pageConfig && pageConfig.secondaryBar) {
        this.setupSecondaryActionBar(pageConfig.secondaryBar);
      }
      
      // Step 3: Initialize checkbox state manager for conditional Food button
      this.initializeCheckboxStateManager();
      
      this.isInitialized = true;
      console.log('HeaderManager initialized successfully');
      
      return true;
    } catch (error) {
      console.error('Failed to initialize HeaderManager:', error);
      throw error;
    }
  }

  // ==========================================================================
  // HEADER TEMPLATE LOADING
  // Fetches shared-header.html and inserts it into the current page
  // ==========================================================================
  async loadHeaderTemplate() {
    try {
      console.log('Loading header template...');
      
      // Fetch the shared header HTML file
      const response = await fetch('shared-header.html');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get the HTML content as text
      const html = await response.text();
      console.log('Header HTML loaded, length:', html.length);
      
      // Insert the header HTML at the beginning of the page body
      document.body.insertAdjacentHTML('afterbegin', html);
      console.log('Header HTML inserted into DOM');
      
    } catch (error) {
      console.error('Error loading header template:', error);
      throw error;
    }
  }

  // ==========================================================================
  // SECONDARY ACTION BAR SETUP
  // Configures the secondary bar content based on page configuration
  // ==========================================================================
  setupSecondaryActionBar(config) {
    // Find the left and right containers in the secondary action bar
    const leftContainer = document.getElementById('secondaryBarLeft');
    const rightContainer = document.getElementById('secondaryBarRight');
    
    // Make sure the containers exist (they should be in shared-header.html)
    if (!leftContainer || !rightContainer) {
      console.error('Secondary action bar containers not found');
      return;
    }

    // Clear any existing content from previous page loads
    leftContainer.innerHTML = '';
    rightContainer.innerHTML = '';

    // Setup left side content (buttons, breadcrumbs, filters, etc.)
    if (config.leftContent) {
      this.setupLeftContent(leftContainer, config.leftContent);
    }

    // Setup right side content (action buttons, utilities, etc.)
    if (config.rightContent) {
      this.setupRightContent(rightContainer, config.rightContent);
    }

    console.log('Secondary action bar configured');
  }

  // ==========================================================================
  // LEFT SIDE CONTENT SETUP
  // Handles different types of content for the left side of secondary bar
  // ==========================================================================
  setupLeftContent(container, content) {
    // OPTION 1: Button list (like Reports, Programs, Staff, Inventory)
    if (content.type === 'buttons' && content.buttons) {
      content.buttons.forEach(button => {
        const btn = document.createElement('a');
        btn.href = button.href || '#';
        btn.className = 'btn btn-primary';
        btn.style.textDecoration = 'none';
        btn.textContent = button.text;
        
        // Add click handler if provided
        if (button.onClick) {
          btn.addEventListener('click', button.onClick);
        }
        
        container.appendChild(btn);
      });
    } 
    // OPTION 2: Breadcrumb navigation (like "Contact Log > Client History")
    else if (content.type === 'breadcrumbs' && content.breadcrumbs) {
      const nav = document.createElement('nav');
      nav.className = 'breadcrumb-nav';
      
      // Build breadcrumb trail
      content.breadcrumbs.forEach((crumb, index) => {
        // Add separator between breadcrumbs (not before first one)
        if (index > 0) {
          const separator = document.createElement('span');
          separator.className = 'breadcrumb-separator';
          separator.textContent = '>';
          nav.appendChild(separator);
        }
        
        // Create clickable link or plain text for current page
        if (crumb.href) {
          const link = document.createElement('a');
          link.href = crumb.href;
          link.className = 'breadcrumb-link';
          link.textContent = crumb.text;
          nav.appendChild(link);
        } else {
          const current = document.createElement('span');
          current.className = 'breadcrumb-current';
          current.textContent = crumb.text;
          nav.appendChild(current);
        }
      });
      
      container.appendChild(nav);
    }
  }

  // ==========================================================================
  // RIGHT SIDE CONTENT SETUP
  // Handles different types of content for the right side of secondary bar
  // ==========================================================================
  setupRightContent(container, content) {
    // OPTION 1: Button list (like Export, Print, Add New buttons)
    if (content.type === 'buttons' && content.buttons) {
      content.buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary';
        btn.textContent = button.text;
        btn.id = button.id || '';
        
        // Add click handler if provided
        if (button.onClick) {
          btn.addEventListener('click', button.onClick);
        }
        
        container.appendChild(btn);
      });
    }
  }

  // ==========================================================================
  // CONDITIONAL FOOD BUTTON MANAGEMENT
  // Shows/hides the Food button in the secondary action bar right side
  // ==========================================================================
  
  /**
   * Shows the conditional Food button in the secondary action bar
   */
  showConditionalFoodButton() {
    const rightContainer = document.getElementById('secondaryBarRight');
    
    if (!rightContainer) {
      console.error('Secondary bar right container not found');
      return;
    }

    // Check if Food button already exists
    if (document.getElementById('conditionalFoodBtn')) {
      console.log('Food button already exists');
      return;
    }

    // Create the Food button
    const foodBtn = document.createElement('button');
    foodBtn.id = 'conditionalFoodBtn';
    foodBtn.className = 'btn btn-primary';
    foodBtn.textContent = 'Food';
    foodBtn.style.marginLeft = '8px'; // Add some spacing from other buttons
    
    // Add click handler
    foodBtn.addEventListener('click', () => {
      this.handleFoodAction();
    });
    
    // Add the button to the right container
    rightContainer.appendChild(foodBtn);
    console.log('Food button added to secondary action bar');
  }

  /**
   * Hides/removes the conditional Food button from the secondary action bar
   */
  hideConditionalFoodButton() {
    const foodBtn = document.getElementById('conditionalFoodBtn');
    
    if (foodBtn) {
      foodBtn.remove();
      console.log('Food button removed from secondary action bar');
    }
  }

  /**
   * Handles the Food button click action
   * You can customize this method to perform the desired action
   */
  handleFoodAction() {
    console.log('Food button clicked!');
    
    // Get information about selected checkboxes for context
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    console.log('Selected checkboxes:', checkedBoxes.length);
    
    // Example actions you might want to implement:
    
    // Option 1: Show an alert (for testing)
    alert(`Food button clicked! ${checkedBoxes.length} items selected.`);
    
    // Option 2: Open a food-related dialog/form
    // this.openFoodDialog();
    
    // Option 3: Navigate to a food page
    // window.location.href = 'food-distribution.html';
    
    // Option 4: Show a specific food-related modal
    // this.showFoodModal();
    
    // Option 5: Process selected items for food distribution
    // this.processFoodDistribution(checkedBoxes);
  }

  // ==========================================================================
  // CHECKBOX STATE MANAGER INTEGRATION
  // Initializes the global checkbox monitoring system
  // ==========================================================================
  
  /**
   * Initializes the checkbox state manager for conditional button functionality
   */
  initializeCheckboxStateManager() {
    if (!window.CheckboxStateManager) {
      console.error('CheckboxStateManager not available');
      return;
    }

    // Create and initialize the checkbox state manager
    if (!this.checkboxStateManager) {
      this.checkboxStateManager = new window.CheckboxStateManager();
      this.checkboxStateManager.init(this);
      console.log('Checkbox state manager initialized');
    }
  }

  // ==========================================================================
  // UTILITY METHODS
  // Helper methods for checking status and debugging
  // ==========================================================================
  
  // Check if HeaderManager has finished initializing
  isReady() {
    return this.isInitialized;
  }

  // Get version info for debugging purposes
  getVersion() {
    return '1.0.0';
  }
}

// ==========================================================================
// CHECKBOX STATE MANAGER CLASS
// Manages global checkbox state and conditional Food button visibility
// ==========================================================================

class CheckboxStateManager {
  // ==========================================================================
  // CONSTRUCTOR - Initialize state tracking
  // ==========================================================================
  constructor() {
    this.checkedCount = 0;
    this.headerManager = null;
    this.isInitialized = false;
  }

  // ==========================================================================
  // INITIALIZATION METHOD
  // Links to HeaderManager instance and sets up global listeners
  // ==========================================================================
  init(headerManagerInstance) {
    if (this.isInitialized) {
      console.log('CheckboxStateManager already initialized');
      return;
    }

    this.headerManager = headerManagerInstance;
    this.setupGlobalCheckboxListener();
    this.isInitialized = true;
    console.log('CheckboxStateManager initialized');
  }

  // ==========================================================================
  // GLOBAL CHECKBOX LISTENER SETUP
  // Uses event delegation to capture ALL checkbox changes across the app
  // ==========================================================================
  setupGlobalCheckboxListener() {
    // Use event delegation on document to catch all checkbox changes
    document.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        console.log('Checkbox changed:', e.target.name, 'checked:', e.target.checked);
        this.updateCheckboxCount();
      }
    });

    // Also listen for DOM changes in case checkboxes are added dynamically
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if any new checkboxes were added
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const newCheckboxes = node.querySelectorAll ? node.querySelectorAll('input[type="checkbox"]') : [];
              if (newCheckboxes.length > 0) {
                console.log('New checkboxes detected, recounting...');
                setTimeout(() => this.updateCheckboxCount(), 10);
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ==========================================================================
  // CHECKBOX COUNT UPDATE
  // Counts all checked checkboxes and triggers UI updates when needed
  // ==========================================================================
  updateCheckboxCount() {
    // Count all currently checked checkboxes in the document
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const newCount = allCheckboxes.length;
    
    console.log('Checkbox count updated:', this.checkedCount, '->', newCount);
    
    // Only trigger UI changes when crossing the zero threshold
    if ((this.checkedCount === 0 && newCount > 0) || 
        (this.checkedCount > 0 && newCount === 0)) {
      this.checkedCount = newCount;
      this.toggleFoodButton();
    } else {
      this.checkedCount = newCount;
    }
  }

  // ==========================================================================
  // FOOD BUTTON TOGGLE LOGIC
  // Shows/hides the Food button based on checkbox state
  // ==========================================================================
  toggleFoodButton() {
    if (!this.headerManager) {
      console.error('HeaderManager not available for checkbox state updates');
      return;
    }

    if (this.checkedCount > 0) {
      console.log('Showing Food button - checkboxes selected:', this.checkedCount);
      this.headerManager.showConditionalFoodButton();
    } else {
      console.log('Hiding Food button - no checkboxes selected');
      this.headerManager.hideConditionalFoodButton();
    }
  }

  // ==========================================================================
  // MANUAL RECOUNT METHOD
  // For use when checkbox state might be out of sync
  // ==========================================================================
  forceRecount() {
    console.log('Forcing checkbox recount...');
    this.updateCheckboxCount();
  }
}

// ==========================================================================
// GLOBAL INSTANCE CREATION
// Create the HeaderManager instance that all pages will use
// ==========================================================================
console.log('Creating HeaderManager instance...');
window.HeaderManager = new HeaderManager();
console.log('HeaderManager instance created:', window.HeaderManager);
console.log('HeaderManager.init method exists:', typeof window.HeaderManager.init);

// Make CheckboxStateManager available globally
window.CheckboxStateManager = CheckboxStateManager;
