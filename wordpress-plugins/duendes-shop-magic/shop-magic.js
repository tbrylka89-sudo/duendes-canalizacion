/**
 * Duendes Shop Magic — JS v1.0
 * Particles, size grouping, scroll reveals, cursor glow, social proof
 */
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initMagicShop, 300);
  });

  function initMagicShop() {

    // ═══ 1. FLOATING PARTICLES ═══
    var canvas = document.getElementById('magic-particles');
    if (canvas) {
      var ctx = canvas.getContext('2d');
      var W, H;
      function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = document.body.scrollHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      var particles = [];
      function Particle() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.5 + 0.3;
        this.speed = Math.random() * 0.25 + 0.08;
        this.drift = (Math.random() - 0.5) * 0.2;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.pulse = Math.random() * Math.PI * 2;
        this.gold = Math.random() > 0.55;
      }
      Particle.prototype.update = function() {
        this.y -= this.speed;
        this.x += this.drift + Math.sin(this.pulse * 0.3) * 0.15;
        this.pulse += 0.015;
        if (this.y < -10) { this.y = H + 10; this.x = Math.random() * W; }
      };
      Particle.prototype.draw = function() {
        var a = this.alpha * (0.5 + 0.5 * Math.sin(this.pulse));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.gold
          ? 'rgba(184,151,58,' + a + ')'
          : 'rgba(180,200,160,' + (a * 0.4) + ')';
        ctx.fill();
        // Halo on larger gold particles
        if (this.r > 1 && this.gold) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(184,151,58,' + (a * 0.08) + ')';
          ctx.fill();
        }
      };

      for (var i = 0; i < 60; i++) particles.push(new Particle());

      function animate() {
        ctx.clearRect(0, 0, W, H);
        for (var j = 0; j < particles.length; j++) {
          particles[j].update();
          particles[j].draw();
        }
        requestAnimationFrame(animate);
      }
      animate();

      // Re-measure canvas on scroll
      var resizeTimeout;
      window.addEventListener('scroll', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 200);
      });
    }

    // ═══ 2. CURSOR GLOW ═══
    var glow = document.getElementById('cursor-glow');
    if (glow && window.matchMedia('(hover: hover)').matches) {
      document.addEventListener('mousemove', function(e) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      });
    }

    // ═══ 3. GROUP CARDS BY SIZE ═══
    var grid = document.querySelector('.productos-grid');
    if (!grid) return;

    var cards = Array.from(grid.querySelectorAll('.guardian-card'));
    if (!cards.length) return;

    var sizeOrder = ['Mini', 'Pixie', 'Mediano', 'Grande', 'Gigante'];
    var sizeInfo = {
      'Mini':    { title: 'Mini',     accent: 'Clásicos',   sub: 'Pequeños pero poderosos — un guardián siempre cerca tuyo', rune: '✦' },
      'Pixie':   { title: 'Pixie',    accent: 'Encantados', sub: 'Traviesos, juguetones, con espíritu de bosque',            rune: '❋' },
      'Mediano': { title: 'Medianos', accent: 'Guardianes', sub: 'El tamaño perfecto — presencia, detalle y alma',           rune: '◆' },
      'Grande':  { title: 'Grandes',  accent: 'Especiales', sub: 'Para quienes buscan una conexión más profunda',            rune: '✧' },
      'Gigante': { title: 'Gigantes', accent: 'Maestros',   sub: 'Piezas únicas de máximo poder y canalización',             rune: '⟡' }
    };

    var groups = {};
    cards.forEach(function(card) {
      var sizeEl = card.querySelector('.guardian-tamano');
      var size = sizeEl ? sizeEl.textContent.trim() : 'Mediano';
      // Normalize
      var sizeLower = size.toLowerCase();
      if (sizeLower.indexOf('mini') !== -1) size = 'Mini';
      else if (sizeLower.indexOf('pixie') !== -1) size = 'Pixie';
      else if (sizeLower.indexOf('gigante') !== -1) size = 'Gigante';
      else if (sizeLower.indexOf('grande') !== -1) size = 'Grande';
      else size = 'Mediano';

      if (!groups[size]) groups[size] = [];
      groups[size].push(card);
    });

    // Rebuild grid sorted by size with section headers
    grid.innerHTML = '';

    sizeOrder.forEach(function(size) {
      if (!groups[size] || groups[size].length === 0) return;
      var info = sizeInfo[size];
      var available = groups[size].filter(function(c) { return !c.classList.contains('adoptado'); });
      var adopted = groups[size].filter(function(c) { return c.classList.contains('adoptado'); });

      // Section header
      var header = document.createElement('div');
      header.className = 'size-section-header';
      header.innerHTML =
        '<div class="ssh-line"></div>' +
        '<div class="ssh-rune">' + info.rune + '</div>' +
        '<h2>' + info.title + ' <em>' + info.accent + '</em></h2>' +
        '<div class="ssh-sub">' + info.sub + '</div>' +
        '<div class="ssh-count">' + available.length + ' DISPONIBLES</div>';
      grid.appendChild(header);

      // Available first, then adopted
      available.forEach(function(card, i) {
        card.style.transitionDelay = (i * 0.07) + 's';
        grid.appendChild(card);
      });
      adopted.forEach(function(card, i) {
        card.style.transitionDelay = ((available.length + i) * 0.07) + 's';
        grid.appendChild(card);
      });
    });

    // ═══ 4. ADD HOVER CTA OVERLAY ═══
    cards.forEach(function(card) {
      if (card.classList.contains('adoptado')) return;
      var overlay = document.createElement('div');
      overlay.className = 'hover-overlay';
      overlay.innerHTML = '<span class="ho-btn">CONOCER SU HISTORIA</span>';
      var imgWrap = card.querySelector('.guardian-imagen');
      if (imgWrap) imgWrap.appendChild(overlay);
    });

    // ═══ 5. SCROLL REVEAL ═══
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll('.guardian-card, .size-section-header').forEach(function(el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show all immediately
      document.querySelectorAll('.guardian-card').forEach(function(el) {
        el.classList.add('revealed');
      });
    }

    // ═══ 6. SOCIAL PROOF TOAST ═══
    var toast = document.getElementById('sp-toast');
    if (toast) {
      var spText = toast.querySelector('.sp-text');
      var spTime = toast.querySelector('.sp-time');
      var toastData = [
        {n:'María',c:'Buenos Aires',p:'Freya',t:'hace 3 min'},
        {n:'Carolina',c:'Ciudad de México',p:'Thomas',t:'hace 7 min'},
        {n:'Luciana',c:'Madrid',p:'Serena',t:'hace 12 min'},
        {n:'Gabriela',c:'Santiago',p:'Moonstone',t:'hace 18 min'},
        {n:'Florencia',c:'Montevideo',p:'Dani',t:'hace 25 min'},
        {n:'Andrea',c:'Bogotá',p:'Lil',t:'hace 31 min'}
      ];
      var ti = 0;
      function showToast() {
        var d = toastData[ti % toastData.length];
        spText.innerHTML = '<strong>' + d.n + '</strong> de ' + d.c + ' adoptó a <strong>' + d.p + '</strong>';
        spTime.textContent = d.t;
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); ti++; }, 4500);
      }
      setTimeout(function() {
        showToast();
        setInterval(function() {
          setTimeout(showToast, Math.random() * 12000 + 18000);
        }, 28000);
      }, 6000);
    }

    // ═══ 7. RESIZE PARTICLES CANVAS ═══
    setTimeout(function() {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = document.body.scrollHeight;
      }
    }, 1000);

  } // end initMagicShop
})();
