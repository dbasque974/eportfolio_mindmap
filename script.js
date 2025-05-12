document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les cercles et les lignes
    initBubbles();
    drawConnections();
    
    // Popup functionality
    const popup = document.getElementById('popup');
    const closeBtn = document.querySelector('.close');
    const bubbles = document.querySelectorAll('.bubble');
    
    // Ouvrir la popup lors du clic sur une bulle
    bubbles.forEach(bubble => {
        bubble.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const period = this.getAttribute('data-period');
            const description = this.getAttribute('data-description');
            const skills = this.getAttribute('data-skills').split(', ');
            
            document.getElementById('popup-title').textContent = title;
            document.getElementById('popup-period').textContent = period;
            document.getElementById('popup-description').textContent = description;
            
            const skillsList = document.getElementById('popup-skills');
            skillsList.innerHTML = '';
            
            skills.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                skillsList.appendChild(li);
            });
            
            popup.style.display = 'flex';
            
            // Ajouter une légère animation d'ouverture
            const popupContent = document.querySelector('.popup-content');
            popupContent.style.opacity = '0';
            popupContent.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                popupContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                popupContent.style.opacity = '1';
                popupContent.style.transform = 'translateY(0)';
            }, 10);
        });
    });
    
    // Fermer la popup
    closeBtn.addEventListener('click', function() {
        popup.style.display = 'none';
    });
    
    // Fermer la popup en cliquant à l'extérieur
    popup.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
    
    // Fermer la popup avec la touche Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && popup.style.display === 'flex') {
            popup.style.display = 'none';
        }
    });
    
    // Animation des bulles
    animateBubbles();
});

// Fonction pour initialiser les bulles avec des positions aléatoires dans les limites définies
function initBubbles() {
    const bubbles = document.querySelectorAll('.bubble');
    
    bubbles.forEach(bubble => {
        // Ajouter une légère animation d'entrée
        bubble.style.opacity = '0';
        bubble.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            bubble.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            bubble.style.opacity = '1';
            bubble.style.transform = 'scale(1)';
        }, Math.random() * 500 + 100);
    });
}

// Fonction pour dessiner les connections entre les bulles
function drawConnections() {
    const canvas = document.getElementById('bubbleCanvas');
    const ctx = canvas.getContext('2d');
    const container = document.querySelector('.sketch-container');
    
    // Ajuster la taille du canvas
    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        drawLines();
    }
    
    // Dessiner les lignes
    function drawLines() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Définir les connexions entre les bulles (ID des bulles à connecter)
        const connections = [
            ['master', 'enseignant-vacataire'],
            ['master', 'formateur-yes-you-can'],
            ['master', 'ecriture'],
            ['bts-design', 'feng-shui'],
            ['bts-design', 'conception'],
            ['bts-design', 'realisation'],
            ['licence-pro', 'gerant-pnp'],
            ['bac-pro', 'stage-maraichage'],
            ['bac-pro', 'formateur-permakiltir'],
            ['bac-pro', 'nature'],
            ['formateur-permakiltir', 'nature'],
            ['feng-shui', 'conception'],
            ['conception', 'realisation'],
        ];
        
        // Dessiner chaque connexion
        connections.forEach(connection => {
            const bubble1 = document.getElementById(connection[0]);
            const bubble2 = document.getElementById(connection[1]);
            
            if (bubble1 && bubble2 && window.getComputedStyle(bubble1).position === 'absolute' && 
                window.getComputedStyle(bubble2).position === 'absolute') {
                
                const rect1 = bubble1.getBoundingClientRect();
                const rect2 = bubble2.getBoundingClientRect();
                
                const containerRect = container.getBoundingClientRect();
                
                const x1 = rect1.left + rect1.width / 2 - containerRect.left;
                const y1 = rect1.top + rect1.height / 2 - containerRect.top;
                const x2 = rect2.left + rect2.width / 2 - containerRect.left;
                const y2 = rect2.top + rect2.height / 2 - containerRect.top;
                
                // Calculer l'angle pour déterminer les points d'intersection avec les cercles
                const angle = Math.atan2(y2 - y1, x2 - x1);
                
                const r1 = rect1.width / 2;
                const r2 = rect2.width / 2;
                
                const startX = x1 + Math.cos(angle) * r1;
                const startY = y1 + Math.sin(angle) * r1;
                const endX = x2 - Math.cos(angle) * r2;
                const endY = y2 - Math.sin(angle) * r2;
                
                // Dessiner la ligne avec un style manuscrit
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                
                // Ajouter une légère courbe pour un effet plus naturel
                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;
                const offsetX = (Math.random() - 0.5) * 20;
                const offsetY = (Math.random() - 0.5) * 20;
                
                ctx.quadraticCurveTo(midX + offsetX, midY + offsetY, endX, endY);
                
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1.5;
                ctx.stroke();
                
                // Ajouter des petits points décoratifs le long de la ligne
                const numDots = Math.floor(Math.random() * 3) + 2; // 2 à 4 points
                for (let i = 1; i <= numDots; i++) {
                    const t = i / (numDots + 1);
                    const dotX = startX * (1 - t) * (1 - t) + 2 * (midX + offsetX) * t * (1 - t) + endX * t * t;
                    const dotY = startY * (1 - t) * (1 - t) + 2 * (midY + offsetY) * t * (1 - t) + endY * t * t;
                    
                    ctx.beginPath();
                    ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
                    ctx.fillStyle = '#333';
                    ctx.fill();
                }
            }
        });
    }
    
    // Initialiser le canvas et les événements
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

// Fonction pour animer légèrement les bulles
function animateBubbles() {
    const bubbles = document.querySelectorAll('.bubble');
    
    bubbles.forEach(bubble => {
        // Position initiale
        const initialTop = parseFloat(window.getComputedStyle(bubble).top);
        const initialLeft = parseFloat(window.getComputedStyle(bubble).left);
        
        // Seulement si la bulle est en position absolue (pas en mobile)
        if (!isNaN(initialTop) && !isNaN(initialLeft) && window.getComputedStyle(bubble).position === 'absolute') {
            // Paramètres d'animation
            const amplitude = 5; // Amplitude du mouvement
            const period = Math.random() * 2000 + 3000; // Période de l'animation entre 3 et 5 secondes
            const startTime = Math.random() * period; // Décalage aléatoire pour chaque bulle
            
            // Animation
            function animate() {
                const now = Date.now();
                const offset = amplitude * Math.sin((now - startTime) / period * Math.PI * 2);
                
                // Appliquer un mouvement légèrement différent pour chaque bulle
                if (bubble.style.position === 'absolute') {
                    bubble.style.top = `${initialTop + offset}px`;
                    bubble.style.left = `${initialLeft + offset * 0.7}px`;
                }
                
                requestAnimationFrame(animate);
            }
            
            animate();
        }
    });
}
