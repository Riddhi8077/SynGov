'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ClientInteractions() {
  const pathname = usePathname()

  useEffect(() => {
    // Delay slightly to ensure DOM is ready
    const timer = setTimeout(() => {
      // 1. Reveal Animations
      const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      revealElements.forEach(el => revealObserver.observe(el));

      // 2. Parallax
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      let ticking = false;
      const updateParallax = () => {
        const scrollY = window.scrollY;
        parallaxElements.forEach(el => {
          const speed = parseFloat(el.getAttribute('data-parallax') || '0.3');
          if (el.parentElement) {
            const rect = el.parentElement.getBoundingClientRect();
            const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
            (el as HTMLElement).style.transform = `translateY(${-offset}px)`;
          }
        });
        ticking = false;
      };
      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      // 3. Count-Up
      const counters = document.querySelectorAll('[data-count]');
      const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target as HTMLElement);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      counters.forEach(el => countObserver.observe(el));

      function animateCount(el: HTMLElement) {
        const target = el.getAttribute('data-count') || '';
        const duration = 1200;
        const start = performance.now();
        const numericMatch = target.match(/^([<>]?\s?)(\d+\.?\d*)/);
        
        if (!numericMatch) {
          el.textContent = target;
          return;
        }
        
        const prefix = numericMatch[1] || '';
        const endValue = parseFloat(numericMatch[2]);
        const suffix = target.replace(numericMatch[0], '');
        const isDecimal = target.includes('.');
        
        function step(timestamp: number) {
          const elapsed = timestamp - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * endValue;
          
          if (isDecimal) {
            el.textContent = prefix + current.toFixed(1) + suffix;
          } else {
            el.textContent = prefix + Math.round(current) + suffix;
          }
          
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        }
        requestAnimationFrame(step);
      }

      // 4. Marquee cloning
      const tracks = document.querySelectorAll('.marquee-track');
      tracks.forEach(track => {
        if (track.getAttribute('data-cloned')) return;
        track.setAttribute('data-cloned', 'true');
        const children = Array.from(track.children);
        children.forEach(child => {
          const clone = child.cloneNode(true);
          track.appendChild(clone);
        });
      });
      
      // Store cleanup function on window to prevent memory leaks during HMR
      (window as any)._cleanupInteractions = () => {
        revealObserver.disconnect();
        countObserver.disconnect();
        window.removeEventListener('scroll', onScroll);
      }

    }, 100);

    return () => {
      clearTimeout(timer);
      if ((window as any)._cleanupInteractions) {
        (window as any)._cleanupInteractions();
      }
    };
  }, [pathname]);

  return null;
}
