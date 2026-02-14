const gifStages = [
    {
        src: "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",
        alt: "Happy cat",
        effect: "bounce"
    },
    {
        src: "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",
        alt: "Confused cat",
        effect: "shake"
    },
    {
        src: "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",
        alt: "Pleading cat",
        effect: "pulse"
    },
    {
        src: "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",
        alt: "Sad cat",
        effect: "fade"
    },
    {
        src: "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",
        alt: "Sadder cat",
        effect: "heartbeat"
    },
    {
        src: "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",
        alt: "Devastated cat",
        effect: "cry"
    },
    {
        src: "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",
        alt: "Very devastated cat",
        effect: "heartbreak"
    },
    {
        src: "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif",
        alt: "Crying runaway cat",
        effect: "float-away"
    }
];

const noMessages = [
    "No",
    "Are you positive? 🤔",
    "Pookie please... 🥺",
    "If you say no, I will be really sad...",
    "I will be very sad... 😢",
    "Please??? 💔",
    "Don't do this to me...",
    "Last chance! 😭",
    "You can't catch me anyway 😜"
];

const yesTeasePokes = [
    "try saying no first... I bet you want to know what happens 😏",
    "go on, hit no... just once 👀",
    "you're missing out 😈",
    "click no, I dare you 😏",
    "the cat is getting curious... 🐱",
    "I'll make it worth your while ✨"
];

let yesTeasedCount = 0;
let noClickCount = 0;
let runawayEnabled = false;
let musicPlaying = true;
let gifAnimationInterval = null;

const catGif = document.getElementById('cat-gif');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const music = document.getElementById('bg-music');
const container = document.querySelector('.container');

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes gifBounce {
        0%, 100% { transform: scale(1) translateY(0); }
        50% { transform: scale(1.1) translateY(-10px); }
    }
    
    @keyframes gifShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }
    
    @keyframes gifPulse {
        0%, 100% { transform: scale(1); filter: brightness(1); }
        50% { transform: scale(1.05); filter: brightness(1.1); }
    }
    
    @keyframes gifHeartbeat {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.1); }
        35% { transform: scale(1); }
        45% { transform: scale(1.1); }
    }
    
    @keyframes gifCry {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-3px) rotate(-1deg); }
        75% { transform: translateY(3px) rotate(1deg); }
    }
    
    @keyframes gifHeartbreak {
        0%, 100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
        50% { transform: scale(0.95) rotate(-2deg); filter: brightness(0.95); }
    }
    
    @keyframes gifFloatAway {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-50px) scale(0.8); opacity: 0; }
    }
    
    .gif-effect-bounce { animation: gifBounce 0.6s ease infinite; }
    .gif-effect-shake { animation: gifShake 0.4s ease infinite; }
    .gif-effect-pulse { animation: gifPulse 0.8s ease infinite; }
    .gif-effect-heartbeat { animation: gifHeartbeat 1s ease infinite; }
    .gif-effect-cry { animation: gifCry 0.5s ease infinite; }
    .gif-effect-heartbreak { animation: gifHeartbreak 0.7s ease infinite; }
    .gif-effect-float-away { animation: gifFloatAway 2s ease forwards; }
    
    .heart-rain {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        animation: heartRain 1.5s ease-out forwards;
    }
    
    @keyframes heartRain {
        0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
    
    .button-shake {
        animation: buttonShake 0.3s ease-in-out;
    }
    
    @keyframes buttonShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .glow-effect {
        animation: glowPulse 1.5s ease-in-out infinite;
    }
    
    @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 10px rgba(255, 105, 180, 0.5), 0 0 20px rgba(255, 105, 180, 0.3); }
        50% { box-shadow: 0 0 20px rgba(255, 105, 180, 0.8), 0 0 40px rgba(255, 105, 180, 0.5); }
    }
`;
document.head.appendChild(style);

// Autoplay: audio starts muted (bypasses browser policy), unmute immediately
music.muted = true;
music.volume = 0.3;
music.play().then(() => {
    music.muted = false;
}).catch(() => {
    // Fallback: unmute on first interaction
    document.addEventListener('click', () => {
        music.muted = false;
        music.play().catch(() => {});
    }, { once: true });
});

function toggleMusic() {
    if (musicPlaying) {
        music.pause();
        musicPlaying = false;
        document.getElementById('music-toggle').textContent = '🔇';
        document.getElementById('music-toggle').style.transform = 'scale(0.9)';
    } else {
        music.muted = false;
        music.play();
        musicPlaying = true;
        document.getElementById('music-toggle').textContent = '🔊';
        document.getElementById('music-toggle').style.transform = 'scale(1.1)';
    }
    setTimeout(() => {
        document.getElementById('music-toggle').style.transform = 'scale(1)';
    }, 200);
}

function handleYesClick() {
    if (!runawayEnabled) {
        // Tease her to try No first
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)];
        yesTeasedCount++;
        showTeaseMessage(msg);
        
        // Add heart effect on yes button when teased
        createHeartEffect(yesBtn);
        
        // Make yes button bounce slightly
        yesBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            yesBtn.style.transform = 'scale(1)';
        }, 300);
        return;
    }
    
    // Celebrate before redirecting
    celebrateYes();
    setTimeout(() => {
        window.location.href = 'yes.html';
    }, 1000);
}

function celebrateYes() {
    // Create confetti effect
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createHeartRain();
        }, i * 100);
    }
    
    // Make cat gif happy
    catGif.style.transform = 'scale(1.2) rotate(360deg)';
    catGif.style.transition = 'transform 0.5s ease';
    
    // Glow effect on yes button
    yesBtn.classList.add('glow-effect');
}

function createHeartRain() {
    const heart = document.createElement('div');
    heart.innerHTML = ['💕', '💗', '💖', '💘', '💝', '💞'][Math.floor(Math.random() * 6)];
    heart.className = 'heart-rain';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (20 + Math.random() * 30) + 'px';
    heart.style.animationDuration = (1 + Math.random() * 2) + 's';
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 3000);
}

function createHeartEffect(element) {
    const rect = element.getBoundingClientRect();
    const heart = document.createElement('div');
    heart.innerHTML = '💗';
    heart.style.position = 'fixed';
    heart.style.left = rect.left + rect.width / 2 + 'px';
    heart.style.top = rect.top + 'px';
    heart.style.fontSize = '24px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.animation = 'heartRain 1s ease-out forwards';
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast');
    toast.textContent = msg;
    toast.classList.add('show');
    
    // Add random heart on tease
    if (Math.random() > 0.5) {
        createHeartEffect(toast);
    }
    
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function handleNoClick() {
    noClickCount++;
    
    // Clear any existing animation
    if (gifAnimationInterval) {
        clearInterval(gifAnimationInterval);
    }
    
    // Cycle through guilt-trip messages with smooth transition
    const msgIndex = Math.min(noClickCount, noMessages.length - 1);
    noBtn.style.opacity = '0';
    setTimeout(() => {
        noBtn.textContent = noMessages[msgIndex];
        noBtn.style.opacity = '1';
    }, 150);
    
    // Grow the Yes button bigger each time with smooth animation
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
    yesBtn.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    yesBtn.style.fontSize = `${currentSize * 1.3}px`;
    const padY = Math.min(18 + noClickCount * 4, 60);
    const padX = Math.min(45 + noClickCount * 8, 120);
    yesBtn.style.padding = `${padY}px ${padX}px`;
    
    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize);
        noBtn.style.transition = 'all 0.3s ease';
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`;
    }
    
    // Add shake effect to no button
    noBtn.classList.add('button-shake');
    setTimeout(() => {
        noBtn.classList.remove('button-shake');
    }, 300);
    
    // Swap cat GIF through stages with enhanced transitions
    const gifIndex = Math.min(noClickCount, gifStages.length - 1);
    swapGif(gifStages[gifIndex]);
    
    // Add floating hearts on each no click
    if (noClickCount > 2) {
        createHeartRain();
    }
    
    // Runaway starts at click 4 (sooner for more fun)
    if (noClickCount >= 4 && !runawayEnabled) {
        enableRunaway();
        runawayEnabled = true;
        showTeaseMessage("Uh oh! The no button is playing hide and seek! 🏃‍♂️");
    }
    
    // Special effects at certain thresholds
    if (noClickCount === 3) {
        createHeartRain();
        createHeartRain();
    }
    
    if (noClickCount === 5) {
        // Dramatic effect
        document.body.style.animation = 'shakeScreen 0.3s ease';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 300);
    }
}

function swapGif(gifData) {
    // Remove all effect classes
    catGif.className = '';
    
    // Fade out
    catGif.style.opacity = '0';
    catGif.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        // Change GIF
        catGif.src = gifData.src;
        catGif.alt = gifData.alt;
        
        // Fade in with effect
        catGif.style.opacity = '1';
        catGif.style.transform = 'scale(1)';
        
        // Add effect class based on stage
        catGif.classList.add(`gif-effect-${gifData.effect}`);
        
        // Special handling for final stage
        if (gifData.effect === 'float-away') {
            setTimeout(() => {
                catGif.style.opacity = '0.5';
            }, 1000);
        }
    }, 200);
}

function enableRunaway() {
    noBtn.style.transition = 'left 0.3s ease, top 0.3s ease';
    noBtn.addEventListener('mouseover', runAway);
    noBtn.addEventListener('touchstart', runAway, { passive: true });
    
    // Add initial warning
    noBtn.style.border = '3px dashed #ff6b6b';
}

function runAway() {
    const margin = 20;
    const btnW = noBtn.offsetWidth;
    const btnH = noBtn.offsetHeight;
    const maxX = window.innerWidth - btnW - margin;
    const maxY = window.innerHeight - btnH - margin;

    const randomX = Math.random() * maxX + margin / 2;
    const randomY = Math.random() * maxY + margin / 2;

    noBtn.style.position = 'fixed';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    noBtn.style.zIndex = '50';
    
    // Add escape message sometimes
    if (Math.random() > 0.7) {
        const escapeMessages = ["Too slow! 😜", "Can't catch me!", "Over here! 👋", "Boop! ✨"];
        showTeaseMessage(escapeMessages[Math.floor(Math.random() * escapeMessages.length)]);
    }
    
    // Create heart trail
    if (Math.random() > 0.5) {
        createHeartEffect(noBtn);
    }
}

// Add shake screen animation
const shakeScreenKeyframes = `
    @keyframes shakeScreen {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
    }
`;
const shakeStyle = document.createElement('style');
shakeStyle.textContent = shakeScreenKeyframes;
document.head.appendChild(shakeStyle);

// Preload GIFs for smoother transitions
function preloadGifs() {
    gifStages.forEach(gif => {
        const img = new Image();
        img.src = gif.src;
    });
}
preloadGifs();

// Add hover effects for buttons
yesBtn.addEventListener('mouseenter', () => {
    if (!runawayEnabled) {
        yesBtn.style.transform = 'scale(1.05)';
    }
});

yesBtn.addEventListener('mouseleave', () => {
    yesBtn.style.transform = 'scale(1)';
});

noBtn.addEventListener('mouseenter', () => {
    if (!runawayEnabled) {
        noBtn.style.transform = 'scale(1.02)';
    }
});

noBtn.addEventListener('mouseleave', () => {
    noBtn.style.transform = 'scale(1)';
});

// Make the container slightly interactive
container.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    container.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

container.addEventListener('mouseleave', () => {
    container.style.transform = 'rotateY(0deg) rotateX(0deg)';
});
