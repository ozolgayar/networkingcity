// ===== Supabase =====
var _sb = null;
try {
  var _supaLib = window.supabase || window.Supabase;
  if (_supaLib && _supaLib.createClient) {
    _sb = _supaLib.createClient(
      'https://hdzelembnsoejijvlhzj.supabase.co',
      'sb_publishable_y4va7P8-6stuCGq4b55LuQ_rmM3JUD4'
    );
    console.log('✅ Supabase подключён');
  } else {
    console.warn('❌ Supabase библиотека не найдена');
  }
} catch(e) {
  console.warn('Supabase ошибка:', e);
}

var _quizNeedsStart = false;

// Глобальное состояние
const state = {
  score: 0,
  screensVisited: {},
  wheel: {
    segments: ['Карьера', 'Образование', 'Хобби', 'Личные проекты', 'Финансы', 'Здоровье'],
    values: [0, 0, 0, 0, 0, 0],
    importance: [5, 5, 5, 5, 5, 5],
    currentIndex: 0
  },
  beads: { stage: 1, attempts: 0 },
  bizcardRewarded: false
};

// Порядок экранов
const screenOrder = [
  'screen-1', 'screen-2', 'screen-3-0', 'screen-3', 'screen-10',
  'screen-11', 'screen-12', 'screen-13', 'screen-13-s','screen-14', 'screen-15',
  'screen-16', 'screen-16-1', 'screen-17', 'screen-17-1',
  'screen-19', 'screen-19-1',
  'screen-20', 'screen-20-1', 'screen-21', 'screen-21-0',
  'screen-21-1', 'screen-21-1-1',
  'screen-21-2',
  'screen-zlata-ready',
  'screen-final'
];

// ===== Утилиты =====
function showScreen(id) {
 var sc = document.getElementById('screen-container');
  if (sc) {
    sc.style.cssText = '';
  }

   if (id !== 'screen-17') {
    var smartSvg = document.getElementById('smart-lines');
    if (smartSvg) {
      // Очищаем все нарисованные пути
      smartSvg.innerHTML = '';
    }
    // На всякий случай удаляем любые «сбежавшие» SVG на других экранах
    document.querySelectorAll('.screen:not(#screen-17) svg.smart-lines').forEach(function(svg) {
      if (svg.id !== 'smart-lines') svg.remove();
    });
  }
  
  // Сброс inline-стилей панели экрана 2
  var panel2 = document.querySelector('#screen-2 .panel');
  if (panel2) panel2.style.cssText = '';
  var screen2 = document.getElementById('screen-2');
  if (screen2) screen2.style.background = '';

  // Восстановить скрытые элементы экрана 2
  ['quiz-progress', 'quiz-intro-text', 'quiz-intro-hint'].forEach(function(elId) {
    var el = document.getElementById(elId);
    if (el) el.style.display = '';
  });
  var h2 = document.querySelector('#screen-2 h2');
  if (h2) h2.style.display = '';
  var tag = document.querySelector('#screen-2 .panel-tag');
  if (tag) tag.style.display = '';
  var origBack = document.querySelector('#screen-2 [data-prev]');
  if (origBack) origBack.style.display = '';

  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
  });

  if (id === 'screen-2') {
    _quizNeedsStart = true;
  }
  var screenEl = document.getElementById(id);
  if (!screenEl) {
    console.warn('showScreen: экран не найден →', id);
    return;
  }
  screenEl.classList.add('active');
  state.screensVisited[id] = true;
  updateHud();

  if (id === 'screen-2') {
    setTimeout(function() {
      var area = document.getElementById('quiz-area');
      if (area && area.innerHTML.trim() === '') {
        initQuiz();
      }
    }, 50);
  }
  if (id === 'screen-12') {
    setTimeout(function() { renderBeadsStage(); }, 50);
  }
  if (id === 'screen-13') {
    setTimeout(function() { initFears(); }, 50);
  }
  if (id === 'screen-13-s') {
    setTimeout(function() {
      var el = document.querySelector('#screen-13-s .fear-fullscreen');
      if (el) el.scrollTop = 0;
      var sc = document.getElementById('screen-container');
      if (sc) sc.scrollTop = 0;
      window.scrollTo(0, 0);
      initFears13S();
    }, 50);
  }

  if (id === 'screen-14') {
    setTimeout(function() { initWheel(); }, 50);
  }
 if (id === 'screen-15') {
  setTimeout(function() {
    renderWheel('resultWheelSvg', state.wheel.values, -1);
    initImportanceSliders();  // ← добавь это
  }, 100);
}
  if (id === 'screen-16') {
  setTimeout(function() { initPeopleGame(); }, 50);
}
  if (id === 'screen-16-1' && !window._locationsInited) {
    window._locationsInited = true;
    setTimeout(function() { initLocations(); }, 50);
  }
  if (id === 'screen-17' && !window._smartInited) {
    window._smartInited = true;
    setTimeout(function() { initSmartGoal(); }, 50);
  }
  if (id === 'screen-17-1' && !window._zlataCard17Inited) {
    window._zlataCard17Inited = true;
    setTimeout(function() { initZlataCard17(); }, 50);
  }
if (id === 'screen-19') {
  setTimeout(function() { initBizcard(); }, 50);
}
  if (id === 'screen-19-1' && !window._zlataCard19Inited) {
    window._zlataCard19Inited = true;
    setTimeout(function() { initZlataCard19(); }, 50);
  }
  if (id === 'screen-20' && !window._photoInited) {
    window._photoInited = true;
    setTimeout(function() { initPhotoGame(); }, 50);
  }
    if (id === 'screen-20-1' && !window._statusInited) {
    window._statusInited = true;
    setTimeout(function() { initStatusForm(); }, 50);
  }
  if (id === 'screen-21' && !window._stickyInited) {
    window._stickyInited = true;
    setTimeout(function() { initProfileAndSticky(); }, 50);
  }
  if (id === 'screen-21-0' && !window._zlataCard21Inited) {
    window._zlataCard21Inited = true;
    setTimeout(function() { initZlataCard21(); }, 50);
  }
  if (id === 'screen-21-1' && !window._bagInited) {
    window._bagInited = true;
    setTimeout(function() { initBag(); }, 50);
  }
  if (id === 'screen-21-1-1' && !window._zlataCard211Inited) {
    window._zlataCard211Inited = true;
    setTimeout(function() { initZlataCard211(); }, 50);
  }
  if (id === 'screen-21-2' && !window._venueInited) {
    window._venueInited = true;
    setTimeout(function() { initVenueMap(); }, 50);
  }
  if (id === 'screen-10') {
    setTimeout(function() {
      var scheduleDone = localStorage.getItem('laptopScheduleDone') === '1';
      var goalDone     = localStorage.getItem('laptopGoalDone') === '1';
      var mapDone      = localStorage.getItem('mapViewed') === '1';
      var bs = document.getElementById('schedule-done-badge');
      var bg = document.getElementById('goal-done-badge');
      var bm = document.getElementById('map-done-badge');
      var btn = document.getElementById('btn-laptop-next');
      var hint = document.getElementById('laptop-next-hint');
      if (bs && scheduleDone) bs.style.display = 'flex';
      if (bg && goalDone)     bg.style.display = 'flex';
      if (bm && mapDone)      bm.style.display = 'flex';
      var allDone = scheduleDone && goalDone && mapDone;
      if (btn)  btn.style.display  = allDone ? 'block' : 'none';
      if (hint) hint.style.display = allDone ? 'none'  : 'block';
    }, 50);
  }
if (id === 'screen-final') {
    localStorage.setItem('nc_mod1_status', 'complete');
    localStorage.setItem('nc_mod1_progress', '100');
    var finalScoreEl = document.getElementById('final-score');
    if (finalScoreEl) finalScoreEl.textContent = state.score;
    
    setTimeout(function() {
      if (typeof initDownloadPdfButton === 'function') {
        initDownloadPdfButton();
      }
    }, 100);
  }
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function addScore(delta) {
  state.score = Math.max(0, state.score + delta);
  updateHud();
}

function updateHud() {
  var visited = Object.keys(state.screensVisited).length;
  var total = screenOrder.length;
  var pct = Math.round((visited / total) * 100);
  document.getElementById('hud-progress-bar').style.transform = 'scaleX(' + (pct / 100) + ')';
  document.getElementById('hud-progress-value').textContent = pct + '%';
  document.getElementById('hud-score').textContent = state.score;
  document.getElementById('screen-pill').textContent = visited + ' / ' + total;
  localStorage.setItem('nc_mod1_progress', String(pct));
}

function initGlobalNav() {
  document.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextId = btn.getAttribute('data-next');
      showScreen(nextId);
    });
  });
  document.querySelectorAll('[data-prev]').forEach(btn => {
    btn.addEventListener('click', () => {
      const screen = btn.closest('.screen');
      if (!screen) return;
      const idx = screenOrder.indexOf(screen.id);
      if (idx > 0) {
        showScreen(screenOrder[idx - 1]);
      }
    });
  });
}

function initMainMenu() {
  const toggle = document.getElementById('main-menu-toggle');
  const menu = document.getElementById('main-menu');
  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
  });
  menu.addEventListener('click', e => {
    const li = e.target.closest('[data-goto]');
    if (!li) return;
    const target = li.dataset.goto;
    showScreen(target);
    menu.classList.remove('active');
  });
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
      menu.classList.remove('active');
    }
  });
}

// ===== Экран 2: тест =====
function initQuiz() {
  var questions = [
    { q: 'Я знаю, как найти общий язык с незнакомыми мне людьми:', opts: ['Не знаю','Не уверен','Примерно','Знаю','Знаю и буду применять на практике'] },
    { q: 'Я смогу познакомиться с несколькими новыми людьми за одно мероприятие:', opts: ['Не смогу','Не уверен','Возможно','Смогу','Смогу и начну это делать'] },
    { q: 'Я знаю, как правильно и оригинально представиться незнакомому человеку:', opts: ['Не знаю','Не уверен','Примерно','Знаю','Знаю и буду применять на практике'] },
    { q: 'Я смогу делать каждую неделю рассылку новостей и/или полезной информации списку своих знакомых:', opts: ['Не смогу','Не уверен','Возможно','Смогу','Смогу и начну это делать'] },
    { q: 'Я знаю, насколько важно запоминать имя и ценности человека, с которым познакомился:', opts: ['Не знаю','Не уверен','Примерно','Знаю','Знаю и буду применять на практике'] },
    { q: 'Я буду просить о помощи своих знакомых, когда в этом действительно нуждаюсь:', opts: ['Никогда','Редко','Иногда','Часто','Всегда'] },
    { q: 'Я буду делиться своими контактами и знаниями со знакомыми и малознакомыми людьми, чтобы им помочь:', opts: ['Никогда','Редко','Иногда','Часто','Всегда'] },
    { q: 'Я буду публиковать свои статьи / писать экспертное мнение в специализированные издания:', opts: ['Никогда','Редко','Иногда','Часто','Всегда'] },
    { q: 'Я знаю, как публично выступать перед целевой аудиторией на бизнес-ланчах, конференциях и прочих мероприятиях:', opts: ['Не знаю','Не уверен','Примерно','Знаю','Знаю и буду применять на практике'] },
    { q: 'Ко мне будут обращаться незнакомые люди за помощью:', opts: ['Никогда','Редко','Иногда','Часто','Всегда'] }
  ];

  var area = document.getElementById('quiz-area');
  var result = document.getElementById('quiz-result');
  var progress = document.getElementById('quiz-progress');
  if (!area || !result || !progress) return;

  var answers = [];
  var currentQ = 0;
  var quizStarted = false;

  function showQuestion(idx) {
    if (idx >= questions.length) {
      showResult();
      return;
    }

    var q1 = questions[idx];
    var q2 = (idx + 1 < questions.length) ? questions[idx + 1] : null;

    area.innerHTML = '';

    if (idx === questions.length - 1) {
      progress.textContent = 'Вопрос ' + (idx + 1) + ' из ' + questions.length;
    } else {
      progress.textContent = 'Вопросы ' + (idx + 1) + '–' + (idx + 2) + ' из ' + questions.length;
    }

    var html = '';

    // Первый вопрос
    html += '<div class="quiz-q" data-qidx="' + idx + '">';
    html += '<h3>' + (idx + 1) + '. ' + q1.q + '</h3>';
    html += '<div class="quiz-options">';
    q1.opts.forEach(function(label, oi) {
      html += '<div class="quiz-opt" data-pts="' + (oi + 1) + '" data-qidx="' + idx + '">' + label + '</div>';
    });
    html += '</div></div>';

    // Второй вопрос (если есть)
    if (q2) {
      html += '<div class="quiz-q" data-qidx="' + (idx + 1) + '" style="margin-top:12px;">';
      html += '<h3>' + (idx + 2) + '. ' + q2.q + '</h3>';
      html += '<div class="quiz-options">';
      q2.opts.forEach(function(label, oi) {
        html += '<div class="quiz-opt" data-pts="' + (oi + 1) + '" data-qidx="' + (idx + 1) + '">' + label + '</div>';
      });
      html += '</div></div>';
    }

    area.innerHTML = html;

    setTimeout(function() {
      var firstQ = area.querySelector('.quiz-q');
      if (firstQ) {
        firstQ.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);

    // ← ВАЖНО: answered локальный для этой пары вопросов
    var answered = {};

    area.querySelectorAll('.quiz-opt').forEach(function(opt) {
      opt.addEventListener('click', function() {
        var qIdx = parseInt(opt.dataset.qidx);
        var pts  = parseInt(opt.dataset.pts);

        area.querySelectorAll('.quiz-opt[data-qidx="' + qIdx + '"]').forEach(function(o) {
          o.classList.remove('selected');
        });
        opt.classList.add('selected');

        answered[qIdx] = pts;
        answers[qIdx] = pts;

        var q1done = answered[idx] !== undefined;
        // ← ИСПРАВЛЕНИЕ: если q2 нет — считаем q2done = true
        var q2done = !q2 || (answered[idx + 1] !== undefined);

        if (q1done && q2done) {
          area.querySelectorAll('.quiz-opt').forEach(function(o) {
            o.style.pointerEvents = 'none';
          });
          currentQ = idx + 2;
          setTimeout(function() {
            showQuestion(currentQ);
            var panel = document.querySelector('#screen-2 .panel');
            if (panel) {
              panel.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }, 500);
        }
      });
    });
  }

  function showResult() {
    var screenContainer = document.getElementById('screen-container');
    if (screenContainer) {
      screenContainer.style.background = 'transparent';
      screenContainer.style.boxShadow = 'none';
      screenContainer.style.border = 'none';
    }

    var prog = document.getElementById('quiz-progress');
    if (prog) {
      prog.style.display = 'none';
      prog.style.visibility = 'hidden';
    }

    var toHide = [
      document.getElementById('quiz-progress'),
      document.querySelector('#screen-2 h2'),
      document.querySelector('#screen-2 .panel-tag'),
      document.getElementById('quiz-intro-text'),
      document.getElementById('quiz-intro-hint')
    ];
    toHide.forEach(function(el) {
      if (el) el.style.display = 'none';
    });

    var panel = document.querySelector('#screen-2 .panel');
    if (panel) {
      panel.style.cssText = [
        'background: transparent',
        'border: none',
        'box-shadow: none',
        'padding: 0',
        'max-width: 100%',
        'overflow: visible',
        'display: flex',
        'align-items: center',
        'justify-content: center',
        'flex: 1'
      ].join(';');
    }

    var screen2 = document.getElementById('screen-2');
    if (screen2) screen2.style.background = 'transparent';

    var total = answers.reduce(function(s, v) { return s + (v || 0); }, 0);
    var max = questions.length * 5;
    var pct = Math.round(total / max * 100);

    var level, desc, color;
    if (pct <= 30) {
      level = 'Новичок';
      desc  = 'Самое время начать — и курс поможет тебе с нуля выстроить навык знакомств.';
      color = '#f59e0b';
    } else if (pct <= 55) {
      level = 'Базовый';
      desc  = 'Кажется, у тебя есть базовые знания. Повысь их до максимума!';
      color = '#38bdf8';
    } else if (pct <= 75) {
      level = 'Средний';
      desc  = 'Ты уже умеешь знакомиться. Курс поможет выйти на новый уровень.';
      color = '#22c55e';
    } else {
      level = 'Продвинутый';
      desc  = 'Отличный результат! Курс поможет закрепить и систематизировать навыки.';
      color = '#a855f7';
    }

if (_sb && typeof _sb.from === 'function') {
  _sb.from('quiz_results').insert({ level: level }).then(function(r) {
    if (r.error) console.error('Ошибка сохранения:', r.error);
    else console.log('✅ Результат сохранён!');
  });
}

    var origBack = document.querySelector('#screen-2 [data-prev]');
    if (origBack) origBack.style.display = 'none';

    area.innerHTML =
      '<div class="qr-result-wrap">' +
        '<div class="qr-result-card">' +
          '<div class="qr-result-title">Твой результат</div>' +
          '<div class="qr-result-score" style="color:' + color + '">' +
            total +
            '<span style="font-size:20px;font-weight:500;color:#94a3b8;"> / ' + max + '</span>' +
          '</div>' +
          '<div class="qr-result-badge" style="background:' + color + '20;color:' + color + ';border-color:' + color + '50;">' +
            level +
          '</div>' +
          '<div class="qr-result-bar-wrap">' +
            '<div class="qr-result-bar" style="width:' + pct + '%;background:' + color + ';"></div>' +
          '</div>' +
          '<div class="qr-result-pct">' + pct + '%</div>' +
          '<div class="qr-result-desc">' + desc + '</div>' +
          '<div class="qr-result-social" style="display:none;"></div>' +
          '<div class="qr-result-btns">' +
            '<button class="btn btn-back-result">← Назад</button>' +
            '<button class="btn qr-result-btn">Продолжить →</button>' +
          '</div>' +
        '</div>' +
      '</div>';

if (_sb && typeof _sb.from === 'function') {
  _sb
    .from('quiz_results')
    .select('level')
    .then(function(r) {
          if (r.error || !r.data) return;
          var totalRows = r.data.length;
          if (totalRows < 3) return;
          var counts = { 'Новичок': 0, 'Базовый': 0, 'Средний': 0, 'Продвинутый': 0 };
          r.data.forEach(function(row) {
            if (counts[row.level] !== undefined) counts[row.level]++;
          });
          var myCount = counts[level] || 0;
          var myPct = Math.round(myCount / totalRows * 100);
          var socialEl = area.querySelector('.qr-result-social');
          if (socialEl) {
            socialEl.innerHTML =
              '<strong>' + myPct + '% участников</strong> курса получили такой же результат' +
              '<span style="color:#cbd5e1;font-size:11px;display:block;margin-top:2px;">из ' + totalRows + ' прошедших тест</span>';
            socialEl.style.display = 'block';
          }
        });
    }

    area.querySelector('.btn-back-result').addEventListener('click', function() {
      var sc = document.getElementById('screen-container');
      if (sc) {
        sc.style.background = '';
        sc.style.boxShadow = '';
        sc.style.border = '';
      }
      if (origBack) origBack.style.display = '';
      showScreen('screen-1');
    });

    area.querySelector('.qr-result-btn').addEventListener('click', function() {
      var sc = document.getElementById('screen-container');
      if (sc) {
        sc.style.background = '';
        sc.style.boxShadow = '';
        sc.style.border = '';
      }
      showScreen('screen-3-0');
    });
  }

  function startQuiz() {
    if (quizStarted) return;
    quizStarted = true;
    currentQ = 0;
    answers = [];
    area.style.display = 'block';
    progress.style.display = 'block';
    result.style.display = 'none';
    showQuestion(0);
  }

  // Запуск через MutationObserver
  var screen2el = document.getElementById('screen-2');
  if (screen2el) {
    if (screen2el.classList.contains('active')) {
      setTimeout(startQuiz, 100);
    }
    var quizObserver = new MutationObserver(function() {
      if (screen2el.classList.contains('active') && !quizStarted) {
        setTimeout(startQuiz, 100);
      }
    });
    quizObserver.observe(screen2el, { attributes: true, attributeFilter: ['class'] });
  }

} // ← закрытие initQuiz

// ===== Экран 3: Знакомство со Златой =====
function initKeysGame() {
  var card = document.getElementById('zlata-card');
  var wrapper = document.getElementById('zlata-card-wrapper');
  var laptop = document.getElementById('inv-laptop');

  if (!card || !wrapper || !laptop) {
    console.warn('initKeysGame: элементы карточки Златы не найдены');
    return;
  }

  wrapper.addEventListener('click', function(e) {
    if (e.target.closest('#inv-laptop')) return;
    card.classList.toggle('flipped');
  });

  laptop.addEventListener('click', function(e) {
    e.stopPropagation();
    showScreen('screen-10');
  });
}

// ===== Экран 10: ноутбук =====
function initLaptopHotspot() {
  var folderSchedule = document.getElementById('folder-schedule');
  var scheduleModal  = document.getElementById('schedule-modal');

  var portal = document.getElementById('modals-portal');
  if (portal && scheduleModal) {
    portal.appendChild(scheduleModal);
  }

  if (!folderSchedule || !scheduleModal) {
    console.warn('initLaptopHotspot: элементы не найдены!');
    return;
  }

  function checkAllDone() {
    var scheduleDone = localStorage.getItem('laptopScheduleDone') === '1';
    var goalDone     = localStorage.getItem('laptopGoalDone') === '1';
    var mapDone      = localStorage.getItem('mapViewed') === '1';

    var badgeSchedule = document.getElementById('schedule-done-badge');
    var badgeGoal     = document.getElementById('goal-done-badge');
    var badgeMap      = document.getElementById('map-done-badge');

    if (badgeSchedule && scheduleDone) badgeSchedule.style.display = 'flex';
    if (badgeGoal && goalDone)         badgeGoal.style.display = 'flex';
    if (badgeMap && mapDone)           badgeMap.style.display = 'flex';

    var allDone = scheduleDone && goalDone && mapDone;

    var btnNext = document.getElementById('btn-laptop-next');
    if (btnNext) {
      btnNext.style.display = allDone ? 'block' : 'none';
    }

    var hint = document.getElementById('laptop-next-hint');
    if (hint) {
      hint.style.display = allDone ? 'none' : 'block';
    }
  }

  folderSchedule.addEventListener('click', function() {
    scheduleModal.classList.add('active');
  });

  document.getElementById('schedule-modal-ok').addEventListener('click', function() {
    scheduleModal.classList.remove('active');
    localStorage.setItem('laptopScheduleDone', '1');
    checkAllDone();
  });

  document.getElementById('folder-goal').addEventListener('click', function() {
    showScreen('screen-11');
  });

  var folderMap = document.getElementById('folder-map');
  if (folderMap) {
    folderMap.addEventListener('click', function() {
      showScreen('screen-21-2');
    });
  }

  var btnLaptopNext = document.getElementById('btn-laptop-next');
  if (btnLaptopNext) {
    btnLaptopNext.addEventListener('click', function() {
      showScreen('screen-17-1');
    });
  }

  var screen10 = document.getElementById('screen-10');
  if (screen10) {
    var observer = new MutationObserver(function() {
      if (screen10.classList.contains('active')) {
        checkAllDone();
      }
    });
    observer.observe(screen10, { attributes: true, attributeFilter: ['class'] });
  }

  checkAllDone();
}

// ===== Экран 11: цель нетворкинга =====
function initPurposeScreen() {
  var btn = document.getElementById('btn-purpose-submit');
  var btnSave = document.getElementById('btn-purpose-save');
  var modal = document.getElementById('purpose-modal');
  var cont = document.getElementById('purpose-modal-continue');
  var textarea = document.getElementById('networking-purpose');
  var floatMsg = document.getElementById('purpose-saved-float');

  var saved = localStorage.getItem('nc_purpose_text');
  if (saved) {
    textarea.value = saved;
  }

  btn.addEventListener('click', function() {
    var text = textarea.value.trim();
    if (!text) {
      textarea.style.borderColor = '#ef4444';
      setTimeout(function() { textarea.style.borderColor = ''; }, 1500);
      return;
    }
    state.purposeText = text;
    addScore(2);
    modal.classList.add('active');
  });

  btnSave.addEventListener('click', function() {
    var text = textarea.value.trim();
    if (!text) return;
    localStorage.setItem('nc_purpose_text', text);
    floatMsg.classList.remove('show');
    void floatMsg.offsetWidth;
    floatMsg.classList.add('show');
  });

  cont.addEventListener('click', function() {
    var text = textarea.value.trim();
    if (text) {
      localStorage.setItem('nc_purpose_text', text);
    }
    modal.classList.remove('active');
    showScreen('screen-12');
  });
}

// ===== Экран 12: Нити нетворкинга =====
const beadsStages = [
  { word: 'УСТАНОВКА', feedbackOk: 'Установка связей — это первый шаг, смелость начать. Супер! Двигаемся дальше.' },
  { word: 'УДЕРЖАНИЕ', feedbackOk: 'Удержание связей — это забота, искусство поддерживать контакт тёплым.' },
  { word: 'ЦЕННОСТЬ',  feedbackOk: 'Ценность связей — это результат, к которому приводят первые два шага.' }
];

function shuffleArray(arr) {
  return arr
    .map((v) => ({ v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ v }) => v);
}

function renderBeadsStage() {
  var stageIndex = state.beads.stage - 1;
  var stage = beadsStages[stageIndex];
  var pool = document.getElementById('beads-pool');
  var target = document.getElementById('beads-target');
  var feedback = document.getElementById('beads-feedback');
  var label = document.getElementById('beads-stage-label');
  var hint = document.getElementById('beads-hint');
  var btnCheck = document.getElementById('beads-check');
  var btnReset = document.getElementById('beads-reset');

  if (!stage || !pool || !target) {
    console.warn('renderBeadsStage: elements not found');
    return;
  }

  if (label) label.textContent = String(state.beads.stage);

  for (var d = 1; d <= 3; d++) {
    var dot = document.getElementById('dot-' + d);
    if (!dot) continue;
    dot.classList.remove('active', 'done');
    if (d < state.beads.stage) dot.classList.add('done');
    if (d === state.beads.stage) dot.classList.add('active');
  }

 
  // ===== ПОДСКАЗКА: 4 случайные буквы открыты =====
  function buildHint(word) {
    var chars = word.split('');
    var total = chars.length;
    var openCount = Math.min(4, total);

    // Выбираем 4 случайных индекса
    var indices = [];
    for (var i = 0; i < total; i++) indices.push(i);
    // Перемешиваем
    for (var j = indices.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var tmp = indices[j];
      indices[j] = indices[k];
      indices[k] = tmp;
    }
    var openSet = new Set(indices.slice(0, openCount));

    return chars.map(function(ch, i) {
      return openSet.has(i) ? ch : '_';
    }).join(' ');
  }
  if (hint) {
    hint.textContent = buildHint(stage.word);
    hint.style.fontFamily = 'monospace';
    hint.style.fontSize = '18px';
    hint.style.letterSpacing = '6px';
  }

  var letters = shuffleArray(stage.word.split(''));
  pool.innerHTML = '';
  target.innerHTML = '';
  if (feedback) feedback.textContent = '';

  // Клонируем кнопки, чтобы сбросить старые обработчики
  if (btnCheck) {
    var newCheck = btnCheck.cloneNode(true);
    btnCheck.parentNode.replaceChild(newCheck, btnCheck);
    btnCheck = newCheck;
  }
  if (btnReset) {
    var newReset = btnReset.cloneNode(true);
    btnReset.parentNode.replaceChild(newReset, btnReset);
    btnReset = newReset;
  }

  // ===== DROP в target =====
  target.ondragover = function(e) {
    e.preventDefault();
    target.classList.add('drag-over');
  };
  target.ondragleave = function() {
    target.classList.remove('drag-over');
  };
  target.ondrop = function(e) {
    e.preventDefault();
    target.classList.remove('drag-over');
    var letter = e.dataTransfer.getData('text/plain');
    var beadId = e.dataTransfer.getData('beadId');
    if (!letter) return;
    var srcBead = document.querySelector('.bead[data-bead-id="' + beadId + '"]');
    if (srcBead && !srcBead.classList.contains('used')) {
      placeBead(letter, srcBead);
    }
  };

  // DROP обратно в pool
  pool.ondragover = function(e) { e.preventDefault(); };
  pool.ondrop = function(e) {
    e.preventDefault();
    var fromTargetId = e.dataTransfer.getData('fromTargetId');
    if (fromTargetId) {
      var slot = document.querySelector('.bead.placed[data-slot-id="' + fromTargetId + '"]');
      if (slot) {
        var srcBeadId = slot.dataset.srcBeadId;
        var src = document.querySelector('.bead[data-bead-id="' + srcBeadId + '"]');
        if (src) src.classList.remove('used');
        slot.remove();
      }
    }
  };

  letters.forEach(function(letter, idx) {
    var bead = document.createElement('div');
    bead.className = 'bead';
    bead.textContent = letter;
    bead.setAttribute('draggable', 'true');
    bead.dataset.beadId = 'b' + idx;
    bead.dataset.letter = letter;

    bead.addEventListener('click', function() {
      if (bead.classList.contains('used')) return;
      placeBead(letter, bead);
    });

    bead.addEventListener('dragstart', function(e) {
      if (bead.classList.contains('used')) { e.preventDefault(); return; }
      bead.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', letter);
      e.dataTransfer.setData('beadId', bead.dataset.beadId);
    });
    bead.addEventListener('dragend', function() {
      bead.classList.remove('dragging');
    });

    addTouchDrag(bead, letter);
    pool.appendChild(bead);
  });

  function placeBead(letter, srcBead) {
    srcBead.classList.add('used');
    var slot = document.createElement('div');
    slot.className = 'bead placed';
    slot.textContent = letter;
    slot.dataset.letter = letter;
    slot.dataset.slotId = 's' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    slot.dataset.srcBeadId = srcBead.dataset.beadId;
    slot.setAttribute('draggable', 'true');

    slot.addEventListener('click', function() {
      srcBead.classList.remove('used');
      slot.remove();
    });

    slot.addEventListener('dragstart', function(e) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('fromTargetId', slot.dataset.slotId);
    });

    target.appendChild(slot);
  }

  // ===== TOUCH DRAG =====
  function addTouchDrag(bead, letter) {
    var ghost = null, startX = 0, startY = 0, moved = false;

    bead.addEventListener('touchstart', function(e) {
      if (bead.classList.contains('used')) return;
      var t = e.touches[0];
      startX = t.clientX; startY = t.clientY; moved = false;
      ghost = bead.cloneNode(true);
      ghost.style.cssText = 'position:fixed;left:' + (t.clientX - 25) + 'px;top:' + (t.clientY - 25) + 'px;z-index:9999;opacity:0.85;pointer-events:none;transform:scale(1.15);';
      document.body.appendChild(ghost);
      bead.style.opacity = '0.4';
    }, { passive: true });

    bead.addEventListener('touchmove', function(e) {
      if (!ghost) return;
      var t = e.touches[0];
      if (Math.abs(t.clientX - startX) > 5 || Math.abs(t.clientY - startY) > 5) moved = true;
      ghost.style.left = (t.clientX - 25) + 'px';
      ghost.style.top = (t.clientY - 25) + 'px';
      e.preventDefault();
    }, { passive: false });

    bead.addEventListener('touchend', function(e) {
      if (!ghost) return;
      var t = e.changedTouches[0];
      var el = document.elementFromPoint(t.clientX, t.clientY);
      ghost.remove(); ghost = null;
      bead.style.opacity = '';
      if (moved && el && (el === target || target.contains(el))) {
        if (!bead.classList.contains('used')) placeBead(letter, bead);
      } else if (!moved) {
        if (!bead.classList.contains('used')) placeBead(letter, bead);
      }
    });

    bead.addEventListener('touchcancel', function() {
      if (ghost) { ghost.remove(); ghost = null; }
      bead.style.opacity = '';
    });
  }

  // ===== КНОПКА "СБРОСИТЬ" =====
  if (btnReset) {
    btnReset.addEventListener('click', function() {
      target.innerHTML = '';
      pool.querySelectorAll('.bead').forEach(function(b) {
        b.classList.remove('used');
        b.style.background = '';
        b.style.color = '';
      });
      if (feedback) feedback.textContent = '';
    });
  }

  // ===== КНОПКА "ПРОВЕРИТЬ" =====
  if (btnCheck) {
    btnCheck.addEventListener('click', function() {
      var current = Array.from(target.querySelectorAll('.bead'))
        .map(function(b) { return (b.textContent || '').trim().toUpperCase(); })
        .join('');
      var expected = stage.word.trim().toUpperCase();

      console.log('Проверка:', { собрано: current, нужно: expected, равны: current === expected });

      if (current.length === 0) {
        if (feedback) {
          feedback.textContent = 'Сначала собери слово из букв 👆';
          feedback.style.color = '#f59e0b';
        }
        return;
      }

      if (current.length < expected.length) {
        if (feedback) {
          feedback.textContent = 'Ещё не все буквы на месте (' + current.length + ' из ' + expected.length + ')';
          feedback.style.color = '#f59e0b';
        }
        return;
      }

      if (current === expected) {
        if (feedback) {
          feedback.textContent = stage.feedbackOk;
          feedback.style.color = '#22c55e';
        }
        addScore(3);
        target.querySelectorAll('.bead').forEach(function(b) {
          b.style.background = '#22c55e';
          b.style.color = '#fff';
          b.style.pointerEvents = 'none';
          b.setAttribute('draggable', 'false');
        });
        pool.querySelectorAll('.bead').forEach(function(b) {
          b.style.pointerEvents = 'none';
          b.setAttribute('draggable', 'false');
        });
        if (hint) hint.textContent = '';
        btnCheck.style.display = 'none';
        btnReset.style.display = 'none';

        setTimeout(function() {
          if (state.beads.stage < beadsStages.length) {
            state.beads.stage++;
            renderBeadsStage();
            // Вернуть кнопки
            var bc = document.getElementById('beads-check');
            var br = document.getElementById('beads-reset');
            if (bc) bc.style.display = '';
            if (br) br.style.display = '';
          } else {
            if (feedback) {
              feedback.innerHTML = 'Отлично! Ты собрал все три слова!';
              feedback.style.color = '#a855f7';
            }
            setTimeout(function() { showScreen('screen-13'); }, 1500);
          }
        }, 1500);

      } else {
        if (feedback) {
          feedback.textContent = 'Не то слово, попробуй ещё раз 🤔';
          feedback.style.color = '#ef4444';
        }
        state.beads.attempts++;
        target.querySelectorAll('.bead').forEach(function(b) {
          b.style.background = '#fecaca';
        });
        setTimeout(function() {
          target.innerHTML = '';
          pool.querySelectorAll('.bead').forEach(function(b) {
            b.classList.remove('used');
          });
          if (feedback) feedback.textContent = '';
        }, 1200);
      }
    });
  }
}

// ===== Экран 13: Сними маски своих страхов =====
var _fearsSelected = []; // глобально — передадим на 13-s

function initFears() {
  var container = document.getElementById('fears-container');
  var masks = document.querySelectorAll('#screen-13 .fear-mask');
  var btnUnmask = document.getElementById('btn-unmask');
  var btnNoFear = document.getElementById('btn-no-fear');
  var validations = document.getElementById('fears-validations');
  var validationsList = document.getElementById('fears-validation-list');

  if (!container || !masks.length) {
    console.warn('initFears: элементы не найдены');
    return;
  }

  // Данные для каждой маски: валидация + подсказки для стратегии
  var fearData = {
    say: {
      label: 'Не знаю, что сказать',
      validation: '<strong>80% людей боятся того же.</strong> Даже опытные нетворкеры в первые минуты ищут, с чего начать разговор.',
      hint: 'Заготовь 3 универсальных вопроса: «Как вам конференция?», «Что привело сюда?», «Откуда вы?»'
    },
    reject: {
      label: 'Меня отвергнут',
      validation: 'Отказ — это <strong>не про тебя, а про ситуацию</strong>. Человек может быть занят, устал, спешит. Это редко про твою личность.',
      hint: 'Напомни себе: «Если не ответят — это не катастрофа. Подойду к следующему».'
    },
    worth: {
      label: 'Я недостаточно важен(на)',
      validation: 'Синдром самозванца — <strong>у 70% профессионалов</strong>. Даже у тех, кто кажется очень уверенным.',
      hint: 'Вспомни 3 факта, за которые тебя ценят коллеги. Ты пришёл(ла) не «продавать себя», а обменяться пользой.'
    },
    incompetent: {
      label: 'Покажусь некомпетентным',
      validation: '<strong>Никто не знает всё.</strong> Профессионалы не боятся сказать «не знаю» — они умеют задавать хорошие вопросы.',
      hint: 'Фраза-спасатель: «Интересно, расскажите подробнее — я не до конца разбираюсь в этой теме».'
    },
    pushy: {
      label: 'Буду навязчивым',
      validation: 'Если ты <strong>искренне интересуешься человеком</strong> — это не навязчивость, а внимание.',
      hint: 'Правило 70/30: слушай больше, чем говоришь. Интересуйся другими — и ты точно не покажешься навязчивым.'
    },
    everyone: {
      label: 'Все уже знают друг друга',
      validation: 'Это <strong>иллюзия</strong>. На любом мероприятии минимум треть людей — такие же новички, как ты.',
      hint: 'Ищи тех, кто стоит один с бокалом — им тоже не по себе, они будут рады разговору.'
    },
    awkward: {
      label: 'Потом будет неловко',
      validation: 'Неловкие моменты <strong>забываются через 10 минут</strong>. Люди помнят общее впечатление, а не детали.',
      hint: 'Если случился неловкий момент — пошути над собой. Самоирония снимает напряжение мгновенно.'
    },
    custom: {
      label: 'Свой вариант',
      validation: 'Признать страх — <strong>уже половина победы</strong>. Ты молодец, что назвал(а) его своими словами.',
      hint: 'Подумай: что самое худшее может случиться? И что ты сделаешь, если это случится?'
    }
  };

  _fearsSelected = [];

  masks.forEach(function(mask) {
    var fearId = mask.dataset.fear;
    var customInput = mask.querySelector('.fear-custom-input');

    mask.addEventListener('click', function(e) {
      // Клик по input — не триггерим выбор (чтобы ввод не снимал выделение)
      if (e.target.classList && e.target.classList.contains('fear-custom-input')) return;

      // Если это «Свой вариант» — показываем поле ввода
      if (fearId === 'custom') {
        if (!mask.classList.contains('selected')) {
          mask.classList.add('selected');
          _fearsSelected.push(fearId);
          if (customInput) {
            customInput.style.display = 'block';
            setTimeout(function() { customInput.focus(); }, 50);
          }
        } else {
          mask.classList.remove('selected');
          _fearsSelected = _fearsSelected.filter(function(x) { return x !== fearId; });
          if (customInput) {
            customInput.style.display = 'none';
            customInput.value = '';
          }
        }
      } else {
        mask.classList.toggle('selected');
        if (mask.classList.contains('selected')) {
          _fearsSelected.push(fearId);
        } else {
          _fearsSelected = _fearsSelected.filter(function(x) { return x !== fearId; });
        }
      }

      updateValidations();
      updateButtons();
    });
  });

  function updateValidations() {
    if (!validations || !validationsList) return;
    if (_fearsSelected.length === 0) {
      validations.style.display = 'none';
      validationsList.innerHTML = '';
      return;
    }
    validations.style.display = 'block';
    validationsList.innerHTML = _fearsSelected.map(function(id) {
      var d = fearData[id];
      if (!d) return '';
      return '<div class="fears-validation-item" style="padding:10px 14px; border-radius:10px; background:rgba(34,197,94,0.06); border:1px solid rgba(34,197,94,0.2); margin-bottom:8px; font-size:13px; line-height:1.5;">' +
               '<strong style="color:#16a34a;">' + d.label + '</strong><br>' +
               '<span style="color:#475569;">' + d.validation + '</span>' +
             '</div>';
    }).join('');
  }

  function updateButtons() {
    if (btnUnmask) {
      btnUnmask.style.display = _fearsSelected.length > 0 ? 'inline-block' : 'none';
    }
    if (btnNoFear) {
      btnNoFear.style.display = _fearsSelected.length > 0 ? 'none' : 'inline-block';
    }
  }

  if (btnUnmask) {
    btnUnmask.addEventListener('click', function() {
      if (_fearsSelected.length === 0) return;
      // Сохраняем выбранные страхи + данные для 13-s
      window._selectedFearsData = _fearsSelected.map(function(id) {
        var d = fearData[id];
        var customText = '';
        if (id === 'custom') {
          var inp = document.querySelector('.fear-mask[data-fear="custom"] .fear-custom-input');
          customText = inp && inp.value ? inp.value.trim() : '';
        }
        return {
          id: id,
          label: customText || d.label,
          hint: d.hint
        };
      });
      addScore(2);
      showScreen('screen-13-s');
    });
  }

  if (btnNoFear) {
    btnNoFear.addEventListener('click', function() {
      // Нет страхов — пропускаем экран стратегий
      window._selectedFearsData = [];
      addScore(2);
      showScreen('screen-14');
    });
  }

  updateButtons();
}

// ===== Экран 13-s: Стратегии по страхам =====
function initFears13S() {
  var list = document.getElementById('fears-strategy-list');
  var btnSave = document.getElementById('btn-fears-save');
  var btnDone = document.getElementById('btn-fears-done');
  var modal = document.getElementById('fears-modal');

  if (!list) {
    console.warn('initFears13S: список не найден');
    return;
  }

  var fears = window._selectedFearsData || [];

  // Если страхов нет — сразу на 13-1
  if (fears.length === 0) {
    showScreen('screen-14');
    return;
  }

  // Восстанавливаем сохранённые стратегии
  var saved = {};
  try {
    saved = JSON.parse(localStorage.getItem('nc_fear_strategies') || '{}');
  } catch(e) { saved = {}; }

  list.innerHTML = fears.map(function(f, i) {
    var savedText = saved[f.id] || '';
    return '<div class="fear-strategy-item" style="margin-bottom:16px; padding:14px 16px; border-radius:14px; background:#fff; border:1px solid #e2e8f0; box-shadow:0 2px 8px rgba(0,0,0,0.04);">' +
             '<div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">' +
               '<div style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,#facc15,#f59e0b); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:13px;">' + (i+1) + '</div>' +
               '<strong style="font-size:15px; color:#1e293b;">' + f.label + '</strong>' +
             '</div>' +
             '<div style="font-size:12px; color:#64748b; margin-bottom:6px; padding:8px 10px; border-radius:8px; background:rgba(56,189,248,0.08); border-left:3px solid #38bdf8;">💡 <strong>Подсказка:</strong> ' + f.hint + '</div>' +
             '<textarea data-fear-id="' + f.id + '" placeholder="Напиши свою стратегию..." style="width:100%; min-height:70px; padding:10px 12px; border-radius:10px; border:1px solid #e2e8f0; font-family:inherit; font-size:13px; line-height:1.5; resize:vertical; box-sizing:border-box;">' + savedText + '</textarea>' +
           '</div>';
  }).join('');

  if (btnSave) {
    var newSave = btnSave.cloneNode(true);
    btnSave.parentNode.replaceChild(newSave, btnSave);
    newSave.addEventListener('click', function() {
      var data = {};
      list.querySelectorAll('textarea[data-fear-id]').forEach(function(ta) {
        data[ta.dataset.fearId] = ta.value.trim();
      });
      localStorage.setItem('nc_fear_strategies', JSON.stringify(data));
      newSave.textContent = '✅ Сохранено';
      setTimeout(function() { newSave.innerHTML = '💾 Сохранить'; }, 1500);
    });
  }

  if (btnDone) {
    var newDone = btnDone.cloneNode(true);
    btnDone.parentNode.replaceChild(newDone, btnDone);
    newDone.addEventListener('click', function() {
      // Проверка, что заполнены все
      var allFilled = true;
      list.querySelectorAll('textarea[data-fear-id]').forEach(function(ta) {
        if (!ta.value.trim()) allFilled = false;
      });
      if (!allFilled) {
        alert('Напиши стратегию для каждого страха — это важный шаг!');
        return;
      }
      // Сохраняем
      var data = {};
      list.querySelectorAll('textarea[data-fear-id]').forEach(function(ta) {
        data[ta.dataset.fearId] = ta.value.trim();
      });
      localStorage.setItem('nc_fear_strategies', JSON.stringify(data));
      addScore(3);
      if (modal) modal.classList.add('active');
    });
  }
}

// ===== Экран 14: Колесо баланса =====
function renderWheel(svgId, values, activeIndex) {
  var svg = document.getElementById(svgId);
  if (!svg) return;

  var segments = state.wheel.segments;
  var N = segments.length;

  // Размеры — через viewBox, адаптивные
  var size   = 500;           // viewBox size
  var cx     = size / 2;      // 250
  var cy     = size / 2;      // 250
  var R      = 185;           // внешний радиус сектора (max)
  var innerR = 38;            // внутренний круг
  var labelR = R + 26;        // радиус подписей

  svg.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.style.width  = '100%';
  svg.style.height = '100%';
  svg.style.overflow = 'visible';

  svg.innerHTML = '';
 
  svg.setAttribute('viewBox', '0 0 500 500');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.style.overflow = 'visible';
  svg.style.display  = 'block';
  svg.style.width    = '100%';
  svg.style.height   = '100%';
  
  var colors = [
    '#6366f1',  // Карьера      — индиго
    '#22c55e',  // Образование  — зелёный
    '#38bdf8',  // Хобби        — голубой
    '#f59e0b',  // Личные проекты — жёлтый
    '#ef4444',  // Финансы      — красный
    '#a855f7'   // Здоровье     — фиолетовый
  ];

  var angleStep = (2 * Math.PI) / N;

  // --- Кольца-сетка (фон) ---
  for (var ring = 1; ring <= 10; ring++) {
    var ringR = innerR + (R - innerR) * (ring / 10);
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', ringR);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'rgba(203,213,225,0.5)');
    circle.setAttribute('stroke-width', ring % 5 === 0 ? '1.2' : '0.6');
    svg.appendChild(circle);
  }

  // --- Линии-разделители (фон) ---
  for (var i = 0; i < N; i++) {
    var angle = i * angleStep - Math.PI / 2;
    var lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lineEl.setAttribute('x1', cx + Math.cos(angle) * innerR);
    lineEl.setAttribute('y1', cy + Math.sin(angle) * innerR);
    lineEl.setAttribute('x2', cx + Math.cos(angle) * R);
    lineEl.setAttribute('y2', cy + Math.sin(angle) * R);
    lineEl.setAttribute('stroke', 'rgba(255,255,255,0.7)');
    lineEl.setAttribute('stroke-width', '1.5');
    svg.appendChild(lineEl);
  }

  // --- Секторы ---
  for (var i = 0; i < N; i++) {
    var startAngle = i * angleStep - Math.PI / 2;
    var endAngle   = startAngle + angleStep;
    var val        = values[i] || 0;
    var ratio      = val / 10;
    var rOuter     = innerR + (R - innerR) * ratio;
    if (rOuter < innerR + 5) rOuter = innerR + 5;

    var largeArc = angleStep > Math.PI ? 1 : 0;
    var isActive = (i === activeIndex);
    var color    = colors[i % colors.length];

    // Путь сектора
    var x1 = cx + Math.cos(startAngle) * innerR;
    var y1 = cy + Math.sin(startAngle) * innerR;
    var x2 = cx + Math.cos(startAngle) * rOuter;
    var y2 = cy + Math.sin(startAngle) * rOuter;
    var x3 = cx + Math.cos(endAngle)   * rOuter;
    var y3 = cy + Math.sin(endAngle)   * rOuter;
    var x4 = cx + Math.cos(endAngle)   * innerR;
    var y4 = cy + Math.sin(endAngle)   * innerR;

    var d = [
      'M', x1, y1,
      'L', x2, y2,
      'A', rOuter, rOuter, 0, largeArc, 1, x3, y3,
      'L', x4, y4,
      'A', innerR, innerR, 0, largeArc, 0, x1, y1,
      'Z'
    ].join(' ');

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', color);
    path.setAttribute('fill-opacity', isActive ? '0.95' : (val > 0 ? '0.75' : '0.12'));
    path.setAttribute('stroke', '#ffffff');
    path.setAttribute('stroke-width', isActive ? '3' : '1.5');
    if (isActive) {
      path.setAttribute('filter', 'drop-shadow(0 0 6px ' + color + '80)');
    }
    svg.appendChild(path);

    // Значение внутри сектора
    if (val > 0) {
      var midAngle = startAngle + angleStep / 2;
      var valR     = innerR + (rOuter - innerR) * 0.55;
      var vx = cx + Math.cos(midAngle) * valR;
      var vy = cy + Math.sin(midAngle) * valR;

      var valText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valText.setAttribute('x', vx);
      valText.setAttribute('y', vy);
      valText.setAttribute('text-anchor', 'middle');
      valText.setAttribute('dominant-baseline', 'central');
      valText.setAttribute('font-size', rOuter - innerR > 30 ? '15' : '12');
      valText.setAttribute('font-weight', '700');
      valText.setAttribute('fill', '#ffffff');
      valText.setAttribute('pointer-events', 'none');
      valText.textContent = val;
      svg.appendChild(valText);
    }
  }

  // --- Подписи секторов ---
  for (var i = 0; i < N; i++) {
    var midAngle   = (i * angleStep - Math.PI / 2) + angleStep / 2;
    var isActive   = (i === activeIndex);
    var color      = colors[i % colors.length];

    var lx = cx + Math.cos(midAngle) * labelR;
    var ly = cy + Math.sin(midAngle) * labelR;

    // Выравнивание по горизонтали
    var anchor = 'middle';
    var cosA = Math.cos(midAngle);
    if (cosA > 0.3)  anchor = 'start';
    if (cosA < -0.3) anchor = 'end';

    var label = segments[i];

    // Разбить длинное слово (> 8 символов) на строки
    var words = label.split(' ');
    var line1 = '', line2 = '';
    if (words.length > 1) {
      line1 = words[0];
      line2 = words.slice(1).join(' ');
    } else {
      line1 = label;
    }

    var textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textEl.setAttribute('text-anchor', anchor);
    textEl.setAttribute('font-size', isActive ? '13' : '12');
    textEl.setAttribute('font-weight', isActive ? '700' : '500');
    textEl.setAttribute('fill', isActive ? color : '#475569');
    textEl.setAttribute('pointer-events', 'none');

    if (line2) {
      // Две строки
      var tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan1.setAttribute('x', lx);
      tspan1.setAttribute('y', ly - 7);
      tspan1.textContent = line1;

      var tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan2.setAttribute('x', lx);
      tspan2.setAttribute('dy', '15');
      tspan2.textContent = line2;

      textEl.appendChild(tspan1);
      textEl.appendChild(tspan2);
    } else {
      textEl.setAttribute('x', lx);
      textEl.setAttribute('y', ly);
      textEl.setAttribute('dominant-baseline', 'central');
      textEl.textContent = line1;
    }

    svg.appendChild(textEl);
  }

  // --- Центральный круг ---
  var centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  centerCircle.setAttribute('cx', cx);
  centerCircle.setAttribute('cy', cy);
  centerCircle.setAttribute('r', innerR);
  centerCircle.setAttribute('fill', '#ffffff');
  centerCircle.setAttribute('stroke', '#e2e8f0');
  centerCircle.setAttribute('stroke-width', '2');
  svg.appendChild(centerCircle);
}

function initWheel() {
  var segments = state.wheel.segments;
  var N = segments.length;
  var currentIndex = 0;

  function renderButtons() {
    var container = document.getElementById('seg-level-buttons');
    var nameEl = document.getElementById('current-seg-name');
    if (!container || !nameEl) return;

    nameEl.textContent = segments[currentIndex];

    container.innerHTML = '';
    for (var i = 1; i <= 10; i++) {
      (function(val) {
        var btn = document.createElement('button');
        btn.className = 'seg-btn';
        btn.textContent = val;
        if (state.wheel.values[currentIndex] === val) {
          btn.classList.add('active');
        }
        btn.style.cssText = [
          'width:32px',
          'height:32px',
          'border-radius:8px',
          'border:1.5px solid #e2e8f0',
          'background:#f8fafc',
          'font-size:13px',
          'font-weight:600',
          'cursor:pointer',
          'transition:all 0.15s',
          'color:#475569'
        ].join(';');
        if (state.wheel.values[currentIndex] === val) {
          btn.style.background = '#a855f7';
          btn.style.color = '#fff';
          btn.style.borderColor = '#a855f7';
        }
        btn.addEventListener('click', function() {
          state.wheel.values[currentIndex] = val;
          renderWheel('wheelSvg', state.wheel.values, currentIndex);

          // Следующая сфера
          setTimeout(function() {
            if (currentIndex < N - 1) {
              currentIndex++;
              state.wheel.currentIndex = currentIndex;
              renderButtons();
              renderWheel('wheelSvg', state.wheel.values, currentIndex);
            } else {
              // Все сферы оценены
              var btnFinish = document.getElementById('btn-wheel-finish');
              var btnReset = document.getElementById('btn-wheel-reset');
              if (btnFinish) btnFinish.style.display = 'inline-block';
              if (btnReset) btnReset.style.display = 'inline-block';
              container.innerHTML = '<span style="font-size:13px;color:#6B7B90;font-weight:600;">✅ Все сферы оценены!</span>';
              var nameEl2 = document.getElementById('current-seg-name');
              if (nameEl2) nameEl2.textContent = 'Готово';
            }
          }, 400);
        });
        container.appendChild(btn);
      })(i);
    }
  }

  // Кнопка "Оценить заново"
  var btnReset = document.getElementById('btn-wheel-reset');
  if (btnReset) {
    btnReset.addEventListener('click', function() {
      state.wheel.values = [0, 0, 0, 0, 0, 0];
      currentIndex = 0;
      state.wheel.currentIndex = 0;
      renderWheel('wheelSvg', state.wheel.values, currentIndex);
      renderButtons();
      btnReset.style.display = 'none';
      var btnFinish = document.getElementById('btn-wheel-finish');
      if (btnFinish) btnFinish.style.display = 'none';
    });
  }

  // Кнопка "Готово"
 var btnFinish = document.getElementById('btn-wheel-finish');
if (btnFinish) {
  btnFinish.addEventListener('click', function() {
    addScore(3);
    showScreen('screen-15');
    setTimeout(function() {
      initImportanceSliders(); // ← вызываем ПОСЛЕ перехода
    }, 100);
  });
}
  // Первый рендер
  renderWheel('wheelSvg', state.wheel.values, currentIndex);
  renderButtons();
}

function initPrioritySliders() {
  var container = document.getElementById('priority-sliders');
  if (!container) return;

  container.innerHTML = '';
  var segments = state.wheel.segments;

  segments.forEach(function(seg) {
    var row = document.createElement('div');
    row.className = 'slider-row';
    row.innerHTML =
      '<div class="slider-label">' +
        '<span>' + seg + '</span>' +
        '<span class="slider-value" id="val-' + seg + '">5</span>' +
      '</div>' +
      '<input type="range" min="1" max="10" value="5" data-seg="' + seg + '" id="slider-' + seg + '">';

    container.appendChild(row);

    var input = row.querySelector('input');
    input.addEventListener('input', function() {
      var valEl = document.getElementById('val-' + seg);
      if (valEl) valEl.textContent = this.value;
    });
  });
}

// ===== Экран 15: Ползунки важности =====
function initImportanceSliders() {
  var panel = document.querySelector('#screen-15 .panel');
  if (!panel) {
    console.warn('initImportanceSliders: панель не найдена');
    return;
  }

  var segments = state.wheel.segments;

  // ===== 1. Убираем ВСЁ старое из сцены =====
  var scene15 = document.querySelector('#screen-15 .scene');
  if (scene15) {
    // Убираем инструкцию, ползунки, кнопки из сцены
    [
      '#sliders-instruction',
      '#priority-sliders',
      '#btn-calc-priorities',
      '.sliders-block',
      '.importance-row',
      '[id^="imp-val-"]'
    ].forEach(function(sel) {
      scene15.querySelectorAll(sel).forEach(function(el) { el.remove(); });
    });

    // Убираем любые текстовые ноды / параграфы с текстом про ползунки
    scene15.querySelectorAll('p, div').forEach(function(el) {
      if (el.textContent.includes('ползунок') || el.textContent.includes('важна для тебя')) {
        el.remove();
      }
    });
  }

  // ===== 2. Убираем старое из панели =====
  panel.querySelectorAll(
    '#sliders-instruction, #priority-sliders, #btn-calc-priorities, #priority-results, #btn-wheel-next, .sliders-block, .importance-row'
  ).forEach(function(el) { el.remove(); });

  // ===== 3. Создаём блок =====
  var block = document.createElement('div');
  block.className = 'sliders-block';
  block.style.cssText = 'display:flex;flex-direction:column;gap:10px;width:100%;';

  // --- Инструкция ---
  var instr = document.createElement('div');
  instr.id = 'sliders-instruction';
  instr.style.cssText = [
    'font-size:13px',
    'color:#475569',
    'line-height:1.5',
    'padding:10px 14px',
    'border-radius:12px',
    'background:rgba(168,85,247,0.06)',
    'border:1px solid rgba(168,85,247,0.2)',
    'flex-shrink:0'
  ].join(';');
  instr.innerHTML =
    '📊 <strong style="color:#1e293b;">Насколько важна для тебя каждая сфера?</strong><br>' +
    '<span style="font-size:12px;">Передвинь ползунок от <b>1</b> (не важна) до <b>10</b> (критически важна).</span>';
  block.appendChild(instr);

  // --- Ползунки ---
  var slidersWrap = document.createElement('div');
  slidersWrap.id = 'priority-sliders';
  slidersWrap.style.cssText = 'display:flex;flex-direction:column;gap:10px;flex-shrink:0;';

  segments.forEach(function(seg, i) {
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;flex-direction:column;gap:4px;';

    var labelRow = document.createElement('div');
    labelRow.style.cssText = [
      'display:flex',
      'justify-content:space-between',
      'align-items:center',
      'font-size:13px',
      'font-weight:600',
      'color:#334155'
    ].join(';');

    var nameSpan = document.createElement('span');
    nameSpan.textContent = seg;

    var valSpan = document.createElement('span');
    valSpan.id = 'imp-val-' + i;
    valSpan.textContent = state.wheel.importance[i];
    valSpan.style.cssText = 'color:#a855f7;font-weight:700;min-width:20px;text-align:right;font-size:14px;';

    labelRow.appendChild(nameSpan);
    labelRow.appendChild(valSpan);

    var slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '1';
    slider.max = '10';
    slider.value = String(state.wheel.importance[i]);
    slider.style.cssText = [
      'width:100%',
      'accent-color:#a855f7',
      'height:6px',
      'cursor:pointer',
      'margin:0',
      '-webkit-appearance:none',
      'appearance:none',
      'background:#e2e8f0',
      'border-radius:999px',
      'outline:none'
    ].join(';');

    (function(index, sp, sl) {
      sl.addEventListener('input', function() {
        state.wheel.importance[index] = parseInt(sl.value);
        sp.textContent = sl.value;
      });
    })(i, valSpan, slider);

    row.appendChild(labelRow);
    row.appendChild(slider);
    slidersWrap.appendChild(row);
  });

  block.appendChild(slidersWrap);

  // --- Кнопка Рассчитать ---
  var btnCalc = document.createElement('button');
  btnCalc.id = 'btn-calc-priorities';
  btnCalc.style.cssText = [
    'display:inline-flex',
    'align-items:center',
    'justify-content:center',
    'gap:6px',
    'padding:10px 20px',
    'border-radius:10px',
    'border:none',
    'cursor:pointer',
    'font-size:13px',
    'font-weight:700',
    'background:linear-gradient(135deg,#a855f7,#7c3aed)',
    'color:#fff',
    'box-shadow:0 4px 14px rgba(168,85,247,0.35)',
    'transition:transform 0.15s,box-shadow 0.15s',
    'align-self:flex-start',
    'flex-shrink:0',
    'margin-top:4px'
  ].join(';');
  btnCalc.innerHTML = '📊 Рассчитать приоритеты';

  btnCalc.addEventListener('mouseenter', function() {
    btnCalc.style.transform = 'translateY(-1px)';
    btnCalc.style.boxShadow = '0 6px 20px rgba(168,85,247,0.5)';
  });
  btnCalc.addEventListener('mouseleave', function() {
    btnCalc.style.transform = '';
    btnCalc.style.boxShadow = '0 4px 14px rgba(168,85,247,0.35)';
  });

  btnCalc.addEventListener('click', function() {
    // Собираем значения с ползунков
    var sliderEls = slidersWrap.querySelectorAll('input[type="range"]');
    var results = segments.map(function(seg, i) {
      var s = sliderEls[i];
      var imp = s ? parseInt(s.value) : (state.wheel.importance[i] || 5);
      var val = state.wheel.values[i] || 0;
      return { seg: seg, imp: imp, val: val, gap: imp - val };
    });

    var sorted = results.slice().sort(function(a, b) { return b.gap - a.gap; });

    state.wheel.priorities = {};
    results.forEach(function(r) { state.wheel.priorities[r.seg] = r.imp; });

    var colors = ['#ef4444','#f59e0b','#22c55e','#38bdf8','#6366f1','#a855f7'];

    var resultsHtml = sorted.map(function(r, idx) {
      var color = colors[idx % colors.length];
      var gapText = r.gap > 0 ? ('+' + r.gap) : String(r.gap);
      var gapColor = r.gap > 0 ? '#ef4444' : '#22c55e';
      return [
        '<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;',
        'border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;margin-bottom:6px;">',
        '<div style="width:22px;height:22px;border-radius:50%;background:' + color + ';',
        'color:#fff;font-weight:700;font-size:11px;display:flex;align-items:center;',
        'justify-content:center;flex-shrink:0;">' + (idx + 1) + '</div>',
        '<div style="flex:1;font-size:12px;font-weight:600;color:#1e293b;">' + r.seg + '</div>',
        '<div style="font-size:11px;color:#64748b;">важность: <b>' + r.imp + '</b>&nbsp;/&nbsp;сейчас: <b>' + r.val + '</b></div>',
        '<div style="font-size:12px;font-weight:700;color:' + gapColor + ';">' + gapText + '</div>',
        '</div>'
      ].join('');
    }).join('');

    // Скрываем инструкцию, ползунки, кнопку
    instr.style.display = 'none';
    slidersWrap.style.display = 'none';
    btnCalc.style.display = 'none';

    // Результаты
    var resultsDiv = document.createElement('div');
    resultsDiv.id = 'priority-results';
    resultsDiv.style.cssText = 'overflow-y:auto;flex:1;min-height:0;';
    resultsDiv.innerHTML =
      '<div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:10px;">🎯 Твои приоритеты:</div>' +
      resultsHtml;
    block.appendChild(resultsDiv);

    // Кнопка Продолжить
    var btnNext = document.createElement('button');
    btnNext.className = 'btn';
    btnNext.id = 'btn-wheel-next';
    btnNext.style.cssText = 'width:100%;margin-top:8px;flex-shrink:0;';
    btnNext.textContent = 'Продолжить →';
    btnNext.addEventListener('click', function() {
      showScreen('screen-16');
    });
    block.appendChild(btnNext);

    addScore(3);
  });

  block.appendChild(btnCalc);

  // ===== 4. Вставляем блок в панель =====
  panel.appendChild(block);
}

// ===== Экран 16: Локации =====
function initPeopleGame() {
  var pool = document.getElementById('people-pool');
  var target = document.getElementById('people-target');
  var counter = document.getElementById('people-counter');
  var feedback = document.getElementById('people-feedback');
  var btnPlan = document.getElementById('btn-people-plan');
  var btnContinue = document.getElementById('btn-people-continue');

  if (!pool || !target || !counter) {
    console.warn('initPeopleGame: элементы не найдены');
    return;
  }

  if (pool.dataset.inited === '1') return;
  pool.dataset.inited = '1';

  // ↓↓↓ ВСТАВЬ СЮДА СВОЮ ССЫЛКУ НА КАРТИНКУ ЧЕЛОВЕЧКА ↓↓↓
  var PERSON_IMG = 'https://i.ibb.co/cSz3DYGB/1.png';

  var TOTAL_PEOPLE = 12;

 pool.innerHTML = '';
  target.innerHTML = '';

  for (var i = 0; i < TOTAL_PEOPLE; i++) {
    var person = document.createElement('div');
    person.className = 'person-avatar';
    person.dataset.personId = 'p' + i;
    person.style.cssText = [
      'width:56px',
      'height:76px',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'cursor:pointer',
      'user-select:none',
      'transition:transform 0.2s ease, filter 0.2s ease',
      'border-radius:10px',
      'padding:4px'
    ].join(';');

    var img = document.createElement('img');
    img.src = PERSON_IMG;
    img.alt = 'Человек ' + (i + 1);
    img.draggable = false;
    img.style.cssText = 'width:100%;height:100%;object-fit:contain;pointer-events:none;display:block;';
    person.appendChild(img);

    person.addEventListener('click', function() {
      var el = this;
      if (el.parentElement === pool) {
        target.appendChild(el);
        el.style.filter = 'drop-shadow(0 4px 8px rgba(34,197,94,0.4))';
      } else {
        pool.appendChild(el);
        el.style.filter = '';
      }
      updateCounter();
    });

    person.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-6px) scale(1.12)';
    });
    person.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });

    pool.appendChild(person);
  }

  function updateCounter() {
    var n = target.children.length;
    counter.textContent = n;

    if (n === 0) {
      counter.style.color = '#94a3b8';
    } else if (n <= 3) {
      counter.style.color = '#22c55e';
    } else if (n <= 7) {
      counter.style.color = '#3b82f6';
    } else {
      // > 7 — красный (предупреждение)
      counter.style.color = '#ef4444';
    }
  }

  // Кнопка "Запланировать"
  if (btnPlan) {
    btnPlan.addEventListener('click', function() {
      var n = target.children.length;

      // Случай 0 — нужно добавить хотя бы одного
      if (n === 0) {
        if (feedback) {
          feedback.style.display = 'block';
          feedback.innerHTML = 'Добавь хотя бы одного человечка в свой план!';
          feedback.style.color = '#f59e0b';
          feedback.style.background = 'rgba(250,204,21,0.08)';
          feedback.style.border = '1px solid rgba(250,204,21,0.3)';
        }
        return;
      }

      localStorage.setItem('nc_people_planned', String(n));

      var msg = '';
      var bgColor = '';
      var borderColor = '';
      var textColor = '#1e293b';

      if (n <= 3) {
        // 1-3: позитив (реалистично)
        msg = '<strong>Реалистичный план!</strong> ' + n + ' качественных знакомств — это уже много. Главное — не количество, а глубина.';
        bgColor = 'rgba(34,197,94,0.08)';
        borderColor = 'rgba(34,197,94,0.3)';
      } else if (n <= 6) {
        // 4-6: позитив (баланс)
        msg = ' <strong>Отличная цель!</strong> ' + n + ' знакомств за одно мероприятие — хороший баланс между амбицией и реальностью.';
        bgColor = 'rgba(59,130,246,0.08)';
        borderColor = 'rgba(59,130,246,0.3)';
      } else {
        // > 7: НЕГАТИВНАЯ ОС
        msg = '<strong>Слишком много!</strong> ' + n + ' знакомств за одно мероприятие — это нереалистично. ' +
              '<br><br> <strong>Лучше качество, чем количество.</strong><br>' +
              'За одну конференцию физически невозможно построить столько глубоких контактов. ' +
              'Поверхностные знакомства быстро забываются: ни ты, ни они не вспомнят друг друга через неделю.' +
              '<br><br> Уменьши число до <strong>3–6 человек</strong> — и ты получишь реальные, а не «галочные» связи.';
        bgColor = 'rgba(239,68,68,0.08)';
        borderColor = 'rgba(239,68,68,0.35)';
        textColor = '#7f1d1d';
      }

      if (feedback) {
        feedback.style.display = 'block';
        feedback.innerHTML = msg;
        feedback.style.color = textColor;
        feedback.style.background = bgColor;
        feedback.style.border = '1px solid ' + borderColor;
        feedback.style.padding = '12px 16px';
        feedback.style.borderRadius = '12px';
        feedback.style.lineHeight = '1.55';
        feedback.style.textAlign = 'left';
      }

      // Показываем "Продолжить" только если число разумное
      if (btnContinue) {
        if (n > 7) {
          btnContinue.style.display = 'none';
          btnContinue.classList.remove('visible');
        } else {
          btnContinue.classList.add('visible');
          btnContinue.style.display = 'inline-flex';
        }
      }

      if (typeof addScore === 'function' && n <= 7) addScore(2);

      // ↓↓↓ СКРОЛЛ К ФИДБЕКУ (на десктопе скроллим панель теории, на мобиле — окно) ↓↓↓
      setTimeout(function() {
        scrollToFeedback(feedback);
      }, 100);
    });
  }

  updateCounter();
}

// Универсальный скролл к фидбеку
function scrollToFeedback(feedback) {
  if (!feedback) return;

  // Ищем ближайший скроллируемый контейнер
  var scrollableParent = feedback.parentElement;
  while (scrollableParent && scrollableParent !== document.body) {
    var style = window.getComputedStyle(scrollableParent);
    var overflowY = style.overflowY;
    if ((overflowY === 'auto' || overflowY === 'scroll') &&
        scrollableParent.scrollHeight > scrollableParent.clientHeight) {
      // Нашли скроллируемого родителя
      var rect = feedback.getBoundingClientRect();
      var parentRect = scrollableParent.getBoundingClientRect();
      var offset = rect.top - parentRect.top + scrollableParent.scrollTop - 20;
      scrollableParent.scrollTo({ top: offset, behavior: 'smooth' });
      return;
    }
    scrollableParent = scrollableParent.parentElement;
  }

  // Fallback — скроллим окно
  feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function initLocations() {
  var pool = document.getElementById('location-pool');
  var zones = document.querySelectorAll('#screen-16-1 .location-drop-zone');
  var btnDone = document.getElementById('btn-locations-done');
  var modal = document.getElementById('locations-modal');
  var feedbackEl = document.getElementById('locations-feedback');
  var btnContinue = document.getElementById('locations-continue');

  if (!pool || !zones.length) {
    console.warn('initLocations: элементы не найдены');
    return;
  }

  // Защита от повторной инициализации
  if (pool.dataset.inited) return;
  pool.dataset.inited = '1';

  // Список локаций
  var locations = [
    { id: 'conf',      label: 'Конференции' },
    { id: 'meetup',    label: 'Митапы' },
    { id: 'workshop',  label: 'Воркшопы' },
    { id: 'party',     label: 'Вечеринки' },
    { id: 'coworking', label: 'Коворкинг' },
    { id: 'online',    label: 'Онлайн-чаты' },
    { id: 'gym',       label: 'Спортзал' },
    { id: 'cafe',      label: 'Кафе/кофейня' },
    { id: 'course',    label: 'Курсы/лекции' },
    { id: 'club',      label: 'Бизнес-клуб' },
    { id: 'travel',    label: 'Путешествия' },
    { id: 'bar',       label: 'Бар' }
  ];

  // Создаём чипы
  locations.forEach(function(loc) {
    var chip = document.createElement('div');
    chip.className = 'location-chip';
    chip.textContent = loc.label;
    chip.dataset.locId = loc.id;
    chip.setAttribute('draggable', 'true');

    // Desktop drag
    chip.addEventListener('dragstart', function(e) {
      chip.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', loc.id);
    });
    chip.addEventListener('dragend', function() {
      chip.classList.remove('dragging');
    });

    // Mobile touch drag
    addTouchDragLocation(chip);

    pool.appendChild(chip);
  });

  // Drop-зоны
  zones.forEach(function(zone) {
    zone.addEventListener('dragover', function(e) {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', function() {
      zone.classList.remove('drag-over');
    });
    zone.addEventListener('drop', function(e) {
      e.preventDefault();
      zone.classList.remove('drag-over');
      var id = e.dataTransfer.getData('text/plain');
      var chip = document.querySelector('.location-chip[data-loc-id="' + id + '"]');
      if (!chip) return;
      moveChipToZone(chip, zone);
    });
  });

  // Pool тоже принимает drop — чтобы можно было вернуть чип
  pool.addEventListener('dragover', function(e) { e.preventDefault(); });
  pool.addEventListener('drop', function(e) {
    e.preventDefault();
    var id = e.dataTransfer.getData('text/plain');
    var chip = document.querySelector('.location-chip[data-loc-id="' + id + '"]');
    if (chip) {
      chip.classList.remove('in-comfort', 'in-neutral', 'in-avoid');
      pool.appendChild(chip);
    }
  });

  function moveChipToZone(chip, zone) {
    var cat = zone.dataset.category;
    chip.classList.remove('in-comfort', 'in-neutral', 'in-avoid');
    chip.classList.add('in-' + cat);
    zone.appendChild(chip);
  }

  // Touch drag (мобилка)
  function addTouchDragLocation(chip) {
    var ghost = null, startX = 0, startY = 0, moved = false;

    chip.addEventListener('touchstart', function(e) {
      var t = e.touches[0];
      startX = t.clientX; startY = t.clientY; moved = false;
      ghost = chip.cloneNode(true);
      ghost.style.cssText = 'position:fixed;left:' + (t.clientX - 40) + 'px;top:' + (t.clientY - 15) + 'px;z-index:9999;opacity:0.85;pointer-events:none;';
      document.body.appendChild(ghost);
      chip.style.opacity = '0.4';
    }, { passive: true });

    chip.addEventListener('touchmove', function(e) {
      if (!ghost) return;
      var t = e.touches[0];
      if (Math.abs(t.clientX - startX) > 5 || Math.abs(t.clientY - startY) > 5) moved = true;
      ghost.style.left = (t.clientX - 40) + 'px';
      ghost.style.top = (t.clientY - 15) + 'px';
      e.preventDefault();
    }, { passive: false });

    chip.addEventListener('touchend', function(e) {
      if (!ghost) return;
      var t = e.changedTouches[0];
      var el = document.elementFromPoint(t.clientX, t.clientY);
      ghost.remove(); ghost = null;
      chip.style.opacity = '';
      if (!moved) return;

      // Ищем ближайшую drop-зону
      var target = el;
      while (target && target !== document.body) {
        if (target.classList && target.classList.contains('location-drop-zone')) {
          moveChipToZone(chip, target);
          return;
        }
        if (target.id === 'location-pool') {
          chip.classList.remove('in-comfort', 'in-neutral', 'in-avoid');
          pool.appendChild(chip);
          return;
        }
        target = target.parentNode;
      }
    });
  }

  // Кнопка "Готово"
  if (btnDone) {
    btnDone.addEventListener('click', function() {
      var comfort = document.querySelectorAll('.location-drop-zone[data-category="comfort"] .location-chip').length;
      var neutral = document.querySelectorAll('.location-drop-zone[data-category="neutral"] .location-chip').length;
      var avoid   = document.querySelectorAll('.location-drop-zone[data-category="avoid"] .location-chip').length;
      var placed  = comfort + neutral + avoid;

      if (placed === 0) {
        alert('Перетащи хотя бы одну локацию в любую категорию!');
        return;
      }

      if (feedbackEl) {
        feedbackEl.innerHTML =
          '<div style="display:flex; flex-direction:column; gap:6px; font-size:13px; margin-top:8px;">' +
            '<div>🐟 Комфорт: <strong>' + comfort + '</strong></div>' +
            '<div>😐 Нейтрально: <strong>' + neutral + '</strong></div>' +
            '<div>🚫 Избегаю: <strong>' + avoid + '</strong></div>' +
          '</div>';
      }

      addScore(2);
      if (modal) modal.classList.add('active');
    });
  }

  // Кнопка "Продолжить" в модалке
  if (btnContinue) {
    btnContinue.addEventListener('click', function() {
      if (modal) modal.classList.remove('active');
      showScreen('screen-17');
    });
  }
}


// ===== Экран 17: SMART цель — майнд-карта с последовательным появлением =====
function initSmartGoal() {
  var screen = document.getElementById('screen-17');
  if (!screen) return;

  // Защита от повторной инициализации
  if (screen.dataset.inited === '1') {
    // При повторном входе — просто восстанавливаем состояние
    restoreSmartState();
    return;
  }
  screen.dataset.inited = '1';

  // Порядок появления ветвей
  var order = ['s', 'm', 'a', 'r', 't'];
  var colors = {
    s: '#22c55e',
    m: '#3b82f6',
    a: '#f59e0b',
    r: '#a855f7',
    t: '#ef4444'
  };
  var labels = {
    s: 'Specific',
    m: 'Measurable',
    a: 'Achievable',
    r: 'Relevant',
    t: 'Time-bound'
  };

  // Загружаем сохранённые ответы
  var saved = {};
  try {
    saved = JSON.parse(localStorage.getItem('nc_smart_goal') || '{}');
  } catch(e) { saved = {}; }

  // Показать ветвь по индексу (0..4)
  function showBranch(index) {
    if (index >= order.length) return;
    var key = order[index];
    var branch = screen.querySelector('.smart-branch[data-branch="' + key + '"]');
    if (!branch) return;

    if (!branch.classList.contains('visible')) {
      branch.classList.add('visible');
    }
    branch.classList.add('active');

    // Обновить прогресс-точку
    var dot = screen.querySelector('.smart-progress-dot[data-step="' + (index + 1) + '"]');
    if (dot) dot.classList.add('active');

    // Нарисовать линию от центра к ветви
    drawLineToBranch(key);

    // Установить фокус на textarea этой ветви
    setTimeout(function() {
      var ta = branch.querySelector('textarea');
      if (ta && !ta.value) ta.focus();
    }, 400);
  }

  // Отметить ветвь как заполненную и показать следующую
  function markFilled(index) {
    var key = order[index];
    var branch = screen.querySelector('.smart-branch[data-branch="' + key + '"]');
    if (branch) {
      branch.classList.add('filled');
      branch.classList.remove('active');
    }

    // Прогресс-точка → done
    var dot = screen.querySelector('.smart-progress-dot[data-step="' + (index + 1) + '"]');
    if (dot) {
      dot.classList.remove('active');
      dot.classList.add('done');
    }

    // Линия → filled
    var line = screen.querySelector('.smart-line-path[data-for="' + key + '"]');
    if (line) {
      line.classList.add('filled');
      line.setAttribute('stroke', colors[key]);
    }

    // Соединительная линия на прогресс-баре
    var lines = screen.querySelectorAll('.smart-progress-line');
    if (lines[index]) lines[index].classList.add('done');

    // Показать следующую ветвь
    if (index + 1 < order.length) {
      setTimeout(function() {
        showBranch(index + 1);
      }, 350);
    }
  }

  // Нарисовать линию от центра к ветви (SVG)
  function drawLineToBranch(key) {
    var svg = document.getElementById('smart-lines');
    var center = document.getElementById('smart-center');
    var branch = screen.querySelector('.smart-branch[data-branch="' + key + '"]');
    if (!svg || !center || !branch) return;

    // Если линия уже есть — не дублируем
    if (svg.querySelector('[data-for="' + key + '"]')) return;

    var wrap = screen.querySelector('.smart-mind-map-wrap');
    if (!wrap) return;

    var wrapRect = wrap.getBoundingClientRect();
    var centerRect = center.getBoundingClientRect();
    var branchRect = branch.getBoundingClientRect();

    // Координаты относительно SVG
    var cx = centerRect.left + centerRect.width / 2 - wrapRect.left;
    var cy = centerRect.top + centerRect.height / 2 - wrapRect.top;
    var bx = branchRect.left + branchRect.width / 2 - wrapRect.left;
    var by = branchRect.top + branchRect.height / 2 - wrapRect.top;

    // Контрольная точка для красивой кривой Безье
    var mx = (cx + bx) / 2;
    var my = (cy + by) / 2;
    // Смещение контрольной точки перпендикулярно линии
    var dx = bx - cx;
    var dy = by - cy;
    var offset = 30;
    var perpX = -dy * 0.15;
    var perpY = dx * 0.15;

    var d = 'M ' + cx + ' ' + cy +
            ' Q ' + (mx + perpX) + ' ' + (my + perpY) +
            ' ' + bx + ' ' + by;

    var ns = 'http://www.w3.org/2000/svg';
    var path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    path.setAttribute('data-for', key);
    path.setAttribute('stroke', colors[key]);
    path.setAttribute('class', 'smart-line-path');
    svg.appendChild(path);

    // Обновить длину для анимации
    var len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    // Запуск анимации
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        path.classList.add('visible');
        path.style.strokeDashoffset = 0;
      });
    });
  }

  // Перерисовка всех линий (при ресайзе)
  function redrawAllLines() {
    var svg = document.getElementById('smart-lines');
    if (!svg) return;

    // Обновляем размер SVG
    var wrap = screen.querySelector('.smart-mind-map-wrap');
    if (wrap) {
      svg.setAttribute('width', wrap.offsetWidth);
      svg.setAttribute('height', wrap.offsetHeight);
    }

    // Удаляем существующие и перерисовываем для видимых ветвей
    svg.innerHTML = '';
    order.forEach(function(key) {
      var branch = screen.querySelector('.smart-branch[data-branch="' + key + '"]');
      if (branch && branch.classList.contains('visible')) {
        drawLineToBranch(key);
        if (branch.classList.contains('filled')) {
          var line = svg.querySelector('[data-for="' + key + '"]');
          if (line) line.classList.add('filled');
        }
      }
    });
  }

  // Проверка заполнения всех ветвей
  function allFilled() {
    return order.every(function(k) {
      var ta = document.getElementById('smart-' + k);
      return ta && ta.value.trim().length >= 3;
    });
  }

  // Восстановление состояния при повторном входе
  function restoreSmartState() {
    var anyFilled = false;
    order.forEach(function(key, i) {
      var ta = document.getElementById('smart-' + key);
      if (ta && saved[key]) {
        ta.value = saved[key];
      }
    });

    // Показываем ветви по порядку
    var firstUnfilled = -1;
    order.forEach(function(key, i) {
      var val = document.getElementById('smart-' + key).value.trim();
      var branch = screen.querySelector('.smart-branch[data-branch="' + key + '"]');
      if (val.length >= 3) {
        // Заполнено
        if (branch) {
          branch.classList.add('visible', 'filled');
        }
        var dot = screen.querySelector('.smart-progress-dot[data-step="' + (i + 1) + '"]');
        if (dot) dot.classList.add('done');
        var lines = screen.querySelectorAll('.smart-progress-line');
        if (lines[i]) lines[i].classList.add('done');
      } else if (firstUnfilled === -1) {
        firstUnfilled = i;
      }
    });

    if (firstUnfilled !== -1) {
      showBranch(firstUnfilled);
    } else {
      // Всё заполнено
      showBranch(order.length - 1);
      var lastBranch = screen.querySelector('.smart-branch[data-branch="t"]');
      if (lastBranch) {
        lastBranch.classList.add('visible');
      }
    }

    // Рисуем линии после появления ветвей
    setTimeout(redrawAllLines, 100);
  }

  // ===== Инициализация =====

  // Скрываем все ветви изначально
  order.forEach(function(key) {
    var branch = screen.querySelector('.smart-branch[data-branch="' + key + '"]');
    if (branch) branch.classList.remove('visible', 'active', 'filled');
  });

  // Скрываем все прогресс-точки
  screen.querySelectorAll('.smart-progress-dot').forEach(function(d) {
    d.classList.remove('active', 'done');
  });
  screen.querySelectorAll('.smart-progress-line').forEach(function(l) {
    l.classList.remove('done');
  });

  // Восстанавливаем если есть сохранённое
  if (Object.keys(saved).length > 0) {
    restoreSmartState();
  } else {
    // Первый вход — показываем только S
    setTimeout(function() {
      showBranch(0);
    }, 300);
  }

  // ===== Обработчики textarea — следующая ветвь появляется на blur =====
  order.forEach(function(key, i) {
    var ta = document.getElementById('smart-' + key);
    if (!ta) return;

    // Убираем старые слушатели (на всякий случай)
    var newTa = ta.cloneNode(true);
    ta.parentNode.replaceChild(newTa, ta);
    if (saved[key]) newTa.value = saved[key];

    // На blur — если заполнено, открываем следующую
    newTa.addEventListener('blur', function() {
      var val = this.value.trim();
      if (val.length >= 3) {
        markFilled(i);
      }
    });

    // На Enter — переход к следующей (без ухода с фокуса)
    newTa.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey && this.value.trim().length >= 3) {
        e.preventDefault();
        this.blur();
      }
    });

    // Убираем ошибку при вводе
    newTa.addEventListener('input', function() {
      this.classList.remove('error');
    });
  });

  // ===== Кнопка "Ответить" =====
  var btnSubmit = document.getElementById('btn-smart-submit');
  if (btnSubmit) {
    var newBtn = btnSubmit.cloneNode(true);
    btnSubmit.parentNode.replaceChild(newBtn, btnSubmit);

    newBtn.addEventListener('click', function() {
      // Проверяем заполнение
      var empty = [];
      order.forEach(function(key) {
        var ta = document.getElementById('smart-' + key);
        if (!ta || ta.value.trim().length < 3) {
          empty.push(key);
          if (ta) ta.classList.add('error');
        }
      });

      if (empty.length > 0) {
        // Показываем первую незаполненную ветвь
        var firstEmptyIdx = order.indexOf(empty[0]);
        showBranch(firstEmptyIdx);

        // Модалка предупреждения
        var warnModal = document.getElementById('smart-warning-modal');
        if (warnModal) warnModal.classList.add('active');
        return;
      }

      // Все заполнено — открываем модалку с ОС
      showFeedbackModal();
    });
  }

  // Модалка предупреждения — кнопка OK
  var warnOk = document.getElementById('smart-warning-ok');
  if (warnOk) {
    warnOk.onclick = function() {
      document.getElementById('smart-warning-modal').classList.remove('active');
    };
  }

  // ===== Пример Златы — раскрытие =====
  var exampleToggle = document.getElementById('smart-example-toggle');
  var exampleHeader = document.getElementById('smart-example-header');
  if (exampleHeader && exampleToggle) {
    exampleHeader.onclick = function() {
      exampleToggle.classList.toggle('open');
    };
  }

  // ===== Модалка ОС =====
  function showFeedbackModal() {
    var modal = document.getElementById('smart-feedback-modal');
    var content = document.getElementById('smart-feedback-content');
    if (!modal || !content) return;

    // Формируем ОС — показываем заполненное + подсветка
    var html = '';
    order.forEach(function(key) {
      var ta = document.getElementById('smart-' + key);
      var val = ta ? ta.value.trim() : '';
      html += '<div style="padding:10px 12px; border-radius:10px; background:' +
              hexToRgba(colors[key], 0.08) +
              '; border-left:3px solid ' + colors[key] + ';">' +
              '<div style="font-size:11px; font-weight:700; color:' + colors[key] +
              '; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:3px;">' +
              key.toUpperCase() + ' — ' + labels[key] +
              '</div>' +
              '<div style="font-size:13px; color:#1e293b; line-height:1.5;">' +
              escapeHtml(val) +
              '</div></div>';
    });
    content.innerHTML = html;

    // Скрываем индикатор сохранения
    var indicator = document.getElementById('smart-saved-indicator');
    if (indicator) indicator.style.display = 'none';

    modal.classList.add('active');
  }

  // Кнопка "Сохранить" в модалке
  var btnSave = document.getElementById('btn-smart-save');
  if (btnSave) {
    var newSave = btnSave.cloneNode(true);
    btnSave.parentNode.replaceChild(newSave, btnSave);

    newSave.addEventListener('click', function() {
      var data = {};
      order.forEach(function(key) {
        var ta = document.getElementById('smart-' + key);
        if (ta) data[key] = ta.value.trim();
      });
      localStorage.setItem('nc_smart_goal', JSON.stringify(data));

      // Показать индикатор
      var indicator = document.getElementById('smart-saved-indicator');
      if (indicator) {
        indicator.style.display = 'block';
        setTimeout(function() {
          indicator.style.display = 'none';
        }, 2500);
      }

      if (typeof addScore === 'function') addScore(3);
    });
  }

  // Кнопка "Продолжить" в модалке
  var btnContinue = document.getElementById('btn-smart-continue');
  if (btnContinue) {
    var newCont = btnContinue.cloneNode(true);
    btnContinue.parentNode.replaceChild(newCont, btnContinue);

    newCont.addEventListener('click', function() {
      // Автосохранение при продолжении
      var data = {};
      order.forEach(function(key) {
        var ta = document.getElementById('smart-' + key);
        if (ta) data[key] = ta.value.trim();
      });
      localStorage.setItem('nc_smart_goal', JSON.stringify(data));

      document.getElementById('smart-feedback-modal').classList.remove('active');
      if (typeof showScreen === 'function') showScreen('screen-17-1');
    });
  }

  // ===== Ресайз — перерисовка линий =====
  var resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(redrawAllLines, 200);
  });

  // Первоначальная установка размера SVG
  setTimeout(function() {
    var svg = document.getElementById('smart-lines');
    var wrap = screen.querySelector('.smart-mind-map-wrap');
    if (svg && wrap) {
      svg.setAttribute('width', wrap.offsetWidth);
      svg.setAttribute('height', wrap.offsetHeight);
    }
  }, 100);
}

// Вспомогательные функции
function hexToRgba(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}


// ===== Экран 19: Визитка =====
function initBizcard() {
  var screen = document.getElementById('screen-19');
  if (!screen) return;
  if (screen.dataset.inited === '1') return;
  screen.dataset.inited = '1';

  var dropZones = screen.querySelectorAll('.bizcard-drop-zone');
  var dragEls = screen.querySelectorAll('.drag-el');
  var btnCheck = document.getElementById('btn-bizcard-check');
  var btnNext = document.getElementById('btn-bizcard-next');
  var feedback = document.getElementById('bc-feedback');
  var phoneError = document.getElementById('bc-phone-error');
  var phoneInput = document.getElementById('bc-phone');

  // Скрываем «Далее» в основной панели (теперь он в модалке)
  if (btnNext) btnNext.style.display = 'none';

  // ===== DRAG & DROP — desktop =====
  dragEls.forEach(function(el) {
    el.addEventListener('dragstart', function(e) {
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', el.dataset.el);
      e.dataTransfer.setData('img', el.dataset.img);
    });
    el.addEventListener('dragend', function() {
      el.classList.remove('dragging');
    });

    // ===== TOUCH DRAG — мобилки =====
    var ghost = null, startX = 0, startY = 0, moved = false;

    el.addEventListener('touchstart', function(e) {
      if (el.classList.contains('placed')) return;
      var t = e.touches[0];
      startX = t.clientX; startY = t.clientY; moved = false;
      ghost = el.cloneNode(true);
      ghost.style.cssText = 'position:fixed;left:' + (t.clientX - 60) + 'px;top:' + (t.clientY - 20) + 'px;z-index:9999;opacity:0.85;pointer-events:none;box-shadow:0 8px 20px rgba(0,0,0,0.25);';
      document.body.appendChild(ghost);
      el.style.opacity = '0.4';
    }, { passive: true });

    el.addEventListener('touchmove', function(e) {
      if (!ghost) return;
      var t = e.touches[0];
      if (Math.abs(t.clientX - startX) > 5 || Math.abs(t.clientY - startY) > 5) moved = true;
      ghost.style.left = (t.clientX - 60) + 'px';
      ghost.style.top = (t.clientY - 20) + 'px';
      e.preventDefault();
    }, { passive: false });

    el.addEventListener('touchend', function(e) {
      if (!ghost) return;
      var t = e.changedTouches[0];
      var target = document.elementFromPoint(t.clientX, t.clientY);
      ghost.remove(); ghost = null;
      el.style.opacity = '';
      if (!moved) return;

      var zone = target;
      while (zone && zone !== document.body) {
        if (zone.classList && zone.classList.contains('bizcard-drop-zone')) {
          placeElementInZone(el, zone);
          return;
        }
        zone = zone.parentNode;
      }
    });
  });

  // ===== DROP ZONES =====
  dropZones.forEach(function(zone) {
    zone.addEventListener('dragover', function(e) {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', function() {
      zone.classList.remove('drag-over');
    });
    zone.addEventListener('drop', function(e) {
      e.preventDefault();
      zone.classList.remove('drag-over');
      var elType = e.dataTransfer.getData('text/plain');
      var sourceEl = document.querySelector('.drag-el[data-el="' + elType + '"]');
      if (!sourceEl) return;
      placeElementInZone(sourceEl, zone);
    });
  });

  function placeElementInZone(sourceEl, zone) {
    var elType = sourceEl.dataset.el;
    var zoneType = zone.dataset.zone;

    if (elType !== zoneType) {
      zone.classList.add('error-flash');
      setTimeout(function() { zone.classList.remove('error-flash'); }, 600);
      if (feedback) {
        feedback.className = 'bizcard-feedback err';
        feedback.textContent = '❌ Этот элемент не подходит сюда. Логотип → к логотипу, QR → к QR, Фото → к фото.';
        setTimeout(function() { feedback.textContent = ''; feedback.className = 'bizcard-feedback'; }, 3000);
      }
      return;
    }

    var imgSrc = sourceEl.dataset.img;
    zone.innerHTML = '<img src="' + imgSrc + '" alt="' + elType + '">';
    zone.classList.add('filled');
    zone.dataset.filled = '1';
    sourceEl.classList.add('placed');

    if (feedback) {
      feedback.textContent = '';
      feedback.className = 'bizcard-feedback';
    }
  }

  // ===== Валидация телефона =====
  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      var val = phoneInput.value.trim();
      var hasDigits = /\d/.test(val);
      if (val.length > 0 && !hasDigits) {
        if (phoneError) phoneError.style.display = 'block';
        phoneInput.classList.add('error');
      } else {
        if (phoneError) phoneError.style.display = 'none';
        phoneInput.classList.remove('error');
      }
    });
  }

  // ===== Создаём модалку успеха (если её ещё нет) =====
  var successModal = document.getElementById('bizcard-success-modal');
  if (!successModal) {
    successModal = document.createElement('div');
    successModal.id = 'bizcard-success-modal';
    successModal.className = 'modal-overlay';
    successModal.innerHTML =
      '<div class="modal" style="max-width:440px;">' +
        '<div style="text-align:center; font-size:48px; margin-bottom:8px;">🎉</div>' +
        '<h3 style="text-align:center; font-size:20px; color:#16a34a; margin-bottom:8px;">Отличная визитка!</h3>' +
        '<p style="font-size:14px; color:#475569; line-height:1.6; text-align:center; margin-bottom:18px;">' +
          'Все основные элементы на месте. Теперь ты готов(а) к знакомствам на мероприятии.' +
        '</p>' +
        '<div style="padding:12px 14px; border-radius:12px; background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.2); margin-bottom:18px; font-size:13px; color:#166534; line-height:1.5;">' +
          '💡 <strong>Совет:</strong> сохрани свою визитку — она пригодится на экране итогов и в будущих модулях.' +
        '</div>' +
        '<div id="bizcard-saved-indicator" style="display:none; text-align:center; font-size:13px; color:#16a34a; font-weight:600; margin-bottom:12px; animation:fadeIn 0.3s ease;">' +
          '✅ Ответ сохранён!' +
        '</div>' +
        '<div class="actions-row" style="display:flex; gap:10px; justify-content:center; flex-wrap:nowrap;">' +
          '<button class="btn secondary" id="btn-bc-save-modal" style="height:44px; padding:0 20px; font-size:14px; border-radius:999px; background:#f1f5f9; color:#475569; border:1px solid #e2e8f0; font-weight:600; cursor:pointer;">' +
            '💾 Сохранить ответ' +
          '</button>' +
          '<button class="btn" id="btn-bc-next-modal" style="height:44px; padding:0 28px; font-size:14px; border-radius:999px; background:linear-gradient(135deg,#22c55e,#16a34a); color:#fff; border:none; font-weight:700; cursor:pointer; box-shadow:0 4px 12px rgba(34,197,94,0.35);">' +
            'Далее →' +
          '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(successModal);

    // Обработчики модалки
    document.getElementById('btn-bc-save-modal').addEventListener('click', function() {
      var data = {};
      ['name','role','company','hook','email','phone','profile'].forEach(function(key) {
        var el = document.getElementById('bc-' + key);
        if (el) data[key] = el.value.trim();
      });
      localStorage.setItem('nc_bizcard', JSON.stringify(data));
      var ind = document.getElementById('bizcard-saved-indicator');
      if (ind) {
        ind.style.display = 'block';
        setTimeout(function() { ind.style.display = 'none'; }, 2500);
      }
    });

    document.getElementById('btn-bc-next-modal').addEventListener('click', function() {
      // Автосохранение перед переходом
      var data = {};
      ['name','role','company','hook','email','phone','profile'].forEach(function(key) {
        var el = document.getElementById('bc-' + key);
        if (el) data[key] = el.value.trim();
      });
      localStorage.setItem('nc_bizcard', JSON.stringify(data));

      successModal.classList.remove('active');
      showScreen('screen-19-1');
    });
  }

  // ===== КНОПКА "ПРОВЕРИТЬ" =====
  if (btnCheck) {
    btnCheck.addEventListener('click', function() {
      var fields = {
        name: document.getElementById('bc-name'),
        role: document.getElementById('bc-role'),
        company: document.getElementById('bc-company'),
        hook: document.getElementById('bc-hook'),
        email: document.getElementById('bc-email'),
        phone: document.getElementById('bc-phone'),
        profile: document.getElementById('bc-profile')
      };

      var errors = [];
      var filled = 0;

      Object.keys(fields).forEach(function(key) {
        var el = fields[key];
        if (!el) return;
        var val = el.value.trim();
        if (val.length >= 2) {
          filled++;
          el.classList.remove('error');
        } else {
          el.classList.add('error');
        }
      });

      var phoneVal = fields.phone ? fields.phone.value.trim() : '';
      if (phoneVal.length > 0 && !/\d/.test(phoneVal)) {
        errors.push('В телефоне должны быть цифры');
        if (phoneError) phoneError.style.display = 'block';
      }

      var filledZones = screen.querySelectorAll('.bizcard-drop-zone.filled').length;

      if (filled < 4) {
        errors.push('Заполни минимум 4 поля (сейчас: ' + filled + ')');
      }

      if (filledZones < 2) {
        errors.push('Перетащи минимум 2 элемента (логотип, QR или фото). Сейчас: ' + filledZones);
      }

      if (errors.length > 0) {
        if (feedback) {
          feedback.className = 'bizcard-feedback err';
          feedback.innerHTML = '⚠️ ' + errors.join('<br>');
        }
        return;
      }

      // Всё ок!
      if (feedback) {
        feedback.className = 'bizcard-feedback ok';
        feedback.innerHTML = '✅ <strong>Отличная визитка!</strong> Все основные элементы на месте.';
      }

      // Сохраняем
      var data = {};
      Object.keys(fields).forEach(function(key) {
        if (fields[key]) data[key] = fields[key].value.trim();
      });
      localStorage.setItem('nc_bizcard', JSON.stringify(data));

      // Награда
      if (!state.bizcardRewarded) {
        addScore(3);
        state.bizcardRewarded = true;
      }

      // Празднование
      var template = document.getElementById('bc-template');
      if (template) {
        template.classList.add('celebrate');
        setTimeout(function() { template.classList.remove('celebrate'); }, 1500);
      }

      // Открываем модалку успеха
      setTimeout(function() {
        successModal.classList.add('active');
      }, 500);
    });
  }

  // ===== Восстановление сохранённого =====
  try {
    var saved = JSON.parse(localStorage.getItem('nc_bizcard') || '{}');
    Object.keys(saved).forEach(function(key) {
      var el = document.getElementById('bc-' + key);
      if (el && saved[key]) el.value = saved[key];
    });
  } catch(e) {}
}

// ===== Экран 20: Выбор фото =====
function initPhotoGame() {
  var screen = document.getElementById('screen-20');
  if (!screen) return;
  if (screen.dataset.inited === '1') return;
  screen.dataset.inited = '1';

  var grid = document.getElementById('photo-grid');
  var cards = screen.querySelectorAll('.photo-card');
  var btnCheck = document.getElementById('btn-photo-check');
  var btnNext = document.getElementById('btn-photo-next');
  var feedback = document.getElementById('photo-feedback');

  if (!grid || !cards.length) {
    console.warn('initPhotoGame: элементы не найдены');
    return;
  }

  // Скрываем «Далее» — он появится через модалку
  if (btnNext) btnNext.style.display = 'none';

  // ПРАВИЛЬНОЕ ФОТО: №1 (Портрет в офисе)
  var CORRECT_PHOTO = '1';
  var selectedPhoto = null;
  var attempts = 0;

  // Данные для ОС по каждому фото
  var photoFeedback = {
    '1': {
      correct: true,
      title: 'Отличный выбор!',
      text: 'Профессиональный портрет в офисе — лицо крупным планом, чистый фон, хороший свет, живое выражение. По всем критериям 5+.'
    },
    '2': {
      correct: false,
      title: 'Не подходит',
      text: 'Селфи в лифте — плохой фон (зеркало), неестественный ракурс, часто плохой свет. Для делового профиля не годится.'
    },
    '3': {
      correct: false,
      title: 'Не подходит',
      text: 'Фото с корпоратива — есть лицо, но фон слишком яркий и отвлекает. Лучше для личной страницы.'
    },
    '4': {
      correct: false,
      title: 'Не подходит',
      text: 'Командное фото — на нём тебя сложно узнать. Для личного профиля нужен кадр, где ты главный герой.'
    },
    '5': {
      correct: false,
      title: 'Не подходит',
      text: 'Фото с отпуска — отличный отдых, но не деловой контекст. Купальник не располагает к деловым предложениям.'
    },
    '6': {
      correct: false,
      title: 'Не подходит',
      text: 'Вечернее фото — плохой свет, неформальный контекст. Для профессионального профиля нужен дневной кадр.'
    }
  };

  // Создаём модалку успеха
  var successModal = document.getElementById('photo-success-modal');
  if (!successModal) {
    successModal = document.createElement('div');
    successModal.id = 'photo-success-modal';
    successModal.className = 'modal-overlay';
    successModal.innerHTML =
      '<div class="modal" style="max-width:440px;">' +
        '<div style="text-align:center; font-size:48px; margin-bottom:8px;">🎉</div>' +
        '<h3 style="text-align:center; font-size:20px; color:#16a34a; margin-bottom:8px;">Отличный выбор фото!</h3>' +
        '<p style="font-size:14px; color:#475569; line-height:1.6; text-align:center; margin-bottom:18px;">' +
          'Профессиональный портрет — именно то, что нужно для онлайн-профиля. Лицо, чистый фон, живое выражение.' +
        '</p>' +
        '<div style="padding:12px 14px; border-radius:12px; background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.2); margin-bottom:18px; font-size:13px; color:#166534; line-height:1.5;">' +
          '💡 <strong>Помни:</strong> аватарка — это твоё первое «рукопожатие» онлайн. Люди решают за 1–2 секунды, хотят ли продолжать общение.' +
        '</div>' +
        '<div class="actions-row" style="display:flex; gap:10px; justify-content:center; flex-wrap:nowrap;">' +
          '<button class="btn" id="btn-photo-next-modal" style="height:44px; padding:0 28px; font-size:14px; border-radius:999px; background:linear-gradient(135deg,#22c55e,#16a34a); color:#fff; border:none; font-weight:700; cursor:pointer; box-shadow:0 4px 12px rgba(34,197,94,0.35);">' +
            'Далее →' +
          '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(successModal);

    document.getElementById('btn-photo-next-modal').addEventListener('click', function() {
      successModal.classList.remove('active');
      showScreen('screen-20-1');
    });
  }

  // Клик по фото
  cards.forEach(function(card) {
    card.addEventListener('click', function() {
      if (card.classList.contains('dimmed')) return;
      // Снимаем выделение со всех
      cards.forEach(function(c) { c.classList.remove('selected'); });
      // Ставим выделение на это
      card.classList.add('selected');
      selectedPhoto = card.dataset.photo;

      if (feedback) {
        feedback.textContent = '';
        feedback.className = 'photo-feedback';
      }
    });
  });

  // Кнопка «Проверить»
  if (btnCheck) {
    btnCheck.addEventListener('click', function() {
      if (!selectedPhoto) {
        if (feedback) {
          feedback.className = 'photo-feedback err';
          feedback.innerHTML = '⚠️ Сначала выбери одно фото';
        }
        return;
      }

      attempts++;
      var data = photoFeedback[selectedPhoto];

      if (selectedPhoto === CORRECT_PHOTO) {
        // ПРАВИЛЬНО!
        var selectedCard = document.querySelector('.photo-card[data-photo="' + CORRECT_PHOTO + '"]');
        if (selectedCard) {
          selectedCard.classList.remove('selected');
          selectedCard.classList.add('correct');
        }
        // Остальные — тусклые
        cards.forEach(function(c) {
          if (c.dataset.photo !== CORRECT_PHOTO) {
            c.classList.add('dimmed');
          }
        });

        if (feedback) {
          feedback.className = 'photo-feedback ok';
          feedback.innerHTML = '✅ <strong>' + data.title + '</strong><br>' + data.text;
        }

        // Награда
        if (!state.photoRewarded) {
          addScore(3);
          state.photoRewarded = true;
        }

        // Модалка через 1 секунду
        setTimeout(function() {
          successModal.classList.add('active');
        }, 1200);

      } else {
        // НЕПРАВИЛЬНО
        var wrongCard = document.querySelector('.photo-card[data-photo="' + selectedPhoto + '"]');
        if (wrongCard) {
          wrongCard.classList.add('wrong');
          setTimeout(function() {
            wrongCard.classList.remove('wrong');
          }, 500);
        }

        if (feedback) {
          feedback.className = 'photo-feedback err';
          feedback.innerHTML = '❌ <strong>' + data.title + '</strong><br>' + data.text;
          if (attempts >= 2) {
            feedback.innerHTML += '<br><br><strong>Подсказка:</strong> ищи фото с лицом крупным планом, чистым фоном и живым выражением.';
          }
        }
      }
    });
  }
}

// ===== Экран 20-1: Статус профиля =====
function initStatusForm() {
  var screen = document.getElementById('screen-20-1');
  if (!screen) return;
  if (screen.dataset.inited === '1') return;
  screen.dataset.inited = '1';

  var roleInput = document.getElementById('status-role');
  var specInput = document.getElementById('status-spec');
  var focusInput = document.getElementById('status-focus');
  var btnSet = document.getElementById('btn-status-set');
  var btnRetry = document.getElementById('btn-status-retry');
  var btnNext = document.getElementById('btn-status-next');
  var preview = document.getElementById('status-preview');
  var previewText = document.getElementById('status-text');
  var inlineFeedback = document.getElementById('status-inline-feedback');
  var form = document.getElementById('status-form');

  if (!roleInput || !specInput || !focusInput || !btnSet) {
    console.warn('initStatusForm: элементы не найдены');
    return;
  }

  // Убираем старые onclick
  btnSet.removeAttribute('onclick');
  if (btnRetry) btnRetry.removeAttribute('onclick');
  if (btnNext) btnNext.removeAttribute('onclick');

  // Восстановление сохранённого
  try {
    var saved = JSON.parse(localStorage.getItem('nc_status') || '{}');
    if (saved.role) roleInput.value = saved.role;
    if (saved.spec) specInput.value = saved.spec;
    if (saved.focus) focusInput.value = saved.focus;
  } catch(e) {}

  // Создаём модалку успеха
  var successModal = document.getElementById('status-success-modal');
  if (!successModal) {
    successModal = document.createElement('div');
    successModal.id = 'status-success-modal';
    successModal.className = 'modal-overlay';
    successModal.innerHTML =
      '<div class="modal" style="max-width:460px;">' +
        '<div style="text-align:center; font-size:48px; margin-bottom:8px;">🎉</div>' +
        '<h3 style="text-align:center; font-size:20px; color:#16a34a; margin-bottom:8px;">Отличный статус!</h3>' +
        '<p style="font-size:14px; color:#475569; line-height:1.6; text-align:center; margin-bottom:14px;">' +
          'Теперь человек, увидев твой статус, подумает: «О, вот с этим человеком я хочу быть на связи».' +
        '</p>' +
        '<div id="status-preview-modal" style="background:linear-gradient(135deg,#f0fdf4,#dcfce7); border:1px solid rgba(34,197,94,0.3); border-radius:12px; padding:14px 16px; text-align:center; margin-bottom:18px;">' +
          '<div style="font-size:10px; color:#16a34a; font-weight:700; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.05em;">ТВОЙ СТАТУС</div>' +
          '<div id="status-preview-modal-text" style="font-size:14px; font-weight:600; color:#1e293b; line-height:1.5;"></div>' +
        '</div>' +
        '<div style="padding:10px 14px; border-radius:10px; background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.25); margin-bottom:18px; font-size:12px; color:#0c4a6e; line-height:1.5;">' +
          '💡 <strong>Совет:</strong> обновляй статус, когда меняется фокус твоей работы. Это твоя актуальная «визитная карточка».' +
        '</div>' +
        '<div id="status-saved-indicator" style="display:none; text-align:center; font-size:13px; color:#16a34a; font-weight:600; margin-bottom:12px;">' +
          '✅ Ответ сохранён!' +
        '</div>' +
        '<div class="actions-row" style="display:flex; gap:10px; justify-content:center; flex-wrap:nowrap;">' +
          '<button class="btn secondary" id="btn-status-save-modal" style="height:44px; padding:0 20px; font-size:14px; border-radius:999px; background:#f1f5f9; color:#475569; border:1px solid #e2e8f0; font-weight:600; cursor:pointer;">' +
            '💾 Сохранить ответ' +
          '</button>' +
          '<button class="btn" id="btn-status-next-modal" style="height:44px; padding:0 28px; font-size:14px; border-radius:999px; background:linear-gradient(135deg,#22c55e,#16a34a); color:#fff; border:none; font-weight:700; cursor:pointer; box-shadow:0 4px 12px rgba(34,197,94,0.35);">' +
            'Далее →' +
          '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(successModal);

    // Кнопка «Сохранить ответ» в модалке
    document.getElementById('btn-status-save-modal').addEventListener('click', function() {
      var role = roleInput.value.trim();
      var spec = specInput.value.trim();
      var focus = focusInput.value.trim();
      var fullStatus = role + ' | ' + spec + ' · ' + focus;

      localStorage.setItem('nc_status', JSON.stringify({
        role: role, spec: spec, focus: focus, full: fullStatus
      }));
      localStorage.setItem('nc_status_confirmed', '1');

      var ind = document.getElementById('status-saved-indicator');
      if (ind) {
        ind.style.display = 'block';
        setTimeout(function() { ind.style.display = 'none'; }, 2500);
      }

      var btn = document.getElementById('btn-status-save-modal');
      if (btn) {
        var orig = btn.innerHTML;
        btn.innerHTML = '✅ Сохранено';
        btn.disabled = true;
        setTimeout(function() {
          btn.innerHTML = orig;
          btn.disabled = false;
        }, 2000);
      }

      console.log('✅ Статус сохранён:', fullStatus);
    });

    // Кнопка «Далее» в модалке
    document.getElementById('btn-status-next-modal').addEventListener('click', function() {
      // Автосохранение перед переходом
      var role = roleInput.value.trim();
      var spec = specInput.value.trim();
      var focus = focusInput.value.trim();
      var fullStatus = role + ' | ' + spec + ' · ' + focus;
      localStorage.setItem('nc_status', JSON.stringify({
        role: role, spec: spec, focus: focus, full: fullStatus
      }));

      successModal.classList.remove('active');
      showScreen('screen-21');
    });
  }

  // Кнопка «Установить статус»
  btnSet.addEventListener('click', function() {
    var role = roleInput.value.trim();
    var spec = specInput.value.trim();
    var focus = focusInput.value.trim();

    // Валидация
    var errors = [];
    [roleInput, specInput, focusInput].forEach(function(el) {
      el.classList.remove('error');
    });

    if (role.length < 3) { errors.push('Роль/Сфера'); roleInput.classList.add('error'); }
    if (spec.length < 3) { errors.push('Специализация'); specInput.classList.add('error'); }
    if (focus.length < 3) { errors.push('Фокус/Интерес'); focusInput.classList.add('error'); }

    if (errors.length > 0) {
      if (inlineFeedback) {
        inlineFeedback.style.display = 'block';
        inlineFeedback.style.background = 'rgba(239,68,68,0.08)';
        inlineFeedback.style.border = '1px solid rgba(239,68,68,0.3)';
        inlineFeedback.style.color = '#dc2626';
        inlineFeedback.innerHTML = '⚠️ Заполни все поля: <strong>' + errors.join(', ') + '</strong>';
      }
      return;
    }

    // Собираем статус
    var fullStatus = role + ' | ' + spec + ' · ' + focus;

    // Показываем превью
    if (preview && previewText) {
      previewText.textContent = fullStatus;
      preview.style.display = 'block';
    }

    // Скрываем форму, показываем кнопку «Ещё раз»
    if (form) form.style.display = 'none';
    btnSet.style.display = 'none';
    if (btnRetry) btnRetry.style.display = 'inline-flex';

    // Сохраняем
    localStorage.setItem('nc_status', JSON.stringify({
      role: role, spec: spec, focus: focus, full: fullStatus
    }));

    // Награда
    if (!state.statusRewarded) {
      addScore(3);
      state.statusRewarded = true;
    }

    // Обновляем текст в модалке и открываем её
    var modalText = document.getElementById('status-preview-modal-text');
    if (modalText) modalText.textContent = fullStatus;

    setTimeout(function() {
      successModal.classList.add('active');
    }, 800);
  });

  // Кнопка «Ещё раз»
  if (btnRetry) {
    btnRetry.addEventListener('click', function() {
      if (form) form.style.display = 'block';
      if (preview) preview.style.display = 'none';
      if (inlineFeedback) inlineFeedback.style.display = 'none';
      btnSet.style.display = 'inline-flex';
      btnRetry.style.display = 'none';
    });
  }
}

// ===== Экран 21: Стикеры =====
function initProfileAndSticky() {
  var screen = document.getElementById('screen-21');
  if (!screen) return;
  if (screen.dataset.inited === '1') return;
  screen.dataset.inited = '1';

  var board = document.getElementById('sticky-board');
  var input = document.getElementById('sticky-input');
  var addBtn = document.getElementById('btn-sticky-add');
  var btnNext = document.getElementById('btn-sticky-next');
  var deleteModal = document.getElementById('sticky-delete-modal');
  var deleteCancel = document.getElementById('sticky-delete-cancel');
  var deleteConfirm = document.getElementById('sticky-delete-confirm');
  var myStickEl = document.getElementById('my-sticky-preview');
  var stickyToDelete = null;

  if (!board || !input || !addBtn) {
    console.warn('initProfileAndSticky: элементы не найдены');
    return;
  }

  function escapeHtmlLocal(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function loadMySticky() {
    var saved = localStorage.getItem('nc_my_sticky');
    if (!saved || !myStickEl) return;
    try {
      var data = JSON.parse(saved);
      myStickEl.style.display = 'block';
      var txtEl = myStickEl.querySelector('.my-sticky-text');
      if (txtEl) txtEl.textContent = data.text;
    } catch(e) {}
  }

  function loadStickies() {
    if (!_sb) {
      console.warn('Supabase не подключён — стикеры не загружаем');
      return;
    }
    _sb
      .from('stickies')
      .select('*')
      .eq('screen', 'screen-21')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(function(result) {
        if (result.error) { console.error('Ошибка загрузки стикеров:', result.error); return; }
        board.innerHTML = '';
        (result.data || []).forEach(function(row) {
          board.appendChild(createStickyEl(row));
        });
        console.log('✅ Загружено стикеров:', (result.data || []).length);
      });
  }

  function createStickyEl(row) {
    var sticky = document.createElement('div');
    sticky.className = 'sticky';
    sticky.dataset.id = row.id;
    sticky.dataset.text = row.text;
    sticky.innerHTML =
      '<button class="sticky-delete" title="Удалить стикер">✕</button>' +
      '<div>' + escapeHtmlLocal(row.text) + '</div>' +
      '<div class="sticky-footer">' +
        '<span style="opacity:0.7;">' + escapeHtmlLocal(row.author || 'Аноним') + '</span>' +
        '<span class="like-count" data-likes="' + (row.likes || 0) + '">♥ ' + (row.likes || 0) + '</span>' +
      '</div>';
    return sticky;
  }

  // ===== Удаление =====
  board.addEventListener('click', function(e) {
    var deleteBtn = e.target.closest('.sticky-delete');
    if (!deleteBtn) return;
    e.stopPropagation();
    stickyToDelete = deleteBtn.closest('.sticky');
    if (stickyToDelete && deleteModal) {
      deleteModal.classList.add('active');
    }
  });

  if (deleteCancel) {
    deleteCancel.addEventListener('click', function() {
      stickyToDelete = null;
      deleteModal.classList.remove('active');
    });
  }

  if (deleteModal) {
    deleteModal.addEventListener('click', function(e) {
      if (e.target === deleteModal) {
        stickyToDelete = null;
        deleteModal.classList.remove('active');
      }
    });
  }

  if (deleteConfirm) {
    deleteConfirm.addEventListener('click', function() {
      if (!stickyToDelete) {
        if (deleteModal) deleteModal.classList.remove('active');
        return;
      }
      var elToRemove = stickyToDelete;
      var stickyId = elToRemove.dataset.id;
      stickyToDelete = null;
      deleteModal.classList.remove('active');

      elToRemove.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      elToRemove.style.opacity = '0';
      elToRemove.style.transform = 'scale(0.8)';
      setTimeout(function() {
        if (elToRemove && elToRemove.parentNode) elToRemove.remove();
      }, 300);

      if (_sb && stickyId) {
        _sb.from('stickies').delete().eq('id', stickyId)
          .then(function(result) {
            if (result.error) console.error('Ошибка удаления:', result.error);
          });
      }
    });
  }

  // ===== Модалка успеха =====
  var successModal = document.getElementById('sticky-success-modal');
  if (!successModal) {
    successModal = document.createElement('div');
    successModal.id = 'sticky-success-modal';
    successModal.className = 'modal-overlay';
    successModal.innerHTML =
      '<div class="modal" style="max-width:460px;">' +
        '<div style="text-align:center; font-size:48px; margin-bottom:8px;">📌</div>' +
        '<h3 style="text-align:center; font-size:20px; color:#16a34a; margin-bottom:10px;">Стикер добавлен на доску!</h3>' +
        '<p style="font-size:14px; color:#475569; line-height:1.6; text-align:center; margin-bottom:14px;">' +
          'Отлично! Твоя самопрезентация теперь видна другим участникам курса.' +
        '</p>' +
        '<div id="sticky-modal-preview" style="background:linear-gradient(135deg,#fef9c3,#fde68a); border:1.5px solid #facc15; border-radius:12px; padding:14px 16px; margin-bottom:16px; font-size:13px; color:#713f12; line-height:1.5; font-weight:500; box-shadow: 0 2px 8px rgba(250,204,21,0.25);"></div>' +
        '<div style="padding:10px 14px; border-radius:10px; background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.25); margin-bottom:18px; font-size:12px; color:#0c4a6e; line-height:1.5;">' +
          '💡 <strong>Совет:</strong> обновляй свой стикер, когда меняется фокус или появляется новая «фишка» в работе.' +
        '</div>' +
        '<div style="display:flex; gap:10px; justify-content:center; flex-wrap:nowrap;">' +
          '<button class="btn secondary" id="btn-sticky-edit-modal" style="height:42px; padding:0 20px; font-size:13px; border-radius:999px; background:#f1f5f9; color:#475569; border:1px solid #e2e8f0; font-weight:600; cursor:pointer;">' +
            '✏️ Редактировать' +
          '</button>' +
          '<button class="btn" id="btn-sticky-next-modal" style="height:42px; padding:0 26px; font-size:14px; border-radius:999px; background:linear-gradient(135deg,#22c55e,#16a34a); color:#fff; border:none; font-weight:700; cursor:pointer; box-shadow:0 4px 12px rgba(34,197,94,0.35);">' +
            'Далее →' +
          '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(successModal);

    document.getElementById('btn-sticky-edit-modal').addEventListener('click', function() {
      successModal.classList.remove('active');
    });

    document.getElementById('btn-sticky-next-modal').addEventListener('click', function() {
      successModal.classList.remove('active');
      showScreen('screen-21-0');
    });
  }

  // ===== Добавление стикера =====
  addBtn.addEventListener('click', function() {
    var text = input.value.trim();
    if (!text) {
      input.style.borderColor = '#ef4444';
      setTimeout(function() { input.style.borderColor = ''; }, 1500);
      return;
    }

    localStorage.setItem('nc_my_sticky', JSON.stringify({ text: text }));

    if (myStickEl) {
      myStickEl.style.display = 'block';
      var txtEl = myStickEl.querySelector('.my-sticky-text');
      if (txtEl) txtEl.textContent = text;
    }

    function openSuccessModal(finalText) {
      var modalPrev = document.getElementById('sticky-modal-preview');
      if (modalPrev) modalPrev.textContent = '«' + finalText + '»';
      setTimeout(function() {
        successModal.classList.add('active');
      }, 400);
    }

    if (_sb) {
      _sb
        .from('stickies')
        .insert({ screen: 'screen-21', text: text, author: 'Участник', likes: 0 })
        .select()
        .then(function(result) {
          if (result.error) { console.error('Ошибка сохранения:', result.error); return; }
          if (result.data && result.data.length > 0) {
            board.insertBefore(createStickyEl(result.data[0]), board.firstChild);
          }
          var allStickies = board.querySelectorAll('.sticky');
          if (allStickies.length > 20) {
            var oldest = allStickies[allStickies.length - 1];
            var oldestId = oldest.dataset.id;
            oldest.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            oldest.style.opacity = '0';
            oldest.style.transform = 'scale(0.7)';
            setTimeout(function() {
              if (oldest && oldest.parentNode) oldest.remove();
            }, 400);
            if (_sb && oldestId) {
              _sb.from('stickies').delete().eq('id', oldestId)
                .then(function(r) {
                  if (r.error) console.error('Ошибка удаления старого:', r.error);
                });
            }
          }
          addScore(1);
          input.value = '';
          openSuccessModal(text);
        });
    } else {
      var fallback = { id: Date.now(), text: text, author: 'Ты', likes: 0 };
      board.insertBefore(createStickyEl(fallback), board.firstChild);
      addScore(1);
      input.value = '';
      openSuccessModal(text);
    }
  });

  // ===== Лайки =====
  board.addEventListener('click', function(e) {
    if (e.target.closest('.sticky-delete')) return;
    var target = e.target.closest('.like-count');
    if (!target) return;
    var sticky = target.closest('.sticky');
    var id = sticky ? sticky.dataset.id : null;
    var likes = parseInt(target.dataset.likes || '0', 10) + 1;
    target.dataset.likes = String(likes);
    target.textContent = '♥ ' + likes;
    if (_sb && id) {
      _sb.from('stickies').update({ likes: likes }).eq('id', id)
        .then(function(r) { if (r.error) console.error(r.error); });
    }
  });

  // ===== Realtime =====
  if (_sb) {
    try {
      _sb
        .channel('stickies-realtime')
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'stickies',
          filter: 'screen=eq.screen-21'
        }, function(payload) {
          if (board.querySelector('[data-id="' + payload.new.id + '"]')) return;
          board.insertBefore(createStickyEl(payload.new), board.firstChild);
        })
        .on('postgres_changes', {
          event: 'UPDATE', schema: 'public', table: 'stickies'
        }, function(payload) {
          var el = board.querySelector('[data-id="' + payload.new.id + '"]');
          if (!el) return;
          var lc = el.querySelector('.like-count');
          if (lc) {
            lc.dataset.likes = String(payload.new.likes);
            lc.textContent = '♥ ' + payload.new.likes;
          }
        })
        .on('postgres_changes', {
          event: 'DELETE', schema: 'public', table: 'stickies'
        }, function(payload) {
          var el = board.querySelector('[data-id="' + payload.old.id + '"]');
          if (el) {
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            el.style.opacity = '0';
            el.style.transform = 'scale(0.8)';
            setTimeout(function() { el.remove(); }, 300);
          }
        })
        .subscribe();
    } catch(e) {
      console.warn('Realtime не подключился:', e);
    }
  }

  loadStickies();
  loadMySticky();

  if (typeof initStickyTooltip === 'function') {
    initStickyTooltip();
  }
}

// ===== Глобальный тултип для стикеров =====
function initStickyTooltip() {
  var tooltip = document.getElementById('sticky-tooltip');
  if (!tooltip) return;
  if (tooltip.dataset.inited === '1') return;
  tooltip.dataset.inited = '1';

  var currentTarget = null;

  document.addEventListener('mouseover', function(e) {
    var sticky = e.target.closest('.sticky');
    if (!sticky) return;
    if (e.target.closest('.sticky-delete')) return;
    var text = sticky.dataset.text;
    if (!text) return;
    currentTarget = sticky;
    tooltip.textContent = text;
    tooltip.classList.add('visible');
    positionTooltip(e);
  });

  document.addEventListener('mousemove', function(e) {
    if (!currentTarget) return;
    positionTooltip(e);
  });

  document.addEventListener('mouseout', function(e) {
    var sticky = e.target.closest('.sticky');
    if (!sticky) return;
    currentTarget = null;
    tooltip.classList.remove('visible');
  });

  function positionTooltip(e) {
    var x = e.clientX;
    var y = e.clientY;
    var tw = tooltip.offsetWidth;
    var th = tooltip.offsetHeight;
    var vw = window.innerWidth;

    var left = x - tw / 2;
    var top = y - th - 14;

    if (left + tw > vw - 10) left = vw - tw - 10;
    if (left < 10) left = 10;
    if (top < 10) top = y + 18;

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }
}


// ===== Экран 21-1: Сумочка нетворкера =====
// ===== Экран 21-1: Сумочка нетворкера =====
function initBag() {
  var screen = document.getElementById('screen-21-1');
  if (!screen) return;
  if (screen.dataset.inited === '1') return;
  screen.dataset.inited = '1';

  console.log('🎒 initBag: старт');

  // ===== ПРАВИЛЬНЫЕ ПРЕДМЕТЫ =====
  var correctItems = [
    { name: 'Визитница', img: 'https://i.ibb.co/Z6Cpr5wM/image.png', text: 'Это не та визитница, которая находится в левом внутреннем кармане пиджака или блейзера. Это запасная визитница — неприкосновенный запас, пользоваться которым нужно в случае крайней необходимости.' },
    { name: 'Ручка', img: 'https://i.ibb.co/pttqb8S/1.png', text: 'Всегда имей при себе запасную ручку, а лучше две. Идеально, если они именные или корпоративные.' },
    { name: 'Записная книжка', img: 'https://i.ibb.co/7xtcQfFK/image.png', text: 'Понадобится для записей мыслей в дороге, во время семинаров или конференций.' },
    { name: 'Салфетки', img: 'https://i.ibb.co/jv0Lw5fN/1.png', text: 'Частые переезды, десятки рукопожатий в день, регулярные кофе-брейки. Влажные салфетки незаменимы.' },
    { name: 'Пятновыводитель', img: 'https://i.ibb.co/8ggVDc4Z/image.png', text: 'Порой случается этот неловкий момент, когда приятный кофе-брейк заканчивается пятном на сорочке.' },
    { name: 'Аптечка', img: 'https://i.ibb.co/FL4zkrHF/image.png', text: 'Частые переезды и длительные конференции выматывают. Возьми средства от головной боли, давления и для пищеварения.' },
    { name: 'Мятные конфеты', img: 'https://i.ibb.co/99kG2qvJ/1.png', text: 'Убедись, что после кофе-брейка с тобой приятно общаться. Свежесть дыхания облегчает понимание.' },
    { name: 'Зарядное устройство', img: 'https://i.ibb.co/LdBxNkkf/image.png', text: 'Универсальное зарядное устройство — гаджет размером с визитницу. Выручает при каждой поездке.' }
  ];

  // ===== НЕПРАВИЛЬНЫЕ ПРЕДМЕТЫ =====
  var wrongItems = [
    { name: 'Ноутбук', img: 'https://i.ibb.co/xS0cKzyG/1cc21ffc81d4b5d70623eb2976a6d5a6-c2a86506-bc52-483b-a8ff-b3390a6a3344-1.png', text: 'На конференциях редко удаётся поработать за ноутбуком.', wrongReason: 'Ноутбук слишком громоздкий и отвлекает от нетворкинга. На мероприятии главное — живое общение.' },
    { name: 'Наушники большие', img: 'https://i.ibb.co/FLNCx1FH/e622c2eff3c16540aed9f07dc80c98f7-748d3f2c-a562-4ed5-a2b8-a57857f2b0d7-1.png', text: 'Большие накладные наушники — сигнал «не подходите ко мне».', wrongReason: 'Наушники создают барьер для общения. Если нужна музыка в дороге — возьми компактные вкладыши.' }
  ];

  var allItems = correctItems.concat(wrongItems);
  var CORRECT_COUNT = correctItems.length;

  var shelfVisual = document.getElementById('bag-shelf-visual');
  var bagInside   = document.getElementById('bag-inside');
  var modal       = document.getElementById('bag-modal');
  var mTitle      = document.getElementById('bag-modal-title');
  var mText       = document.getElementById('bag-modal-text');
  var mImg        = document.getElementById('bag-modal-img');
  var mTakeOld    = document.getElementById('bag-modal-take');
  var mSkipOld    = document.getElementById('bag-modal-skip');
  var doneMsg     = document.getElementById('bag-done-msg');
  var btnGo       = document.getElementById('btn-bag-go');

  if (!shelfVisual || !bagInside) {
    console.warn('initBag: shelf или bag-inside не найдены');
    return;
  }

  // ===== ВАЖНО: клонируем кнопки модалки чтобы сбросить старые обработчики =====
  var mTake = mTakeOld;
  var mSkip = mSkipOld;
  if (mTakeOld) {
    var newTake = mTakeOld.cloneNode(true);
    mTakeOld.parentNode.replaceChild(newTake, mTakeOld);
    mTake = newTake;
  }
  if (mSkipOld) {
    var newSkip = mSkipOld.cloneNode(true);
    mSkipOld.parentNode.replaceChild(newSkip, mSkipOld);
    mSkip = newSkip;
  }

  if (btnGo) btnGo.style.display = 'none';

  var currentIdx = -1;
  var takenCorrect = 0;

  // ===== Предметы на полке =====
  shelfVisual.innerHTML = '';
  var shuffled = allItems.map(function(it, idx) {
    return { item: it, originalIdx: idx };
  }).sort(function() { return Math.random() - 0.5; });

  // При drag&drop: для неправильных — сразу handleDrop (покажет модалку "лишнее"),
  // для правильных — показываем модалку с описанием
  function showItemModalOrDrop(idx) {
    if (idx >= CORRECT_COUNT) {
      handleDrop(idx); // неправильный — сразу модалка "это лишнее"
    } else {
      showItemModal(idx); // правильный — модалка с описанием + кнопка "Положить в сумку"
    }
  }
  
  // Показ модалки с описанием предмета
  function showItemModal(idx) {
    if (idx < 0 || idx >= allItems.length) return;
    var item = allItems[idx];
    var shelfEl = shelfVisual.querySelector('[data-idx="' + idx + '"]');
    if (!shelfEl || shelfEl.classList.contains('taken')) return;

    currentIdx = idx;
    if (mImg) mImg.src = item.img;
    if (mTitle) mTitle.textContent = item.name;
    if (mText) mText.textContent = item.text;
    if (mTake) {
      mTake.style.display = 'inline-flex';
      mTake.textContent = 'Положить в сумку';
    }
    if (mSkip) {
      mSkip.style.display = 'inline-flex';
      mSkip.textContent = 'Понятно';
    }
    if (modal) modal.classList.add('active');
  }
  
 // Функция обработки "дропа" предмета в сумку
  function handleDrop(idx) {
    if (idx < 0 || idx >= allItems.length) return;
    var item = allItems[idx];
    var shelfEl = shelfVisual.querySelector('[data-idx="' + idx + '"]');
    if (!shelfEl || shelfEl.classList.contains('taken')) return;

    var isWrong = idx >= CORRECT_COUNT;

    // НЕПРАВИЛЬНЫЙ — модалка "это лишнее"
    if (isWrong) {
      var wTitle = document.getElementById('bag-wrong-title');
      var wText = document.getElementById('bag-wrong-text');
      if (wTitle) wTitle.textContent = '🤔 «' + item.name + '» — это лишнее!';
      if (wText) wText.textContent = item.wrongReason;
      wrongModal.classList.add('active');
      // shake эффект
      shelfEl.style.transition = 'transform 0.2s ease';
      shelfEl.style.transform = 'translateX(-6px)';
      setTimeout(function(){ shelfEl.style.transform='translateX(6px)'; setTimeout(function(){ shelfEl.style.transform=''; },150); },150);
      return;
    }

    // ПРАВИЛЬНЫЙ — кладём в сумку + показываем модалку с описанием
    shelfEl.classList.add('taken');
    var bagEl = document.createElement('div');
    bagEl.className = 'bag-item-inside';
    bagEl.innerHTML = '<img src="' + item.img + '" alt="' + item.name + '">';
    var positions = [
      { left:'22%', top:'8%' },{ left:'38%', top:'5%' },{ left:'52%', top:'8%' },
      { left:'10%', top:'30%' },{ left:'28%', top:'30%' },{ left:'44%', top:'30%' },
      { left:'62%', top:'30%' },{ left:'18%', top:'53%' }
    ];
    var pos = positions[idx] || { left:'45%', top:'45%' };
    bagEl.style.left = pos.left;
    bagEl.style.top = pos.top;
   bagInside.appendChild(bagEl);
    takenCorrect++;
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ bagEl.classList.add('dropped'); }); });

    if (takenCorrect >= CORRECT_COUNT) {
      setTimeout(function() {
        if (doneMsg) doneMsg.style.display = 'block';
        if (typeof addScore === 'function') addScore(2);
        setTimeout(function() {
          if (modal) modal.classList.remove('active');
          finalModal.classList.add('active');
        }, 1500);
      }, 400);
    }
  } 

  // Создаём предметы с DRAG & DROP
  shuffled.forEach(function(entry) {
    var item = entry.item;
    var i = entry.originalIdx;
    var el = document.createElement('div');
    el.className = 'bag-item-visual';
    el.dataset.idx = i;
    el.setAttribute('draggable', 'true');
    el.style.cursor = 'grab';
    el.innerHTML =
      '<img src="' + item.img + '" alt="' + item.name + '" draggable="false">' +
      '<span>' + item.name + '</span>';
     // КЛИК — открываем модалку с описанием
    el.addEventListener('click', function(e) {
      if (el.classList.contains('taken')) return;
      currentIdx = i;
      if (mImg) mImg.src = item.img;
      if (mTitle) mTitle.textContent = item.name;
      if (mText) mText.textContent = item.text;
      if (mTake) {
        mTake.style.display = 'inline-flex';
        mTake.textContent = 'Положить в сумку';
      }
    if (mSkip) mSkip.style.display = 'none';
      if (modal) modal.classList.add('active');
    });

    // DESKTOP drag
    el.addEventListener('dragstart', function(e) {
      if (el.classList.contains('taken')) { e.preventDefault(); return; }
      el.classList.add('dragging');
      el.style.opacity = '0.4';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(i));
    });
    el.addEventListener('dragend', function() {
      el.classList.remove('dragging');
      el.style.opacity = '';
    });

    // MOBILE touch
    var ghost = null, startX = 0, startY = 0, moved = false;
    el.addEventListener('touchstart', function(e) {
      if (el.classList.contains('taken')) return;
      var t = e.touches[0];
      startX = t.clientX; startY = t.clientY; moved = false;
      ghost = el.cloneNode(true);
      ghost.style.cssText = 'position:fixed;left:'+(t.clientX-32)+'px;top:'+(t.clientY-40)+'px;z-index:99999;opacity:0.85;pointer-events:none;transform:scale(1.1);box-shadow:0 8px 24px rgba(0,0,0,0.25);';
      document.body.appendChild(ghost);
      el.style.opacity = '0.4';
    }, { passive: true });
    el.addEventListener('touchmove', function(e) {
      if (!ghost) return;
      var t = e.touches[0];
      if (Math.abs(t.clientX-startX)>5 || Math.abs(t.clientY-startY)>5) moved = true;
      ghost.style.left = (t.clientX-32)+'px';
      ghost.style.top = (t.clientY-40)+'px';
      e.preventDefault();
    }, { passive: false });
    el.addEventListener('touchend', function(e) {
      if (!ghost) return;
      var t = e.changedTouches[0];
      var target = document.elementFromPoint(t.clientX, t.clientY);
      ghost.remove(); ghost = null;
      el.style.opacity = '';
      if (moved && target) {
        var zone = target;
        while (zone && zone !== document.body) {
          if (zone.classList && (zone.classList.contains('bag-visual') || zone.id === 'bag-inside' || zone.classList.contains('bag-item-inside'))) {
            showItemModalOrDrop(i);
            return;
          }
          zone = zone.parentNode;
        }
      }
    });

    shelfVisual.appendChild(el);
  });

  // DROP ZONE — сумка
  var bagVisual = document.querySelector('#screen-21-1 .bag-visual');
  function setupDropZone(zone) {
    if (!zone) return;
    zone.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      zone.classList.add('drag-over-bag');
    });
    zone.addEventListener('dragleave', function(e) {
      if (!zone.contains(e.relatedTarget)) zone.classList.remove('drag-over-bag');
    });
    zone.addEventListener('drop', function(e) {
      e.preventDefault();
      zone.classList.remove('drag-over-bag');
      var idx = parseInt(e.dataTransfer.getData('text/plain'), 10);
      if (!isNaN(idx)) showItemModalOrDrop(idx);
    });
  }
  setupDropZone(bagVisual);
  setupDropZone(bagInside);

  // ===== Финальная модалка =====
  var finalModal = document.getElementById('bag-final-modal');
  if (!finalModal) {
    finalModal = document.createElement('div');
    finalModal.id = 'bag-final-modal';
    finalModal.className = 'modal-overlay';
    finalModal.innerHTML =
      '<div class="modal" style="max-width:440px; text-align:center;">' +
        '<div style="font-size:56px; margin-bottom:10px;">🎒</div>' +
        '<h3 style="font-size:20px; color:#16a34a; margin-bottom:10px;">Сумка собрана!</h3>' +
        '<p style="font-size:14px; color:#475569; line-height:1.6; margin-bottom:14px;">Ты справился(ась) с выбором! Теперь твоя сумка укомплектована всем необходимым.</p>' +
        '<button id="btn-bag-final-continue" style="height:44px; padding:0 32px; font-size:14px; font-weight:700; border-radius:999px; background:linear-gradient(135deg,#22c55e,#16a34a); color:#fff; border:none; cursor:pointer; box-shadow:0 4px 12px rgba(34,197,94,0.35);">Продолжить →</button>' +
      '</div>';
    document.body.appendChild(finalModal);
   document.getElementById('btn-bag-final-continue').addEventListener('click', function() {
  finalModal.classList.remove('active');
  // Показываем кнопку "Далее" на самом экране
  var btnGoNow = document.getElementById('btn-bag-go');
  if (btnGoNow) {
    btnGoNow.style.display = 'inline-flex';
  }
});
  }

  // ===== Модалка "это лишнее" =====
  var wrongModal = document.getElementById('bag-wrong-modal');
  if (!wrongModal) {
    wrongModal = document.createElement('div');
    wrongModal.id = 'bag-wrong-modal';
    wrongModal.className = 'modal-overlay';
    wrongModal.innerHTML =
      '<div class="modal" style="max-width:420px; text-align:center;">' +
        '<div style="font-size:48px; margin-bottom:8px;">🤔</div>' +
        '<h3 id="bag-wrong-title" style="font-size:18px; color:#dc2626; margin-bottom:10px;">Это лишнее!</h3>' +
        '<p id="bag-wrong-text" style="font-size:13px; color:#475569; line-height:1.6; margin-bottom:18px;"></p>' +
        '<button id="btn-bag-wrong-ok" style="height:40px; padding:0 24px; font-size:13px; font-weight:700; border-radius:999px; background:linear-gradient(135deg,#f59e0b,#d97706); color:#fff; border:none; cursor:pointer; box-shadow:0 4px 12px rgba(245,158,11,0.35);">Понятно</button>' +
      '</div>';
    document.body.appendChild(wrongModal);
    document.getElementById('btn-bag-wrong-ok').addEventListener('click', function() {
      wrongModal.classList.remove('active');
    });
  }

  // КНОПКА "ПОЛОЖИТЬ В СУМКУ" — работает через handleDrop
  if (mTake) {
    mTake.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (currentIdx < 0) return;
      var idxToPlace = currentIdx;
      currentIdx = -1;
      if (modal) modal.classList.remove('active');
      setTimeout(function() {
        handleDrop(idxToPlace);
      }, 100);
    });
  }

  // ===== КНОПКА "ЗАКРЫТЬ" =====
  if (mSkip) {
    mSkip.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (modal) modal.classList.remove('active');
      currentIdx = -1;
    });
  }

  // Клик вне модалки
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
        currentIdx = -1;
      }
    });
  }

  // Кнопка "Далее" в плеере
  if (btnGo) {
    var newBtnGo = btnGo.cloneNode(true);
    btnGo.parentNode.replaceChild(newBtnGo, btnGo);
    newBtnGo.addEventListener('click', function() {
      if (typeof showScreen === 'function') showScreen('screen-21-1-1');
    });
  }

  console.log('initBag: готов. Предметов:', allItems.length, 'правильных:', CORRECT_COUNT);
}

// ===== УНИВЕРСАЛЬНАЯ функция для карточек Златы =====
function initZlataCardUniversal(screenId, nextScreenId, activeIconIds) {
  var screen = document.getElementById(screenId);
  if (!screen) {
    console.warn('initZlataCardUniversal: экран не найден →', screenId);
    return;
  }

  if (screen.dataset.zlataCardInited === '1') return;
  screen.dataset.zlataCardInited = '1';

  // Ищем карточку и обёртку внутри экрана по классам
  var wrapper = screen.querySelector('.zlata-card-wrapper');
  var card = screen.querySelector('.zlata-card');

  if (!wrapper || !card) {
    console.warn('initZlataCardUniversal: карточка не найдена на', screenId);
    return;
  }

  // Собираем все активные иконки (может быть несколько: лицевая + обратная)
  var activeIcons = [];
  if (activeIconIds && Array.isArray(activeIconIds)) {
    activeIconIds.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) activeIcons.push(el);
    });
  }
  // Fallback — все .zlata-inv-item.active на экране
  if (activeIcons.length === 0) {
    screen.querySelectorAll('.zlata-inv-item.active').forEach(function(el) {
      activeIcons.push(el);
    });
  }

  // Клик по обёртке → переворот (кроме кликов по активным иконкам)
  wrapper.addEventListener('click', function(e) {
    // Если клик по любой активной иконке — не переворачиваем
    for (var i = 0; i < activeIcons.length; i++) {
      if (activeIcons[i] === e.target || activeIcons[i].contains(e.target)) {
        return;
      }
    }
    card.classList.toggle('flipped');
    console.log('Карточка перевёрнута на', screenId);
  });

  // Клик по активной иконке → переход
  activeIcons.forEach(function(icon) {
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('Клик по активной иконке на', screenId, '→', nextScreenId);
      showScreen(nextScreenId);
    });
  });

  console.log('✅ initZlataCardUniversal готов:', screenId, '→', nextScreenId, '| иконок:', activeIcons.length);
}

// ===== Экран 17-1: после SMART → к визитке =====
function initZlataCard17() {
  initZlataCardUniversal('screen-17-1', 'screen-19', ['inv-bizcard-17', 'inv-bizcard-17-back']);
}

// ===== Экран 19-1: после визитки → к фото =====
function initZlataCard19() {
  initZlataCardUniversal('screen-19-1', 'screen-20', ['inv-phone-19', 'inv-phone-19-back']);
}

// ===== Экран 21-0: после стикеров → к сумке =====
function initZlataCard21() {
  initZlataCardUniversal('screen-21-0', 'screen-21-1', ['inv-bag-21', 'inv-bag-21-back']);
}

// ===== Экран 21-1-1: после сумки → к карте =====
function initZlataCard211() {
  initZlataCardUniversal('screen-21-1-1', 'screen-zlata-ready', ['inv-map-211', 'inv-map-211-back']);
}

// ===== Экран 21-2: Карта =====
function initVenueMap() {
  var screen = document.getElementById('screen-21-2');
  if (!screen) return;
  if (screen.dataset.inited === '1') return;
  screen.dataset.inited = '1';

  var objects = screen.querySelectorAll('.venue-obj');
  var counter = document.getElementById('venue-counter');
  var successMsg = document.getElementById('venue-success');
  var lifehack = document.getElementById('venue-lifehack');
  var btnNext = document.getElementById('btn-venue-next');
  var modal = document.getElementById('venue-modal');
  var modalTitle = document.getElementById('venue-modal-title');
  var modalText = document.getElementById('venue-modal-text');
  var modalOk = document.getElementById('venue-modal-ok');

  if (!objects.length) {
    console.warn('initVenueMap: объекты не найдены');
    return;
  }

  // СКРЫВАЕМ старую кнопку «Далее» в нижней панели — теперь она в модалке
  if (btnNext) btnNext.style.display = 'none';

  // Данные по каждому объекту (индекс = data-obj)
  var venueData = [
    { // 0 — Гардероб
      good: true,
      title: '🧥 Гардероб',
      text: 'Отличное место! Люди расслаблены, никуда не спешат, снимают пальто — есть пауза для «Привет, ты тоже впервые здесь?». Короткая реплика может перейти в разговор.'
    },
    { // 1 — Ресепшен
      good: false,
      title: '🎫 Ресепшен',
      text: 'Неподходящее место. Люди заняты регистрацией, думают о бейджах и программе. Они сосредоточены на процессе — знакомиться не настроены.'
    },
    { // 2 — Организатор
      good: false,
      title: '📋 Организатор',
      text: 'Не лучшее место. Организаторы всегда заняты и решают рабочие вопросы. Если и общаться — то коротко, по делу.'
    },
    { // 3 — Напитки (Бар) ⭐
      good: true,
      title: '🍹 Зона с напитками',
      text: 'Отличное место! Классика нетворкинга. Люди расслаблены, стоят с бокалами, ждут своей очереди. Отличный повод: «Что посоветуете из безалкогольного?» или «Как кофе?» — и разговор пошёл.'
    },
    { // 4 — Еда ⭐
      good: true,
      title: '🍱 Столик с едой',
      text: 'Отличное место! Здесь работает закон «одной очереди»: люди выбирают, комментируют, шутят. Легко начать: «О, вы тоже берёте это? Рекомендую!». Метод «Корова на выпасе» — ходи сюда несколько раз, каждый поход даёт новый повод для разговора.'
    },
    { // 5 — Столик с закусками
      good: false,
      title: '🍽️ Столик с закусками',
      text: 'Осторожно! Если человек уже с тарелкой — ему неудобно есть и разговаривать одновременно. Лучше подойти до еды, а не во время.'
    },
    { // 6 — Давний знакомый ⭐
      good: true,
      title: '👋 Давний знакомый',
      text: 'Отличная точка входа! Через знакомого легче войти в группу: «Привет! Кстати, ты не знакома с...?» — и вот ты уже в разговоре с новыми людьми. Это самый безопасный способ нетворкинга.'
    },
    { // 7 — Туалеты
      good: false,
      title: '🚻 Туалеты',
      text: 'Точно нет. Не лучшее место для знакомств по понятным причинам. Люди спешат и меньше всего готовы к диалогу.'
    }
  ];

  var foundCount = 0;
  var totalGood = 3; // 3 правильные точки: напитки, еда, давний знакомый
  var clickedIds = {};

  // ===== Создаём финальную модалку с кнопкой "Далее" =====
  var finalModal = document.getElementById('venue-final-modal');
  if (!finalModal) {
    finalModal = document.createElement('div');
    finalModal.id = 'venue-final-modal';
    finalModal.className = 'modal-overlay';
    finalModal.innerHTML =
      '<div class="modal" style="max-width:480px; text-align:center;">' +
        '<div style="font-size:56px; margin-bottom:10px;">🗺️</div>' +
        '<h3 style="font-size:20px; color:#16a34a; margin-bottom:10px;">Ты нашёл(а) все благоприятные точки!</h3>' +
        '<p style="font-size:14px; color:#475569; line-height:1.6; margin-bottom:14px;">' +
          'Теперь ты знаешь, где происходит магия нетворкинга: <strong>зона напитков</strong>, <strong>столик с едой</strong> и <strong>давний знакомый</strong> как точка входа в группу.' +
        '</p>' +
        '<div style="padding:12px 14px; border-radius:12px; background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.25); margin-bottom:14px; font-size:13px; color:#166534; line-height:1.55; text-align:left;">' +
          '💡 <strong>Лайфхак: метод «Корова на выпасе»</strong><br>' +
          'Ходи к столу с едой или напитками несколько раз — каждый поход меняет твою позицию в зале и даёт новый повод познакомиться с новыми людьми.' +
        '</div>' +
        '<div style="padding:10px 14px; border-radius:10px; background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.25); margin-bottom:20px; font-size:12.5px; color:#0c4a6e; line-height:1.5; text-align:left;">' +
          '⚡ <strong>Помни три закона знакомства:</strong><br>' +
          '1. Человек не должен быть занят чем-то важным<br>' +
          '2. Должен быть естественный повод начать разговор<br>' +
          '3. Человек физически доступен (открытая поза)' +
        '</div>' +
        '<button id="btn-venue-final-continue" style="height:44px; padding:0 32px; font-size:14px; font-weight:700; border-radius:999px; background:linear-gradient(135deg,#22c55e,#16a34a); color:#fff; border:none; cursor:pointer; box-shadow:0 4px 12px rgba(34,197,94,0.35);">' +
          'Продолжить →' +
        '</button>' +
      '</div>';
    document.body.appendChild(finalModal);

    document.getElementById('btn-venue-final-continue').addEventListener('click', function() {
      finalModal.classList.remove('active');
      // Помечаем, что карту изучили
      localStorage.setItem('mapViewed', '1');
      if (typeof addScore === 'function') addScore(3);
      // Возврат на рабочий стол Златы
      if (typeof showScreen === 'function') showScreen('screen-10');
    });
  }

  function updateCounter() {
    if (counter) {
      counter.textContent = 'Найдено: ' + foundCount + ' из ' + totalGood + ' ⭐';
    }

    // Показать сообщение об успехе и лайфхак прямо на сцене
    if (foundCount >= totalGood) {
      if (successMsg) successMsg.style.display = 'block';
      if (lifehack) lifehack.style.display = 'block';

      // Открываем финальную модалку с небольшой задержкой
      setTimeout(function() {
        finalModal.classList.add('active');
      }, 800);
    }
  }

  // Обработчики клика на каждый объект
  objects.forEach(function(obj) {
    obj.style.cursor = 'pointer';

    obj.addEventListener('click', function() {
      var idx = parseInt(obj.dataset.obj, 10);
      var data = venueData[idx];
      if (!data) return;

      // Показываем модалку с описанием
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalText) modalText.textContent = data.text;
      if (modal) modal.classList.add('active');

      // Если это хорошая точка и ещё не отмечена
      if (data.good && !clickedIds[idx]) {
        clickedIds[idx] = true;
        foundCount++;

        // Визуально отмечаем
        obj.classList.add('venue-good');

        // Добавляем звёздочку
        if (!obj.querySelector('.venue-star')) {
          var star = document.createElement('div');
          star.className = 'venue-star';
          star.textContent = '⭐';
          star.style.cssText = 'position:absolute; top:-6px; right:-6px; font-size:18px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2)); animation:popIn 0.4s ease;';
          obj.style.position = 'relative';
          obj.appendChild(star);
        }

        updateCounter();
      } else if (!data.good && !clickedIds[idx]) {
        clickedIds[idx] = true;
        // Визуально помечаем как «ловушку»
        obj.classList.add('venue-bad');
      }
    });
  });

  // Закрытие модалки с описанием объекта
  if (modalOk) {
    modalOk.addEventListener('click', function() {
      if (modal) modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  updateCounter();
}
// ===== Экран zlata-ready =====
function initZlataReady() {
  var btn = document.getElementById('btn-zlata-ready-next');
  if (!btn) return;
  btn.addEventListener('click', function() {
    showScreen('screen-final');
  });
}

// ===== Генерация PDF с ответами =====
function generateAnswersPDF() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('Библиотека jsPDF не загружена. Проверь подключение в index.html');
    return;
  }

  var answers = {
    purpose: localStorage.getItem('nc_purpose_text') || '',
    fearStrategies: {},
    smartGoal: {},
    bizcard: {},
    status: {},
    mySticky: {}
  };

  try { answers.fearStrategies = JSON.parse(localStorage.getItem('nc_fear_strategies') || '{}'); } catch(e) {}
  try { answers.smartGoal = JSON.parse(localStorage.getItem('nc_smart_goal') || '{}'); } catch(e) {}
  try { answers.bizcard = JSON.parse(localStorage.getItem('nc_bizcard') || '{}'); } catch(e) {}
  try { answers.status = JSON.parse(localStorage.getItem('nc_status') || '{}'); } catch(e) {}
  try { answers.mySticky = JSON.parse(localStorage.getItem('nc_my_sticky') || '{}'); } catch(e) {}

  var pdfContent = document.createElement('div');
  pdfContent.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;padding:40px;background:#ffffff;font-family:Arial,sans-serif;color:#1e293b;line-height:1.5;box-sizing:border-box;';

  var html = '';

  html += '<div style="text-align:center;padding:40px 20px;background:linear-gradient(135deg,#a855f7,#7c3aed);color:#fff;border-radius:16px;margin-bottom:30px;">';
  html +=   '<div style="font-size:40px;margin-bottom:10px;">🎓</div>';
  html +=   '<h1 style="font-size:28px;font-weight:700;margin:0 0 8px;color:#fff;">Мои ответы</h1>';
  html +=   '<div style="font-size:16px;opacity:0.9;">Модуль 1: Основы нетворкинга</div>';
  html += '</div>';

  if (answers.purpose) {
    html += renderPdfSection('Моя цель нетворкинга', answers.purpose, '#3b82f6');
  }

  if (Object.keys(answers.fearStrategies).length > 0) {
    var fearLabels = {
      say: 'Не знаю, что сказать',
      reject: 'Меня отвергнут',
      worth: 'Я недостаточно важен(на)',
      incompetent: 'Покажусь некомпетентным',
      pushy: 'Буду навязчивым',
      everyone: 'Все уже знают друг друга',
      awkward: 'Потом будет неловко',
      custom: 'Мой страх'
    };
    var fearContent = '';
    Object.keys(answers.fearStrategies).forEach(function(key) {
      var val = answers.fearStrategies[key];
      if (val && val.trim()) {
        fearContent += '<div style="margin-bottom:12px;padding:10px 14px;background:#fef3c7;border-left:3px solid #f59e0b;border-radius:8px;">';
        fearContent +=   '<div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:4px;">' + (fearLabels[key] || key) + '</div>';
        fearContent +=   '<div style="font-size:13px;color:#1e293b;">' + escapeHtml(val) + '</div>';
        fearContent += '</div>';
      }
    });
    if (fearContent) {
      html += renderPdfSection('Стратегии работы со страхами', fearContent, '#f59e0b', true);
    }
  }

  if (state.wheel && state.wheel.values && state.wheel.values.some(function(v) { return v > 0; })) {
    var wheelContent = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
    state.wheel.segments.forEach(function(seg, i) {
      var val = state.wheel.values[i] || 0;
      var imp = (state.wheel.importance && state.wheel.importance[i]) || 5;
      wheelContent += '<div style="padding:10px 12px;background:#f0f9ff;border-radius:8px;border:1px solid #bae6fd;">';
      wheelContent +=   '<div style="font-size:13px;font-weight:700;color:#0c4a6e;margin-bottom:4px;">' + seg + '</div>';
      wheelContent +=   '<div style="font-size:11px;color:#475569;">Сейчас: <b>' + val + '/10</b> | Важность: <b>' + imp + '/10</b></div>';
      wheelContent += '</div>';
    });
    wheelContent += '</div>';
    html += renderPdfSection('Моё колесо баланса', wheelContent, '#38bdf8', true);
  }

  if (Object.keys(answers.smartGoal).length > 0) {
    var smartLabels = {
      s: { letter: 'S', name: 'Specific (Конкретная)', color: '#22c55e' },
      m: { letter: 'M', name: 'Measurable (Измеримая)', color: '#3b82f6' },
      a: { letter: 'A', name: 'Achievable (Достижимая)', color: '#f59e0b' },
      r: { letter: 'R', name: 'Relevant (Релевантная)', color: '#a855f7' },
      t: { letter: 'T', name: 'Time-bound (Ограниченная во времени)', color: '#ef4444' }
    };
    var smartContent = '';
    ['s','m','a','r','t'].forEach(function(key) {
      var val = answers.smartGoal[key];
      if (val && val.trim()) {
        var info = smartLabels[key];
        smartContent += '<div style="margin-bottom:10px;padding:10px 14px;background:' + info.color + '15;border-left:3px solid ' + info.color + ';border-radius:8px;">';
        smartContent +=   '<div style="font-size:11px;font-weight:700;color:' + info.color + ';text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px;">';
        smartContent +=     info.letter + ' — ' + info.name;
        smartContent +=   '</div>';
        smartContent +=   '<div style="font-size:13px;color:#1e293b;">' + escapeHtml(val) + '</div>';
        smartContent += '</div>';
      }
    });
    if (smartContent) {
      html += renderPdfSection('Моя SMART-цель', smartContent, '#22c55e', true);
    }
  }

  if (Object.keys(answers.bizcard).length > 0) {
    var bcLabels = {
      name: 'Имя',
      role: 'Должность',
      company: 'Компания',
      hook: 'Зацепка',
      email: 'Email',
      phone: 'Телефон',
      profile: 'Профиль / сайт'
    };
    var bcContent = '<div style="padding:20px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:12px;border:1px solid #fbbf24;">';
    var hasAny = false;
    Object.keys(bcLabels).forEach(function(key) {
      var val = answers.bizcard[key];
      if (val && val.trim()) {
        hasAny = true;
        bcContent += '<div style="margin-bottom:8px;font-size:13px;"><strong style="color:#92400e;">' + bcLabels[key] + ':</strong> <span style="color:#1e293b;">' + escapeHtml(val) + '</span></div>';
      }
    });
    bcContent += '</div>';
    if (hasAny) {
      html += renderPdfSection('Моя визитка', bcContent, '#f59e0b', true);
    }
  }

  if (answers.status && answers.status.full) {
    var statusContent = '<div style="padding:16px 20px;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border-radius:12px;border:1px solid #86efac;text-align:center;">';
    statusContent +=   '<div style="font-size:15px;font-weight:600;color:#14532d;">' + escapeHtml(answers.status.full) + '</div>';
    statusContent += '</div>';
    html += renderPdfSection('Мой статус в соцсетях', statusContent, '#22c55e', true);
  }

  if (answers.mySticky && answers.mySticky.text) {
    var stickyContent = '<div style="padding:20px;background:linear-gradient(135deg,#fef9c3,#fde68a);border:2px dashed #facc15;border-radius:12px;text-align:center;">';
    stickyContent +=   '<div style="font-size:14px;font-style:italic;color:#713f12;line-height:1.6;">«' + escapeHtml(answers.mySticky.text) + '»</div>';
    stickyContent += '</div>';
    html += renderPdfSection('Моя самопрезентация', stickyContent, '#facc15', true);
  }

  html += '<div style="margin-top:40px;padding-top:20px;border-top:2px solid #e2e8f0;text-align:center;font-size:11px;color:#94a3b8;">';
  html +=   'Сформировано в курсе «Нетворкинг» · ' + new Date().toLocaleDateString('ru-RU');
  html += '</div>';

  pdfContent.innerHTML = html;
  document.body.appendChild(pdfContent);

  renderHtmlToPdf(pdfContent, 'Мои_ответы_Нетворкинг.pdf');
}

function renderPdfSection(title, content, color, isHtml) {
   // Определяем иконку автоматически по названию
  var icons = {
    'Моя цель нетворкинга': '🎯',
    'Стратегии работы со страхами': '🎭',
    'Моё колесо баланса': '⚖️',
    'Моя SMART-цель': '🎯',
    'Моя визитка': '💼',
    'Мой статус в соцсетях': '💬',
    'Моя самопрезентация': '📌'
  };
  var icon = icons[title] || '📋';
  
  var html = '';
  html += '<div style="margin-bottom:24px;page-break-inside:avoid;">';
  html +=   '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid ' + color + ';">';
  html +=     '<div style="font-size:22px;">' + icon + '</div>';
  html +=     '<h2 style="font-size:17px;font-weight:700;color:' + color + ';margin:0;">' + title + '</h2>';
  html +=   '</div>';
  if (isHtml) {
    html += '<div>' + content + '</div>';
  } else {
    html += '<div style="padding:12px 16px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;font-size:13px;line-height:1.6;color:#334155;">';
    html +=   escapeHtml(content);
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function renderHtmlToPdf(element, filename) {
  var btn = document.getElementById('btn-download-pdf');
  if (btn) {
    btn.innerHTML = '<span class="spinner"></span><span>Генерирую PDF...</span>';
    btn.disabled = true;
  }

  function doRender() {
    html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    }).then(function(canvas) {
      var imgData = canvas.toDataURL('image/png');
      var jsPDF = window.jspdf.jsPDF;
      var pdf = new jsPDF('p', 'mm', 'a4');
      var pdfWidth = pdf.internal.pageSize.getWidth();
      var pdfHeight = pdf.internal.pageSize.getHeight();
      var imgWidth = pdfWidth;
      var imgHeight = (canvas.height * pdfWidth) / canvas.width;
      var heightLeft = imgHeight;
      var position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(filename);
      element.remove();
      showPdfToast('✅ PDF скачан!');

      if (btn) {
        btn.innerHTML = '<span>📥</span><span>Скачать мои ответы (PDF)</span>';
        btn.disabled = false;
      }
    }).catch(function(err) {
      console.error('Ошибка PDF:', err);
      alert('Не удалось сгенерировать PDF. Попробуй ещё раз.');
      element.remove();
      if (btn) {
        btn.innerHTML = '<span>Скачать мои ответы (PDF)</span>';
        btn.disabled = false;
      }
    });
  }

  if (typeof html2canvas === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = doRender;
    script.onerror = function() {
      alert('Не удалось загрузить html2canvas');
      element.remove();
      if (btn) {
        btn.innerHTML = '<span>📥</span><span>Скачать мои ответы (PDF)</span>';
        btn.disabled = false;
      }
    };
    document.head.appendChild(script);
  } else {
    doRender();
  }
}

function showPdfToast(text) {
  var existing = document.querySelector('.pdf-saved-toast');
  if (existing) existing.remove();

  var toast = document.createElement('div');
  toast.className = 'pdf-saved-toast';
  toast.textContent = text;
  document.body.appendChild(toast);

  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      toast.classList.add('visible');
    });
  });

  setTimeout(function() {
    toast.classList.remove('visible');
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

function initDownloadPdfButton() {
  var btn = document.getElementById('btn-download-pdf');
  if (!btn) return;
  if (btn.dataset.inited === '1') return;
  btn.dataset.inited = '1';

  btn.addEventListener('click', function() {
    generateAnswersPDF();
  });

  console.log('✅ Кнопка PDF подключена');
}

document.addEventListener('DOMContentLoaded', function() {
  try { initGlobalNav(); } catch(e) { console.warn('initGlobalNav error:', e); }
  try { initMainMenu(); } catch(e) { console.warn('initMainMenu error:', e); }
  try { initKeysGame(); } catch(e) { console.warn('initKeysGame error:', e); }
  try { initLaptopHotspot(); } catch(e) { console.warn('initLaptopHotspot error:', e); }
  try { initPurposeScreen(); } catch(e) { console.warn('initPurposeScreen error:', e); }
  try { initZlataReady(); } catch(e) { console.warn('initZlataReady error:', e); }

  var btnStart = document.getElementById('btn-screen1-start');
  if (btnStart) {
    btnStart.addEventListener('click', function() {
      showScreen('screen-2');
    });
  }

  // Кнопка на обложке (s1-cover-btn)
  var coverBtn = document.querySelector('.s1-cover-btn');
  if (coverBtn) {
    coverBtn.addEventListener('click', function() {
      var cover = document.getElementById('screen-1-cover');
      var overlay = document.getElementById('screen-1-overlay');
      if (cover) cover.style.display = 'none';
      if (overlay) overlay.style.display = 'flex';
    });
  }

  console.log('✅ INIT завершён, показываем screen-1');
  showScreen('screen-1');
});

// ===== АВТОФИКС: возвращаем сбежавшие экраны в screen-container =====
(function fixRunawayScreens() {
  function doFix() {
    var sc = document.getElementById('screen-container');
    if (!sc) return;
    
    var moved = 0;
    document.querySelectorAll('.screen').forEach(function(scr) {
      // Сначала снимаем active со всех сбежавших экранов
      if (scr.parentElement !== sc) {
        scr.classList.remove('active');
        console.warn('🔧 Перенёс экран', scr.id, 'в screen-container (был в ' + scr.parentElement.tagName + ')');
        sc.appendChild(scr);
        moved++;
      }
    });
    
    if (moved > 0) {
      console.log('✅ Всего перенесено экранов:', moved);
      // После переноса — показываем только screen-1
      document.querySelectorAll('.screen').forEach(function(s) {
        s.classList.remove('active');
      });
      var first = document.getElementById('screen-1');
      if (first) first.classList.add('active');
    }
  }
  
  // Запускаем ПОСЛЕ того, как отработал DOMContentLoaded основного кода
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // Ждём чуть-чуть, чтобы основной скрипт успел отработать
      setTimeout(doFix, 50);
    });
  } else {
    setTimeout(doFix, 50);
  }
})();
