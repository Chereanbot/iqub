// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Trigger animations for hero section
    const heroText = document.querySelectorAll('.hero-section h1, .hero-section p');
    heroText.forEach((text, index) => {
        text.classList.add('animate__animated', 'animate__fadeIn');
        text.style.animationDelay = `${index * 0.2}s`;
    });

    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize Owl Carousel for testimonials
    $('.testimonial-carousel').owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Counter animation for statistics
    const counterElements = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = parseInt(target.innerText.replace(/\D/g, ''));
                let count = 0;
                const duration = 2000; // 2 seconds
                const increment = value / (duration / 16); // 60fps

                function updateCount() {
                    count += increment;
                    if (count < value) {
                        target.innerText = Math.ceil(count).toLocaleString() + (target.innerText.includes('+') ? '+' : '');
                        requestAnimationFrame(updateCount);
                    } else {
                        target.innerText = value.toLocaleString() + (target.innerText.includes('+') ? '+' : '');
                    }
                }

                updateCount();
                counterObserver.unobserve(target);
            }
        });
    }, {
        threshold: 0.5
    });

    counterElements.forEach(el => counterObserver.observe(el));

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroSection.style.backgroundPositionY = scrolled * 0.5 + 'px';
        });
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href')?.includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Enhanced news ticker
    function updateNewsTicker() {
        const ticker = document.querySelector('.ticker-text');
        if (ticker) {
            const news = [
                'Welcome to Dilla University Teachers\' and Staff Savings and Credit Association',
                'Current Savings Interest Rate: 7.9%',
                'Loan Interest Rate: 3% Monthly',
                'Maximum Loan Amount: Up to 5x of Savings',
                'Join DTSCA Today and Secure Your Financial Future',
                'New Education Loans Available for Staff Members',
                'Annual General Meeting: March 20, 2024',
                'Digital Services Enhancement in Progress'
            ];
            let currentIndex = 0;

            setInterval(() => {
                ticker.style.opacity = '0';
                ticker.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    currentIndex = (currentIndex + 1) % news.length;
                    ticker.textContent = news[currentIndex];
                    ticker.style.opacity = '1';
                    ticker.style.transform = 'translateY(0)';
                }, 500);
            }, 5000);
        }
    }
    updateNewsTicker();

    // Quick tools hover effect
    const quickTools = document.querySelectorAll('.quick-tool');
    quickTools.forEach(tool => {
        tool.addEventListener('mouseenter', () => {
            tool.style.transform = 'translateY(-5px)';
        });
        tool.addEventListener('mouseleave', () => {
            tool.style.transform = 'translateY(0)';
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            // Here you would typically send this to your backend
            alert('Thank you for subscribing! We will keep you updated.');
            this.reset();
        });
    }

    // Calculator functionality
    const calculatorForms = document.querySelectorAll('.calculator-form');
    calculatorForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const type = this.closest('.tab-pane').id;
            
            if (type === 'savings-calc') {
                const salary = parseFloat(formData.get('salary'));
                const duration = parseFloat(formData.get('duration'));
                const monthlyContribution = salary * 0.05; // 5% of salary
                const annualInterest = 0.079; // 7.9%
                
                let totalSavings = 0;
                for (let i = 0; i < duration * 12; i++) {
                    totalSavings += monthlyContribution;
                    totalSavings *= (1 + annualInterest / 12);
                }
                
                const resultDiv = document.getElementById('savings-result');
                resultDiv.innerHTML = `
                    <div class="alert alert-success">
                        <h5>Projected Savings</h5>
                        <p>Monthly Contribution: ETB ${monthlyContribution.toLocaleString()}</p>
                        <p>Total Savings after ${duration} years: ETB ${Math.round(totalSavings).toLocaleString()}</p>
                    </div>
                `;
            } else if (type === 'loan-calc') {
                const currentSavings = parseFloat(formData.get('current-savings'));
                const loanAmount = parseFloat(formData.get('loan-amount'));
                const duration = parseFloat(formData.get('loan-duration'));
                const monthlyInterest = 0.03; // 3%
                
                if (loanAmount > currentSavings * 5) {
                    document.getElementById('loan-result').innerHTML = `
                        <div class="alert alert-danger">
                            <p>Loan amount cannot exceed 5 times your savings (ETB ${(currentSavings * 5).toLocaleString()})</p>
                        </div>
                    `;
                    return;
                }
                
                const monthlyPayment = (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, duration)) / 
                                     (Math.pow(1 + monthlyInterest, duration) - 1);
                
                document.getElementById('loan-result').innerHTML = `
                    <div class="alert alert-success">
                        <h5>Loan Repayment Schedule</h5>
                        <p>Monthly Payment: ETB ${Math.round(monthlyPayment).toLocaleString()}</p>
                        <p>Total Repayment: ETB ${Math.round(monthlyPayment * duration).toLocaleString()}</p>
                        <p>Total Interest: ETB ${Math.round(monthlyPayment * duration - loanAmount).toLocaleString()}</p>
                    </div>
                `;
            }
        });
    });

    // Back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.display = 'flex';
            backToTop.style.opacity = '1';
        } else {
            backToTop.style.opacity = '0';
            setTimeout(() => {
                if (window.scrollY <= 300) {
                    backToTop.style.display = 'none';
                }
            }, 300);
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Language translations
const translations = {
    en: {
        welcome: "Welcome to Dilla University Teachers' and Staff Savings and Credit Association",
        home: "Home",
        aboutUs: "About Us",
        services: "Services",
        savings: "Savings",
        loans: "Loans",
        investments: "Investments",
        documents: "Documents",
        blog: "Blog",
        contact: "Contact",
        login: "Login",
        joinNow: "Join Now",
        learnMore: "Learn More",
        quickTools: "Quick Tools",
        loanCalculator: "Loan Calculator",
        checkSavings: "Check Savings",
        applyLoan: "Apply for Loan",
        getSupport: "Get Support"
    },
    am: {
        welcome: "እንኳን ደህና መጡ ወደ ዲላ ዩኒቨርሲቲ መምህራንና ሰራተኞች የቁጠባና የብድር ማህበር",
        home: "መነሻ ገጽ",
        aboutUs: "ስለ እኛ",
        services: "አገልግሎቶች",
        savings: "ቁጠባ",
        loans: "ብድር",
        investments: "ኢንቨስትመንት",
        documents: "ሰነዶች",
        blog: "ብሎግ",
        contact: "አግኙን",
        login: "ግባ",
        joinNow: "አሁን ተቀላቀል",
        learnMore: "ተጨማሪ ይወቁ",
        quickTools: "ፈጣን መሳሪያዎች",
        loanCalculator: "የብድር ካልኩሌተር",
        checkSavings: "ቁጠባ ያረጋግጡ",
        applyLoan: "ለብድር ያመልክቱ",
        getSupport: "ድጋፍ ያግኙ"
    }
};

// Current language
let currentLang = 'en';

// Function to switch language
function switchLanguage(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);
    
    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Update placeholder texts
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });

    // Store language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Initialize language from stored preference or default to English
document.addEventListener('DOMContentLoaded', () => {
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang) {
        switchLanguage(storedLang);
    }

    // Add Amharic font for better rendering
    if (currentLang === 'am') {
        document.body.classList.add('amharic');
    }
});

// Add Amharic font
const amharicFont = document.createElement('link');
amharicFont.rel = 'stylesheet';
amharicFont.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;500;600;700&display=swap';
document.head.appendChild(amharicFont);