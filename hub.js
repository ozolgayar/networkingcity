document.addEventListener('DOMContentLoaded', function() {

  // Кнопка «Погрузиться»
document.getElementById('btn-dive').addEventListener('click', function() {
  var hub = document.getElementById('hub');
  hub.style.display = 'block';
  // Плавно появляется
  hub.style.opacity = '0';
  hub.style.transition = 'opacity 0.5s ease';
  setTimeout(function() {
    hub.style.opacity = '1';
    hub.scrollIntoView({ behavior: 'smooth' });
  }, 50);
});

  // Скрываем индикатор скролла
  var scrollHint = document.getElementById('scroll-hint');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100 && scrollHint) {
      scrollHint.style.opacity = '0';
    }
  });

  // === Прогресс ===
  var mod1Progress = parseInt(localStorage.getItem('nc_mod1_progress') || '0', 10);
  var mod1Status = localStorage.getItem('nc_mod1_status') || '';
  var mod2Status = localStorage.getItem('nc_mod2_status') || '';
  var mod3Status = localStorage.getItem('nc_mod3_status') || '';

  // Прогресс-бар модуля 1
  var mod1Bar = document.getElementById('mod1-bar');
  var mod1Pct = document.getElementById('mod1-pct');
  if (mod1Bar) mod1Bar.style.width = mod1Progress + '%';
  if (mod1Pct) mod1Pct.textContent = mod1Progress + '%';

  // === Созвездие ===
  var completedModules = 0;
  if (mod1Status === 'complete') completedModules = 1;
  if (mod2Status === 'complete') completedModules = 2;
  if (mod3Status === 'complete') completedModules = 3;

  // Общий процент
  var totalPct = Math.round((completedModules / 3) * 100);
  var constPct = document.getElementById('const-pct');
  if (constPct) {
    constPct.textContent = totalPct + '%';
    if (totalPct > 0) constPct.classList.add('glow');
  }

  // Зажигаем звёзды и линии
  for (var i = 1; i <= completedModules; i++) {
    var star = document.getElementById('cstar-' + i);
    if (star) star.classList.add('active');

    // Линия перед текущей звездой (линия 1 между звёздами 1-2, линия 2 между 2-3)
    if (i >= 2) {
      var line = document.getElementById('cline-' + (i - 1));
      if (line) line.classList.add('active');
    }
  }

  // Если модуль 1 в процессе (не завершён, но начат) — подсвечиваем 1-ю звезду мягко
  if (mod1Progress > 0 && mod1Status !== 'complete') {
    var star1 = document.getElementById('cstar-1');
    if (star1) star1.style.opacity = '0.6';
    star1.classList.add('active');
  }

  // === Карточки модулей ===
  if (mod1Status === 'complete') {
    var card1 = document.querySelector('[data-module="1"]');
    if (card1) {
      card1.classList.remove('unlocked');
      card1.classList.add('completed');
      var s1 = card1.querySelector('.hub-card-status');
      if (s1) s1.textContent = '✅ Пройден';
      var b1 = card1.querySelector('.hub-card-btn');
      if (b1) b1.textContent = 'Повторить';
    }
    var card2 = document.querySelector('[data-module="2"]');
    if (card2) {
      card2.classList.remove('locked');
      card2.classList.add('unlocked');
      var s2 = card2.querySelector('.hub-card-status');
      if (s2) s2.textContent = '🟢 Доступен';
      var b2 = card2.querySelector('.hub-card-btn');
      if (b2) {
        b2.classList.remove('disabled');
        b2.textContent = 'Начать →';
      }
    }
  }

  if (mod2Status === 'complete') {
    var card2c = document.querySelector('[data-module="2"]');
    if (card2c) {
      card2c.classList.remove('unlocked');
      card2c.classList.add('completed');
      var s2c = card2c.querySelector('.hub-card-status');
      if (s2c) s2c.textContent = '✅ Пройден';
      var b2c = card2c.querySelector('.hub-card-btn');
      if (b2c) b2c.textContent = 'Повторить';
    }
    var card3 = document.querySelector('[data-module="3"]');
    if (card3) {
      card3.classList.remove('locked');
      card3.classList.add('unlocked');
      var s3 = card3.querySelector('.hub-card-status');
      if (s3) s3.textContent = '🟢 Доступен';
      var b3 = card3.querySelector('.hub-card-btn');
      if (b3) {
        b3.classList.remove('disabled');
        b3.textContent = 'Начать →';
      }
    }
  }

  // Анимация появления карточек
  var cards = document.querySelectorAll('.hub-card');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(function(card, i) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease ' + (i * 0.1) + 's';
    observer.observe(card);
  });


 // ===== Мерцающие пойнты с посланиями =====
  var tooltip = document.getElementById('wisdom-tooltip');
  var points = document.querySelectorAll('.wisdom-point');
  var activePoint = null;

  points.forEach(function(point) {
    point.addEventListener('click', function(e) {
      e.stopPropagation();

      // Если кликнули на уже открытый — закрываем
      if (activePoint === point) {
        tooltip.classList.remove('active');
        activePoint = null;
        return;
      }

      activePoint = point;
      var msg = point.getAttribute('data-msg');
      tooltip.textContent = msg;

        // Позиционируем тултип рядом с точкой
      var container = document.getElementById('wisdom-points');
      var containerRect = container.getBoundingClientRect();
      var pointRect = point.getBoundingClientRect();
      var tooltipW = 260;

      var px = pointRect.left - containerRect.left + pointRect.width / 2;
      var leftPos = px - tooltipW / 2;

      if (leftPos < 16) leftPos = 16;
      if (leftPos + tooltipW > containerRect.width - 16) {
        leftPos = containerRect.width - tooltipW - 16;
      }

      var py = pointRect.top - containerRect.top + pointRect.height + 12;

      if (py + 120 > containerRect.height) {
        py = pointRect.top - containerRect.top - 120;
      }

      tooltip.style.left = leftPos + 'px';
      tooltip.style.top = py + 'px';
      tooltip.style.width = tooltipW + 'px';
      
      
      tooltip.classList.remove('active');
      // Форсируем reflow для повторной анимации
      void tooltip.offsetWidth;
      tooltip.classList.add('active');
    });
  });

  // Клик по свободному месту — закрываем тултип
  document.addEventListener('click', function() {
    tooltip.classList.remove('active');
    activePoint = null;
  });
});
