// ==========================================================================
// INDEX.HTML SCRIPTS - Main JavaScript functionality for Contact Log page
// ==========================================================================

// Global variable to store contact log data
let contactLogData = [];

// ==========================================================================
// MAIN INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', async function() {
  console.log('DOM Content Loaded - Starting initialization');
  
  // Wait a moment to ensure all scripts are loaded
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Verify HeaderManager is available
  if (!window.HeaderManager) {
    console.error('HeaderManager not found - scripts may not have loaded properly');
    return;
  }
  
  // Initialize both header and table data in parallel
  try {
    // Start both operations simultaneously
    const headerPromise = initializeHeader();
    const dataPromise = loadContactLogData();
    
    // Wait for both to complete
    await Promise.all([headerPromise, dataPromise]);
    
    console.log('Both header and data loaded successfully');
    
    // Initialize table interactions after everything is loaded
    initializeTableDragScrolling();
    
    // Initialize dialog after header is loaded
    initializeDialog();
    
    // Set up page-specific search callback
    window.onClientSelected = function(clientName) {
      filterTableByClient(clientName);
    };
    
  } catch (error) {
    console.error('Error during initialization:', error);
  }
});

// ==========================================================================
// HEADER INITIALIZATION
// ==========================================================================

// Initialize header with error handling
async function initializeHeader() {
  try {
    // Wait a bit longer for HeaderManager to be available
    let attempts = 0;
    while (!window.HeaderManager && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (!window.HeaderManager) {
      throw new Error('HeaderManager not available after waiting');
    }
    
    // ADD THIS CHECK:
    if (typeof window.HeaderManager.init !== 'function') {
      throw new Error('HeaderManager.init is not a function');
    }
    
    await window.HeaderManager.init();
    console.log('Header loaded successfully');
  } catch (error) {
    console.error('Header initialization failed:', error);
    createFallbackHeader();
  }
}

// Create a simple fallback header if HeaderManager fails
function createFallbackHeader() {
  const fallbackHeader = document.createElement('header');
  fallbackHeader.innerHTML = `
    <div class="header-left">
      <div class="logo">
        <img src="ReVive-IMPACT-Logo.png" alt="ReVive IMPACT Logo" class="logo-image">
      </div>
      <nav>
        <span class="nav-tab nav-tab-active">CONTACT LOG</span>
        <a href="prospects.html" class="nav-tab nav-tab-inactive">PROSPECTS</a>
        <a href="outreach.html" class="nav-tab nav-tab-inactive">OUTREACH</a>
        <a href="cm-ot.html" class="nav-tab nav-tab-inactive">CM/OT</a>
        <a href="clients.html" class="nav-tab nav-tab-inactive">CLIENTS</a>
        <a href="dashboard.html" class="nav-tab nav-tab-inactive">DASHBOARD</a>
      </nav>
    </div>
    <div class="header-right">
      <div class="search-container">
        <input type="text" class="search-input" id="clientSearchInput" placeholder=" ">
        <span class="search-label">Client Search</span>
        <div class="suggestions-container" id="searchSuggestions"></div>
      </div>
      <div class="user-info">
        <span>Andrea Leflore</span>
        <div class="user-avatar"></div>
      </div>
      <button class="sign-out">Sign Out</button>
    </div>
  `;
  document.body.insertBefore(fallbackHeader, document.body.firstChild);
  console.log('Fallback header created');
}

// ==========================================================================
// DATA LOADING & TABLE POPULATION
// ==========================================================================

// Load data from JSON file and populate table
async function loadContactLogData() {
  try {
    console.log('Starting to load contact log data...');
    const response = await fetch('contact-log-data.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    contactLogData = data.contactLogEntries;
    
    console.log('Data loaded, populating table with', contactLogData.length, 'entries');
    populateTable(contactLogData);
    
  } catch (error) {
    console.error('Error loading contact log data:', error);
    showErrorMessage();
  }
}

// Generate table rows from data
function populateTable(entries) {
  const tableRowsContainer = document.querySelector('.table-rows-container');
  
  if (!tableRowsContainer) {
    console.error('Table rows container not found');
    return;
  }
  
  // Clear existing rows (keep header)
  const existingRows = tableRowsContainer.querySelectorAll('.table-row:not(:first-child)');
  existingRows.forEach(row => row.remove());

  // Generate rows from data
  entries.forEach(entry => {
    const row = createTableRow(entry);
    tableRowsContainer.appendChild(row);
  });

  console.log('Table populated with', entries.length, 'rows');
  
  // Re-initialize dialog functionality for new rows
  initializeTableRowClickHandlers();
}

// Create a single table row from entry data
function createTableRow(entry) {
  const row = document.createElement('div');
  row.className = 'table-row';
  row.style.cursor = 'pointer';

  // Create resources list HTML
  const resourcesHTML = entry.resourcesGiven.map(resource => 
    `<span>${resource}</span>`
  ).join('');

  row.innerHTML = `
    <div class="fixed-columns">
      <div class="column-cell col-date">${entry.date}</div>
      <div class="column-cell col-days">${entry.daysAgo}</div>
      <div class="column-cell col-provider">${entry.provider}</div>
      <div class="column-cell col-client">${entry.client}</div>
    </div>
    <div class="scrollable-columns">
      <div class="column-cell col-service">${entry.placeOfService}</div>
      <div class="column-cell col-accompanied">${entry.accompaniedAppointment}</div>
      <div class="column-cell col-documentation">${entry.obtainedDocumentation}</div>
      <div class="column-cell col-resources">
        <div class="resource-list">
          ${resourcesHTML}
        </div>
      </div>
      <div class="column-cell col-health">${entry.onSiteHealthCare}</div>
      <div class="column-cell col-program">${entry.programStarted}</div>
      <div class="column-cell col-housing">${entry.housingEntered}</div>
      <div class="column-cell col-counted">${entry.countedColumns}</div>
      <div class="column-cell col-notes">${entry.notes}</div>
      <div class="column-cell col-status">${entry.programStatus}</div>
    </div>
  `;

  return row;
}

// Show error message if data loading fails
function showErrorMessage() {
  const tableRowsContainer = document.querySelector('.table-rows-container');
  const errorRow = document.createElement('div');
  errorRow.className = 'table-row';
  errorRow.innerHTML = `
    <div class="fixed-columns">
      <div class="column-cell" style="color: red; text-align: center; padding: 20px; grid-column: 1 / -1;">
        Error loading contact log data. Please refresh the page or contact support.
      </div>
    </div>
  `;
  tableRowsContainer.appendChild(errorRow);
}

// ==========================================================================
// TABLE INTERACTION HANDLERS
// ==========================================================================

// Initialize click handlers for table rows
function initializeTableRowClickHandlers() {
  const tableRows = document.querySelectorAll('.table-row:not(:first-child)');
  tableRows.forEach(row => {
    row.addEventListener('click', function(e) {
      e.preventDefault();
      const clientCell = this.querySelector('.fixed-columns .col-client');
      if (clientCell) {
        const clientName = clientCell.textContent.trim();
        showDialog(clientName);
      }
    });
  });
}

// Filter table rows based on selected client
function filterTableByClient(clientName) {
  const rows = document.querySelectorAll('.table-row:not(:first-child)');
  const normalizedSearch = clientName.toLowerCase();
  let foundMatches = false;

  rows.forEach(row => {
    const clientCell = row.querySelector('.fixed-columns .col-client');
    const rowClientName = clientCell.textContent.toLowerCase();

    if (rowClientName.includes(normalizedSearch)) {
      row.style.display = '';
      foundMatches = true;
    } else {
      row.style.display = 'none';
    }
  });
}

// Table drag scrolling functionality
function initializeTableDragScrolling() {
  const tableContent = document.querySelector('.table-content');
  
  if (!tableContent) {
    console.error('Table content element not found');
    return;
  }
  
  let isDown = false;
  let startX;
  let scrollLeft;

  tableContent.addEventListener('mousedown', function(e) {
    isDown = true;
    tableContent.style.cursor = 'grabbing';
    startX = e.pageX - tableContent.offsetLeft;
    scrollLeft = tableContent.scrollLeft;
    e.preventDefault();
  });

  tableContent.addEventListener('mouseleave', function() {
    isDown = false;
    tableContent.style.cursor = 'default';
  });

  tableContent.addEventListener('mouseup', function() {
    isDown = false;
    tableContent.style.cursor = 'default';
  });

  tableContent.addEventListener('mousemove', function(e) {
    if (!isDown) return;
    const x = e.pageX - tableContent.offsetLeft;
    const walk = (x - startX) * 1.5;
    tableContent.scrollLeft = scrollLeft - walk;
  });
}

// ==========================================================================
// DIALOG FUNCTIONALITY
// ==========================================================================

// Make showDialog function global so other scripts can use it
window.showDialog = function(clientName) {
  const dialog = document.getElementById('clientDialog');
  const dialogClientName = document.getElementById('dialogClientName');
  const initialOptionsScreen = document.getElementById('dialogInitialOptions');
  const checkInFormScreen = document.getElementById('dialogCheckInForm');
  
  if (dialog && dialogClientName && initialOptionsScreen && checkInFormScreen) {
    dialogClientName.textContent = clientName;
    initialOptionsScreen.style.display = 'block';
    checkInFormScreen.style.display = 'none';
    dialog.style.display = 'flex';
    dialog.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
};

// Initialize dialog functionality
function initializeDialog() {
  const dialog = document.getElementById('clientDialog');
  if (!dialog) {
    console.error('Dialog element not found.');
    return;
  }
  
  const dialogClientName = document.getElementById('dialogClientName');
  const initialOptionsScreen = document.getElementById('dialogInitialOptions');
  const checkInFormScreen = document.getElementById('dialogCheckInForm');
  const quickCheckInBtn = document.getElementById('quickCheckInBtn');
  
  if (!dialogClientName || !initialOptionsScreen || !checkInFormScreen || !quickCheckInBtn) {
    console.error('Dialog content elements not found.');
    return;
  }
  
// Add event listener for the "Client Dashboard" button
const clientHistoryBtn = document.getElementById('clientHistoryBtn');
if (clientHistoryBtn) {
  clientHistoryBtn.addEventListener('click', function() {
    const clientName = dialogClientName.textContent;
    window.open(`clientDashboard.html?clientName=${encodeURIComponent(clientName)}`, '_blank');
  });
}
  
  const dialogCloseBtn = document.getElementById('dialogCloseBtn');
  const initialCancelBtn = document.getElementById('initialCancelBtn');
  const dialogCancelBtn = document.getElementById('dialogCancelBtn');
  
  if (dialogCloseBtn) {
    dialogCloseBtn.addEventListener('click', () => {
      closeDialog();
    });
  }
  
  if (initialCancelBtn) {
    initialCancelBtn.addEventListener('click', () => {
      closeDialog();
    });
  }
  
  if (dialogCancelBtn) {
    dialogCancelBtn.addEventListener('click', () => {
      closeDialog();
    });
  }
  
  // Add event listener to Quick Check In button
  if (quickCheckInBtn) {
    quickCheckInBtn.addEventListener('click', () => {
      initialOptionsScreen.style.display = 'none';
      checkInFormScreen.style.display = 'block';
    });
  }
  
  // Add submit button handler
  const dialogSubmitBtn = document.getElementById('dialogSubmitBtn');
  if (dialogSubmitBtn) {
    dialogSubmitBtn.addEventListener('click', () => {
      // Here you would save the form data
      alert('Check-in form submitted successfully!');
      closeDialog();
    });
  }

  console.log('Dialog initialized successfully');
}

// Close dialog function
function closeDialog() {
  const dialog = document.getElementById('clientDialog');
  if (dialog) {
    dialog.style.display = 'none';
    dialog.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
}
