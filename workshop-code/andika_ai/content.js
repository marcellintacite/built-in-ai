/**
 * Content Script - AI Rewrite Button
 * Injects icon-only button with tooltip for text inputs
 * Only runs when user activates the extension (privacy-first)
 */

// Prevent duplicate injection
if (!window.andikaAIInjected) {
  window.andikaAIInjected = true;
  console.log("✨ Andika AI content script loaded");

  (function () {
    "use strict";

    let activeInput = null;
    let rewriteBtn = null;
    let tooltip = null;

    /**
     * Create the AI button with icon only
     */
    function createButton() {
      const btn = AndikaUtils.createElement(
        "button",
        {
          className: "andika-ai-btn",
          "aria-label": "Rewrite with AI",
        },
        `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" fill="currentColor"/>
      </svg>
    `,
      );

      document.body.appendChild(btn);

      btn.addEventListener("mousedown", async (e) => {
        e.preventDefault();
        if (activeInput) {
          await handleRewrite(activeInput);
        }
      });

      // Show tooltip on hover
      btn.addEventListener("mouseenter", showTooltip);
      btn.addEventListener("mouseleave", hideTooltip);

      return btn;
    }

    /**
     * Create tooltip element
     */
    function createTooltip() {
      const tip = AndikaUtils.createElement(
        "div",
        {
          className: "andika-ai-tooltip",
        },
        "Rewrite with AI",
      );

      document.body.appendChild(tip);
      return tip;
    }

    /**
     * Show tooltip
     */
    function showTooltip() {
      if (!tooltip) tooltip = createTooltip();
      if (!rewriteBtn) return;

      const btnRect = rewriteBtn.getBoundingClientRect();
      tooltip.style.top = `${window.scrollY + btnRect.top - 35}px`;
      tooltip.style.left = `${window.scrollX + btnRect.left + btnRect.width / 2}px`;
      tooltip.classList.add("visible");
    }

    /**
     * Hide tooltip
     */
    function hideTooltip() {
      if (tooltip) {
        tooltip.classList.remove("visible");
      }
    }

    /**
     * Update button position relative to input
     */
    function updateButtonPosition(input) {
      if (!rewriteBtn) return;

      const pos = AndikaUtils.getElementPosition(input);
      rewriteBtn.style.top = `${pos.top - 45}px`;
      rewriteBtn.style.left = `${pos.right - 40}px`;

      requestAnimationFrame(() => {
        rewriteBtn.classList.add("visible");
      });
    }

    /**
     * Check if element is editable (input, textarea, or contenteditable)
     */
    function isEditableElement(element) {
      // Check for contenteditable
      if (element.isContentEditable) return true;

      // Check for regular text inputs
      return AndikaUtils.isTextInput(element);
    }

    /**
     * Get text content from element
     */
    function getTextContent(element) {
      if (element.isContentEditable) {
        return element.textContent || element.innerText || "";
      }
      return element.value || "";
    }

    /**
     * Set text content to element
     */
    function setTextContent(element, text) {
      if (element.isContentEditable) {
        element.textContent = text;
      } else {
        element.value = text;
      }
    }

    /**
     * Handle input focus
     */
    document.addEventListener("focusin", (e) => {
      const target = e.target;
      if (isEditableElement(target)) {
        activeInput = target;
        if (!rewriteBtn) rewriteBtn = createButton();
        updateButtonPosition(target);
      }
    });

    /**
     * Handle input blur
     */
    document.addEventListener("focusout", () => {
      setTimeout(() => {
        if (rewriteBtn && activeInput !== document.activeElement) {
          rewriteBtn.classList.remove("visible");
          hideTooltip();
          activeInput = null;
        }
      }, 200);
    });

    /**
     * Handle rewrite action
     */
    async function handleRewrite(inputElement) {
      const originalText = getTextContent(inputElement);

      // Update button to loading state
      rewriteBtn.classList.add("thinking");
      hideTooltip();
      const originalHTML = rewriteBtn.innerHTML;
      rewriteBtn.innerHTML = `
      <svg class="spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"></circle>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    `;

      try {
        if (originalText.trim().length > 0) {
          // Rewrite existing text
          const result = await AndikaAI.rewriteText(originalText);
          setTextContent(inputElement, result);
        } else {
          // Generate new text
          const userPrompt = prompt("What would you like to write about?");
          if (!userPrompt) return;

          // Get settings from background script (since content scripts can't access chrome.storage)
          const options = await new Promise((resolve) => {
            chrome.runtime.sendMessage(
              { action: "getSettings" },
              (settings) => {
                resolve({
                  tone: settings.tone,
                  format: settings.format,
                  length: settings.length,
                  sharedContext: settings.sharedContext,
                  inputLanguages: settings.inputLanguages || ["en", "es", "ja"],
                  outputLanguage: settings.outputLanguage || "auto",
                });
              },
            );
          });

          setTextContent(inputElement, "");
          await AndikaAI.writeText(userPrompt, options, (chunk) => {
            const currentText = getTextContent(inputElement);
            setTextContent(inputElement, currentText + chunk);
          });
        }
      } catch (error) {
        console.error("Andika AI Error:", error);
        alert(`AI Error: ${error.message}`);
      } finally {
        rewriteBtn.classList.remove("thinking");
        rewriteBtn.innerHTML = originalHTML;
      }
    }
  })();
} // End of duplicate injection check
