document.addEventListener('DOMContentLoaded', function() {

  // Кнопка «Погрузиться»
  var btnDive = document.getElementById('btn-dive');
  if (btnDive) {
    btnDive.addEventListener('click', function() {
      document.getElementById('hub').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Скрываем индикатор скролла
  var scrollHint = document.getElementById('scroll-hint');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100 && scrollHint) {
      scrollHint.style.opacity = '0';
    }
  });

  // Прогресс модуля 1
  var mod1Progress = parseInt(localStorage.getItem('nc_mod1_progress') || '0', 10);
  var mod1Status = localStorage.getItem('nc_mod1_status') || '';

  var mod1Bar = document.getElementById('mod1-bar');
  var mod1Pct = document.getElementById('mod1-pct');
  if (mod1Bar) mod1Bar.style.width = mod1Progress + '%';
  if (mod1Pct) mod1Pct.textContent = mod1Progress + '%';

  // Общий уровень
  var levelBar = document.getElementById('hub-level-bar');
  var levelValue = document.getElementById('hub-level-value');
  if (levelBar) levelBar.style.width = mod1Progress + '%';
  if (levelValue) levelValue.textContent = mod1Progress + '%';

  // Если модуль 1 пройден
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

});
