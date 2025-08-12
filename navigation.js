// Elker Scribe In-Page Navigation
// Dynamically generates a table of contents based on document headings

(function() {
  'use strict';

  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    generateNavigation();
    handleSearchNavigation();
  });

  function generateNavigation() {
    const container = document.querySelector('.container-narrow');
    if (!container) return;

    // Find all headings
    const title = document.querySelector('h1.scribe-title');
    const sections = document.querySelectorAll('h3.scribe-section');
    
    // If no sections, check for steps (flat structure)
    const steps = document.querySelectorAll('.scribe-step');
    
    // Only create navigation if we have actual section headings
    // Don't create artificial navigation for flat step-by-step guides
    if (sections.length < 2) return;

    // Create navigation container
    const nav = document.createElement('nav');
    nav.className = 'scribe-navigation';
    nav.innerHTML = '<h2 class="nav-title">Contents</h2>';

    const navList = document.createElement('ul');
    navList.className = 'nav-list';

    // Generate IDs and create navigation items
    sections.forEach((section, index) => {
      const text = section.textContent.trim();
      const id = generateId(text, index);
      section.id = id;

      const navItem = createNavItem(text, id);
      navList.appendChild(navItem);
    });

    // Only add navigation if we have items
    if (navList.children.length > 0) {
      nav.appendChild(navList);
      
      // Insert navigation after title but before content
      const scribeContainer = container.querySelector('.scribe-container');
      container.insertBefore(nav, scribeContainer);

      // Add smooth scrolling behavior
      addSmoothScrolling();
      
      // Add active state tracking
      trackActiveSection();
    }
  }

  function generateId(text, index) {
    // Convert text to URL-friendly ID
    let id = text.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single
      .trim();
    
    // Ensure uniqueness
    if (document.getElementById(id)) {
      id = `${id}-${index}`;
    }
    
    return id || `section-${index}`;
  }

  function createNavItem(text, targetId) {
    const li = document.createElement('li');
    li.className = 'nav-item';
    
    const a = document.createElement('a');
    a.href = `#${targetId}`;
    a.className = 'nav-link';
    a.textContent = text;
    
    li.appendChild(a);
    return li;
  }

  function isNaturalBreak(text) {
    // Detect natural section breaks in flat guides
    const breakIndicators = [
      'navigate to',
      'click on',
      'now you',
      'next,',
      'finally',
      'submit',
      'complete'
    ];
    
    const lowerText = text.toLowerCase();
    return breakIndicators.some(indicator => lowerText.includes(indicator));
  }

  function addSmoothScrolling() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          // Calculate offset for fixed header if any
          const offset = 20;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          history.pushState(null, null, `#${targetId}`);
        }
      });
    });
  }

  function trackActiveSection() {
    const sections = document.querySelectorAll('[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveSection() {
      let currentSection = null;
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom > 100) {
          currentSection = section.id;
        }
      });
      
      navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === currentSection) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
    
    // Update on scroll with debouncing
    let scrollTimer;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updateActiveSection, 50);
    });
    
    // Initial update
    updateActiveSection();
  }
  
  function handleSearchNavigation() {
    // Handle navigation from search results
    if (window.location.hash && window.location.hash.includes('#step-')) {
      const hash = window.location.hash;
      const stepMatch = hash.match(/#step-(\d+)/);
      
      if (stepMatch) {
        const stepNumber = parseInt(stepMatch[1]);
        const steps = document.querySelectorAll('.scribe-step');
        
        if (steps[stepNumber - 1]) {
          // Add ID to the step if it doesn't have one
          const step = steps[stepNumber - 1];
          if (!step.id) {
            step.id = `step-${stepNumber}`;
          }
          
          // Highlight the step
          step.style.backgroundColor = 'var(--color-highlight)';
          step.style.transition = 'background-color 0.3s';
          
          // Scroll to the step
          setTimeout(() => {
            step.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
              step.style.backgroundColor = '';
            }, 3000);
          }, 100);
        }
      }
    }
  }
})();