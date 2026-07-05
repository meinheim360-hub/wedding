/**
 * Luxury Wedding Website Interactive Controller
 * Features: Web Audio Synthesizer, LocalStorage RSVP Database, Wishes Wall, Canvas Particles, Live Stream Simulator, Image Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCountdown();
  initAudioSynth();
  initScrollReveal();
  initMobileNav();
  initGallery();
  initLiveStream();
  initRsvp();
  initWishes();
  initShareModal();
  initWelcomeOverlay();
});

// ==========================================
// 1. DYNAMIC GOLD DUST CANVAS PARTICLES
// ==========================================
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  
  let petals = [];
  const petalCount = 55;
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  
  class RosePetal {
    constructor() {
      this.reset();
      // Scatter petals across the screen height on load
      this.y = Math.random() * canvas.height;
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -40 - Math.random() * 60;
      this.size = Math.random() * 10 + 8; // Size between 8px and 18px
      this.speedY = Math.random() * 1.2 + 0.8; // Gentler falling speed
      this.speedX = Math.random() * 0.4 - 0.2; // Base drift
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.015;
      
      // Sway parameters (horizontal wind oscillation)
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.swayWidth = Math.random() * 1.2 + 0.4;
      
      // 3D tumbling/flipping parameters
      this.flip = Math.random() * Math.PI * 2;
      this.flipSpeed = Math.random() * 0.03 + 0.015;
      
      // High-end Rose Blush color palette (Dusty Rose, Blush Pink, Cream Rose)
      const hue = Math.floor(Math.random() * 20) + 342; // Hues between 342 (pink) and 362 (deep crimson)
      const sat = Math.floor(Math.random() * 20) + 70;  // Saturation 70% to 90%
      const light = Math.floor(Math.random() * 15) + 65; // Lightness 65% to 80%
      
      this.colorGradStart = `hsl(${hue}, ${sat}%, ${light}%)`;
      this.colorGradEnd = `hsl(${hue - 15}, ${sat - 12}%, ${light - 15}%)`; // Darker base shading
      
      this.opacity = Math.random() * 0.35 + 0.65; // Opacity 0.65 to 1.0 for layering depth
    }
    
    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.sway) * this.swayWidth;
      
      this.rotation += this.rotationSpeed;
      this.sway += this.swaySpeed;
      this.flip += this.flipSpeed;
      
      // Reset when falling out of bounds
      if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      // Cosine scaling creates the 3D flip illusion as it tumbles
      ctx.scale(Math.cos(this.flip), 1.0);
      ctx.globalAlpha = this.opacity;
      
      // 3D petal gradient
      const grad = ctx.createLinearGradient(0, -this.size / 2, 0, this.size * 0.8);
      grad.addColorStop(0, this.colorGradStart);
      grad.addColorStop(1, this.colorGradEnd);
      
      // Draw organic petal shape
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.bezierCurveTo(
        -this.size * 1.1, -this.size * 0.4, 
        -this.size * 0.9, this.size * 0.6, 
        0, this.size * 0.8
      );
      ctx.bezierCurveTo(
        this.size * 0.9, this.size * 0.6, 
        this.size * 1.1, -this.size * 0.4, 
        0, -this.size / 2
      );
      
      ctx.fillStyle = grad;
      // Soft ambient shadow under each petal
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(42, 42, 42, 0.05)';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;
      ctx.fill();
      
      ctx.restore();
    }
  }
  
  for (let i = 0; i < petalCount; i++) {
    petals.push(new RosePetal());
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    petals.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  
  animate();
}

// ==========================================
// 2. WEDDING COUNTDOWN TIMER
// ==========================================
function initCountdown() {
  // Target Wedding Date: November 8, 2026 at 16:00 (Paris time is roughly UTC+2)
  const targetDate = new Date('November 8, 2026 16:00:00').getTime();
  
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');
  
  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minsEl.textContent = minutes.toString().padStart(2, '0');
    secsEl.textContent = seconds.toString().padStart(2, '0');
  }
  
  updateTimer();
  setInterval(updateTimer, 1000);
}

// ==========================================
// 3. AMBIENT MUSIC PLAYER (YOUTUBE INTEGRATION & WEB AUDIO SYNTH FALLBACK)
// ==========================================
let ytPlayer = null;
let ytPlayerReady = false;
let isAmbientPlaying = false;
let ambientSynth = null;

// Global Audio control methods
function playAmbientMusic() {
  if (isAmbientPlaying) return;
  
  const container = document.getElementById('audioContainer');
  const toggle = document.getElementById('audioToggle');
  if (!container || !toggle) return;
  
  const playIcon = toggle.querySelector('.icon-play');
  const pauseIcon = toggle.querySelector('.icon-pause');
  
  if (ytPlayer && ytPlayerReady) {
    try {
      ytPlayer.playVideo();
    } catch(e) {
      console.warn("YouTube play failed, starting fallback synth", e);
      if (!ambientSynth) ambientSynth = new AmbientMelodySynth();
      ambientSynth.start();
    }
  } else {
    if (!ambientSynth) ambientSynth = new AmbientMelodySynth();
    ambientSynth.start();
  }
  
  container.classList.add('playing');
  playIcon.classList.add('hidden');
  pauseIcon.classList.remove('hidden');
  isAmbientPlaying = true;
}

function pauseAmbientMusic() {
  if (!isAmbientPlaying) return;
  
  const container = document.getElementById('audioContainer');
  const toggle = document.getElementById('audioToggle');
  if (!container || !toggle) return;
  
  const playIcon = toggle.querySelector('.icon-play');
  const pauseIcon = toggle.querySelector('.icon-pause');
  
  if (ytPlayer && ytPlayerReady) {
    try {
      ytPlayer.pauseVideo();
    } catch(e) {
      console.warn("YouTube pause failed, stopping fallback synth", e);
    }
  } else if (ambientSynth) {
    ambientSynth.stop();
  }
  
  container.classList.remove('playing');
  playIcon.classList.remove('hidden');
  pauseIcon.classList.add('hidden');
  isAmbientPlaying = false;
}

function tryAutoplay() {
  // 1. Try standard play immediately on player ready
  playAmbientMusic();
  
  // 2. Set up listeners to play as soon as the user interacts with the page (bypasses browser autoplay blocks)
  const startPlayOnGesture = () => {
    if (!isAmbientPlaying) {
      playAmbientMusic();
    }
    // Clean up listeners
    document.removeEventListener('click', startPlayOnGesture);
    document.removeEventListener('touchstart', startPlayOnGesture);
    document.removeEventListener('scroll', startPlayOnGesture);
    document.removeEventListener('keydown', startPlayOnGesture);
  };
  
  document.addEventListener('click', startPlayOnGesture);
  document.addEventListener('touchstart', startPlayOnGesture);
  document.addEventListener('scroll', startPlayOnGesture);
  document.addEventListener('keydown', startPlayOnGesture);
}

// Inject YouTube Iframe API script dynamically
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('ytPlayerContainer', {
    height: '0',
    width: '0',
    videoId: 'UtbxruJ2r1w',
    playerVars: {
      'autoplay': 1,
      'controls': 0,
      'loop': 1,
      'playlist': 'UtbxruJ2r1w', // Required for loop to work
      'playsinline': 1,
      'enablejsapi': 1
    },
    events: {
      'onReady': () => {
        ytPlayerReady = true;
        // Attempt autoplay on ready
        tryAutoplay();
      },
      'onError': (e) => {
        console.warn("YouTube Player failed to initialize. Falling back to Web Audio Synth.", e);
      }
    }
  });
};

class AmbientMelodySynth {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Node setup: synth -> filter -> delay -> master gain -> output
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.15; // Soft volume
    
    this.delay = this.ctx.createDelay(1.0);
    this.delayFeedback = this.ctx.createGain();
    
    this.delay.delayTime.value = 0.6; // Soothing echo
    this.delayFeedback.gain.value = 0.45; // Slow echo decay
    
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 800; // Warm, dark filter to sound like a soft felt piano
    
    // Connections
    this.delay.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delay);
    
    this.filter.connect(this.masterGain);
    this.filter.connect(this.delay);
    this.delay.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
    
    this.isPlaying = false;
    this.sequenceTimer = null;
    this.bassTimer = null;
    this.step = 0;
    
    // Pentatonic Scale notes (C major pentatonic: C4, D4, E4, G4, A4, C5, D5, E5, G5, A5)
    this.scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
    
    // Chord progression bass roots (C3, Am3, F3, G3)
    this.chords = [
      [130.81, 196.00], // C3 & G3
      [110.00, 165.00], // A2 & E3
      [87.31, 130.81],  // F2 & C3
      [98.00, 146.83]   // G2 & D3
    ];
    this.chordIdx = 0;
  }
  
  playNote(freq, startTime, duration) {
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    
    // Soft triangle/sine wave mixture for a warm electric piano tone
    osc.type = 'sine';
    
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(0.4, startTime + 0.1); // Slow attack
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); // Long release
    
    osc.frequency.setValueAtTime(freq, startTime);
    osc.connect(noteGain);
    noteGain.connect(this.filter);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  }
  
  start() {
    this.isPlaying = true;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    const scheduleMelody = () => {
      if (!this.isPlaying) return;
      const now = this.ctx.currentTime;
      
      // Randomly play a note from the pentatonic scale to create an endless ambient flow
      if (Math.random() > 0.3) {
        const randomNote = this.scale[Math.floor(Math.random() * this.scale.length)];
        // Slightly detune to give warm analog character
        const noteFreq = randomNote * (1 + (Math.random() - 0.5) * 0.004);
        this.playNote(noteFreq, now, 1.8);
      }
      
      // Next note timing (slow tempo)
      const nextTime = Math.random() * 600 + 400; // 400ms to 1000ms steps
      this.sequenceTimer = setTimeout(scheduleMelody, nextTime);
    };
    
    const scheduleBass = () => {
      if (!this.isPlaying) return;
      const now = this.ctx.currentTime;
      const currentChord = this.chords[this.chordIdx];
      
      // Play bass pad
      currentChord.forEach(f => {
        this.playNote(f, now, 4.8);
      });
      
      this.chordIdx = (this.chordIdx + 1) % this.chords.length;
      this.bassTimer = setTimeout(scheduleBass, 5000); // Pad changes every 5 seconds
    };
    
    scheduleMelody();
    scheduleBass();
  }
  
  stop() {
    this.isPlaying = false;
    clearTimeout(this.sequenceTimer);
    clearTimeout(this.bassTimer);
  }
}

function initAudioSynth() {
  const container = document.getElementById('audioContainer');
  if (!container) return;
  
  container.addEventListener('click', () => {
    if (isAmbientPlaying) {
      pauseAmbientMusic();
    } else {
      playAmbientMusic();
    }
  });
}

// ==========================================
// 4. SCROLL REVEAL (INTERSECTION OBSERVER)
// ==========================================
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once active to keep animation simple and performant
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  elements.forEach(el => observer.observe(el));
  
  // Navbar Scrolled Effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Auto active nav links on scroll
    const scrollPos = window.scrollY + 200;
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

// ==========================================
// 5. MOBILE NAVIGATION MENU
// ==========================================
function initMobileNav() {
  const toggle = document.getElementById('mobileNavToggle');
  const navLinksContainer = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');
  
  toggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
    toggle.classList.toggle('active');
  });
  
  links.forEach(l => {
    l.addEventListener('click', () => {
      navLinksContainer.classList.remove('active');
      toggle.classList.remove('active');
    });
  });
}

// ==========================================
// 6. PHOTO GALLERY FILTERS & LIGHTBOX
// ==========================================
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxImgContainer = document.getElementById('lightboxImgContainer');
  const lightboxCaption = document.getElementById('lightboxCaption');
  
  let activeItems = [...galleryItems];
  let currentIdx = 0;
  
  // Filtering Logic
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      activeItems = [];
      
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          activeItems.push(item);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
  
  // Lightbox Activation
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      currentIdx = activeItems.indexOf(item);
      openLightbox();
    });
  });
  
  function openLightbox() {
    const activeItem = activeItems[currentIdx];
    const imgPlaceholder = activeItem.querySelector('.img-placeholder');
    const bgStyle = window.getComputedStyle(imgPlaceholder).backgroundImage;
    const caption = imgPlaceholder.getAttribute('data-caption');
    const label = imgPlaceholder.querySelector('.photo-desc').textContent;
    
    // Create large visual representation inside the lightbox img container
    lightboxImgContainer.innerHTML = '';
    
    const displayCard = document.createElement('div');
    displayCard.className = 'img-placeholder';
    displayCard.style.backgroundImage = bgStyle;
    displayCard.style.width = '100%';
    displayCard.style.height = '100%';
    
    const cardBorder = document.createElement('div');
    cardBorder.style.position = 'absolute';
    cardBorder.style.top = '20px';
    cardBorder.style.left = '20px';
    cardBorder.style.right = '20px';
    cardBorder.style.bottom = '20px';
    cardBorder.style.border = '1px solid rgba(255,255,255,0.2)';
    
    const labelSpan = document.createElement('span');
    labelSpan.className = 'photo-desc';
    labelSpan.style.fontSize = '2.5rem';
    labelSpan.textContent = label;
    
    displayCard.appendChild(cardBorder);
    displayCard.appendChild(labelSpan);
    lightboxImgContainer.appendChild(displayCard);
    
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
  }
  
  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });
  
  lightboxPrev.addEventListener('click', () => {
    currentIdx = (currentIdx - 1 + activeItems.length) % activeItems.length;
    openLightbox();
  });
  
  lightboxNext.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % activeItems.length;
    openLightbox();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lightbox.classList.remove('active');
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });
}

// ==========================================
// 7. LIVE STREAM SIMULATOR (CANVAS ENGINE)
// ==========================================
function initLiveStream() {
  const btnPlay = document.getElementById('btnPlayStream');
  const overlay = document.getElementById('playerOverlay');
  const canvas = document.getElementById('videoCanvas');
  const ctx = canvas.getContext('2d');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatInputForm');
  const streamSelector = document.getElementById('streamSelector');
  const viewerCountEl = document.getElementById('viewerCount');
  
  let streamPlaying = false;
  let heartParticles = [];
  let ringRotation = 0;
  let textAlpha = 1;
  let textFadeDirection = -1;
  
  canvas.width = 640;
  canvas.height = 360;
  
  // Pre-fill canvas with stylized black placeholder
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw gold design lines initially
  ctx.strokeStyle = 'rgba(197, 168, 128, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  
  ctx.font = '24px Cormorant Garamond';
  ctx.fillStyle = '#C5A880';
  ctx.textAlign = 'center';
  ctx.fillText('NITHIN & AMALA Wedding Stream', canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = '12px Inter';
  ctx.fillStyle = '#666';
  ctx.fillText('Broadcast starts November 8, 2026', canvas.width / 2, canvas.height / 2 + 20);
  
  // Heart float engine for the live stream (simulates guests typing heart reactions!)
  class StreamHeart {
    constructor() {
      this.reset();
      this.y = canvas.height + Math.random() * 50;
    }
    
    reset() {
      this.x = canvas.width - 50 - Math.random() * 60;
      this.y = canvas.height + 10;
      this.size = Math.random() * 8 + 6;
      this.speedY = -(Math.random() * 1.5 + 0.8);
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.5;
      this.alpha = 1.0;
      this.hue = Math.random() > 0.4 ? 350 : 45; // Pink or Gold
    }
    
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.alpha -= 0.005;
      if (this.alpha <= 0 || this.y < 50) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, 1)`;
      
      // Simple canvas heart path
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.bezierCurveTo(this.x - this.size / 2, this.y - this.size / 2, this.x - this.size, this.y + this.size / 3, this.x, this.y + this.size);
      ctx.bezierCurveTo(this.x + this.size, this.y + this.size / 3, this.x + this.size / 2, this.y - this.size / 2, this.x, this.y);
      ctx.fill();
      ctx.restore();
    }
  }
  
  btnPlay.addEventListener('click', () => {
    streamPlaying = true;
    overlay.classList.add('hidden');
    
    // Spawn heart animations
    for (let i = 0; i < 20; i++) {
      heartParticles.push(new StreamHeart());
    }
    
    renderStream();
    startChatSimulator();
  });
  
  streamSelector.addEventListener('change', () => {
    if (!streamPlaying) return;
    
    // Print source switch notification in chat
    const selectedText = streamSelector.options[streamSelector.selectedIndex].text;
    appendSystemMessage(`Switched feed to: ${selectedText}`);
  });
  
  // Custom video screen simulation renderer
  function renderStream() {
    if (!streamPlaying) return;
    
    // Draw background video landscape gradient (simulating a beautiful twilight ceremony)
    const videoGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    videoGrad.addColorStop(0, '#15131A');
    videoGrad.addColorStop(0.5, '#2D1E2A');
    videoGrad.addColorStop(1, '#1A1822');
    ctx.fillStyle = videoGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle video grid/scanning effect
    ctx.fillStyle = 'rgba(255,255,255,0.015)';
    for (let y = 0; y < canvas.height; y += 4) {
      ctx.fillRect(0, y, canvas.width, 2);
    }
    
    // Draw overlay graphical graphics (e.g. golden interlocking wedding rings rotating)
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2 - 20);
    ringRotation += 0.005;
    
    ctx.strokeStyle = '#C5A880';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#C5A880';
    ctx.lineWidth = 3;
    
    // Ring 1
    ctx.beginPath();
    ctx.arc(-25, 0, 45, 0, Math.PI * 2);
    ctx.stroke();
    
    // Ring 2
    ctx.beginPath();
    ctx.arc(25, 0, 45, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    
    // Floating Title overlay
    ctx.save();
    textAlpha += textFadeDirection * 0.008;
    if (textAlpha <= 0.4 || textAlpha >= 1.0) textFadeDirection *= -1;
    ctx.font = 'italic 20px Cormorant Garamond';
    ctx.fillStyle = `rgba(255,255,255, ${textAlpha})`;
    ctx.textAlign = 'center';
    ctx.fillText('Live from Château de Coulance...', canvas.width / 2, canvas.height / 2 + 70);
    ctx.restore();
    
    // Broadcast watermark
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px Inter';
    ctx.textAlign = 'left';
    ctx.fillText('CAM-01 CHÂTEAU GARDEN', 35, 45);
    
    // Audio waveform animation visualizer in streaming screen
    ctx.fillStyle = 'rgba(197, 168, 128, 0.7)';
    for (let i = 0; i < 15; i++) {
      const barHeight = Math.sin(Date.now() * 0.005 + i) * 15 + 18;
      ctx.fillRect(35 + i * 5, canvas.height - 45 - barHeight, 3, barHeight);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('AUDIO FEED ACTIVE', 120, canvas.height - 45);
    
    // Hearts reactions rendering
    heartParticles.forEach(heart => {
      heart.update();
      heart.draw();
    });
    
    requestAnimationFrame(renderStream);
  }
  
  // Chat simulator messages database
  const simulationPhrases = [
    { sender: 'Clarissa Brooks', text: 'Amala you look like a princess! 😍' },
    { sender: 'David Jenkins', text: 'Cheers from Boston! Congratulations guys!' },
    { sender: 'Marie Laurent', text: 'So proud of you both, absolutely gorgeous. ❤️' },
    { sender: 'Lucas Durand', text: 'Château is looking incredible! Wish I could be there.' },
    { sender: 'George & Diana', text: 'Such a beautiful couple! Best wishes!' },
    { sender: 'Emma Smith', text: 'Aww the ring exchange was perfect! 😭💍' },
    { sender: 'Philippe', text: 'Vive les mariés ! 🥂🍾' }
  ];
  
  let chatTimer = null;
  let viewerCount = 142;
  
  function startChatSimulator() {
    function postRandomMsg() {
      if (!streamPlaying) return;
      const randPhrase = simulationPhrases[Math.floor(Math.random() * simulationPhrases.length)];
      appendChatMessage(randPhrase.sender, randPhrase.text);
      
      // Fluctuating viewers count
      viewerCount += Math.floor(Math.random() * 5) - 2;
      viewerCountEl.textContent = `${viewerCount} Watching`;
      
      // Schedule next message
      chatTimer = setTimeout(postRandomMsg, Math.random() * 6000 + 3000);
    }
    chatTimer = setTimeout(postRandomMsg, 2000);
  }
  
  function appendChatMessage(sender, text) {
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg';
    msgEl.innerHTML = `<span class="sender">${escapeHTML(sender)}:</span><span>${escapeHTML(text)}</span>`;
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Clean old messages to prevent lagging
    if (chatMessages.children.length > 50) {
      chatMessages.removeChild(chatMessages.children[0]);
    }
  }
  
  function appendSystemMessage(text) {
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg system';
    msgEl.textContent = text;
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('chatUserName');
    const textInput = document.getElementById('chatMsgText');
    
    if (nameInput.value.trim() && textInput.value.trim()) {
      appendChatMessage(nameInput.value, textInput.value);
      textInput.value = '';
      
      // Auto trigger floating heart reaction when user comments!
      if (streamPlaying && heartParticles.length > 0) {
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const extraHeart = new StreamHeart();
            extraHeart.alpha = 1.0;
            extraHeart.reset();
            heartParticles.push(extraHeart);
          }, i * 200);
        }
      }
    }
  });
}

// ==========================================
// 8. RSVP SUBMISSION & DATABASE
// ==========================================
function initRsvp() {
  const rsvpForm = document.getElementById('rsvpForm');
  const attendanceRadios = document.getElementsByName('attendance');
  const detailsFields = document.getElementById('rsvpDetailsFields');
  
  const rsvpModal = document.getElementById('rsvpModal');
  const closeRsvpModal = document.getElementById('closeRsvpModal');
  const printTicketBtn = document.getElementById('btnPrintTicket');
  
  const ticketGuestName = document.getElementById('ticketGuestName');
  const ticketStatus = document.getElementById('ticketStatus');
  const ticketSeats = document.getElementById('ticketSeats');
  const ticketMeal = document.getElementById('ticketMeal');
  const ticketQrCode = document.getElementById('ticketQrCode');
  
  // Dashboard Elements
  const dashboardTrigger = document.getElementById('dashboardTrigger');
  const adminModal = document.getElementById('adminModal');
  const closeAdminModal = document.getElementById('closeAdminModal');
  const adminTableBody = document.getElementById('adminRsvpTableBody');
  const btnExportCSV = document.getElementById('btnExportCSV');
  const btnClearRsvps = document.getElementById('btnClearRsvps');
  
  const statTotalRsvps = document.getElementById('statTotalRsvps');
  const statAccepts = document.getElementById('statAccepts');
  const statDeclines = document.getElementById('statDeclines');
  const statTotalGuests = document.getElementById('statTotalGuests');
  
  // Toggle RSVP extra details inputs based on attendance status
  attendanceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'accepts') {
        detailsFields.classList.remove('hidden');
        document.getElementById('rsvpCount').required = true;
        document.getElementById('rsvpMeal').required = true;
      } else {
        detailsFields.classList.add('hidden');
        document.getElementById('rsvpCount').required = false;
        document.getElementById('rsvpMeal').required = false;
      }
    });
  });
  
  // Handle RSVP Submit
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('rsvpName').value.trim();
    const email = document.getElementById('rsvpEmail').value.trim();
    const attendance = document.querySelector('input[name="attendance"]:checked').value;
    
    let guestCount = 0;
    let mealPreference = 'N/A';
    let songRequest = 'None';
    
    if (attendance === 'accepts') {
      guestCount = parseInt(document.getElementById('rsvpCount').value, 10);
      mealPreference = document.getElementById('rsvpMeal').options[document.getElementById('rsvpMeal').selectedIndex].text;
      songRequest = document.getElementById('rsvpSong').value.trim() || 'None';
    }
    
    const rsvpData = {
      id: Date.now().toString(),
      name,
      email,
      attendance,
      guestCount,
      mealPreference,
      songRequest,
      date: new Date().toLocaleDateString()
    };
    
    // Save to LocalStorage DB
    const existingRsvps = JSON.parse(localStorage.getItem('wedding_rsvps')) || [];
    existingRsvps.push(rsvpData);
    localStorage.setItem('wedding_rsvps', JSON.stringify(existingRsvps));
    
    // Generate Pass Details
    ticketGuestName.textContent = name;
    ticketStatus.textContent = attendance === 'accepts' ? 'CONFIRMED' : 'DECLINED';
    ticketSeats.textContent = attendance === 'accepts' ? `${guestCount} Guest(s)` : '0 Seats';
    ticketMeal.textContent = attendance === 'accepts' ? mealPreference : 'N/A';
    
    // Generate QR Code mockup
    generateQrMockup(ticketQrCode, `PASS-N&A-${rsvpData.id}`);
    
    // Open Ticket Modal
    rsvpModal.classList.add('active');
    
    // Clear form
    rsvpForm.reset();
    detailsFields.classList.remove('hidden');
    
    // Refresh admin tables
    renderAdminDashboard();
  });
  
  closeRsvpModal.addEventListener('click', () => {
    rsvpModal.classList.remove('active');
  });
  
  printTicketBtn.addEventListener('click', () => {
    window.print();
  });
  
  // Admin Dashboard Activation
  dashboardTrigger.addEventListener('click', () => {
    renderAdminDashboard();
    adminModal.classList.add('active');
  });
  
  closeAdminModal.addEventListener('click', () => {
    adminModal.classList.remove('active');
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === rsvpModal) rsvpModal.classList.remove('active');
    if (e.target === adminModal) adminModal.classList.remove('active');
  });
  
  function renderAdminDashboard() {
    const rsvps = JSON.parse(localStorage.getItem('wedding_rsvps')) || [];
    
    // Compute stats
    let total = rsvps.length;
    let accepts = 0;
    let declines = 0;
    let totalGuests = 0;
    
    adminTableBody.innerHTML = '';
    
    rsvps.forEach(r => {
      if (r.attendance === 'accepts') {
        accepts++;
        totalGuests += r.guestCount;
      } else {
        declines++;
      }
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${escapeHTML(r.name)}</strong></td>
        <td>${escapeHTML(r.email)}</td>
        <td><span class="badge ${r.attendance === 'accepts' ? 'badge-success' : 'badge-danger'}">${r.attendance === 'accepts' ? 'Going' : 'Declined'}</span></td>
        <td>${r.guestCount}</td>
        <td>${escapeHTML(r.mealPreference)}</td>
        <td><span class="text-muted">${escapeHTML(r.songRequest)}</span></td>
        <td><button class="btn btn-outline btn-sm text-danger" style="padding: 2px 8px; font-size:0.7rem;" data-id="${r.id}">Delete</button></td>
      `;
      
      // Delete single response
      tr.querySelector('button').addEventListener('click', (e) => {
        const targetId = e.target.getAttribute('data-id');
        const updated = rsvps.filter(item => item.id !== targetId);
        localStorage.setItem('wedding_rsvps', JSON.stringify(updated));
        renderAdminDashboard();
      });
      
      adminTableBody.appendChild(tr);
    });
    
    if (rsvps.length === 0) {
      adminTableBody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 2rem; color: #888;">No RSVP submissions yet.</td></tr>`;
    }
    
    statTotalRsvps.textContent = total;
    statAccepts.textContent = accepts;
    statDeclines.textContent = declines;
    statTotalGuests.textContent = totalGuests;
  }
  
  // Reset Database
  btnClearRsvps.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all RSVP guest entries? This action is permanent.')) {
      localStorage.removeItem('wedding_rsvps');
      renderAdminDashboard();
    }
  });
  
  // Export CSV File
  btnExportCSV.addEventListener('click', () => {
    const rsvps = JSON.parse(localStorage.getItem('wedding_rsvps')) || [];
    if (rsvps.length === 0) {
      alert('No RSVP data to export.');
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Email,Attendance,Guests,Meal,Song Request,DateSubmitted\n";
    
    rsvps.forEach(r => {
      const row = [
        r.id,
        `"${r.name.replace(/"/g, '""')}"`,
        `"${r.email.replace(/"/g, '""')}"`,
        r.attendance,
        r.guestCount,
        `"${r.mealPreference.replace(/"/g, '""')}"`,
        `"${r.songRequest.replace(/"/g, '""')}"`,
        r.date
      ].join(",");
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", "wedding_rsvps_export.csv");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  });
}

// ==========================================
// 9. INTERACTIVE WISHES WALL (GUESTBOOK)
// ==========================================
function initWishes() {
  const form = document.getElementById('wishesForm');
  const wishesGrid = document.getElementById('wishesGrid');
  
  // Pre-load mock guest wishes so the wall is beautiful at first glance
  const defaultWishes = [
    { name: "George & Sarah Jenkins", message: "Congratulations NITHIN & AMALA! We are thrilled to celebrate with you at Château de Coulance. You look amazing!", theme: "gold" },
    { name: "Emily Laurent", message: "Wishing you both a lifetime of love, laughter, and endless coffee shops. May your love grow stronger each day!", theme: "rose" },
    { name: "Uncle Robert & Aunt Helen", message: "A match made in heaven. Cheers to the beautiful proposal on the Seine and the wonderful journey ahead. Blessings!", theme: "navy" }
  ];
  
  function getWishes() {
    const saved = localStorage.getItem('wedding_wishes');
    if (!saved) {
      localStorage.setItem('wedding_wishes', JSON.stringify(defaultWishes));
      return defaultWishes;
    }
    return JSON.parse(saved);
  }
  
  function renderWishes() {
    const wishes = getWishes();
    wishesGrid.innerHTML = '';
    
    // Render in reverse chronological order
    wishes.slice().reverse().forEach(w => {
      const card = document.createElement('div');
      card.className = `wish-card theme-${w.theme}`;
      card.innerHTML = `
        <p>"${escapeHTML(w.message)}"</p>
        <div class="wish-author">${escapeHTML(w.name)}</div>
      `;
      wishesGrid.appendChild(card);
    });
  }
  
  // Theme selectors layout handling
  const themeLabels = document.querySelectorAll('.card-design-selector .design-btn');
  themeLabels.forEach(label => {
    label.addEventListener('click', () => {
      themeLabels.forEach(lbl => lbl.classList.remove('active'));
      label.classList.add('active');
    });
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('wishName').value.trim();
    const message = document.getElementById('wishMessage').value.trim();
    const theme = document.querySelector('input[name="wishTheme"]:checked').value;
    
    const newWish = { name, message, theme };
    
    const wishes = getWishes();
    wishes.push(newWish);
    localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
    
    renderWishes();
    form.reset();
    
    // Reset selection styling
    themeLabels.forEach(lbl => lbl.classList.remove('active'));
    document.querySelector('.opt-gold').classList.add('active');
    document.querySelector('input[value="gold"]').checked = true;
  });
  
  renderWishes();
}

// ==========================================
// 10. DIGITAL INVITATION CARD PDF & SHARE
// ==========================================
function initShareModal() {
  const btnPrint = document.getElementById('btnPrintInvite');
  const btnShare = document.getElementById('btnShareInvite');
  const shareModal = document.getElementById('shareModal');
  const closeShare = document.getElementById('closeShareModal');
  const qrContainer = document.getElementById('shareQrCode');
  
  const whatsappLink = document.getElementById('shareWhatsapp');
  const copyLink = document.getElementById('shareCopyLink');
  const emailLink = document.getElementById('shareEmail');
  const copyStatus = document.getElementById('copyStatusText');
  
  const footWA = document.getElementById('footShareWhatsApp');
  const footFB = document.getElementById('footShareFB');
  const footIG = document.getElementById('footShareInsta');
  const footMail = document.getElementById('footShareMail');
  
  const weddingUrl = window.location.href;
  
  btnPrint.addEventListener('click', () => {
    // Media queries handle layout shifts. Simply trigger standard printing.
    window.print();
  });
  
  btnShare.addEventListener('click', () => {
    // Generate share QR Code mockup
    generateQrMockup(qrContainer, weddingUrl);
    
    // Set dynamic links
    whatsappLink.setAttribute('href', `https://api.whatsapp.com/send?text=You%20are%20invited%20to%20our%20wedding!%20View%20invitation%20here:%20${encodeURIComponent(weddingUrl)}`);
    emailLink.setAttribute('href', `mailto:?subject=NITHIN%20and%20AMALA%20Wedding%20Invitation&body=We%20invite%20you%20to%20visit%20our%20wedding%20website:%20${encodeURIComponent(weddingUrl)}`);
    
    shareModal.classList.add('active');
  });
  
  copyLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(weddingUrl).then(() => {
      copyStatus.classList.remove('hidden');
      setTimeout(() => {
        copyStatus.classList.add('hidden');
      }, 2000);
    });
  });
  
  closeShare.addEventListener('click', () => {
    shareModal.classList.remove('active');
  });
  
  // Footer Social Shares
  footWA.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(`https://api.whatsapp.com/send?text=Visit%20NITHIN%20%26%20AMALA%27s%20wedding%20website%20here:%20${encodeURIComponent(weddingUrl)}`, '_blank');
  });
  
  footFB.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(weddingUrl)}`, '_blank');
  });
  
  footIG.addEventListener('click', (e) => {
    e.preventDefault();
    alert("Copy this URL to share in your Instagram Story / Bio:\n" + weddingUrl);
  });
  
  footMail.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(`mailto:?subject=NITHIN%20%26%20AMALA%20Wedding&body=Here%20is%20the%20link%20to%20our%20wedding%20website:%20${encodeURIComponent(weddingUrl)}`, '_blank');
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === shareModal) shareModal.classList.remove('active');
  });
}

// ==========================================
// 11. STANDALONE DIGITAL QR MOCK GENERATOR
// ==========================================
/**
 * Renders a crisp, luxury SVG representation of a QR Code matrix.
 * Totally standalone, offline-proof, and incredibly stylish.
 */
function generateQrMockup(containerEl, dataString) {
  containerEl.innerHTML = '';
  
  const qrSize = 130;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', qrSize.toString());
  svg.setAttribute('height', qrSize.toString());
  svg.setAttribute('viewBox', '0 0 29 29'); // 29x29 matrix sizing (Version 3 QR format)
  svg.style.shapeRendering = 'crispEdges';
  
  // Generate pseudo-deterministic matrix grid using string hashing
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    hash = (hash << 5) - hash + dataString.charCodeAt(i);
    hash |= 0;
  }
  
  const matrixSize = 29;
  
  // Marker block locations helper
  function isMarkerBlock(r, c) {
    // Top-Left (7x7)
    if (r < 7 && c < 7) {
      return (r === 0 || r === 6 || c === 0 || c === 6) || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
    }
    // Top-Right (7x7)
    if (r < 7 && c >= matrixSize - 7) {
      const tc = c - (matrixSize - 7);
      return (r === 0 || r === 6 || tc === 0 || tc === 6) || (r >= 2 && r <= 4 && tc >= 2 && tc <= 4);
    }
    // Bottom-Left (7x7)
    if (r >= matrixSize - 7 && c < 7) {
      const tr = r - (matrixSize - 7);
      return (tr === 0 || tr === 6 || c === 0 || c === 6) || (tr >= 2 && tr <= 4 && c >= 2 && c <= 4);
    }
    // Timing patterns / aligners
    if (r === 6 || c === 6) {
      return (r % 2 === 0 && c % 2 === 0);
    }
    return false;
  }
  
  // Generate matrix points
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      let isFilled = false;
      
      if (isMarkerBlock(r, c)) {
        isFilled = true;
      } else {
        // Exclude quiet margins and randomize matrix bits deterministically
        const seedValue = Math.sin(r * 12.9898 + c * 78.233 + hash) * 43758.5453;
        const randomVal = seedValue - Math.floor(seedValue);
        isFilled = randomVal > 0.45;
      }
      
      if (isFilled) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', c.toString());
        rect.setAttribute('y', r.toString());
        rect.setAttribute('width', '1');
        rect.setAttribute('height', '1');
        rect.setAttribute('fill', '#1A1A1A'); // Luxury charcoal bits
        svg.appendChild(rect);
      }
    }
  }
  
  containerEl.appendChild(svg);
}

// ==========================================
// 12. SECURITY / HELPER UTILITIES
// ==========================================
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

function initWelcomeOverlay() {
  const overlay = document.getElementById('welcomeOverlay');
  const btnOpen = document.getElementById('btnOpenInvite');
  if (!overlay || !btnOpen) return;
  
  btnOpen.addEventListener('click', () => {
    // satisfying browser user-gesture policy immediately
    playAmbientMusic();
    
    // fade out the welcome card to reveal the falling rose petals
    overlay.classList.add('fade-out');
  });
}
