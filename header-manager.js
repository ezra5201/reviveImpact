/**
 * HeaderManager - Manages global header and secondary action bar
 * across all pages in the ReVive application
 */
class HeaderManager {
  constructor() {
    this.config = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the header with page-specific configuration
   * @param {Object} pageConfig - Configuration object for the current page
   */
  async init(pageConfig) {
    this.config = pageConfig;
    
    try {
      // Load the shared header HTML
      await this.loadHeaderTemplate();
      
      // Set up the navigation
      this.setupNavigation();
      
      // Set up the secondary action bar
      this.setupSecondaryBar();
      
      // Initialize search functionality if needed
      if (pageConfig.features?.search) {
        this.initializeSearch();
      }
      
      this.isInitialized = true;
      console.log('HeaderManager initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize HeaderManager:', error);
    }
  }

  /**
   * Load the shared header template into the current page
   */
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

  /**
   * Set up main navigation tabs
   */
  setupNavigation() {
    const navContainer = document.getElementById('mainNavigation');
    if (!navContainer) return;

    // Define all possible navigation tabs
    const allTabs = [
      { id: 'contact-log', label: 'CONTACT LOG', href: 'index.html' },
      { id: 'outreach', label: 'OUTREACH', href: 'outreach.html' },
      { id: 'cm-ot', label: 'CM/OT', href: 'cm-ot.html' },
      { id: 'dashboard', label: 'DASHBOARD', href: 'dashboard.html' }
    ];

    // Generate navigation HTML
    const navHTML = allTabs.map(tab => {
      const isActive = tab.label === this.config.activeTab;
      const className = isActive ? 'nav-tab nav-tab-active' : 'nav-tab nav-tab-inactive';
      
      if (isActive) {
        return `<span class="${className}">${tab.label}</span>`;
      } else {
        return `<a href="${tab.href}" class="${className}">${tab.label}</a>`;
      }
    }).join('');

    navContainer.innerHTML = navHTML;
  }

  /**
   * Set up secondary action bar based on page configuration
   */
  setupSecondaryBar() {
    const secondaryLeft = document.getElementById('secondaryLeft');
    const secondaryRight = document.getElementById('secondaryRight');
    
    if (!secondaryLeft || !secondaryRight) return;

    // Clear existing content
    secondaryLeft.innerHTML = '';
    secondaryRight.innerHTML = '';

    // Set up left filters
    if (this.config.secondaryBar?.leftFilters) {
      this.setupLeftFilters(secondaryLeft);
    }

    // Set up right actions
    if (this.config.secondaryBar?.rightActions) {
      this.setupRightActions(secondaryRight);
    }
  }

  /**
   * Set up left side filters
   */
  setupLeftFilters(container) {
    const filters = this.config.secondaryBar.leftFilters;
    
    filters.forEach(filterType => {
      const filterElement = this.createFilter(filterType);
      if (filterElement) {
        container.appendChild(filterElement);
      }
    });
  }

  /**
   * Create individual filter elements
   */
  createFilter(filterType) {
    const filterGroup = document.createElement('div');
    filterGroup.className = 'filter-group';

    switch (filterType) {
      case 'date':
        filterGroup.innerHTML = `
          <label for="dateFilter">Date/s:</label>
          <select id="dateFilter" class="filter-select">
            <option value="today" selected>Today</option>
            <option value="thisWeek">This week</option>
            <option value="thisMonth">This month</option>
            <option value="thisYear">This year</option>
            <option value="custom">Custom</option>
            <option value="dateRange">Date Range</option>
          </select>
        `;
        break;

      case 'provider':
        filterGroup.innerHTML = `
          <label for="providerFilter">Provider:</label>
          <select id="providerFilter" class="filter-select">
            <option value="0" selected>Andrea Leflore</option>
            <option value="1">Elena Ahmed</option>
            <option value="2">Sofia Cohen</option>
            <option value="3">Jamal Silva</option>
            <option value="4">Mohammed Ahmed</option>
            <option value="5">Sonia Singh</option>
            <option value="6">Leila Garcia</option>
          </select>
        `;
        break;

      case 'location':
        filterGroup.innerHTML = `
          <label for="locationFilter">Location:</label>
          <select id="locationFilter" class="filter-select">
            <option value="all" selected>All Locations</option>
            <option value="hubbard-desplaines">Hubbard & Desplaines</option>
            <option value="chicago-albany">Chicago & Albany</option>
            <option value="carroll-hoyne">Carroll & Hoyne</option>
          </select>
        `;
        break;

      case 'status':
        filterGroup.innerHTML = `
          <label for="statusFilter">Status:</label>
          <select id="statusFilter" class="filter-select">
            <option value="all" selected>All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        `;
        break;

      default:
        return null;
    }

    return filterGroup;
  }

  /**
   * Set up right side actions
   */
  setupRightActions(container) {
    const actions = this.config.secondaryBar.rightActions;
    
    actions.forEach(actionType => {
      const actionElement = this.createAction(actionType);
      if (actionElement) {
        container.appendChild(actionElement);
      }
    });
  }

  /**
   * Create individual action elements
   */
  createAction(actionType) {
    let button;

    switch (actionType) {
      case 'quickCheckIn':
        button = document.createElement('button');
        button.id = 'quickCheckInButton';
        button.className = 'btn btn-primary';
        button.textContent = 'Quick Check-In';
        button.disabled = true;
        break;

      case 'addClient':
        button = document.createElement('button');
        button.id = 'addClientButton';
        button.className = 'btn btn-primary';
        button.textContent = 'Add Client';
        break;

      case 'addOutreach':
        button = document.createElement('button');
        button.id = 'addOutreachButton';
        button.className = 'btn btn-primary';
        button.textContent = 'Add Outreach';
        break;

      case 'newCase':
        button = document.createElement('button');
        button.id = 'newCaseButton';
        button.className = 'btn btn-primary';
        button.textContent = 'New Case';
        break;

      case 'exportData':
        button = document.createElement('button');
        button.id = 'exportDataButton';
        button.className = 'btn btn-secondary';
        button.textContent = 'Export Data';
        break;

      default:
        return null;
    }

    return button;
  }

  /**
   * Initialize search functionality
   */
  initializeSearch() {
    const searchContainer = document.getElementById('searchContainer');
    if (searchContainer) {
      searchContainer.style.display = 'block';
      
      // Initialize search functionality here
      // This would include the existing search logic from your current implementation
      this.setupClientSearch();
    }
  }

  /**
   * Set up client search functionality
   */
  setupClientSearch() {
    // Mock data for client suggestions - in production, this would come from your database
    const clientData = [
      { id: 1, firstName: 'Thiago', lastName: 'Schmidt' },
      { id: 2, firstName: 'Liam', lastName: 'Nguyen' },
      { id: 3, firstName: 'Mia', lastName: 'Patel' },
      // ... add more mock data as needed
    ];

    const searchInput = document.getElementById('clientSearchInput');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    let currentSelection = -1;

    if (!searchInput || !suggestionsContainer) return;

    // Search input event listeners
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      
      if (query === '') {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'none';
        return;
      }

      // Filter and show suggestions
      const filteredClients = clientData.filter(client => {
        const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
        return fullName.includes(query);
      });

      this.renderSuggestions(filteredClients, query, suggestionsContainer);
    });

    // Additional search event listeners (keyboard navigation, etc.)
    this.setupSearchKeyboardNavigation(searchInput, suggestionsContainer);
  }

  /**
   * Render search suggestions
   */
  renderSuggestions(clients, query, container) {
    container.innerHTML = '';
    
    if (clients.length === 0) {
      container.style.display = 'none';
      return;
    }

    clients.forEach(client => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      const fullName = `${client.firstName} ${client.lastName}`;
      item.textContent = fullName;
      
      item.addEventListener('click', () => {
        document.getElementById('clientSearchInput').value = fullName;
        container.style.display = 'none';
        // Trigger page-specific search functionality
        if (typeof window.onClientSelected === 'function') {
          window.onClientSelected(fullName);
        }
      });

      container.appendChild(item);
    });

    container.style.display = 'block';
  }

  /**
   * Set up keyboard navigation for search
   */
  setupSearchKeyboardNavigation(searchInput, suggestionsContainer) {
    // Implement keyboard navigation logic here
    // This would include arrow key navigation, enter to select, escape to close
  }

  /**
   * Update secondary bar dynamically (useful for state changes)
   */
  updateSecondaryBar(newConfig) {
    if (!this.isInitialized) return;
    
    this.config.secondaryBar = { ...this.config.secondaryBar, ...newConfig };
    this.setupSecondaryBar();
  }

  /**
   * Show/hide search functionality
   */
  toggleSearch(show) {
    const searchContainer = document.getElementById('searchContainer');
    if (searchContainer) {
      searchContainer.style.display = show ? 'block' : 'none';
    }
  }
}

// Create global instance
window.HeaderManager = new HeaderManager();
