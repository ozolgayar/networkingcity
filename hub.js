(function() {
  // ===== Ссылки на модули (замени на реальные URL на Тильде) =====
  var MODULE_URLS = {
    1: 'module1.html',
    2: 'module2.html',
    3: 'module3.html'
  };

  // ===== Чтение прогресса из localStorage =====
  function getProgress(mod) {
    return parseInt(localStorage.getItem('nc_mod' + mod + '_progress') || '0', 10);
  }

  function getStatus(mod) {
    return localStorage.getItem('nc_mod' + mod + '_status') || '';
  }

  function getTotalLevel() {
    var m1 = getProgress(1);
    var m2 = getProgress(2);
    var m3 = getProgress(3);
    // Модуль 1 даёт до 35%, модуль 2 до 35%, модуль 3 до 30%
    return Math.min(100, Math.round(m1 * 0.35 + m2 * 0.35 + m3 * 0.30));
  }

  // ===== Обновление UI =====
  function updateHub() {
    var total = getTotalLevel();

    // Общий прогресс
    document.getElementById('hub-level-value').textContent = total + '%';
    document.getElementById('hub-level-bar').style.transform = 'scaleX(' + (total / 100) + ')';

    // Модули
    updateModuleCard(1);
    updateModuleCard(2);
    updateModuleCard(3);
  }

  function updateModuleCard(mod) {
    var card = document.getElementById('mod' + mod + '-card');
    var bar = document.getElementById('mod' + mod + '-bar');
    var text = document.getElementById('mod' + mod + '-text');
    var status = document.getElementById('mod' + mod + '-status');
    var progress = getProgress(mod);
    var modStatus = getStatus(mod);

    bar.style.transform = 'scaleX(' + (progress / 100) + ')';
    text.textContent = progress + '%';

    // Разблокировка
    var unlocked = isUnlocked(mod);

    if (modStatus === 'complete') {
      card.classList.remove('module-locked');
      card.classList.add('module-complete');
      status.textContent = '✅ Пройден';
      status.className = 'module-status status-complete';
    } else if (unlocked) {
      card.classList.remove('module-locked');
      card.classList.remove('module-complete');
      if (progress > 0) {
        status.textContent = 'Продолжить →';
      } else {
        status.textContent = 'Начать →';
      }
      status.className = 'module-status';
    } else {
      card.classList.add('module-locked');
      card.classList.remove('module-complete');
      status.textContent = '🔒 Заблокирован';
      status.className = 'module-status';
    }
  }

  function isUnlocked(mod) {
    if (mod === 1) return true;
    if (mod === 2) return getStatus(1) === 'complete';
    if (mod === 3) return getStatus(2) === 'complete';
    return false;
  }

  // ===== Клики по карточкам =====
  function initClicks() {
    document.querySelectorAll('.module-card').forEach(function(card) {
      card.addEventListener('click', function() {
        var mod = parseInt(card.dataset.module);
        if (!isUnlocked(mod)) return;

        var url = MODULE_URLS[mod];
        if (url) {
          window.location.href = url;
        }
      });
    });
  }

  // ===== Цитаты (ротация) =====
  function initQuotes() {
    var quotes = [
      { text: '«Поставьте себе цель каждую неделю знакомиться с новым человеком. Неважно, кем он будет и где это произойдёт.»', author: '— Кейт Ферраци' },
      { text: '«Чаще бывает полезнее знать многих, чем многое.»', author: '— Роберт Лембке' },
      { text: '«Нетворкинг — это искусство создания отношений, которые в перспективе могут быть полезны в любой сфере жизни.»', author: '— Гил Петерсил' },
      { text: '«Если из-за страха перед неизвестным мы отгораживаемся от общения, мы теряем себя как личности. Когда становимся открытыми, появляются новые возможности.»', author: '— Джефф Джарвис' }
    ];

    var idx = Math.floor(Math.random() * quotes.length);
    var q = quotes[idx];
    var textEl = document.querySelector('.hub-quote-text');
    var authorEl = document.querySelector('.hub-quote-author');
    if (textEl) textEl.textContent = q.text;
    if (authorEl) authorEl.textContent = q.author;
  }

  // ===== Инициализация =====
  document.addEventListener('DOMContentLoaded', function() {
    updateHub();
    initClicks();
    initQuotes();
  });

  // Обновляем при возврате на страницу (из модуля)
  window.addEventListener('focus', updateHub);
  window.addEventListener('pageshow', updateHub);

})();
