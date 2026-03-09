// ============================================
// Preloader
// ============================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    }
});

// ============================================
// Animated Thread Background for Hero Section
// ============================================
const canvas = document.getElementById('threadCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let mouse = { x: null, y: null, radius: 150 };

    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initParticles();
    }

    // Particle class for threads
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = (Math.random() - 0.5) * 1.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            // Move particles
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off walls
            if (this.x > canvas.width || this.x < 0) {
                this.speedX *= -1;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY *= -1;
            }

            // Mouse interaction - particles move away from mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    this.x += directionX * force * 3;
                    this.y += directionY * force * 3;
                }
            }
        }

        draw() {
            ctx.fillStyle = `rgba(255, 152, 0, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Initialize particles
    function initParticles() {
        particles = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    // Connect particles with threads
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.3;
                    ctx.strokeStyle = `rgba(255, 152, 0, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw threads between particles
        connectParticles();

        animationFrameId = requestAnimationFrame(animate);
    }

    // Mouse move event
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    // Mouse leave event
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Initialize
    resizeCanvas();
    animate();

    // Resize handler
    window.addEventListener('resize', resizeCanvas);

    // Cleanup on visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrameId);
        } else {
            animate();
        }
    });
}

// ============================================
// Mobile Navigation Toggle
// ============================================
// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    let current = '';
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - navbarHeight - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form Submission with Formspree
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(contactForm);
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                formStatus.style.display = 'block';
                formStatus.style.background = 'rgba(76, 175, 80, 0.2)';
                formStatus.style.color = '#4caf50';
                formStatus.style.border = '1px solid #4caf50';
                formStatus.textContent = '✅ Thank you! Your message has been sent successfully.';
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Error
            formStatus.style.display = 'block';
            formStatus.style.background = 'rgba(244, 67, 54, 0.2)';
            formStatus.style.color = '#f44336';
            formStatus.style.border = '1px solid #f44336';
            formStatus.textContent = '❌ Oops! Something went wrong. Please email me directly at kashishnankani996@gmail.com';
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            
            // Hide status after 5 seconds
            setTimeout(() => {
                if (formStatus) formStatus.style.display = 'none';
            }, 5000);
        }
    });
}

// Contact Form (Modal) Submission with Formspree
const contactFormModal = document.getElementById('contactFormModal');
const formStatusModal = document.getElementById('form-status-modal');

if (contactFormModal) {
    contactFormModal.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactFormModal.querySelector('button[type="submit"]');
        const formData = new FormData(contactFormModal);
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            const response = await fetch(contactFormModal.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                formStatusModal.style.display = 'block';
                formStatusModal.style.background = 'rgba(76, 175, 80, 0.2)';
                formStatusModal.style.color = '#4caf50';
                formStatusModal.style.border = '1px solid #4caf50';
                formStatusModal.textContent = '✅ Thank you! Your message has been sent successfully.';
                contactFormModal.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Error
            formStatusModal.style.display = 'block';
            formStatusModal.style.background = 'rgba(244, 67, 54, 0.2)';
            formStatusModal.style.color = '#f44336';
            formStatusModal.style.border = '1px solid #f44336';
            formStatusModal.textContent = '❌ Oops! Something went wrong. Please email me directly at kashishnankani996@gmail.com';
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            
            // Hide status after 5 seconds
            setTimeout(() => {
                if (formStatusModal) formStatusModal.style.display = 'none';
            }, 5000);
        }
    });
}

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections, cards, and timeline items
document.querySelectorAll('section, .skill-card, .portfolio-item, .timeline-item, .testimonial-card').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// Skill Bars Animation
// ============================================
const skillBars = document.querySelectorAll('.skill-progress');
let skillsAnimated = false;

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
            // Animate all skill bars when skills section comes into view
            skillBars.forEach((bar, index) => {
                setTimeout(() => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = progress + '%';
                }, index * 100); // Stagger animation by 100ms per bar
            });
            skillsAnimated = true;
        }
    });
}, { threshold: 0.3 });

// Observe skills section
const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Typing Effect for Hero Title (Optional Enhancement)
const heroTitle = document.querySelector('.hero-title');

// ============================================
// Animated Counter for Stats Section
// ============================================
const statsSection = document.querySelector('.stats');
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 50; // Adjust speed here
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                // Handle decimal values for GPA
                if (target < 10) {
                    stat.textContent = target.toFixed(1);
                } else {
                    stat.textContent = target;
                }
            }
        };
        
        updateCounter();
    });
    
    statsAnimated = true;
}

// Observe stats section for animation trigger
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Typing Effect for Hero Title (Optional Enhancement)
const heroTitleTyping = document.querySelector('.hero-title');

// ============================================
// Scroll to Top Button
// ============================================
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// Skills Modal
// ============================================
const viewMoreSkillsBtn = document.getElementById('viewMoreSkills');
const skillsModal = document.getElementById('skillsModal');
const closeModalBtn = document.getElementById('closeModal');

// Open modal
if (viewMoreSkillsBtn) {
    viewMoreSkillsBtn.addEventListener('click', () => {
        skillsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Animate modal skill bars
        setTimeout(() => {
            const modalSkillBars = skillsModal.querySelectorAll('.skill-progress');
            modalSkillBars.forEach((bar, index) => {
                setTimeout(() => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = progress + '%';
                }, index * 100);
            });
        }, 300);
    });
}

// Close modal
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        skillsModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside
if (skillsModal) {
    skillsModal.addEventListener('click', (e) => {
        if (e.target === skillsModal) {
            skillsModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// Open Skills Modal from Navigation Link
const navSkillsLink = document.getElementById('navSkillsLink');
if (navSkillsLink) {
    navSkillsLink.addEventListener('click', (e) => {
        e.preventDefault();
        skillsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Animate modal skill bars
        setTimeout(() => {
            const modalSkillBars = skillsModal.querySelectorAll('.skill-progress');
            modalSkillBars.forEach((bar, index) => {
                setTimeout(() => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = progress + '%';
                }, index * 100);
            });
        }, 300);
        
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Open Experience Modal from Navigation Link
const navExperienceLink = document.getElementById('navExperienceLink');
if (navExperienceLink) {
    navExperienceLink.addEventListener('click', (e) => {
        e.preventDefault();
        const expModal = document.getElementById('experienceModal');
        if (expModal) {
            expModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Open Projects Modal from Navigation Link
const navProjectsLink = document.getElementById('navProjectsLink');
if (navProjectsLink) {
    navProjectsLink.addEventListener('click', (e) => {
        e.preventDefault();
        const projModal = document.getElementById('projectsModal');
        if (projModal) {
            projModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Open Certificates Modal from Navigation Link
const navCertificatesLink = document.getElementById('navCertificatesLink');
if (navCertificatesLink) {
    navCertificatesLink.addEventListener('click', (e) => {
        e.preventDefault();
        const certModal = document.getElementById('certificatesModal');
        if (certModal) {
            certModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Open About Modal from Navigation Link
const navAboutLink = document.getElementById('navAboutLink');
if (navAboutLink) {
    navAboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        const aboutModal = document.getElementById('aboutModal');
        if (aboutModal) {
            aboutModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Open Contact Modal from Navigation Link
const navContactLink = document.getElementById('navContactLink');
if (navContactLink) {
    navContactLink.addEventListener('click', (e) => {
        e.preventDefault();
        const contactModal = document.getElementById('contactModal');
        if (contactModal) {
            contactModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close modals with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (skillsModal && skillsModal.classList.contains('show')) {
            skillsModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
        if (experienceModal && experienceModal.classList.contains('show')) {
            experienceModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
        if (projectsModal && projectsModal.classList.contains('show')) {
            projectsModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
        if (certificatesModal && certificatesModal.classList.contains('show')) {
            certificatesModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
        const aboutModal = document.getElementById('aboutModal');
        if (aboutModal && aboutModal.classList.contains('show')) {
            aboutModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
        const contactModal = document.getElementById('contactModal');
        if (contactModal && contactModal.classList.contains('show')) {
            contactModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
});

// ============================================
// Experience Modal
// ============================================
const viewMoreExperienceBtn = document.getElementById('viewMoreExperience');
const experienceModal = document.getElementById('experienceModal');
const closeExperienceModalBtn = document.getElementById('closeExperienceModal');

// Open experience modal
if (viewMoreExperienceBtn) {
    viewMoreExperienceBtn.addEventListener('click', () => {
        experienceModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
}

// Close experience modal
if (closeExperienceModalBtn) {
    closeExperienceModalBtn.addEventListener('click', () => {
        experienceModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
}

// Close experience modal when clicking outside
if (experienceModal) {
    experienceModal.addEventListener('click', (e) => {
        if (e.target === experienceModal) {
            experienceModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// ============================================
// Projects Modal
// ============================================
const viewMoreProjectsBtn = document.getElementById('viewMoreProjects');
const projectsModal = document.getElementById('projectsModal');
const closeProjectsModalBtn = document.getElementById('closeProjectsModal');

// Open projects modal
if (viewMoreProjectsBtn) {
    viewMoreProjectsBtn.addEventListener('click', () => {
        projectsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
}

// Close projects modal
if (closeProjectsModalBtn) {
    closeProjectsModalBtn.addEventListener('click', () => {
        projectsModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
}

// Close projects modal when clicking outside
if (projectsModal) {
    projectsModal.addEventListener('click', (e) => {
        if (e.target === projectsModal) {
            projectsModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// ============================================
// Certificates Modal
// ============================================
const viewMoreCertificatesBtn = document.getElementById('viewMoreCertificates');
const certificatesModal = document.getElementById('certificatesModal');
const closeCertificatesModalBtn = document.getElementById('closeCertificatesModal');

// Open certificates modal
if (viewMoreCertificatesBtn) {
    viewMoreCertificatesBtn.addEventListener('click', () => {
        certificatesModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
}

// Close certificates modal
if (closeCertificatesModalBtn) {
    closeCertificatesModalBtn.addEventListener('click', () => {
        certificatesModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
}

// Close certificates modal when clicking outside
if (certificatesModal) {
    certificatesModal.addEventListener('click', (e) => {
        if (e.target === certificatesModal) {
            certificatesModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// ============================================
// About Modal
// ============================================
const aboutModal = document.getElementById('aboutModal');
const closeAboutModalBtn = document.getElementById('closeAboutModal');

// Close about modal
if (closeAboutModalBtn) {
    closeAboutModalBtn.addEventListener('click', () => {
        aboutModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
}

// Close about modal when clicking outside
if (aboutModal) {
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            aboutModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// ============================================
// Contact Modal
// ============================================
const contactModal = document.getElementById('contactModal');
const closeContactModalBtn = document.getElementById('closeContactModal');

// Close contact modal
if (closeContactModalBtn) {
    closeContactModalBtn.addEventListener('click', () => {
        contactModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
}

// Close contact modal when clicking outside
if (contactModal) {
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    }
    
    // Start typing after a short delay
    setTimeout(type, 500);
}

// Navbar Background on Scroll
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.7)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
    }
    
    lastScroll = currentScroll;
});

// Skill Cards Hover Effect Enhancement
const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.05)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Portfolio Item Click Handler
const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach(item => {
    const link = item.querySelector('.portfolio-link');
    if (link) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const title = item.querySelector('.portfolio-title').textContent;
            alert(`Opening ${title}...\\nAdd your project link here!`);
        });
    }
});

// Initialize animations when page loads
window.addEventListener('load', () => {
    // Add loaded class to body for any CSS transitions
    document.body.classList.add('loaded');
    
    // Animate hero section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }
});

// Add parallax effect to hero section (optional)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Form input animations
const formInputs = document.querySelectorAll('.form-input');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
    });
});

// Add cursor trail effect (optional enhancement)
let dots = [];
let mouse = { x: 0, y: 0 };

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Console welcome message
console.log('%c👋 Welcome to Kashish Nankani\'s Portfolio!', 'color: #ff9800; font-size: 20px; font-weight: bold;');
console.log('%c💼 MERN Stack Developer | Computer Science Student', 'color: #ffa726; font-size: 14px;');
console.log('%c📧 Contact: kashishnankani996@gmail.com', 'color: #b0b0b0; font-size: 12px;');

// ============================================
// Project Detail Modal & Image Slider
// ============================================

// Project Detail Modal Functionality
const viewDetailsButtons = document.querySelectorAll('.btn-view-details');
const projectDetailModals = document.querySelectorAll('.project-detail-modal');
const closeProjectDetailButtons = document.querySelectorAll('.close-project-detail');

// Store current slide index for each slider
const sliderStates = {};

// Open project detail modal
viewDetailsButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = button.getAttribute('data-project');
        const modal = document.getElementById(`projectDetailModal-${projectId}`);
        
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Initialize slider for this modal
            initializeSlider(projectId);
        }
    });
});

// Close project detail modal
closeProjectDetailButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.project-detail-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
});

// Close modal when clicking outside
projectDetailModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
});

// Initialize Image Slider
function initializeSlider(projectId) {
    const modal = document.getElementById(`projectDetailModal-${projectId}`);
    if (!modal) return;
    
    const sliderContainer = modal.querySelector('.slider-container');
    const images = modal.querySelectorAll('.slider-image');
    const prevBtn = modal.querySelector('.slider-btn.prev');
    const nextBtn = modal.querySelector('.slider-btn.next');
    const dotsContainer = modal.querySelector('.slider-dots');
    
    if (!sliderContainer || images.length === 0) return;
    
    // Initialize slider state
    sliderStates[projectId] = { currentSlide: 0, totalSlides: images.length };
    
    // Create dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < images.length; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(projectId, i));
        dotsContainer.appendChild(dot);
    }
    
    // Next button
    if (nextBtn) {
        // Remove old listeners by replacing the element
        const newNextBtn = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        
        newNextBtn.addEventListener('click', () => {
            const state = sliderStates[projectId];
            const nextSlide = (state.currentSlide + 1) % state.totalSlides;
            goToSlide(projectId, nextSlide);
        });
    }
    
    // Previous button
    if (prevBtn) {
        // Remove old listeners by replacing the element
        const newPrevBtn = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        
        newPrevBtn.addEventListener('click', () => {
            const state = sliderStates[projectId];
            const prevSlide = (state.currentSlide - 1 + state.totalSlides) % state.totalSlides;
            goToSlide(projectId, prevSlide);
        });
    }
    
    // Auto-advance slider every 5 seconds
    const sliderInterval = setInterval(() => {
        const modal = document.getElementById(`projectDetailModal-${projectId}`);
        if (!modal || !modal.classList.contains('show')) {
            clearInterval(sliderInterval);
            return;
        }
        
        const state = sliderStates[projectId];
        if (state) {
            const nextSlide = (state.currentSlide + 1) % state.totalSlides;
            goToSlide(projectId, nextSlide);
        }
    }, 5000);
    
    // Initialize first slide
    goToSlide(projectId, 0);
}

// Navigate to specific slide
function goToSlide(projectId, slideIndex) {
    const modal = document.getElementById(`projectDetailModal-${projectId}`);
    if (!modal) return;
    
    const sliderContainer = modal.querySelector('.slider-container');
    const dots = modal.querySelectorAll('.slider-dot');
    
    if (!sliderContainer) return;
    
    // Update slider state
    const state = sliderStates[projectId];
    if (state) {
        state.currentSlide = slideIndex;
    }
    
    // Move slider
    const offset = -slideIndex * 100;
    sliderContainer.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        if (index === slideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Keyboard navigation for sliders
document.addEventListener('keydown', (e) => {
    // Find currently open modal
    const openModal = document.querySelector('.project-detail-modal.show');
    if (!openModal) return;
    
    const modalId = openModal.id.replace('projectDetailModal-', '');
    const state = sliderStates[modalId];
    
    if (!state) return;
    
    if (e.key === 'ArrowLeft') {
        const prevSlide = (state.currentSlide - 1 + state.totalSlides) % state.totalSlides;
        goToSlide(modalId, prevSlide);
    } else if (e.key === 'ArrowRight') {
        const nextSlide = (state.currentSlide + 1) % state.totalSlides;
        goToSlide(modalId, nextSlide);
    } else if (e.key === 'Escape') {
        openModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});
