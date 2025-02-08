// Configuration
const config = {
    retryAttempts: 3,
    retryDelay: 1000,
    modalDuration: 3000,
    codeLength: 5,
    serverUrl: 'https://pws-0h89.onrender.com',
  };
  
  // Dashboard Manager Class
  class DashboardManager {
    constructor() {
      this.elements = {
        dashboard: document.getElementById('dashboard'),
        inputSection: document.getElementById('inputSection'),
        referralCodeInput: document.getElementById('referralCode'),
        codeDisplay: document.getElementById('codeDisplay'),
        referralCountDisplay: document.getElementById('referralCount'),
        balanceDisplay: document.getElementById('balance'),
      };
  
      this.activeModals = new Set();
      this.initializeEventListeners();
    }
  
    // Initialize event listeners
    initializeEventListeners() {
      document.addEventListener('DOMContentLoaded', () => {
        this.validateElements();
      });
  
      // Close modals on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeAllModals();
      });
    }
  
    // Validate elements
    validateElements() {
      Object.entries(this.elements).forEach(([key, element]) => {
        if (!element) {
          console.error(`Element not found: ${key}`);
        }
      });
    }
  
    // Show dashboard
    async showDashboard() {
      try {
        const code = this.elements.referralCodeInput.value.trim();
        if (!code) {
          throw new Error('Please enter a referral code.');
        }
  
        const data = await this.fetchWithRetry(`${config.serverUrl}/refer/count?code=${code}`);
        if (data.count !== undefined) {
          this.updateDashboard(data);
        } else {
          throw new Error('Invalid referral code.');
        }
      } catch (error) {
        this.showErrorModal(error.message);
      }
    }
  
    // Update dashboard
    updateDashboard(data) {
      this.elements.codeDisplay.textContent = data.code;
      this.elements.referralCountDisplay.textContent = data.count;
      this.elements.balanceDisplay.textContent = this.calculateBalance(data.count);
  
      this.elements.dashboard.classList.remove('hidden');
      this.elements.inputSection.classList.add('hidden');
  
      this.showSuccessModal('Dashboard updated successfully!');
    }
  
    // Calculate balance
    calculateBalance(count) {
      return (count * 50).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    }
  
    // Create new code
    async createNewCode() {
      try {
        const newCode = this.generateSecureCode();
        const data = await this.fetchWithRetry(`${config.serverUrl}/refer/save?code=${newCode}`);
  
        this.elements.referralCodeInput.value = data.code;
        this.showSuccessModal(`New referral code created: ${data.code}`);
  
        // Copy to clipboard
        await navigator.clipboard.writeText(data.code);
        this.showSuccessModal('Code copied to clipboard!');
      } catch (error) {
        this.showErrorModal('Error creating referral code. Please try again.');
      }
    }
  
    // Reset count
    async resetCount() {
      try {
        const code = this.elements.codeDisplay.textContent;
        const data = await this.fetchWithRetry(`${config.serverUrl}/refer/reset?code=${code}`);
  
        this.elements.referralCountDisplay.textContent = '0';
        this.elements.balanceDisplay.textContent = this.calculateBalance(0);
  
        this.showSuccessModal(data.message);
      } catch (error) {
        this.showErrorModal('Error resetting referral count.');
      }
    }
  
    // Generate secure code
    generateSecureCode() {
      const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return Array.from(crypto.getRandomValues(new Uint8Array(config.codeLength)))
        .map((x) => charset[x % charset.length])
        .join('');
    }
  
    // Fetch with retry
    async fetchWithRetry(url, attempt = 1) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        if (attempt < config.retryAttempts) {
          await new Promise((resolve) => setTimeout(resolve, config.retryDelay * attempt));
          return this.fetchWithRetry(url, attempt + 1);
        }
        throw error;
      }
    }
  
    // Show error modal
    showErrorModal(message) {
      this.showModal(message, 'error-modal');
    }
  
    // Show success modal
    showSuccessModal(message) {
      this.showModal(message, 'success-modal');
    }
  
    // Show modal
    showModal(message, type) {
      const modal = document.createElement('div');
      modal.className = `modal ${type}`;
      modal.innerHTML = `
      <div class='modal-content'>
      <p>${message}</p>
      <button onclick='dashboardManager.closeModal(this)'>OK</button>
    </div>
  `;

  document.body.appendChild(modal);
  this.activeModals.add(modal);

  // Force reflow for animation
  modal.offsetHeight;
  modal.classList.add('show');

  // Auto-close success modals
  if (type === 'success-modal') {
    setTimeout(() => this.closeModal(modal), config.modalDuration);
  }
}

// Close modal
closeModal(element) {
  const modal = element.closest?.('.modal') || element;
  modal.classList.remove('show');
  setTimeout(() => {
    modal.remove();
    this.activeModals.delete(modal);
  }, 300);
}

// Close all modals
closeAllModals() {
  this.activeModals.forEach((modal) => this.closeModal(modal));
}
}

// Initialize dashboard manager
const dashboardManager = new DashboardManager();

// Export for global access
window.dashboardManager = dashboardManager;