class HeaderManager {
  constructor() {
    this.isInitialized = false;
  }

  async init(pageConfig = null) {
    try {
      console.log('HeaderManager.init called with config:', pageConfig);
      
      // Load the shared header HTML
      await this.loadHeaderTemplate();
      
      this.isInitialized = true;
      console.log('HeaderManager initialized successfully');
      
      return true;
    } catch (error) {
      console.error('Failed to initialize HeaderManager:', error);
      throw error;
    }
  }

  async loadHeaderTemplate() {
    try {
      console.log('Loading header template...');
      
      const response = await fetch('shared-header.html');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      console.log('Header HTML loaded, length:', html.length);
      
      // Insert header at the beginning of body
      document.body.insertAdjacentHTML('afterbegin', html);
      console.log('Header HTML inserted into DOM');
      
    } catch (error) {
      console.error('Error loading header template:', error);
      throw error;
    }
  }

  // Method to check if HeaderManager is ready
  isReady() {
    return this.isInitialized;
  }

  // Method to get version info for debugging
  getVersion() {
    return '1.0.0';
  }
}

// Create global instance
console.log('Creating HeaderManager instance...');
window.HeaderManager = new HeaderManager();
console.log('HeaderManager instance created:', window.HeaderManager);
console.log('HeaderManager.init method exists:', typeof window.HeaderManager.init);
