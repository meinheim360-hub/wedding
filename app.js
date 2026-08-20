/**
 * Luxury Wedding Website Interactive Controller
 * Features: Web Audio Synthesizer, LocalStorage RSVP Database, Wishes Wall, Canvas Particles, Live Stream Simulator, Image Lightbox
 */

// ==========================================
// WEDDING WEBSITE CONFIGURATION (EDITABLE)
// ==========================================
window.weddingConfig = {
  groomName: "Nithin",
  brideName: "Amala",
  initials: "N & A",
  weddingDate: "November 8, 2026",
  weddingTime: "4:00 PM", // Customizable wedding time
  countdownDate: "November 8, 2026 16:00:00", // Target countdown date (Month DD, YYYY HH:MM:SS)
  venueName: "Eden Garden",
  venueAddress: "Mallepelly, Pathanamthitta, Kerala, India",
  googleMapsLink: "https://maps.google.com/?q=Eden+Garden+Mallepelly+Pathanamthitta",
  musicYoutubeId: "UtbxruJ2r1w", // YouTube video ID for background music
  musicLocalPath: "", // Optional local MP3 path if uploaded (e.g. "assets/audio/music.mp3")
  
  // Custom texts
  welcomeSubtitle: "YOU ARE INVITED",
  invitationMessage: "Two hearts, one promise. Two souls, one journey. The lock has found its key, and a beautiful new chapter is about to begin. Join us as we celebrate the beginning of our forever.",
  
  // Photo URLs (Local assets in workspace)
  coverImage: "assets/images/photo1.png",
  heroImage: "assets/images/photo1.png",
  footerImage: "assets/images/photo4.png",
  storyImages: {
    firstMeet: "assets/images/photo2.png",
    firstTrip: "assets/images/photo3.png",
    proposal: "assets/images/photo4.png"
  },
  galleryImages: [
    { src: "assets/images/photo1.png", title: "Lake Side", desc: "Two hearts, one view. Holding hands at the dock." },
    { src: "assets/images/photo2.png", title: "Mountain Peak", desc: "Walking hand-in-hand in the peaceful mountains." },
    { src: "assets/images/photo3.png", title: "The Ride", desc: "Creating endless memories on our travels." },
    { src: "assets/images/photo4.png", title: "City Walk", desc: "Laughter in every step along the streets." }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  applyConfig(); // Initialize dynamic texts and configurations
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
  initScratchCard(); // Load the HTML5 scratch-off canvas
  initRingsScrollAnimation(); // Load the floating separate rings scroll-to-merge logic
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
      if (this.burstMode) {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.94; // Air friction
        this.vy *= 0.94; // Air friction
        this.vy += 0.12;  // Gravity
        
        this.rotation += this.rotationSpeed * 4;
        this.flip += this.flipSpeed * 4;
        
        // Decay burst mode and return to normal float
        if (Math.abs(this.vx) + Math.abs(this.vy) < 0.8) {
          this.burstMode = false;
          this.speedX = Math.random() * 0.4 - 0.2;
          this.speedY = Math.random() * 1.2 + 0.8;
        }
      } else {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.sway) * this.swayWidth;
        this.rotation += this.rotationSpeed;
        this.sway += this.swaySpeed;
        this.flip += this.flipSpeed;
      }
      
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
  
  // Expose global trigger for petal explosion (used on unlocking and scratching)
  window.triggerPetalBurst = function(x, y, count = 60) {
    const canvasX = x - window.scrollX;
    const canvasY = y - window.scrollY;

    for (let i = 0; i < count; i++) {
      const p = new RosePetal();
      p.x = canvasX;
      p.y = canvasY;
      p.burstMode = true;
      
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 2.5; // Explode outwards and slightly upwards
      
      // Let burst petals have a higher speed of rotation and flip
      p.rotationSpeed = (Math.random() - 0.5) * 0.08;
      p.flipSpeed = Math.random() * 0.1 + 0.05;
      
      petals.push(p);
    }
    
    // Prevent lag by capping active petals
    if (petals.length > 250) {
      petals.splice(0, petals.length - 250);
    }
  };
  
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
  const c = window.weddingConfig;
  const targetDate = new Date(c.countdownDate).getTime();
  
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
let ambientAudio = null; // HTML5 Audio for local MP3 files
let ambientSynth = null;

// Global Audio control methods
function playAmbientMusic() {
  if (isAmbientPlaying) return;
  
  const container = document.getElementById('audioContainer');
  const toggle = document.getElementById('audioToggle');
  if (!container || !toggle) return;
  
  const playIcon = toggle.querySelector('.icon-play');
  const pauseIcon = toggle.querySelector('.icon-pause');
  
  const c = window.weddingConfig;
  
  if (c.musicLocalPath) {
    // Play local audio file
    if (!ambientAudio) {
      ambientAudio = new Audio(c.musicLocalPath);
      ambientAudio.loop = true;
      ambientAudio.volume = 0.45;
    }
    ambientAudio.play().catch(e => {
      console.warn("Local audio playback blocked or failed, fallback to synth.", e);
      if (!ambientSynth) ambientSynth = new AmbientMelodySynth();
      ambientSynth.start();
    });
  } else if (ytPlayer && ytPlayerReady) {
    // Play YouTube video audio
    try {
      ytPlayer.playVideo();
    } catch(e) {
      console.warn("YouTube play failed, starting fallback synth", e);
      if (!ambientSynth) ambientSynth = new AmbientMelodySynth();
      ambientSynth.start();
    }
  } else {
    // Play Web Audio Synth
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
  
  if (ambientAudio) {
    ambientAudio.pause();
  } else if (ytPlayer && ytPlayerReady) {
    try {
      ytPlayer.pauseVideo();
    } catch(e) {
      console.warn("YouTube pause failed, stopping fallback synth", e);
    }
  }
  
  if (ambientSynth) {
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
  const c = window.weddingConfig;
  const vidId = c.musicYoutubeId || 'UtbxruJ2r1w';
  
  ytPlayer = new YT.Player('ytPlayerContainer', {
    height: '0',
    width: '0',
    videoId: vidId,
    playerVars: {
      'autoplay': 1,
      'controls': 0,
      'loop': 1,
      'playlist': vidId, // Required for loop to work
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
  if (!rsvpForm) return;
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
  const waxSeal = document.getElementById('waxSealBtn');
  const cardContainer = document.getElementById('foldedCardContainer');
  const clickToOpen = document.getElementById('clickToOpen');
  
  if (!overlay || !waxSeal || !cardContainer) return;
  
  let isUnlocking = false;
  
  function triggerUnlock() {
    if (isUnlocking) return;
    isUnlocking = true;
    
    // Add visual unlocking state
    overlay.classList.add('unlocking');
    
    // Play physical stamp crack/click sound
    playUnlockClickSound();
    
    // Create golden halo flash
    const flash = document.createElement('div');
    flash.className = 'unlock-flash';
    cardContainer.appendChild(flash);
    
    flash.offsetWidth;
    flash.classList.add('active');
    
    // Open card flaps (triggers left/right translate and ribbon split in CSS)
    overlay.classList.add('card-open');
    
    // Spawn flower petals burst from the card center
    if (window.triggerPetalBurst) {
      const rect = cardContainer.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      window.triggerPetalBurst(centerX, centerY, 60);
    }
    
    // Keep rings visible inside the opened flaps for 3 seconds, then zoom through!
    setTimeout(() => {
      // Play background music
      playAmbientMusic();
      
      // Zoom through card doors
      overlay.classList.add('zoom-through');
      overlay.classList.add('fade-out');
      
      setTimeout(() => {
        overlay.remove();
        // Show side floating rings
        const rL = document.getElementById('floatingRingLeft');
        const rR = document.getElementById('floatingRingRight');
        if (rL) rL.classList.add('visible');
        if (rR) rR.classList.add('visible');
      }, 1200);
    }, 3000); // 3 seconds rings display!
  }
  
  // Bind click event listeners
  waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerUnlock();
  });
  
  if (clickToOpen) {
    clickToOpen.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerUnlock();
    });
  }
  
  cardContainer.addEventListener('click', () => {
    triggerUnlock();
  });
}

function playUnlockClickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch(e) {
    console.warn("Could not play click sound effect", e);
  }
}

function applyConfig() {
  const c = window.weddingConfig;
  
  // Page Title
  document.title = `${c.groomName.toUpperCase()} & ${c.brideName.toUpperCase()} — Our Wedding Day`;
  
  // Welcome Overlay Flaps Background
  const leftFlap = document.getElementById('leftFlap');
  const rightFlap = document.getElementById('rightFlap');
  if (leftFlap && rightFlap) {
    leftFlap.style.backgroundImage = `url(${c.coverImage})`;
    rightFlap.style.backgroundImage = `url(${c.coverImage})`;
  }
  
  // Navbar logo
  const logoEl = document.querySelector('.navbar .logo');
  if (logoEl) logoEl.textContent = c.initials;
  
  // Hero Section
  const heroNames = document.querySelector('.hero-content .main-title');
  if (heroNames) heroNames.textContent = `${c.groomName} & ${c.brideName}`;
  
  const heroDateLoc = document.querySelector('.hero-content .date-location');
  if (heroDateLoc) heroDateLoc.textContent = `${c.weddingDate} • ${c.venueName}`;
  
  const heroSec = document.getElementById('hero');
  if (heroSec) {
    heroSec.style.backgroundImage = `url(${c.heroImage})`;
    heroSec.style.backgroundSize = 'cover';
    heroSec.style.backgroundPosition = 'center 45%';
  }
  
  const footerEl = document.querySelector('.footer');
  if (footerEl) {
    footerEl.style.backgroundImage = `url(${c.footerImage})`;
    footerEl.style.backgroundSize = 'cover';
    footerEl.style.backgroundPosition = 'center 45%';
  }
  
  // Invitation Card Section
  const inviteLogo = document.querySelector('.invitation-logo');
  if (inviteLogo) inviteLogo.textContent = c.initials;
  
  const inviteGroom = document.querySelector('.invitation-names .name-text:nth-child(3)');
  const inviteBride = document.querySelector('.invitation-names .name-text:nth-child(1)');
  if (inviteGroom) inviteGroom.textContent = c.groomName.toUpperCase();
  if (inviteBride) inviteBride.textContent = c.brideName.toUpperCase();
  
  const inviteDate = document.querySelector('.invitation-date');
  if (inviteDate) inviteDate.textContent = `SUNDAY, ${c.weddingDate.toUpperCase()}`;
  
  const inviteTime = document.querySelector('.invitation-time');
  if (inviteTime) inviteTime.textContent = `AT ${c.weddingTime.toUpperCase()}`;
  
  const inviteVenue = document.querySelector('.invitation-venue');
  if (inviteVenue) inviteVenue.textContent = c.venueName.toUpperCase();
  
  const inviteAddress = document.querySelector('.invitation-address');
  if (inviteAddress) inviteAddress.textContent = c.venueAddress;
  
  // Scratch reveal card underlying content
  const scratchRevealDate = document.getElementById('scratchRevealDate');
  if (scratchRevealDate) scratchRevealDate.textContent = c.weddingDate.toUpperCase();
  const scratchRevealTime = document.getElementById('scratchRevealTime');
  if (scratchRevealTime) scratchRevealTime.textContent = `Sunday at ${c.weddingTime}`;
  const scratchRevealVenue = document.getElementById('scratchRevealVenue');
  if (scratchRevealVenue) scratchRevealVenue.textContent = `${c.venueName}, ${c.venueAddress}`;
  
  // Venue & Maps Section
  const venueTitle = document.querySelector('.venue-info h4');
  if (venueTitle) venueTitle.textContent = c.venueName;
  
  const venueText = document.querySelector('.venue-info p');
  if (venueText) venueText.textContent = `Join us at ${c.venueName}, located in ${c.venueAddress}. We look forward to celebrating our marriage with you.`;
  
  const mapBtns = document.querySelectorAll('.venue-info a, #btnOpenMap');
  mapBtns.forEach(btn => {
    btn.setAttribute('href', c.googleMapsLink);
  });
  
  const mapIframe = document.querySelector('.venue-map iframe');
  if (mapIframe) {
    mapIframe.setAttribute('src', `https://maps.google.com/maps?q=${encodeURIComponent(c.venueName + ' ' + c.venueAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
  }
  
  // Footer
  const footerLogo = document.querySelector('.footer-logo');
  if (footerLogo) footerLogo.textContent = c.initials;
  
  const footerCouple = document.querySelector('.footer-couple');
  if (footerCouple) footerCouple.textContent = `${c.groomName.toUpperCase()} & ${c.brideName.toUpperCase()}`;
  
  const copyright = document.querySelector('.copyright');
  if (copyright) copyright.textContent = `© 2026 ${c.groomName.toUpperCase()} & ${c.brideName.toUpperCase()}. Created for their special day.`;
  
  // Apply images to timeline
  const timelineImgs = [c.storyImages.firstMeet, c.storyImages.firstTrip, c.storyImages.proposal];
  const timelineContentCards = document.querySelectorAll('.timeline-content');
  timelineContentCards.forEach((card, idx) => {
    if (timelineImgs[idx]) {
      let imgContainer = card.querySelector('.timeline-card-image');
      if (!imgContainer) {
        imgContainer = document.createElement('div');
        imgContainer.className = 'timeline-card-image';
        card.insertBefore(imgContainer, card.firstChild);
      }
      imgContainer.style.backgroundImage = `url(${timelineImgs[idx]})`;
    }
  });

  // Re-build Gallery Grid dynamically
  const galleryGrid = document.querySelector('.gallery-grid');
  if (galleryGrid) {
    galleryGrid.innerHTML = '';
    c.galleryImages.forEach((img, idx) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      const categories = ['proposal', 'travel', 'lifestyle'];
      const cat = categories[idx % categories.length];
      item.setAttribute('data-category', cat);
      
      item.innerHTML = `
        <div class="gallery-img-wrapper">
          <div class="img-placeholder" style="background-image: url(${img.src})" data-caption="${img.desc}">
            <span class="photo-desc">${img.title}</span>
          </div>
        </div>
      `;
      galleryGrid.appendChild(item);
    });
  }
}

function initScratchCard() {
  const canvas = document.getElementById('scratchCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const box = document.getElementById('scratchCardBox');
  
  let width = canvas.offsetWidth || 340;
  let height = canvas.offsetHeight || 220;
  
  function setupCanvas() {
    canvas.width = width;
    canvas.height = height;
    
    // Draw gold foil texture on canvas
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#BF953F');
    grad.addColorStop(0.2, '#FCF6BA');
    grad.addColorStop(0.4, '#B38728');
    grad.addColorStop(0.6, '#FBF5B7');
    grad.addColorStop(0.8, '#AA771C');
    grad.addColorStop(1, '#B38728');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    
    // Add fine gold sparkles/noise effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let i = 0; i < 300; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      const rs = Math.random() * 1.5 + 0.5;
      ctx.beginPath();
      ctx.arc(rx, ry, rs, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw luxury borders on gold foil
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(8, 8, width - 16, height - 16);
    
    ctx.strokeStyle = 'rgba(92, 68, 28, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(11, 11, width - 22, height - 22);
    
    // Write text
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.font = 'italic 1.8rem Cormorant Garamond, serif';
    ctx.fillStyle = '#1A1A1A'; 
    ctx.textAlign = 'center';
    ctx.fillText('Nithin & Amala', width / 2, height / 2 - 15);
    
    ctx.font = '600 0.7rem Inter, sans-serif';
    ctx.letterSpacing = '1.5px';
    ctx.fillStyle = '#423118';
    ctx.fillText('SCRATCH TO REVEAL THE DATE', width / 2, height / 2 + 25);
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
  
  setupCanvas();
  
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  
  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }
  
  function scratch(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  }
  
  function drawLine(x1, y1, x2, y2) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 40;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  
  function checkScratchPercent() {
    const imgData = ctx.getImageData(0, 0, width, height);
    const pixels = imgData.data;
    let transparentCount = 0;
    const sampleStep = 15;
    
    let totalSamples = 0;
    for (let y = sampleStep; y < height; y += sampleStep) {
      for (let x = sampleStep; x < width; x += sampleStep) {
        totalSamples++;
        const pixelIdx = (y * width + x) * 4;
        if (pixels[pixelIdx + 3] === 0) {
          transparentCount++;
        }
      }
    }
    
    const percentage = (transparentCount / totalSamples) * 100;
    if (percentage > 45) {
      revealDate();
    }
  }
  
  let revealed = false;
  function revealDate() {
    if (revealed) return;
    revealed = true;
    
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0';
    
    playUnlockClickSound();
    
    // Trigger Petal Pop burst from center of scratch card
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 + window.scrollX;
    const centerY = rect.top + rect.height / 2 + window.scrollY;
    
    if (window.triggerPetalBurst) {
      window.triggerPetalBurst(centerX, centerY, 70);
    }
    
    setTimeout(() => {
      canvas.remove();
    }, 600);
  }
  
  const startScratch = (e) => {
    isDrawing = true;
    const pos = getMousePos(e);
    lastX = pos.x;
    lastY = pos.y;
    scratch(pos.x, pos.y);
  };
  
  const moveScratch = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getMousePos(e);
    drawLine(lastX, lastY, pos.x, pos.y);
    lastX = pos.x;
    lastY = pos.y;
    
    if (Math.random() < 0.2) {
      checkScratchPercent();
    }
  };
  
  const stopScratch = () => {
    isDrawing = false;
    checkScratchPercent();
  };
  
  canvas.addEventListener('mousedown', startScratch);
  canvas.addEventListener('mousemove', moveScratch);
  window.addEventListener('mouseup', stopScratch);
  
  canvas.addEventListener('touchstart', startScratch, { passive: false });
  canvas.addEventListener('touchmove', moveScratch, { passive: false });
  window.addEventListener('touchend', stopScratch);
}

// ==========================================
// 13. FLOATING RINGS SCROLL-TO-MERGE CONTROLLER
// ==========================================
function initRingsScrollAnimation() {
  const ringLeft = document.getElementById('floatingRingLeft');
  const ringRight = document.getElementById('floatingRingRight');
  const targetContainer = document.getElementById('ringsTogetherContainer');
  const combinedImg = document.getElementById('combinedRingsImg');
  
  if (!ringLeft || !ringRight || !targetContainer || !combinedImg) return;
  
  // Smooth scrolling animation listener
  window.addEventListener('scroll', () => {
    const targetRect = targetContainer.getBoundingClientRect();
    const scrollY = window.scrollY;
    
    // Calculate rotation based on scroll distance
    const rotationLeft = scrollY * 0.12;
    const rotationRight = -scrollY * 0.12;
    
    // If the target container is still far down off-screen
    if (targetRect.top > window.innerHeight) {
      // Keep rings fixed at the sides of the viewport
      ringLeft.style.position = 'fixed';
      ringLeft.style.left = ''; // fallback to default CSS coordinates
      ringLeft.style.top = '45vh';
      ringLeft.style.transform = `translateY(-50%) rotate(${rotationLeft}deg)`;
      ringLeft.style.opacity = ringLeft.classList.contains('visible') ? '0.85' : '0';
      
      ringRight.style.position = 'fixed';
      ringRight.style.right = ''; 
      ringRight.style.top = '45vh';
      ringRight.style.transform = `translateY(-50%) rotate(${rotationRight}deg)`;
      ringRight.style.opacity = ringRight.classList.contains('visible') ? '0.85' : '0';
      
      combinedImg.classList.remove('merged');
    } else {
      // Target container has entered the screen! Let them travel towards the center targets
      const startY = window.innerHeight;
      // The animation completes when the target is 100px from the screen bottom or higher
      const endY = window.innerHeight - targetRect.height - 80;
      
      const totalDist = startY - endY;
      const curDist = startY - targetRect.top;
      let p = totalDist > 0 ? curDist / totalDist : 0;
      p = Math.max(0, Math.min(1, p)); // Clamp progress strictly [0, 1]
      
      // Find exact center coordinates of target container relative to viewport
      const targetX = targetRect.left + targetRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2;
      
      const rWidth = ringLeft.offsetWidth || 50;
      const rHeight = ringLeft.offsetHeight || 50;
      
      // Mobile layout adjustments
      const mobileOffset = window.innerWidth <= 768;
      const sideGap = mobileOffset ? 10 : 24;
      
      if (p >= 0.95) {
        // Fully merged! Fade out individual floating elements and reveal combined interlocked rings
        ringLeft.style.opacity = '0';
        ringRight.style.opacity = '0';
        combinedImg.classList.add('merged');
      } else {
        // Fade combined image out, restore individuals
        combinedImg.classList.remove('merged');
        
        // Left ring coordinates path (fixed side x coordinate to target center-left offset)
        const startLeftX = sideGap;
        const endLeftX = targetX - rWidth * 0.72; // Left side of overlap
        const curLeftX = startLeftX + p * (endLeftX - startLeftX);
        
        // Right ring coordinates path (fixed side x coordinate to target center-right offset)
        const startRightX = sideGap;
        const endRightX = targetX - rWidth * 0.28; // Right side of overlap
        const curRightX = startRightX + p * (endRightX - startRightX);
        
        // Y path for both rings (from center 45vh viewport to target center viewport)
        const startYPos = window.innerHeight * 0.45;
        const endYPos = targetY - rHeight * 0.5;
        const curYPos = startYPos + p * (endYPos - startYPos);
        
        // Apply computed transitions
        ringLeft.style.left = `${curLeftX}px`;
        ringLeft.style.top = `${curYPos}px`;
        ringLeft.style.transform = `translate(0, 0) rotate(${rotationLeft + p * 35}deg)`;
        ringLeft.style.opacity = ringLeft.classList.contains('visible') ? (0.85 - p * 0.85) : '0';
        
        ringRight.style.left = `${window.innerWidth - curRightX - rWidth}px`;
        ringRight.style.top = `${curYPos}px`;
        ringRight.style.transform = `translate(0, 0) rotate(${rotationRight - p * 35}deg)`;
        ringRight.style.opacity = ringRight.classList.contains('visible') ? (0.85 - p * 0.85) : '0';
      }
    }
  });
}
