/**
 * Page Configuration Templates
 * Defines the header and secondary bar setup for each page type
 */

const PageConfigs = {
  
  /**
   * Contact Log Page Configuration
   */
  contactLog: {
    activeTab: 'CONTACT LOG',
    features: {
      search: true  // Enable client search
    },
    secondaryBar: {
      leftFilters: ['date', 'provider'],
      rightActions: ['quickCheckIn']
    }
  },

  /**
   * Outreach Page Configuration  
   */
  outreach: {
    activeTab: 'OUTREACH',
    features: {
      search: false  // Disable search for outreach
    },
    secondaryBar: {
      leftFilters: ['date', 'location', 'provider'],
      rightActions: ['addOutreach', 'exportData']
    }
  },

  /**
   * Case Management / OT Page Configuration
   */
  caseManagement: {
    activeTab: 'CM/OT',
    features: {
      search: true  // Enable client search
    },
    secondaryBar: {
      leftFilters: ['provider', 'status'],
      rightActions: ['newCase', 'addClient']
    }
  },

  /**
   * Dashboard Page Configuration
   */
  dashboard: {
    activeTab: 'DASHBOARD',
    features: {
      search: false  // No search needed on dashboard
    },
    secondaryBar: {
      leftFilters: ['date'],
      rightActions: ['exportData']
    }
  },

  /**
   * Client Detail Page Configuration
   */
  clientDetail: {
    activeTab: 'CONTACT LOG',  // Inherit from contact log
    features: {
      search: true
    },
    secondaryBar: {
      leftFilters: [],  // No filters on detail page
      rightActions: ['addClient']
    }
  },

  /**
   * Client History Page Configuration
   */
  clientHistory: {
    activeTab: 'CONTACT LOG',  // Inherit from contact log
    features: {
      search: false  // Don't need search on history page
    },
    secondaryBar: {
      leftFilters: ['date'],
      rightActions: ['exportData']
    }
  }

};

// Make available globally
window.PageConfigs = PageConfigs;
