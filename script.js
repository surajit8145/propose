/**
 * 🌹 FOREVER WITH YOU — 5-PAGE ROMANTIC SCRIPT
 * Page 1: Welcome | Page 2: Love Letter | Page 3: Automatic Proposal Cutscene | Page 4: Memories | Page 5: Grand Finale
 */

document.addEventListener('DOMContentLoaded', () => {
  // ======================================================
  // 1. CUSTOM CURSOR & FLOATING HEARTS
  // ======================================================
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    }
    if (Math.random() < 0.04) spawnCursorHeart(e.clientX, e.clientY);
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.16;
    cursorY += (mouseY - cursorY) * 0.16;
    if (cursor) {
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const heartChars = ['♥', '💕', '💖', '✨', '🌹', '💗', '💫'];
  function spawnCursorHeart(x, y) {
    const h = document.createElement('div');
    h.className = 'heart-cursor';
    h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
    h.style.left = (x + Math.random() * 24 - 12) + 'px';
    h.style.top = (y + Math.random() * 24 - 12) + 'px';
    h.style.fontSize = (Math.random() * 12 + 12) + 'px';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1200);
  }

  // ======================================================
  // 2. WEB AUDIO PROCEDURAL ROMANTIC SYNTHESIZER
  // ======================================================
  let audioCtx = null;
  let audioEnabled = false;
  let melodyInterval = null;
  const soundBtn = document.getElementById('soundBtn');
  const soundIcon = document.getElementById('soundIcon');

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.6, gainLevel = 0.12, delay = 0) {
    if (!audioEnabled || !audioCtx) return;
    setTimeout(() => {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        console.warn(e);
      }
    }, delay * 1000);
  }

  function playChime() {
    if (!audioEnabled) return;
    playTone(523.25, 'sine', 0.8, 0.15, 0);
    playTone(659.25, 'sine', 0.9, 0.18, 0.12);
    playTone(783.99, 'triangle', 1.1, 0.2, 0.24);
    playTone(1046.50, 'sine', 1.5, 0.22, 0.36);
  }

  function playCelebrationFanfare() {
    if (!audioEnabled) return;
    const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chord.forEach((freq, idx) => {
      playTone(freq, 'triangle', 3.0, 0.25, idx * 0.12);
    });
  }

  const ambientNotes = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25];
  function startAmbientChimes() {
    if (melodyInterval) clearInterval(melodyInterval);
    melodyInterval = setInterval(() => {
      if (audioEnabled) {
        const note = ambientNotes[Math.floor(Math.random() * ambientNotes.length)];
        playTone(note, 'sine', 2.0, 0.06, 0);
      }
    }, 2800);
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      initAudio();
      audioEnabled = !audioEnabled;
      soundIcon.textContent = audioEnabled ? '💖' : '🎵';
      soundBtn.classList.toggle('active', audioEnabled);
      if (audioEnabled) {
        playChime();
        startAmbientChimes();
      } else {
        if (melodyInterval) clearInterval(melodyInterval);
      }
    });
  }

  // ======================================================
  // 3. SMOOTH 5-PAGE SCENE NAVIGATION & AUTO-TRIGGERS
  // ======================================================
  const scenes = document.querySelectorAll('.scene');
  const scrollDots = document.querySelectorAll('.scroll-dot');

  function scrollToScene(index) {
    if (scenes[index]) {
      scenes[index].scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.scene, 10);
      scrollToScene(idx);
    });
  });

  document.querySelectorAll('[data-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Scene Observer to sync scroll navigation dots
  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.id;
        const pageMap = {
          'scene-1': 0,
          'scene-2': 1,
          'scene-3': 2,
          'scene-4': 3,
          'scene-5': 4,
        };
        const idx = pageMap[currentId];
        if (idx !== undefined) {
          scrollDots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
        }

        // Proposal dialogue is ONLY triggered when user clicks 'Hear What My Heart Says' button

        // Trigger Scene 5 finale on scroll
        if (currentId === 'scene-5') {
          triggerFinaleConfetti();
          startFinalePoem();
        }
      }
    });
  }, { threshold: 0.45 });

  scenes.forEach(s => sceneObserver.observe(s));

  // Reveal observer for fade-in elements
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ======================================================
  // 4. PAGE 1: FALLING PETALS (INCREASED SPEED & SWAY)
  // ======================================================
  const petalColors = [
    'radial-gradient(ellipse at 30% 30%, #fecdd9, #f43f6e)',
    'radial-gradient(ellipse at 30% 30%, #ffd6e0, #fb7194)',
    'radial-gradient(ellipse at 30% 30%, #fff1f4, #e11d53)',
    'radial-gradient(ellipse at 30% 30%, #fae2a8, #f0b643)',
  ];
  const petalsContainer = document.getElementById('petalsContainer');
  if (petalsContainer) {
    for (let i = 0; i < 32; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (Math.random() * 3 + 3.5) + 's';
      p.style.animationDelay = (Math.random() * 4) + 's';
      p.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];
      p.style.width = (Math.random() * 12 + 12) + 'px';
      p.style.height = (Math.random() * 14 + 14) + 'px';
      p.style.opacity = Math.random() * 0.4 + 0.55;
      petalsContainer.appendChild(p);
    }
  }

  // Typewriter Loop on Page 1
  const welcomeQuotes = [
    "In a world of 8 billion people...",
    "...my heart beat for you the moment our eyes met 💕",
    "You are my today, my tomorrow, and my forever ✨"
  ];
  const typedEl = document.getElementById('typedText');
  let qIdx = 0, charIdx = 0, isDeleting = false;

  function typeWelcomeLoop() {
    if (!typedEl) return;
    const current = welcomeQuotes[qIdx];
    if (!isDeleting) {
      typedEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        if (qIdx === welcomeQuotes.length - 1) return; // Stay on last quote
        setTimeout(() => { isDeleting = true; typeWelcomeLoop(); }, 2200);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        qIdx = (qIdx + 1) % welcomeQuotes.length;
      }
    }
    const speed = isDeleting ? 35 : 65;
    setTimeout(typeWelcomeLoop, speed);
  }
  setTimeout(typeWelcomeLoop, 1400);

  // ======================================================
  // 5. PAGE 2: THE LOVE LETTER (PARTICLES & 3D ENVELOPE)
  // ======================================================
  const letterParticles = document.getElementById('letterParticles');
  const sparkleSymbols = ['✦', '✨', '⋆', '💖', '🌸', '•'];
  if (letterParticles) {
    for (let i = 0; i < 28; i++) {
      const sp = document.createElement('span');
      sp.className = 'letter-sparkle';
      sp.textContent = sparkleSymbols[Math.floor(Math.random() * sparkleSymbols.length)];
      sp.style.left = (Math.random() * 92 + 4) + '%';
      sp.style.top = (Math.random() * 85 + 8) + '%';
      sp.style.fontSize = (Math.random() * 12 + 10) + 'px';
      sp.style.animationDuration = (Math.random() * 1.2 + 1.5) + 's';
      sp.style.animationDelay = (Math.random() * 2) + 's';
      letterParticles.appendChild(sp);
    }
  }

  const envelope = document.getElementById('envelope');
  const letterPaper = document.getElementById('letterPaper');
  const headingEl = document.getElementById('letterHeading');
  const bodyEl = document.getElementById('letterBody');
  const signEl = document.getElementById('letterSign');

  const letterHeading = "My Dearest One...";
  const letterBody = "When I look into your eyes, I don't just see beauty—I see my future, my peace, and the love I always searched for. You make every quiet moment feel like poetry and every ordinary day a celebration. Thank you for your warmth, your pure smile, and the unspoken comfort we share. If I had to live a thousand lifetimes, I would choose you in every single one of them. Forever yours, with all my heart. 💕";

  let letterOpened = false;
  let letterTyping = false;

  function typeLetterContent(el, text, speed, callback) {
    let i = 0;
    el.textContent = '';
    const iv = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(iv);
        if (callback) callback();
      }
    }, speed);
  }

  function openLoveLetter() {
    if (letterOpened || letterTyping) return;
    letterTyping = true;
    initAudio();
    playChime();

    envelope.classList.add('open');

    setTimeout(() => {
      letterPaper.classList.add('revealed');
      setTimeout(() => {
        typeLetterContent(headingEl, letterHeading, 55, () => {
          setTimeout(() => {
            typeLetterContent(bodyEl, letterBody, 22, () => {
              letterPaper.classList.add('sign-visible');
              letterOpened = true;
              letterTyping = false;
            });
          }, 350);
        });
      }, 500);
    }, 800);
  }

  if (envelope) {
    envelope.addEventListener('click', openLoveLetter);
    envelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') openLoveLetter();
    });
  }

  // ======================================================
  // 6. PAGE 3: THE PROPOSAL (AUTOMATIC CUTSCENE & PARTICLES)
  // ======================================================

  // Dedicated floating particles on Proposal Page (Faster & Vibrant)
  const proposalParticles = document.getElementById('proposalParticles');
  const propParticleIcons = ['💖', '✨', '🌹', '🌸', '💫', '♥'];
  if (proposalParticles) {
    for (let i = 0; i < 26; i++) {
      const p = document.createElement('span');
      p.className = 'proposal-particle';
      p.textContent = propParticleIcons[Math.floor(Math.random() * propParticleIcons.length)];
      p.style.left = (Math.random() * 94 + 3) + '%';
      p.style.top = (Math.random() * 85 + 8) + '%';
      p.style.fontSize = (Math.random() * 14 + 10) + 'px';
      p.style.animationDuration = (Math.random() * 1.5 + 2.0) + 's';
      p.style.animationDelay = (Math.random() * 2.5) + 's';
      proposalParticles.appendChild(p);
    }
  }

  const proposalStoryImg = document.getElementById('proposalStoryImg');
  const proposalStoryBadge = document.getElementById('proposalStoryBadge');
  const charSpeechBubble = document.getElementById('charSpeechBubble');
  const speakerAvatar = document.getElementById('speakerAvatar');
  const speakerName = document.getElementById('speakerName');
  const dialogueText = document.getElementById('dialogueText');

  const phaseSteps = document.querySelectorAll('.phase-step');
  const phase0Action = document.getElementById('phase0Action');
  const phase1Action = document.getElementById('phase1Action');
  const phase2Action = document.getElementById('phase2Action');
  const phase3Action = document.getElementById('phase3Action');
  const phase4Action = document.getElementById('phase4Action');

  const btnStartConversation = document.getElementById('btnStartConversation');
  const btnSkipDialogue = document.getElementById('btnSkipDialogue');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const proposalZone = document.getElementById('proposalZone');
  const dodgeTooltip = document.getElementById('dodgeTooltip');

  // Concise dialogue lines: Boy on Left, Girl on Right
  const conversationDialogue = [
    {
      speaker: 'Him',
      avatar: '👦',
      text: '"From the day we met, my heart knew you were the one 💕"',
      badge: '💫 Looking Deep Into Your Eyes',
      img: 'girl and boy face to face.png',
      isLeft: true, // Left side Boy
      duration: 3200
    },
    {
      speaker: 'Her',
      avatar: '👧',
      text: '"You make every single moment feel like a dream ✨"',
      badge: '🌸 A Quiet Spark',
      img: 'girl and boy face to face.png',
      isLeft: false, // Right side Girl
      duration: 3200
    },
    {
      speaker: 'Him',
      avatar: '👦',
      text: '"There is only one question left in my heart... 🌹"',
      badge: '💍 The Golden Moment',
      img: 'girl and boy face to face.png',
      isLeft: true, // Left side Boy
      duration: 3000
    }
  ];

  let autoDialogueRunning = false;
  let autoDialogueTimeout = null;

  function updatePhaseStepper(phaseNum) {
    phaseSteps.forEach((step, idx) => {
      step.classList.toggle('active', idx <= phaseNum);
    });
  }

  function setCutsceneImage(imgSrc) {
    if (!proposalStoryImg) return;
    proposalStoryImg.style.opacity = '0';
    proposalStoryImg.style.transform = 'scale(0.92)';
    setTimeout(() => {
      proposalStoryImg.src = imgSrc;
      proposalStoryImg.style.opacity = '1';
      proposalStoryImg.style.transform = 'scale(1)';
    }, 280);
  }

  function triggerDialogueTyping(text, callback) {
    if (!dialogueText) return;
    dialogueText.textContent = '';
    let i = 0;
    const iv = setInterval(() => {
      dialogueText.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(iv);
        if (callback) callback();
      }
    }, 22);
  }

  function renderDialogueStep(stepIdx) {
    if (stepIdx >= conversationDialogue.length) {
      // Transition to Proposal Choice Phase cleanly!
      setCutsceneImage('propose.png');

      // Hide speech bubble, start button and badge to avoid clutter
      if (charSpeechBubble) {
        charSpeechBubble.style.opacity = '0';
        charSpeechBubble.style.display = 'none';
        charSpeechBubble.style.pointerEvents = 'none';
      }
      if (phase0Action) {
        phase0Action.style.display = 'none';
      }
      if (btnStartConversation) {
        btnStartConversation.style.display = 'none';
      }
      if (proposalStoryBadge) {
        proposalStoryBadge.style.display = 'none';
      }

      setTimeout(() => {
        phase1Action.style.display = 'none';
        phase2Action.style.display = 'flex';
        updatePhaseStepper(1);
      }, 500);
      return;
    }

    // Phase 1 Conversation Step
    const data = conversationDialogue[stepIdx];
    speakerAvatar.textContent = data.avatar;
    speakerName.textContent = data.speaker;
    proposalStoryBadge.textContent = data.badge;

    if (charSpeechBubble) {
      charSpeechBubble.style.display = 'block';
      charSpeechBubble.style.opacity = '1';
      charSpeechBubble.style.pointerEvents = 'auto';
      if (data.isLeft) {
        charSpeechBubble.classList.remove('bubble-right');
        charSpeechBubble.classList.add('bubble-left');
      } else {
        charSpeechBubble.classList.remove('bubble-left');
        charSpeechBubble.classList.add('bubble-right');
      }
    }

    triggerDialogueTyping(data.text);
    initAudio();
    playTone(data.isLeft ? 523.25 : 659.25, 'sine', 0.3, 0.06);

    // Schedule next automatic step
    autoDialogueTimeout = setTimeout(() => {
      renderDialogueStep(stepIdx + 1);
    }, data.duration);
  }

  function startAutoProposalCutscene() {
    if (autoDialogueRunning) return;
    autoDialogueRunning = true;
    updatePhaseStepper(0);
    renderDialogueStep(0);
  }

  // Start Conversation Button Click Handler
  if (btnStartConversation) {
    btnStartConversation.addEventListener('click', () => {
      initAudio();
      playTone(587.33, 'sine', 0.35, 0.08);
      if (phase0Action) {
        phase0Action.style.display = 'none';
      }
      btnStartConversation.style.display = 'none';
      if (charSpeechBubble) {
        charSpeechBubble.style.display = 'block';
      }
      if (phase1Action) {
        phase1Action.style.display = 'flex';
      }
      startAutoProposalCutscene();
    });
  }

  // Skip button to immediately jump to proposal choice
  if (btnSkipDialogue) {
    btnSkipDialogue.addEventListener('click', () => {
      if (autoDialogueTimeout) clearTimeout(autoDialogueTimeout);
      renderDialogueStep(conversationDialogue.length);
    });
  }

  // Witty & sweet dodge messages for the NO button
  const dodgePhrases = [
    "Aise kaise mana kar sakti ho! 😉",
    "No option not allowed for my favorite person! ✨",
    "Error 404: 'NO' not found! 💖",
    "Your heart says YES, click it! 🌹",
    "Pakka socha? Dubara try karo! 😄",
    "Destiny already chose YES for us! 💫"
  ];
  let dodgeIndex = 0;

  function dodgeNoButton(e) {
    if (e) e.preventDefault();
    initAudio();
    playTone(392.00, 'sine', 0.2, 0.05);

    const zoneRect = proposalZone.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const maxMoveX = Math.max(20, (zoneRect.width / 2) - btnRect.width);
    const maxMoveY = 30;

    const randomX = (Math.random() * (maxMoveX * 2)) - maxMoveX;
    const randomY = (Math.random() * (maxMoveY * 2)) - maxMoveY;

    btnNo.style.transform = `translate(${randomX}px, ${randomY}px)`;

    dodgeTooltip.textContent = dodgePhrases[dodgeIndex % dodgePhrases.length];
    dodgeTooltip.classList.add('visible');
    dodgeIndex++;

    setTimeout(() => {
      dodgeTooltip.classList.remove('visible');
    }, 1600);
  }

  if (btnNo) {
    btnNo.addEventListener('mouseenter', dodgeNoButton);
    btnNo.addEventListener('touchstart', dodgeNoButton, { passive: false });
    btnNo.addEventListener('click', dodgeNoButton);
  }

  // YES button clicked — She Said YES!
  if (btnYes) {
    btnYes.addEventListener('click', () => {
      initAudio();
      playCelebrationFanfare();
      triggerConfetti(document.getElementById('confettiContainer'));

      // Update character cutout to Hug
      setCutsceneImage('hug.png');

      // Update Stepper to Phase 3 (Embrace)
      updatePhaseStepper(2);
      phase2Action.style.display = 'none';
      phase3Action.style.display = 'flex';

      // After 3.5 seconds, advance to Couple Happy (Phase 4)
      setTimeout(() => {
        setCutsceneImage('couple-happy.png');
        updatePhaseStepper(3);
        phase3Action.style.display = 'none';
        phase4Action.style.display = 'flex';
      }, 3500);
    });
  }

  // Confetti generator function
  const confettiColors = ['#fb7194', '#f43f6e', '#fae2a8', '#f0b643', '#ffffff', '#ffd6e0'];
  function triggerConfetti(container) {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 45; i++) {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      c.style.width = (Math.random() * 8 + 6) + 'px';
      c.style.height = (Math.random() * 8 + 6) + 'px';
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      c.style.animationDuration = (Math.random() * 3 + 3) + 's';
      c.style.animationDelay = (Math.random() * 3) + 's';
      c.style.setProperty('--cx', (Math.random() * 80 - 40) + 'px');
      container.appendChild(c);
    }
  }

  // ======================================================
  // 7. PAGE 4: 3D MEMORY CAROUSEL & STAR PARTICLES
  // ======================================================
  const memoryStars = document.getElementById('memoryStars');
  if (memoryStars) {
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.className = 'memory-star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      const size = Math.random() * 3.2 + 1.8;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.animationDuration = `${Math.random() * 1.4 + 1.0}s, ${Math.random() * 4 + 4}s`;
      star.style.animationDelay = `${Math.random() * 2}s, ${Math.random() * 3}s`;
      memoryStars.appendChild(star);
    }
  }

  const memoryCards = document.querySelectorAll('.carousel-card');
  const memoryDots = document.querySelectorAll('.carousel-dots .carousel-dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const totalMemoryCards = memoryCards.length;
  let activeMemoryIndex = 1; // Center card

  const memoryPositions = [
    { tx: -260, rot: -7, scale: 0.88, z: 4, op: 0.7 },
    { tx:    0, rot:  0, scale: 1.05, z: 10, op: 1.0 },
    { tx:  260, rot:  7, scale: 0.88, z: 4, op: 0.7 }
  ];

  function updateMemoryCarousel(centerIdx) {
    activeMemoryIndex = ((centerIdx % totalMemoryCards) + totalMemoryCards) % totalMemoryCards;

    memoryCards.forEach((card, i) => {
      card.classList.remove('active');
      const offset = ((i - activeMemoryIndex) + totalMemoryCards) % totalMemoryCards;

      let posIdx = 1;
      if (offset === 0) posIdx = 1; // Center
      else if (offset === 1) posIdx = 2; // Right
      else if (offset === totalMemoryCards - 1) posIdx = 0; // Left

      const pos = memoryPositions[posIdx];
      card.style.transform = `translateX(${pos.tx}px) rotate(${pos.rot}deg) scale(${pos.scale})`;
      card.style.zIndex = pos.z;
      card.style.opacity = pos.op;
    });

    if (memoryCards[activeMemoryIndex]) {
      memoryCards[activeMemoryIndex].classList.add('active');
    }

    memoryDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeMemoryIndex);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => {
    initAudio();
    playTone(440.00, 'sine', 0.2, 0.05);
    updateMemoryCarousel(activeMemoryIndex - 1);
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    initAudio();
    playTone(523.25, 'sine', 0.2, 0.05);
    updateMemoryCarousel(activeMemoryIndex + 1);
  });

  memoryDots.forEach(dot => {
    dot.addEventListener('click', () => {
      updateMemoryCarousel(parseInt(dot.dataset.dot, 10));
    });
  });

  memoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index, 10);
      if (idx !== activeMemoryIndex) updateMemoryCarousel(idx);
    });
  });

  // Touch Swipe for Memory Carousel
  let touchStartX = 0;
  const carouselTrack = document.getElementById('carouselTrack');
  if (carouselTrack) {
    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    carouselTrack.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        updateMemoryCarousel(diff > 0 ? activeMemoryIndex + 1 : activeMemoryIndex - 1);
      }
    });
  }
  updateMemoryCarousel(1);

  // ======================================================
  // 8. PAGE 5: THE GRAND FINALE (POEM & RELOAD)
  // ======================================================
  const poemLines = [
    "You are the dream I never knew I was waiting for,",
    "The calm in my soul and the joy in my core.",
    "Through every season, through every sunset and rain,",
    "I choose you, today and forever, again and again."
  ];
  const finaleSignatureText = "— Yours in this life & beyond 💕";
  let poemStarted = false;

  function typeLineSequential(lines, els, speed, lineDelay, onDone) {
    let li = 0;
    function nextLine() {
      if (li >= lines.length) {
        if (onDone) onDone();
        return;
      }
      let ci = 0;
      const el = els[li];
      if (!el) return;
      el.textContent = '';
      const iv = setInterval(() => {
        el.textContent += lines[li][ci];
        ci++;
        if (ci >= lines[li].length) {
          clearInterval(iv);
          li++;
          setTimeout(nextLine, lineDelay);
        }
      }, speed);
    }
    nextLine();
  }

  function startFinalePoem() {
    if (poemStarted) return;
    poemStarted = true;

    const lineEls = [
      document.getElementById('poemLine1'),
      document.getElementById('poemLine2'),
      document.getElementById('poemLine3'),
      document.getElementById('poemLine4'),
    ];
    const sigEl = document.getElementById('finaleSignature');

    setTimeout(() => {
      typeLineSequential(poemLines, lineEls, 35, 250, () => {
        setTimeout(() => {
          if (!sigEl) return;
          let si = 0;
          sigEl.textContent = '';
          const iv = setInterval(() => {
            sigEl.textContent += finaleSignatureText[si];
            si++;
            if (si >= finaleSignatureText.length) clearInterval(iv);
          }, 45);
        }, 500);
      });
    }, 1200);
  }

  function triggerFinaleConfetti() {
    triggerConfetti(document.getElementById('finaleConfettiContainer'));
  }

  // Interactive Love Promise Generator
  const lovePromises = [
    "I promise to always hold your hand through every high and low.",
    "I promise to make you laugh on days when the world feels heavy.",
    "I promise to celebrate your dreams as if they were my own.",
    "I promise to never let a day pass without reminding you how cherished you are.",
    "I promise to listen to your quietest thoughts and love you unconditionally.",
    "I promise to choose you, forgive quickly, and stand by your side always.",
    "I promise to build a lifetime of sweet adventures and warm memories with you.",
    "I promise that my love for you will grow deeper with every passing sunrise."
  ];

  let currentPromiseIdx = 0;
  const quoteEl = document.getElementById('loveQuote');
  const quoteCounter = document.getElementById('quoteCounter');
  const pickRoseBtn = document.getElementById('pickRoseBtn');

  function burstRosePetals(btn) {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const icons = ['🌸', '🌹', '💕', '✨', '💖', '💫'];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'petal-burst';
      p.textContent = icons[Math.floor(Math.random() * icons.length)];
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.fontSize = (Math.random() * 12 + 14) + 'px';
      const angle = (Math.PI * 2 / 18) * i;
      const dist = Math.random() * 110 + 60;
      p.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      p.style.animationDuration = (Math.random() * 0.4 + 0.7) + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1100);
    }
  }

  if (pickRoseBtn) {
    pickRoseBtn.addEventListener('click', () => {
      initAudio();
      playTone(659.25, 'sine', 0.4, 0.1);
      burstRosePetals(pickRoseBtn);

      currentPromiseIdx = (currentPromiseIdx + 1) % lovePromises.length;
      quoteCounter.textContent = `Promise ${currentPromiseIdx + 1} / ${lovePromises.length}`;

      quoteEl.style.opacity = '0';
      quoteEl.style.transform = 'translateY(-10px)';
      quoteEl.style.transition = 'all 0.25s ease';

      setTimeout(() => {
        quoteEl.textContent = lovePromises[currentPromiseIdx];
        quoteEl.style.opacity = '1';
        quoteEl.style.transform = 'translateY(0)';
      }, 250);
    });
  }

  // Relive Story from Start Button (Smooth scroll)
  const restartBtn = document.getElementById('restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Reload Entire Page Button
  const reloadBtn = document.getElementById('reloadBtn');
  if (reloadBtn) {
    reloadBtn.addEventListener('click', () => {
      window.location.reload();
    });
  }
});
