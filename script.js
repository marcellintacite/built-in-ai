document.addEventListener('DOMContentLoaded', () => {
  const stepList = document.getElementById('step-list');
  const contentContainer = document.getElementById('content-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentStepIndex = 0;

  // Initialize
  renderSidebar();
  renderStep(currentStepIndex);
  updateButtons();

  // Event Listeners
  prevBtn.addEventListener('click', () => {
    if (currentStepIndex > 0) {
      currentStepIndex--;
      renderStep(currentStepIndex);
      updateButtons();
      updateSidebarActiveState();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentStepIndex < steps.length - 1) {
      currentStepIndex++;
      renderStep(currentStepIndex);
      updateButtons();
      updateSidebarActiveState();
    }
  });

  function renderSidebar() {
    stepList.innerHTML = '';
    steps.forEach((step, index) => {
      const li = document.createElement('li');
      li.className = `step-item ${index === currentStepIndex ? 'active' : ''}`;
      li.innerHTML = `
        <div class="step-number">${index + 1}</div>
        <div class="step-title">${step.title}</div>
      `;
      li.addEventListener('click', () => {
        currentStepIndex = index;
        renderStep(currentStepIndex);
        updateButtons();
        updateSidebarActiveState();
      });
      stepList.appendChild(li);
    });
  }

  function updateSidebarActiveState() {
    const items = stepList.querySelectorAll('.step-item');
    items.forEach((item, index) => {
      if (index === currentStepIndex) {
        item.classList.add('active');
        // Scroll sidebar to keep active item in view
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  function renderStep(index) {
    const step = steps[index];
    // Fade out effect could be added here
    contentContainer.innerHTML = step.content;
    
    // Initialize copy buttons
    initCopyButtons();
    
    // Scroll to top of content
    contentContainer.scrollTop = 0;
  }

  function updateButtons() {
    prevBtn.disabled = currentStepIndex === 0;
    nextBtn.disabled = currentStepIndex === steps.length - 1;
    
    // Optional: Hide buttons if disabled, similar to original app
    prevBtn.style.visibility = currentStepIndex === 0 ? 'hidden' : 'visible';
    nextBtn.style.visibility = currentStepIndex === steps.length - 1 ? 'hidden' : 'visible';
  }

  function initCopyButtons() {
    const copyButtons = contentContainer.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
      button.addEventListener('click', () => {
        const pre = button.closest('pre');
        const code = pre.querySelector('code').textContent;
        
        navigator.clipboard.writeText(code).then(() => {
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
      });
    });
  }
});
