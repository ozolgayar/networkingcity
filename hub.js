document.addEventListener('DOMContentLoaded', function() {
 var isMapPage = document.getElementById('hub') !== null;
  var isCoverPage = document.querySelector('.cover') !== null;

 // ===== Код только для map.html =====
  if (isMapPage) {

    // Прогресс
    var mod1Progress = parseInt(localStorage.getItem('nc_mod1_progress') || '0', 10);
    var mod1Status = localStorage.getItem('nc_mod1_status') || '';
    var mod2Status = localStorage.getItem('nc_mod2_status') || '';
    var mod3Status = localStorage.getItem('nc_mod3_status') || '';

    // Прогресс-бар модуля 1
    var mod1Bar = document.getElementById('mod1-bar');
    var mod1Pct = document.getElementById('mod1-pct');
    if (mod1Bar) mod1Bar.style.width = mod1Progress + '%';
    if (mod1Pct) mod1Pct.textContent = mod1Progress + '%';

    // Созвездие
    var completedModules = 0;
    if (mod1Status === 'complete') completedModules = 1;
    if (mod2Status === 'complete') completedModules = 2;
    if (mod3Status === 'complete') completedModules = 3;

    var totalPct = Math.round((completedModules / 3) * 100);
    var constPct = document.getElementById('const-pct');
    if (constPct) {
      constPct.textContent = totalPct + '%';
      if (totalPct > 0) constPct.classList.add('glow');
    }

    // Дерево нетворкинга
    function activateNode(id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('active');
    }
    function activateLabel(id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('active');
    }

    if (completedModules >= 1) {
      activateNode('cstar-1');
      activateLabel('clabel-1');
      activateNode('cline-1');
      activateNode('cline-1b');
    }
    if (completedModules >= 2) {
      activateNode('cstar-2');
      activateNode('cstar-2b');
      activateLabel('clabel-2');
      activateNode('cline-2');
      activateNode('cline-2b');
      activateNode('cline-2c');
      activateNode('cline-2d');
      activateNode('cline-2e');
      activateNode('cline-2f');
    }
    if (completedModules >= 3) {
      activateNode('cstar-3a');
      activateNode('cstar-3b');
      activateNode('cstar-3c');
      activateNode('cstar-3d');
      activateNode('cstar-3e');
      activateNode('cstar-3f');
      activateLabel('clabel-3');
    }

    if (mod1Progress > 0 && mod1Status !== 'complete') {
      var root = document.getElementById('cstar-1');
      if (root) {
        root.style.opacity = '0.6';
        root.classList.add('active');
      }
    }

    // Карточки модулей
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

    // Анимация карточек
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

    // Смена цитат
    var quotes = [
      { text: '«Поставьте себе цель каждую неделю знакомиться с новым человеком. Неважно, кем он будет и где это произойдёт»', author: '— Кейт Ферраци' },
      { text: '«Чаще бывает полезнее знать многих, чем многое»', author: '— Роберт Лембке' },
      { text: '«Нетворкинг — это искусство создания отношений, которые в перспективе могут быть полезны в любой сфере жизни»', author: '— Гил Петерсил' },
      { text: '«Нетворкинг — умение открыто и искренне общаться с самыми разными людьми, выстраивая сеть полезных знакомств»', author: '— Кейт Феррацци' },
      { text: '«Если из-за страха перед неизвестным мы отгораживаемся от общения друг с другом, мы теряем себя как личности»', author: '— Джефф Джарвис' }
    ];

    var quoteText = document.querySelector('.hub-quote-text');
    var quoteAuthor = document.querySelector('.hub-quote-author');
    var quoteIndex = 0;

    if (quoteText && quoteAuthor) {
      setInterval(function() {
        quoteIndex = (quoteIndex + 1) % quotes.length;
        quoteText.style.opacity = '0';
        quoteAuthor.style.opacity = '0';
        setTimeout(function() {
          quoteText.textContent = quotes[quoteIndex].text;
          quoteAuthor.textContent = quotes[quoteIndex].author;
          quoteText.style.opacity = '1';
          quoteAuthor.style.opacity = '1';
        }, 500);
      }, 8000);
    }

  } // конец isMapPage

  // ===== Код только для index.html =====
  if (isCoverPage) {

    var scrollHint = document.getElementById('scroll-hint');
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100 && scrollHint) {
        scrollHint.style.opacity = '0';
      }
    });

  } // конец isCoverPage

}); // конец DOMContentLoaded


// ===== Тултипы стикеров — только для index.html =====
(function() {
  var tooltip = document.getElementById('sticker-tooltip');
  if (!tooltip) return;

  var currentSticker = null;
  var hideTimer = null;

  document.querySelectorAll('.cover-sticker').forEach(function(sticker) {
    sticker.addEventListener('click', function(e) {
      e.stopPropagation();

      var msg = sticker.getAttribute('data-tip');
      if (!msg) return;

      if (currentSticker === sticker && tooltip.classList.contains('visible')) {
        hideTooltip();
        return;
      }

      currentSticker = sticker;
      tooltip.textContent = msg;
      tooltip.classList.remove('visible');

      requestAnimationFrame(function() {
        var rect = sticker.getBoundingClientRect();
        var tw = 240;
        var th = tooltip.offsetHeight || 100;

        var tipPos = sticker.getAttribute('data-tip-pos');
        var left, top;

        if (tipPos === 'top') {
          left = rect.left + rect.width / 2 - tw / 2;
          top = rect.top - th - 16;
          if (top < 16) {
            left = rect.right + 12;
            top = rect.top + 10;
          }
        } else if (tipPos === 'left') {
          left = rect.left - tw - 12;
          top = rect.top + rect.height / 2 - th / 2;
        } else {
          left = rect.right + 12;
          top = rect.top + 10;
          if (left + tw > window.innerWidth - 16) {
            left = rect.left - tw - 12;
          }
        }

        if (left + tw > window.innerWidth - 16) left = window.innerWidth - tw - 16;
        if (left < 16) left = 16;
        if (top + th > window.innerHeight - 16) top = rect.top - th - 16;
        if (top < 16) top = rect.bottom + 12;

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.classList.add('visible');
      });

      clearTimeout(hideTimer);
      hideTimer = setTimeout(hideTooltip, 4000);
    });
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.cover-sticker')) {
      hideTooltip();
    }
  });

  function hideTooltip() {
    tooltip.classList.remove('visible');
    currentSticker = null;
    clearTimeout(hideTimer);
  }
})();
