/**
 * Melodrio - Story Intro Module
 * Ten-slide pixel-art prologue with Space / Enter / "Další" navigation.
 */

window.Story = {
  SLIDES: [
    {
      act: 'Část I · Probuzení',
      title: 'Údolí Akordov',
      text: 'V údolí Akordov žil malý kytarista Melodrio. Měl jen svou kytaru a velký sen.',
      accent: '#ffd166'
    },
    {
      act: 'Část I · Probuzení',
      title: 'Hudba každého rána',
      text: 'Každé ráno se údolí probouzelo hudbou: pekař vyťukával rytmus na pec, ptáci zpívali v tónině a z komínů stoupaly noty.',
      accent: '#ffcf76'
    },
    {
      act: 'Část II · Šum',
      title: 'Příchod Šumu',
      text: 'Jednoho dne ale přišel Šum, šedá mlha, která z údolí vysála všechny melodie.',
      accent: '#b9c4d3'
    },
    {
      act: 'Část II · Šum',
      title: 'Ztichlé údolí',
      text: 'Struny zněly falešně, zvony zmlkly a lidé zapomněli, jak se zpívá.',
      accent: '#aeb8c7'
    },
    {
      act: 'Část II · Šum',
      title: 'Zapomenutá melodie',
      text: 'Melodriovi zůstal jen se svou kytarou. Ta ale taky neumí hrát, protože Melodrio zapomněl všechno, co kdy uměl.',
      accent: '#9aa6b8'
    },
    {
      act: 'Část III · Jiskra',
      title: 'Jiskřička naděje',
      text: 'V nejtemnější chvíli se ozvalo slabé zazvonění. Jediná struna se zachvěla a nad kytarou se rozsvítila malá zlatá jiskra.',
      accent: '#ffd166'
    },
    {
      act: 'Část III · Jiskra',
      title: 'První tón',
      text: 'Melodrio se znovu dotkl struny. První tón byl nejistý, ale ozval se. A tam, kde dopadl, se šedá mlha rozestoupila.',
      accent: '#ffd166'
    },
    {
      act: 'Část IV · Cíl',
      title: 'Cesta za hudbou',
      text: 'Melodrio se musí naučit hrát znovu, od nuly, a postupně vrátit hudbu do každé vesnice.',
      accent: '#ffc46b'
    },
    {
      act: 'Část IV · Cíl',
      title: 'Tvůj part',
      text: 'Uživatel mu při tom pomáhá: každý správně zahraný tón, akord a rytmus je Melodriův skok kupředu.',
      accent: '#ffbe5c'
    },
    {
      act: 'Část V · Tvá cesta',
      title: 'Tvoje cesta začíná',
      text: 'Teď je řada na tobě. Vezmi svou kytaru a pomoz Melodriovi vrátit údolí Akordov jeho melodii. S každým tónem se svět znovu barví.',
      accent: '#ffe08a'
    }
  ],

  current: 0,
  isOpen: false,
  _initialized: false,
  _autoPlayed: false,
  _previouslyFocused: null,
  _closeTimer: null,
  _onKeydown: null,

  /**
   * Cache DOM references and bind one-time controls.
   */
  init() {
    if (this._initialized) return;

    this.overlay = document.getElementById('story-overlay');
    if (!this.overlay) return;

    this.canvas = document.getElementById('story-canvas');
    this.card = document.getElementById('story-card');
    this.counter = document.getElementById('story-counter');
    this.actEl = document.getElementById('story-act');
    this.titleEl = document.getElementById('story-title');
    this.textEl = document.getElementById('story-text');
    this.dotsEl = document.getElementById('story-dots');
    this.prevBtn = document.getElementById('story-prev');
    this.nextBtn = document.getElementById('story-next');
    this.nextLabel = document.getElementById('story-next-label');
    this.nextIcon = document.getElementById('story-next-icon');
    this.skipBtn = document.getElementById('story-skip');
    this.mainApp = document.getElementById('main-app');

    if (window.PixelStory) {
      window.PixelStory.init(this.canvas);
    }

    this.renderDots();

    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.skipBtn) this.skipBtn.addEventListener('click', () => this.close(false));

    if (this.dotsEl) {
      this.dotsEl.addEventListener('click', (event) => {
        const dot = event.target.closest('.story-dot');
        if (!dot) return;
        const index = Number(dot.getAttribute('data-index'));
        if (!Number.isNaN(index)) this.goTo(index);
      });
    }

    this._onKeydown = this.handleKeydown.bind(this);
    this._initialized = true;
  },

  /**
   * Build the clickable slide indicators.
   */
  renderDots() {
    if (!this.dotsEl) return;
    this.dotsEl.innerHTML = this.SLIDES.map((slide, index) => `
      <button
        type="button"
        class="story-dot"
        data-index="${index}"
        role="tab"
        aria-label="Snímek ${index + 1}: ${slide.title}"
        aria-selected="false"
        tabindex="-1"
      ></button>
    `).join('');
  },

  /**
   * Start the story from the first slide.
   */
  play() {
    this.init();
    if (!this.overlay) return;

    if (this.isOpen) {
      this.showSlide(0);
      return;
    }

    this._autoPlayed = true;
    this._previouslyFocused = document.activeElement;
    this.isOpen = true;

    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }

    this.overlay.hidden = false;
    this.overlay.setAttribute('aria-hidden', 'false');
    this.overlay.classList.add('active');
    document.body.classList.add('story-open');
    if (this.mainApp) this.mainApp.inert = true;

    this.showSlide(0);
    document.addEventListener('keydown', this._onKeydown, true);

    if (window.PixelStory) {
      window.PixelStory.start();
    }

    setTimeout(() => {
      if (this.isOpen && this.nextBtn) {
        this.nextBtn.focus({ preventScroll: true });
      }
    }, 100);
  },

  /**
   * Auto-play exactly once per page load. Manual replay is always available.
   */
  playOnce() {
    if (this._autoPlayed) return;
    this.play();
  },

  /**
   * Render one slide.
   * @param {number} index
   */
  showSlide(index) {
    if (!this.overlay) return;
    const slides = this.SLIDES;
    if (!slides.length) return;

    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    this.current = index;

    const slide = slides[index];
    this.overlay.style.setProperty('--story-accent', slide.accent);

    if (this.counter) this.counter.textContent = `${index + 1} / ${slides.length}`;
    if (this.actEl) this.actEl.textContent = slide.act;
    if (this.titleEl) this.titleEl.textContent = slide.title;
    if (this.textEl) this.textEl.textContent = slide.text;

    const isFirst = index === 0;
    const isLast = index === slides.length - 1;

    if (this.prevBtn) this.prevBtn.disabled = isFirst;
    if (this.nextLabel) this.nextLabel.textContent = isLast ? 'Začít hrát' : 'Další';
    if (this.nextIcon) this.nextIcon.textContent = isLast ? '🎸' : '→';
    if (this.nextBtn) {
      this.nextBtn.setAttribute('aria-label', isLast ? 'Začít hrát' : 'Další snímek');
    }

    if (this.dotsEl) {
      Array.from(this.dotsEl.children).forEach((dot, dotIndex) => {
        const active = dotIndex === index;
        dot.classList.toggle('active', active);
        dot.classList.toggle('done', dotIndex < index);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
        dot.tabIndex = active ? 0 : -1;
      });
    }

    if (window.PixelStory) {
      window.PixelStory.setScene(index);
    }

    if (this.card) {
      this.card.classList.remove('is-entering');
      void this.card.offsetWidth;
      this.card.classList.add('is-entering');
      this.card.scrollTop = 0;
    }
  },

  /**
   * Go to a specific slide.
   * @param {number} index
   */
  goTo(index) {
    if (!this.isOpen) return;
    if (index < 0 || index >= this.SLIDES.length || index === this.current) return;
    if (window.Sounds && typeof window.Sounds.playClick === 'function') {
      window.Sounds.playClick();
    }
    this.showSlide(index);
  },

  /**
   * Advance to the next slide, or finish the story on the last one.
   */
  next() {
    if (!this.isOpen) return;
    if (this.current >= this.SLIDES.length - 1) {
      if (window.Sounds && typeof window.Sounds.playSuccess === 'function') {
        window.Sounds.playSuccess();
      }
      this.close(true);
      return;
    }
    this.goTo(this.current + 1);
  },

  /**
   * Go back one slide.
   */
  prev() {
    if (!this.isOpen) return;
    if (this.current <= 0) return;
    this.goTo(this.current - 1);
  },

  /**
   * Keyboard controls: Space / Enter next, arrows navigate, Esc skips.
   * @param {KeyboardEvent} event
   */
  handleKeydown(event) {
    if (!this.isOpen) return;

    const key = event.key;

    if (key === 'Tab') {
      this.trapFocus(event);
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.close(false);
      return;
    }

    if (key === 'ArrowRight' || key === 'PageDown') {
      event.preventDefault();
      event.stopPropagation();
      this.next();
      return;
    }

    if (key === 'ArrowLeft' || key === 'PageUp') {
      event.preventDefault();
      event.stopPropagation();
      this.prev();
      return;
    }

    if (key === ' ' || key === 'Spacebar' || key === 'Enter') {
      // Let focused buttons handle their own native activation exactly once.
      if (event.target && event.target.closest && event.target.closest('button, a, input, select, textarea')) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.next();
    }
  },

  /**
   * Keep keyboard focus inside the story dialog.
   * @param {KeyboardEvent} event
   */
  trapFocus(event) {
    if (!this.overlay) return;
    const focusables = Array.from(this.overlay.querySelectorAll(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )).filter((el) => el.offsetParent !== null);

    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !this.overlay.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !this.overlay.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  },

  /**
   * Close the story overlay.
   * @param {boolean} completed
   */
  close(completed = false) {
    if (!this.isOpen || !this.overlay) return;
    this.isOpen = false;

    document.removeEventListener('keydown', this._onKeydown, true);
    this.overlay.classList.remove('active');
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('story-open');
    if (this.mainApp) this.mainApp.inert = false;
    if (window.PixelStory) window.PixelStory.stop();

    this._closeTimer = setTimeout(() => {
      if (!this.isOpen && this.overlay) {
        this.overlay.hidden = true;
      }
    }, 420);

    const previous = this._previouslyFocused;
    if (previous && document.contains(previous) && previous.offsetParent !== null) {
      previous.focus({ preventScroll: true });
    } else {
      const activeNav = document.querySelector('.sidebar-item.active');
      if (activeNav && typeof activeNav.focus === 'function') {
        activeNav.focus({ preventScroll: true });
      }
    }

    this._previouslyFocused = null;

    if (completed && window.UI && typeof window.UI.showToast === 'function') {
      window.UI.showToast('🎸 Příběh začal. Tvůj první tón čeká v lekci!', 'success', true);
    }
  }
};
