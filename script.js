document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Sticky Navigation Header Background
    const header = document.getElementById("main-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // 2. Mobile Hamburger Menu Drawer Toggler
    const menuToggleBtn = document.getElementById("hamburger-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    
    if (menuToggleBtn && mobileMenu) {
        menuToggleBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("open");
        });
    }

    // Close mobile menu when clicking nav links
    const navLinksList = document.querySelectorAll(".mobile-nav a");
    navLinksList.forEach(link => {
        link.addEventListener("click", () => {
            if(mobileMenu) mobileMenu.classList.remove("open");
        });
    });

    // 3. Scroll-reveal entrance animation using Intersection Observer
    const revealElements = document.querySelectorAll(".reveal");
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Tabs Especialidades (Filtro)
    const filterTabs = document.querySelectorAll(".filter-tab");
    const specCards = document.querySelectorAll(".spec-card");

    if(filterTabs.length > 0 && specCards.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                // Remove active de todos
                filterTabs.forEach(t => t.classList.remove("active"));
                // Add active no clicado
                tab.classList.add("active");
                
                const filterValue = tab.getAttribute("data-filter");
                
                specCards.forEach(card => {
                    if(card.getAttribute("data-cat") === filterValue || filterValue === "all") {
                        card.style.display = "flex";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        });
    }

    // 5. Interactive 3D Breast Simulation Canvas (Se existir na página)
    const canvas = document.getElementById("simulation-canvas");
    const slider = document.getElementById("projection-slider");
    
    if (canvas && slider) {
        const ctx = canvas.getContext("2d");
        
        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * (window.devicePixelRatio || 1);
            canvas.height = rect.height * (window.devicePixelRatio || 1);
            ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        }
        
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        
        function draw(projectionVal) {
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);
            
            ctx.clearRect(0, 0, width, height);
            
            // Draw Medical Grid Background
            ctx.strokeStyle = "rgba(216, 170, 104, 0.06)";
            ctx.lineWidth = 1;
            const gridSize = 20;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
            }
            
            // Draw digital readout info
            ctx.fillStyle = "rgba(216, 170, 104, 0.85)";
            ctx.font = "10px monospace";
            ctx.fillText("STATUS: ACTIVE", 15, 25);
            ctx.fillText(`PROJECAO: ${Math.round(projectionVal)}%`, 15, 40);
            ctx.fillText(`VOLUME: ${Math.round(200 + projectionVal * 4.5)}cc`, 15, 55);
            ctx.fillText("MODE: 3D WIREFRAME", 15, 70);
            
            // Draw center breast wireframe
            const centerX = width * 0.45;
            const centerY = height * 0.5;
            const baseRadius = 65;
            
            const numSlices = 9;
            for (let i = 0; i < numSlices; i++) {
                const t = (i - (numSlices - 1) / 2) / ((numSlices - 1) / 2); 
                const sliceWidth = Math.sqrt(Math.max(0, 1 - t * t)) * baseRadius;
                if (sliceWidth <= 0) continue;
                
                const opacity = 0.12 + (1 - Math.abs(t)) * 0.68;
                ctx.strokeStyle = `rgba(216, 170, 104, ${opacity})`;
                ctx.lineWidth = t === 0 ? 2 : 1; 
                
                const startY = centerY - baseRadius;
                const endY = centerY + baseRadius;
                const projExtent = projectionVal * 0.75 * (1 - t * t);
                const apexX = centerX + projExtent;
                
                ctx.beginPath();
                ctx.moveTo(centerX, startY);
                ctx.bezierCurveTo(centerX + projExtent * 0.35, startY + 15, apexX - 10, centerY - 25, apexX, centerY);
                ctx.bezierCurveTo(apexX - 5, centerY + 25, centerX + projExtent * 0.35, endY - 15, centerX, endY);
                ctx.stroke();
            }
            
            // Draw horizontal mesh lines
            const numHorizontalLines = 7;
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = "rgba(216, 170, 104, 0.28)";
            
            for (let j = 1; j < numHorizontalLines - 1; j++) {
                const fraction = j / (numHorizontalLines - 1);
                const y = (centerY - baseRadius) + fraction * (baseRadius * 2);
                const t = (y - centerY) / baseRadius;
                const factor = Math.sqrt(Math.max(0, 1 - t * t));
                const currentProj = projectionVal * 0.75 * factor;
                
                ctx.beginPath();
                ctx.moveTo(centerX, y);
                ctx.quadraticCurveTo(centerX + currentProj * 1.3, y, centerX, y);
                ctx.stroke();
            }
            
            // Scanning line
            const scanTime = Date.now() / 1200;
            const scanY = centerY - baseRadius + ((Math.sin(scanTime) + 1) / 2) * (baseRadius * 2);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centerX - 25, scanY);
            ctx.lineTo(centerX + projectionVal * 0.75 + 25, scanY);
            ctx.stroke();
        }
        
        function animate() {
            draw(parseFloat(slider.value));
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }
});
