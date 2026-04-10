// Configuration
const countsNeeded = 30;
let counts = 0;
let isOpen = false;

// DOM Elements
const present = document.querySelector('.present');
const clickCountElement = document.getElementById('clickCount');
const successMessage = document.getElementById('successMessage');
const resetButton = document.getElementById('resetButton');
const presentMessage = document.getElementById('presentMessage');
const presentSubMessage = document.getElementById('presentSubMessage');

// Birthday messages for inside the present
const birthdayMessages = [
    { 
        message: "MINECRAFT", 
        subMessage: "Official Account",
        icon: "<img src='https://cdn.freebiesupply.com/logos/large/2x/minecraft-1-logo-svg-vector.svg' height='75px'>"
    }
];

// Function to get a random birthday message
function getRandomBirthdayMessage() {
    return birthdayMessages[Math.floor(Math.random() * birthdayMessages.length)];
}

// Click handler for present
present.addEventListener('click', () => {
    if (isOpen) return;
    
    counts += 1;
    clickCountElement.textContent = counts;
    present.style.setProperty('--count', Math.ceil(counts / 2));
    present.classList.add('animate');
    
    // Remove animation class after it completes
    setTimeout(() => {
        present.classList.remove('animate');
    }, 300);

    if (counts >= countsNeeded) {
        isOpen = true;
        present.classList.add('open');
        
        // Set a random message inside the present
        const randomMessage = getRandomBirthdayMessage();
        presentMessage.textContent = randomMessage.message;
        presentSubMessage.textContent = randomMessage.subMessage;
        document.querySelector('.present-message-icon').innerHTML = randomMessage.icon;
        
        showSuccessMessage();
        createConfetti();
        updateSnowflakes(100); // More snowflakes when opened
        
        // Special effect for the message
        animateMessageAppearance();
    }
});

// Animate the message appearance
function animateMessageAppearance() {
    const messageContainer = document.querySelector('.present-message-container');
    const message = document.querySelector('.present-message');
    
    // Reset any previous animations
    messageContainer.style.opacity = '0';
    message.style.transform = 'translate(-50%, -50%) scale(0.5)';
    
    // Animate in
    setTimeout(() => {
        messageContainer.style.opacity = '1';
        message.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        message.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 500);
}

// Reset button handler
resetButton.addEventListener('click', resetAnimation);

function resetAnimation() {
    counts = 0;
    isOpen = false;
    clickCountElement.textContent = counts;
    present.classList.remove('open', 'animate');
    successMessage.style.opacity = '0';
    
    // Hide the present message
    document.querySelector('.present-message-container').style.opacity = '0';
    
    updateSnowflakes(50); // Reset snowflake density
}

function showSuccessMessage() {
    const messages = [
        "🎉 Birthday surprise! 🎉"
    ];
    successMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
    successMessage.style.opacity = '1';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        successMessage.style.opacity = '0';
    }, 5000);
}

function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff9900', '#ff66cc'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${Math.random() * 100}%`;
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        document.body.appendChild(confetti);
        
        // Animate confetti
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        const angleX = Math.cos(angle) * velocity;
        const angleY = Math.sin(angle) * velocity;
        
        let opacity = 1;
        let posX = parseFloat(confetti.style.left);
        let posY = parseFloat(confetti.style.top);
        
        const animateConfetti = () => {
            opacity -= 0.02;
            posX += angleX;
            posY += angleY + 0.1; // Gravity effect
            
            confetti.style.opacity = opacity;
            confetti.style.left = `${posX}%`;
            confetti.style.top = `${posY}%`;
            
            if (opacity > 0) {
                requestAnimationFrame(animateConfetti);
            } else {
                confetti.remove();
            }
        };
        
        // Start animation
        requestAnimationFrame(animateConfetti);
    }
}

// Snowflake animation
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let width, height, lastNow, snowflakes;
let maxSnowflakes = 50;

const rand = (min, max) => min + Math.random() * (max - min);

class Snowflake {
    constructor() {
        this.spawn(true);
    }

    spawn(anyY = false) {
        this.x = rand(0, width);
        this.y = anyY === true ? rand(-50, height + 50) : rand(-50, -10);
        this.xVel = rand(-0.05, 0.05);
        this.yVel = rand(0.02, 0.1);
        this.angle = rand(0, Math.PI * 2);
        this.angleVel = rand(-0.001, 0.001);
        this.size = rand(3, 12);
        this.sizeOsc = rand(0.01, 0.5);
        this.wobble = rand(0, Math.PI * 2);
        this.wobbleSpeed = rand(0.01, 0.05);
        this.color = `rgba(${rand(0, 255)}, ${rand(100, 255)}, ${rand(150, 255)}, ${rand(0.5, 0.9)})`;
    }

    update(elapsed, now) {
        const xForce = rand(-0.001, 0.001);
        
        if (Math.abs(this.xVel + xForce) < 0.075) {
            this.xVel += xForce;
        }

        this.x += this.xVel * elapsed;
        this.y += this.yVel * elapsed;
        this.angle += this.xVel * 0.05 * elapsed;
        this.wobble += this.wobbleSpeed;

        if (this.y - this.size > height || this.x + this.size < 0 || this.x - this.size > width) {
            this.spawn();
        }

        this.render(now);
    }

    render(now) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Create snowflake shape
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * this.size, Math.sin(angle) * this.size);
            
            // Add branches
            const branchAngle = angle + Math.PI / 6;
            ctx.moveTo(Math.cos(angle) * this.size * 0.5, Math.sin(angle) * this.size * 0.5);
            ctx.lineTo(Math.cos(branchAngle) * this.size * 0.3, Math.sin(branchAngle) * this.size * 0.3);
            
            const branchAngle2 = angle - Math.PI / 6;
            ctx.moveTo(Math.cos(angle) * this.size * 0.5, Math.sin(angle) * this.size * 0.5);
            ctx.lineTo(Math.cos(branchAngle2) * this.size * 0.3, Math.sin(branchAngle2) * this.size * 0.3);
        }
        ctx.stroke();
        
        // Center dot
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

function render(now) {
    requestAnimationFrame(render);
    const elapsed = now - lastNow;
    lastNow = now;

    // Clear with a slight fade effect for trails
    ctx.fillStyle = 'rgba(135, 206, 235, 0.1)';
    ctx.fillRect(0, 0, width, height);

    if (snowflakes.length < maxSnowflakes) {
        snowflakes.push(new Snowflake());
    }

    snowflakes.forEach((snowflake) => snowflake.update(elapsed, now));
}

function updateSnowflakes(count) {
    maxSnowflakes = count;
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

function pause() {
    cancelAnimationFrame(render);
}

function resume() {
    lastNow = performance.now();
    requestAnimationFrame(render);
}

function initSnowflakes() {
    snowflakes = [];
    resize();
    render(lastNow = performance.now());
}

// Window event listeners
window.addEventListener('resize', resize);
window.addEventListener('blur', pause);
window.addEventListener('focus', resume);

// Initialize everything
initSnowflakes();

// URL hash animation (decorative)
const stuff = ['�', '🎂', '🎁', '🎈', '🎊', '🥳', '🎆', '🌟'];

function updateUrlHash() {
    const randomStuff = [...stuff].sort(() => Math.random() - 0.5).slice(0, 5);
    window.location.hash = randomStuff.join('');
}

// Update URL hash every 30 seconds
setInterval(updateUrlHash, 30000);
updateUrlHash(); // Initial update

// Initialize with a random message
const initialMessage = getRandomBirthdayMessage();
presentMessage.textContent = initialMessage.message;
presentSubMessage.textContent = initialMessage.subMessage;
document.querySelector('.present-message-icon').textContent = initialMessage.icon;
