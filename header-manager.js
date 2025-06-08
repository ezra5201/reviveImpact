class HeaderManager {
  constructor() {
    this.isInitialized = false;
  }

  async init() {
    try {
      // Load the shared header HTML
      await this.loadHeaderTemplate();
      this.isInitialized = true;
      console.log('Simple HeaderManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize HeaderManager:', error);
      throw error;
    }
  }

  async loadHeaderTemplate() {
    try {
      const response = await fetch('shared-header.html');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      
      // Insert header at the beginning of body
      document.body.insertAdjacentHTML('afterbegin', html);
      
    } catch (error) {
      console.error('Error loading header template:', error);
      throw error;
    }
  }
}

// Create global instance
window.HeaderManager = new HeaderManager();
