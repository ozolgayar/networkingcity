document.addEventListener('DOMContentLoaded', function() {

  var isMapPage = document.querySelector('.map-scene') !== null;
  var isCoverPage = document.querySelector('.cover') !== null;


// ===== Попап для мобильных =====
var rotateOverlay = document.getElementById('rotate-overlay');
var rotateBtnOk = document.getElementById('rotate-btn-ok');
var rotateText = document.querySelector('.rotate-text');

function isMobile() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function checkOrientation() {
  if (!rotateOverlay) return;
  if (!isMobile()) return; // На десктопе не показываем

  if (window.innerHeight > window.innerWidth) {
    // Вертикальное положение
    if (rotateText) rotateText.textContent = 'Мобильная версия в разработке. Для комфортного прохождения рекомендуем открывать курс с компьютера или ноутбука. На мобильных устройствах курс может отображаться некорректно.';
  } else {
    // Горизонтальное положение
    if (rotateText) rotateText.textContent = 'Мобильная версия в разработке. Для комфортного прохождения рекомендуем открывать курс с компьютера или ноутбука. На мобильных устройствах курс может отображаться некорректно.';
  }

  // Показываем в любом случае на мобильном
  rotateOverlay.classList.add('visible');
}

if (rotateBtnOk) {
  rotateBtnOk.addEventListener('click', function() {
    rotateOverlay.classList.remove('visible');
  });
}

// Показываем сразу при загрузке
checkOrientation();

// Следим за поворотом
window.addEventListener('resize', function() {
  setTimeout(checkOrientation, 300);
});
window.addEventListener('orientationchange', function() {
  setTimeout(checkOrientation, 300);
});
  
    // ===== Код только для map.html =====
  if (isMapPage) {
        var m1status = localStorage.getItem('nc_mod1_status') || '';
    var m2status = localStorage.getItem('nc_mod2_status') || '';
    var m3status = localStorage.getItem('nc_mod3_status') || '';

    // ===== Точки модулей =====
    var mapPoints = document.querySelectorAll('.map-point');
    var mapTooltip = document.getElementById('map-tooltip');
    var mapTooltipTitle = document.getElementById('map-tooltip-title');
    var mapTooltipDesc = document.getElementById('map-tooltip-desc');

    mapPoints.forEach(function(point) {
      var mod = point.getAttribute('data-module');

      if (mod === '1') {
        if (m1status === 'complete') {
          point.classList.remove('unlocked', 'locked', 'pulsing');
          point.classList.add('completed');
          point.querySelector('.map-point-status').textContent = '✅ Пройден';
        }
      }
      if (mod === '2') {
        if (m1status === 'complete') {
          point.classList.remove('locked');
          point.classList.add('unlocked', 'pulsing');
          point.querySelector('.map-point-status').textContent = '🟢 Доступен';
        }
        if (m2status === 'complete') {
          point.classList.remove('unlocked', 'locked', 'pulsing');
          point.classList.add('completed');
          point.querySelector('.map-point-status').textContent = '✅ Пройден';
        }
      }
      if (mod === '3') {
        if (m2status === 'complete') {
          point.classList.remove('locked');
          point.classList.add('unlocked', 'pulsing');
          point.querySelector('.map-point-status').textContent = '🟢 Доступен';
        }
        if (m3status === 'complete') {
          point.classList.remove('unlocked', 'locked', 'pulsing');
          point.classList.add('completed');
          point.querySelector('.map-point-status').textContent = '✅ Пройден';
        }
      }

      // Тултип при наведении
      point.addEventListener('mouseenter', function() {
        if (!mapTooltip) return;
        mapTooltipTitle.textContent = point.getAttribute('data-tip-title');
        mapTooltipDesc.textContent = point.getAttribute('data-tip-desc');

        var rect = point.getBoundingClientRect();
        var sceneRect = point.closest('.map-scene').getBoundingClientRect();

        var left = rect.left - sceneRect.left + rect.width / 2 - 120;
        var top = rect.top - sceneRect.top - 120;

        if (left < 8) left = 8;
        if (left + 240 > sceneRect.width - 8) left = sceneRect.width - 248;
        if (top < 8) top = rect.bottom - sceneRect.top + 10;

        mapTooltip.style.left = left + 'px';
        mapTooltip.style.top = top + 'px';
        mapTooltip.classList.add('visible');
      });

      point.addEventListener('mouseleave', function() {
        if (mapTooltip) mapTooltip.classList.remove('visible');
      });

      // Клик
      point.addEventListener('click', function() {
        var href = point.getAttribute('data-href');
        if (point.classList.contains('locked')) {
          point.querySelector('.map-point-circle').style.animation = 'shake 0.4s ease';
          setTimeout(function() {
            point.querySelector('.map-point-circle').style.animation = '';
          }, 400);
          return;
        }
        if (href) window.location.href = href;
      });
    });

    // ===== Прогресс-бар =====
    var completedCount = 0;
    if (m1status === 'complete') completedCount++;
    if (m2status === 'complete') completedCount++;
    if (m3status === 'complete') completedCount++;

    var pct = Math.round((completedCount / 3) * 100);
    var fill = document.getElementById('map-progress-fill');
    var pctEl = document.getElementById('map-progress-pct');
    if (fill) setTimeout(function() { fill.style.width = pct + '%'; }, 300);
    if (pctEl) pctEl.textContent = pct + '%';

    // ===== Смена цитат =====
    var quotes = [
      { text: '«Поставьте себе цель каждую неделю знакомиться с новым человеком. Неважно, кем он будет и где это произойдёт»', author: '— Кейт Ферраци' },
      { text: '«Чаще бывает полезнее знать многих, чем многое»', author: '— Роберт Лембке' },
      { text: '«Нетворкинг — это искусство создания отношений, которые в перспективе могут быть полезны в любой сфере жизни»', author: '— Гил Петерсил' },
      { text: '«Нетворкинг — умение открыто и искренне общаться с самыми разными людьми, выстраивая сеть полезных знакомств»', author: '— Кейт Феррацци' },
      { text: '«Если из-за страха перед неизвестным мы отгораживаемся от общения друг с другом, мы теряем себя как личности»', author: '— Джефф Джарвис' }
    ];

    var quoteText = document.getElementById('map-quote-text');
    var quoteAuthor = document.getElementById('map-quote-author');
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

   // Автоматически определяем позицию по месту стикера
        var isBottom = rect.top > window.innerHeight * 0.55;
        var isRight  = rect.left > window.innerWidth  * 0.55;

        if (tipPos === 'force-right') {
          // Принудительно справа
          left = rect.right + 12;
          top  = rect.top + rect.height / 2 - th / 2;
        } else if (tipPos === 'top' || isBottom) {
          // Тултип СВЕРХУ
          left = rect.left + rect.width / 2 - tw / 2;
          top  = rect.top - th - 16;
        } else if (tipPos === 'left' || isRight) {
          // Тултип СЛЕВА
          left = rect.left - tw - 12;
          top  = rect.top + rect.height / 2 - th / 2;
        } else {
          // Тултип СПРАВА
          left = rect.right + 12;
          top  = rect.top + 10;
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
