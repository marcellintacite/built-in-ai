/**
 * Utility Functions
 * Exposed as global AndikaUtils object
 */

const AndikaUtils = (function() {
  'use strict';

  /**
   * Debounce function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Create a DOM element with attributes
   */
  function createElement(tag, attributes = {}, innerHTML = '') {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else {
        element.setAttribute(key, value);
      }
    });
    if (innerHTML) {
      element.innerHTML = innerHTML;
    }
    return element;
  }

  /**
   * Get element position relative to viewport
   */
  function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: window.scrollY + rect.top,
      left: window.scrollX + rect.left,
      right: window.scrollX + rect.right,
      bottom: window.scrollY + rect.bottom,
      width: rect.width,
      height: rect.height,
    };
  }

  /**
   * Check if element is a text input
   */
  function isTextInput(element) {
    if (element.tagName === 'TEXTAREA') return true;
    if (element.tagName === 'INPUT') {
      const type = element.type.toLowerCase();
      return ['text', 'search', 'email', 'url', 'tel'].includes(type);
    }
    return false;
  }

  // Public API
  return {
    debounce,
    createElement,
    getElementPosition,
    isTextInput,
  };
})();
