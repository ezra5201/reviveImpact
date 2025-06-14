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
  // MAIN INITIALIZATION METHOD
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
// GLOBAL INSTANCE CREATION
// Create the HeaderManager instance that all pages will use
// ==========================================================================
console.log('Creating HeaderManager instance...');
window.HeaderManager = new HeaderManager();
console.log('HeaderManager instance created:', window.HeaderManager);
console.log('HeaderManager.init method exists:', typeof window.HeaderManager.init);
