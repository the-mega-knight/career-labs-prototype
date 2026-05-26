document.addEventListener('DOMContentLoaded', () => {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    // Simple smooth parallax effect on scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-speed')) || 0.1;
                // Move elements down slower than the scroll speed
                const yPos = scrollY * speed;
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    });

    // Pivot Analyzer Logic
    const pivotForm = document.getElementById('pivot-form');
    const resultContainer = document.getElementById('result-container');
    const resultContent = document.querySelector('.result-content');

    if (pivotForm && resultContainer && resultContent) {
        pivotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const targetIndustry = document.getElementById('target-industry').value;
            
            // Hide temporarily if re-running
            resultContainer.classList.add('fade-out');
            
            setTimeout(() => {
                let htmlOutput = '';
                if (targetIndustry === 'tech') {
                    htmlOutput = `
                        <p><strong>Analysis: Big Tech</strong></p>
                        <p>The technical bar in Big Tech is unforgiving. Success requires a solid foundation in data structures, algorithms, and system design, coupled with behavioral alignment to company leadership principles.</p>
                        <p>Watch our detailed breakdown on what it takes: <br><a href="https://youtu.be/HCsTgNiFMhY" target="_blank">The Career Labs - Google Episode</a></p>
                    `;
                } else if (targetIndustry === 'finance') {
                    htmlOutput = `
                        <p><strong>Analysis: Finance & Wealth Management</strong></p>
                        <p>The wealth management market is increasingly saturated. Differentiation hinges on building a resilient book of business, demonstrating hyper-competence, and mastering the psychological nuances of high-net-worth client acquisition.</p>
                        <p>Understand the realities here: <br><a href="https://youtu.be/3qmk-wE-Dg8" target="_blank">The Career Labs - Wealth Management Episode</a></p>
                    `;
                } else {
                    htmlOutput = `
                        <p><strong>Analysis: Custom Path</strong></p>
                        <p>Transitioning into specialized or aviation roles requires a highly tailored approach, networking precision, and translating existing skills into niche requirements.</p>
                        <p>To dive deeper, review the "Choose Your Path" modules above to find targeted intel for your current phase.</p>
                    `;
                }
                
                resultContent.innerHTML = htmlOutput;
                resultContainer.classList.remove('hidden');
                
                // Trigger reflow for transition
                void resultContainer.offsetWidth;
                resultContainer.classList.remove('fade-out');
            }, 300);
        });
    }

    // Intersection Observer for Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-scroll');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.hidden-scroll').forEach((el) => {
        observer.observe(el);
    });

    // Episode Vault Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const vaultCards = document.querySelectorAll('.vault-card');

    if (filterBtns.length > 0 && vaultCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                vaultCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || filterValue === category) {
                        card.classList.remove('hidden-item');
                        setTimeout(() => {
                            card.classList.remove('fading-out');
                        }, 20);
                    } else {
                        card.classList.add('fading-out');
                        setTimeout(() => {
                            if (card.classList.contains('fading-out')) {
                                card.classList.add('hidden-item');
                            }
                        }, 500);
                    }
                });
            });
        });
    }
});
