        // Run `fn` once the DOM is parsed. Under Next.js this script is loaded by the
        // framework's script loader, which can run it AFTER DOMContentLoaded has already
        // fired — in which case a plain addEventListener('DOMContentLoaded', ...) would
        // never trigger. This guard runs `fn` immediately when the DOM is already ready.
        function onDomReady(fn) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', fn);
            } else {
                fn();
            }
        }

        // Main app class to handle all functionality
        class DevForgeSite {
            constructor() {
                // Initialize state
                this.ticking = false;
                this.currentStep = 0;
                this.scrollHandlers = new Set();
                
                // Cache DOM elements and initialize
                this.init();
            }

            init() {
                // Cache DOM elements
                this.cacheElements();
                
                // Initialize components
                this.initializeAOS();
                this.initializeSmoothScroll();
                this.initializeNav();
                this.initializeRevealEffects();
                this.initializeStepper();
                this.initializeTestimonials();
                this.initializeModal();
                this.initializeScreenAnimation();
                this.initializeIframeEvents();
                
                // Setup unified scroll/resize handler
                this.setupEventListeners();
            }

            cacheElements() {
                this.nav = document.getElementById('main-nav');
                this.content = document.getElementById('content');
                this.stepsContainer = document.querySelector('.steps-container');
                this.steps = this.stepsContainer?.querySelectorAll('.stepper-step');
                this.progressFill = document.querySelector('.progress-fill');
                this.preFormContent = document.querySelector('.pre-form-content');
                this.iframeContainer = document.querySelector('#iframe-container');
                this.contactSection = document.querySelector('#contact .stepper-container');
            }

            initializeAOS() {
                AOS.init({
                    duration: 800,
                    offset: 50,
                    once: true
                });
            }

            initializeSmoothScroll() {
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', e => {
                        e.preventDefault();
                        document.querySelector(e.target.getAttribute('href'))?.scrollIntoView({ 
                            behavior: 'smooth' 
                        });
                    });
                });
            }

            initializeNav() {
                const handleNav = () => {
                    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                    const triggerPoint = this.content.offsetTop - 120;
                    this.nav.classList.toggle('sticky', scrollPosition >= triggerPoint);
                };
                
                this.scrollHandlers.add(handleNav);
                handleNav(); // Initial check
            }

            initializeRevealEffects() {
                const isElementInCenter = (element) => {
                    if (!element) return false;
                    const rect = element.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    const elementCenter = rect.top + (rect.height / 2);
                    const viewportCenter = viewportHeight / 2;
                    const threshold = viewportHeight / 3;
                    return Math.abs(elementCenter - viewportCenter) < threshold;
                };

                const handleReveal = () => {
                    // Handle service cards
                    const cards = document.querySelectorAll('.service-card');
                    const viewportCenter = window.innerHeight / 2;
                    
                    let closestDistance = Infinity;
                    cards.forEach(card => {
                        const rect = card.getBoundingClientRect();
                        const cardCenter = rect.top + (rect.height / 2);
                        const distance = Math.abs(viewportCenter - cardCenter);
                        closestDistance = Math.min(closestDistance, distance);
                    });

                    cards.forEach(card => {
                        const rect = card.getBoundingClientRect();
                        const cardCenter = rect.top + (rect.height / 2);
                        const distance = Math.abs(viewportCenter - cardCenter);
                        card.classList.toggle('reveal', 
                            Math.abs(distance - closestDistance) <= 20 && 
                            distance < window.innerHeight / 3
                        );
                    });

                    // Handle project rows
                    document.querySelectorAll('.grid-row').forEach(row => {
                        row.classList.toggle('reveal', isElementInCenter(row));
                    });

                    // Handle contact section
                    if (this.contactSection) {
                        this.contactSection.classList.toggle('reveal', isElementInCenter(this.contactSection));
                    }

                    // Handle cards container
                    const cardsContainer = document.querySelector('.cards-container');
                    if (cardsContainer) {
                        const isInCenter = isElementInCenter(cardsContainer);
                        
                        // Handle stepper container
                        const stepperContainer = cardsContainer.querySelector('.stepper-container');
                        if (stepperContainer) {
                            stepperContainer.classList.toggle('reveal', isInCenter);
                        }
                        
                        // Handle testimonials container
                        const testimonialsContainer = cardsContainer.querySelector('.testimonials-container');
                        if (testimonialsContainer) {
                            testimonialsContainer.classList.toggle('reveal', isInCenter);
                        }
                    }
                };

                this.scrollHandlers.add(handleReveal);
                handleReveal(); // Initial check
            }

            initializeStepper() {
                if (!this.stepsContainer) return;

                const updateProgress = () => {
                    const progress = ((this.currentStep + 1) / this.steps.length) * 100;
                    this.progressFill.style.width = `${progress}%`;
                };

                const goToStep = (stepIndex) => {
                    this.steps[this.currentStep].classList.remove('active');
                    this.steps[stepIndex].classList.add('active');
                    this.currentStep = stepIndex;
                    updateProgress();
                };

                const createAndShowForm = () => {
                    const modal = document.getElementById('contact-modal');
                    const iframeContainer = document.getElementById('iframe-container');
                    
                    // Clear any existing iframe
                    iframeContainer.innerHTML = '';
                    
                    const iframe = document.createElement('iframe');
                    Object.assign(iframe, {
                        className: 'form-iframe',
                        src: 'https://dealflow.tracerlabs.io/lead-intake',
                        loading: 'lazy',
                        width: '100%',
                        height: '100%',
                        style: 'border: none; position: absolute; top: 0; left: 0;'
                    });
                    
                    const attributes = {
                        sandbox: 'allow-same-origin allow-scripts allow-popups allow-forms',
                        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                        allowfullscreen: '',
                        'aria-labelledby': 'contact-heading',
                        scrolling: 'yes'
                    };
                    
                    Object.entries(attributes).forEach(([key, value]) => iframe.setAttribute(key, value));
                    
                    iframeContainer.appendChild(iframe);
                    
                    // Lock body scroll and show modal
                    this.lockBodyScroll();
                    modal.style.display = 'block';
                    
                    // Hide stepper buttons
                    this.stepsContainer.querySelectorAll('.stepper-button')
                        .forEach(button => button.style.display = 'none');
                };

                // Add click handlers
                this.steps.forEach((step, index) => {
                    const nextBtn = step.querySelector('.next-btn');
                    const backBtn = step.querySelector('.back-btn');
                    const startBtn = step.querySelector('.start-btn');

                    nextBtn?.addEventListener('click', () => goToStep(index + 1));
                    backBtn?.addEventListener('click', () => goToStep(index - 1));
                    startBtn?.addEventListener('click', createAndShowForm);
                });

                updateProgress(); // Initialize progress bar
            }

            initializeModal() {
                const modal = document.getElementById('contact-modal');
                const closeBtn = document.querySelector('.modal-close');
                
                const closeModal = () => {
                    modal.style.display = 'none';
                    // Unlock body scroll when modal closes
                    this.unlockBodyScroll();
                    // Restore stepper buttons when modal closes
                    if (this.stepsContainer) {
                        this.stepsContainer.querySelectorAll('.stepper-button')
                            .forEach(button => button.style.display = '');
                    }
                };
                
                // Close modal when clicking the X button
                closeBtn?.addEventListener('click', closeModal);
                
                // Close modal when clicking outside of it
                window.addEventListener('click', (event) => {
                    if (event.target === modal) {
                        closeModal();
                    }
                });
                
                // Close modal with Escape key
                document.addEventListener('keydown', (event) => {
                    if (event.key === 'Escape' && modal.style.display === 'block') {
                        closeModal();
                    }
                });
            }

            lockBodyScroll() {
                // Store current scroll position
                this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                
                // Apply styles to prevent scrolling
                document.body.style.position = 'fixed';
                document.body.style.top = `-${this.scrollPosition}px`;
                document.body.style.width = '100%';
                document.body.style.overflow = 'hidden';
                
                // Prevent touch scrolling on mobile
                document.body.style.touchAction = 'none';
            }

            unlockBodyScroll() {
                // Remove fixed positioning
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                document.body.style.touchAction = '';
                
                // Restore scroll position
                if (this.scrollPosition !== undefined) {
                    window.scrollTo(0, this.scrollPosition);
                    this.scrollPosition = undefined;
                }
            }

            initializeIframeEvents() {
                // Security: Define allowed origins
                const ALLOWED_ORIGINS = [
                    'https://dealflow.tracerlabs.io',
                    'http://localhost:3001' // For development
                ];

                // Listen for messages from the iframe
                window.addEventListener('message', (event) => {
                    // Security: Verify origin
                    if (!ALLOWED_ORIGINS.includes(event.origin)) {
                        console.warn('Blocked message from untrusted origin:', event.origin);
                        return;
                    }

                    // Handle terminal events
                    if (event.data && event.data.type === 'terminalEvent') {
                        this.handleTerminalEvent(event.data);
                    }
                });
            }

            handleTerminalEvent(data) {
                console.log('Terminal event received:', data);

                switch(data.eventType) {
                    case 'close':
                        this.handleTerminalClose();
                        break;
                    case 'minimize':
                        this.handleTerminalMinimize();
                        break;
                    case 'maximize':
                        this.handleTerminalMaximize();
                        break;
                }
            }

            handleTerminalClose() {
                // Close the modal
                const modal = document.getElementById('contact-modal');
                modal.style.display = 'none';
                
                // Unlock body scroll
                this.unlockBodyScroll();
                
                // Reset stepper to initial state
                this.resetStepperToInitialState();
                
                // Show stepper buttons again
                if (this.stepsContainer) {
                    this.stepsContainer.querySelectorAll('.stepper-button')
                        .forEach(button => button.style.display = '');
                }
            }

            handleTerminalMinimize() {
                // Hide the modal
                const modal = document.getElementById('contact-modal');
                modal.style.display = 'none';
                
                // Unlock body scroll
                this.unlockBodyScroll();
                
                // Show floating chat button
                this.showFloatingChatButton();
                
                // Note: We don't change the iframe's internal state
                // The iframe keeps its conversation and normal display state
            }

            handleTerminalMaximize() {
                // For now, just ensure fullscreen behavior
                const modal = document.getElementById('contact-modal');
                const iframe = modal.querySelector('iframe');
                
                if (iframe) {
                    iframe.style.height = '100vh';
                    iframe.style.width = '100vw';
                }
            }

            resetStepperToInitialState() {
                // Reset to step 1
                this.currentStep = 0;
                
                // Update step visibility
                if (this.steps) {
                    this.steps.forEach((step, index) => {
                        step.classList.toggle('active', index === 0);
                    });
                }
                
                // Reset progress bar
                if (this.progressFill) {
                    this.progressFill.style.width = '33.33%'; // First step
                }
            }

            showFloatingChatButton() {
                // Remove existing floating button if any
                const existingButton = document.getElementById('floating-chat-button');
                if (existingButton) {
                    existingButton.remove();
                }

                // Create floating chat button
                const floatingButton = document.createElement('div');
                floatingButton.id = 'floating-chat-button';
                floatingButton.innerHTML = `
                    <div class="floating-chat-content">
                        <span class="chat-icon">💬</span>
                        <span class="chat-text">Chat</span>
                    </div>
                `;
                
                // Add click handler to restore terminal
                floatingButton.addEventListener('click', () => {
                    this.restoreTerminal();
                });
                
                // Add to body
                document.body.appendChild(floatingButton);
            }

            restoreTerminal() {
                // Remove floating button
                const floatingButton = document.getElementById('floating-chat-button');
                if (floatingButton) {
                    floatingButton.remove();
                }

                // Show modal again
                const modal = document.getElementById('contact-modal');
                modal.style.display = 'block';
                
                // Lock body scroll
                this.lockBodyScroll();
                
                // Send restore message to iframe to ensure it's in normal state
                this.sendMessageToIframe('restore');
            }

            sendMessageToIframe(messageType, data = null) {
                const modal = document.getElementById('contact-modal');
                const iframe = modal.querySelector('iframe');
                
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'parentMessage',
                        messageType: messageType,
                        data: data,
                        timestamp: new Date().toISOString()
                    }, 'https://dealflow.tracerlabs.io');
                }
            }

            initializeTestimonials() {
                const slides = document.querySelectorAll('.testimonial-slide');
                // Testimonials section was componentized away (React CTA). No slides → no-op
                // so the 5s auto-advance interval doesn't run modulo-zero and throw.
                if (!slides.length) return;
                const dots = document.querySelectorAll('.nav-dot');
                let currentSlide = 0;

                const showSlide = (index) => {
                    // Remove active class from all slides and dots
                    slides.forEach(slide => slide.classList.remove('active'));
                    dots.forEach(dot => dot.classList.remove('active'));
                    
                    // Add active class to current slide and dot
                    slides[index].classList.add('active');
                    dots[index].classList.add('active');
                };

                const nextSlide = () => {
                    currentSlide = (currentSlide + 1) % slides.length;
                    showSlide(currentSlide);
                };

                // Add click handlers to dots
                dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => {
                        currentSlide = index;
                        showSlide(currentSlide);
                    });
                });

                // Auto-advance slides every 5 seconds
                setInterval(nextSlide, 5000);
            }

            initializeScreenAnimation() {
                new ScreenAnimation();
            }

            setupEventListeners() {
                const handleScroll = () => {
                    if (!this.ticking) {
                        requestAnimationFrame(() => {
                            this.scrollHandlers.forEach(handler => handler());
                            this.ticking = false;
                        });
                        this.ticking = true;
                    }
                };

                window.addEventListener('scroll', handleScroll, { passive: true });
                window.addEventListener('resize', handleScroll, { passive: true });
            }
        }

        class ScreenAnimation {
            constructor() {
                this.canvas = document.getElementById('screen-canvas');
                if (!this.canvas) return;
                
                this.ctx = this.canvas.getContext('2d');
                this.particles = [];
                this.time = 0;
                this.message = "Follow the red buttons";
                this.isRunning = false;
                
                // Instead of detecting the theme here, we'll do it in init()
                this.isLightMode = false;
                this.transitionProgress = 1; // 0 to 1 for transition
                this.transitionDuration = 500; // milliseconds
                this.transitionStartTime = 0;
                this.previousMode = false;
                
                this.init();
            }
            
            init() {
                // Get the current theme state from the checkbox
                const checkbox = document.getElementById('theme-toggle-checkbox');
                this.isLightMode = checkbox ? !checkbox.checked : false;
                
                this.setupCanvas();
                this.createParticles();
                this.start();
                
                // Handle resize with debounce
                let resizeTimeout;
                window.addEventListener('resize', () => {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(() => {
                        this.setupCanvas();
                        this.createParticles();
                    }, 250);
                });
                
                // Listen for theme changes
                document.getElementById('theme-toggle-checkbox').addEventListener('change', (e) => {
                    this.updateTheme(!e.target.checked);
                });
                
                // Also listen for the custom event
                document.addEventListener('themeChanged', (e) => {
                    if (e.detail && e.detail.isLightMode !== undefined) {
                        this.updateTheme(e.detail.isLightMode);
                    }
                });
            }
            
            // Update the updateTheme method to start transition
            updateTheme(isLightMode) {
                if (this.isLightMode !== isLightMode) {
                    this.previousMode = this.isLightMode;
                    this.isLightMode = isLightMode;
                    this.transitionStartTime = Date.now();
                    this.transitionProgress = 0;
                    
                    // Still recreate particles to match new theme
                    this.createParticles();
                }
            }
            
            setupCanvas() {
                // Get the device pixel ratio
                const dpr = window.devicePixelRatio || 1;
                
                // Get the size of the canvas in CSS pixels
                const rect = this.canvas.getBoundingClientRect();
                
                // Set the canvas size accounting for DPI
                this.canvas.width = rect.width * dpr;
                this.canvas.height = rect.height * dpr;
                
                // Scale the context to ensure correct drawing operations
                this.ctx.scale(dpr, dpr);
                
                // Set the canvas style width and height
                this.canvas.style.width = `${rect.width}px`;
                this.canvas.style.height = `${rect.height}px`;
                
                // Store the actual drawing dimensions
                this.drawWidth = rect.width;
                this.drawHeight = rect.height;
                
                // Set text properties
                const fontSize = Math.min(rect.width / 30, 16); // Reduced font size
                this.ctx.font = `${fontSize}px 'Plus Jakarta Sans', sans-serif`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
            }
            
            createParticles() {
                const particleCount = Math.floor((this.drawWidth * this.drawHeight) / 20000);
                this.particles = Array.from({ length: particleCount }, 
                    () => new Particle(this.canvas, this.drawWidth, this.drawHeight, this.isLightMode)
                );
            }
            
            start() {
                if (this.isRunning) return;
                this.isRunning = true;
                this.animate();
            }
            
            animate() {
                if (!this.isRunning) return;
                
                this.time += 0.016;
                
                // Handle transition if in progress
                if (this.transitionProgress < 1) {
                    const elapsed = Date.now() - this.transitionStartTime;
                    this.transitionProgress = Math.min(elapsed / this.transitionDuration, 1);
                }
                
                // Clear canvas with transitioning background color
                const ctx = this.ctx;
                
                if (this.transitionProgress < 1) {
                    // During transition, blend colors
                    const startColor = this.previousMode ? [255, 255, 255] : [0, 0, 0];
                    const endColor = this.isLightMode ? [255, 255, 255] : [0, 0, 0];
                    
                    // Calculate blended color
                    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * this.transitionProgress);
                    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * this.transitionProgress);
                    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * this.transitionProgress);
                    
                    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                } else {
                    // After transition completed
                    ctx.fillStyle = this.isLightMode ? '#ffffff' : 'black';
                }
                
                ctx.fillRect(0, 0, this.drawWidth, this.drawHeight);
                
                // Draw particles with appropriate opacity
                this.particles.forEach(particle => {
                    particle.update();
                    particle.draw(ctx, this.isLightMode ? 0.5 : 0.3);
                });
                
                // Draw scan lines
                this.drawScanLines();
                
                // Draw text with glow effect
                this.drawText();
                
                requestAnimationFrame(() => this.animate());
            }
            
            drawScanLines() {
                this.ctx.strokeStyle = this.isLightMode ? 
                    'rgba(231, 2, 141, 0.03)' : 
                    'rgba(231, 2, 141, 0.05)';
                this.ctx.lineWidth = 1;
                
                this.ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const y = (this.time * 30 + i * 30) % this.drawHeight;
                    this.ctx.moveTo(0, y);
                    this.ctx.lineTo(this.drawWidth, y);
                }
                this.ctx.stroke();
            }
            
            drawText() {
                // Add strong glow effect
                this.ctx.shadowColor = this.isLightMode ? 
                    'rgba(0, 0, 0, 0.5)' : 
                    'rgba(255, 255, 255, 0.8)';
                this.ctx.shadowBlur = 8;
                this.ctx.lineWidth = 1;
                
                // Draw text
                this.ctx.fillStyle = this.isLightMode ? '#333333' : 'white';
                this.ctx.fillText(
                    this.message,
                    this.drawWidth / 2,
                    this.drawHeight / 2
                );
                
                // Reset shadow
                this.ctx.shadowBlur = 0;
            }
        }

        class Particle {
            constructor(canvas, drawWidth, drawHeight, isLightMode) {
                this.canvas = canvas;
                this.drawWidth = drawWidth;
                this.drawHeight = drawHeight;
                this.isLightMode = isLightMode;
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * this.drawWidth;
                this.y = Math.random() * this.drawHeight;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 1;
                this.speedY = (Math.random() - 0.5) * 1;
                
                // Choose colors based on theme
                if (this.isLightMode) {
                    this.color = Math.random() > 0.5 ? '#E7028D' : '#056AFC'; 
                    // Same colors but they'll be more visible against white
                } else {
                    this.color = Math.random() > 0.5 ? '#E7028D' : '#056AFC';
                }
                
                this.life = 1;
                this.decay = Math.random() * 0.01 + 0.01;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= this.decay;
                
                if (this.life <= 0 || 
                    this.x < 0 || this.x > this.drawWidth || 
                    this.y < 0 || this.y > this.drawHeight) {
                    this.reset();
                }
            }
            
            draw(ctx, opacity = 1) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                const alpha = Math.floor(this.life * 255 * opacity).toString(16).padStart(2, '0');
                ctx.fillStyle = `${this.color}${alpha}`;
                ctx.fill();
            }
        }

        // Standalone funnel pages (e.g. /solar) reuse this bundle but have none of
        // these elements and their own styling — skip all legacy initialization there.
        if (location.pathname.indexOf('/solar') !== 0) {

        // Initialize everything when DOM is ready
        onDomReady(() => new DevForgeSite());


        onDomReady(function() {
            const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
            const themeStylesheet = document.getElementById('theme-stylesheet');
            const logoImage = document.querySelector('.logo-img');
            
            // Check if user has a saved preference
            const savedTheme = localStorage.getItem('theme');
            let isLightMode = savedTheme === 'light';
            
            // Set initial theme and logo
            if (isLightMode) {
                themeStylesheet.href = 'light-mode.css';
                themeToggleCheckbox.checked = false;
                logoImage.src = './assets/logo-light.png'; // Light logo for light mode
            } else {
                // Default to dark if no preference or preference is dark
                themeStylesheet.href = 'style.css';
                themeToggleCheckbox.checked = true;
                logoImage.src = './assets/logo-dark.png'; // Dark logo for dark mode
            }
            
            // Dispatch initial theme state for any components that need it
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('themeChanged', { 
                    detail: { isLightMode: isLightMode } 
                }));
            }, 100);
            
            themeToggleCheckbox.addEventListener('change', function() {
                const isLightMode = !this.checked;
                
                if (!isLightMode) {
                    // Dark mode
                    themeStylesheet.href = 'style.css';
                    localStorage.setItem('theme', 'dark');
                    logoImage.src = './assets/logo-dark.png'; // Dark logo for dark mode
                } else {
                    // Light mode
                    themeStylesheet.href = 'light-mode.css';
                    localStorage.setItem('theme', 'light');
                    logoImage.src = './assets/logo-light.png'; // Light logo for light mode
                }
                
                // Dispatch a custom event with the theme state
                document.dispatchEvent(new CustomEvent('themeChanged', { 
                    detail: { isLightMode: isLightMode } 
                }));
            });
        });

        } // end /solar guard
