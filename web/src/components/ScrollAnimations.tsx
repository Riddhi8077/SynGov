'use client'

import { useEffect } from 'react'

export default function ScrollAnimations() {
  useEffect(() => {
    // Setup intersection observer for reveal animations
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
    
    // Count up animation
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          if (target.classList.contains('counted')) return;
          
          target.classList.add('counted');
          const finalValue = parseFloat(target.getAttribute('data-value') || '0');
          const duration = 2000;
          const steps = 60;
          const stepValue = finalValue / steps;
          let current = 0;
          
          const timer = setInterval(() => {
            current += stepValue;
            if (current >= finalValue) {
              clearInterval(timer);
              target.textContent = finalValue % 1 === 0 ? finalValue.toString() : finalValue.toFixed(1);
            } else {
              target.textContent = Math.floor(current).toString();
            }
          }, duration / steps);
        }
      });
    });

    stats.forEach(stat => statsObserver.observe(stat));

    return () => {
      revealObserver.disconnect();
      statsObserver.disconnect();
    }
  }, []);

  return null;
}
