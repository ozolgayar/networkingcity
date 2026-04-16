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
  'screen-11', 'screen-12', 'screen-13', 'screen-13-s','screen-13-1', 'screen-14', 'screen-15',
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
    // Сброс инлайн-стилей от showResult()
  var sc = document.getElementById('screen-container');
  if (sc) {
    sc.style.background = '';
    sc.style.boxShadow = '';
    sc.style.border = '';
  }

  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
  });
   var sc = document.getElementById('screen-container');
  if (sc) {
    sc.style.background = '';
    sc.style.boxShadow = '';
    sc.style.border = '';
    sc.style.padding = '';
  }

  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
  });
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
  if (id === 'screen-13-1') {
    setTimeout(function() { initZlataCard2(); }, 50);
  }
  if (id === 'screen-14') {
    setTimeout(function() { initWheel(); }, 50);
  }
  if (id === 'screen-15') {
    setTimeout(function() { renderWheel('resultWheelSvg', state.wheel.values, -1); }, 50);
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
  if (id === 'screen-19' && !window._bizcardInited) {
    window._bizcardInited = true;
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

  var letters = shuffleArray(stage.word.split(''));
  pool.innerHTML = '';
  target.innerHTML = '';
  if (feedback) feedback.textContent = '';
  if (hint) hint.textContent = 'Собери слово из букв';

  letters.forEach(function(letter) {
    var bead = document.createElement('div');
    bead.className = 'bead';
    bead.textContent = letter;
    bead.addEventListener('click', function() {
      if (bead.classList.contains('used')) return;
      bead.classList.add('used');
      var slot = document.createElement('div');
      slot.className = 'bead placed';
      slot.textContent = letter;
      slot.dataset.letter = letter;
      slot.addEventListener('click', function() {
        slot.remove();
        bead.classList.remove('used');
        checkWord();
      });
      target.appendChild(slot);
      checkWord();
    });
    pool.appendChild(bead);
  });

  function checkWord() {
    var current = Array.from(target.querySelectorAll('.bead')).map(function(b) {
      return b.textContent;
    }).join('');

    if (current.length < stage.word.length) return;

    if (current === stage.word) {
      if (feedback) {
        feedback.textContent = stage.feedbackOk;
        feedback.style.color = '#22c55e';
      }
      addScore(3);
      target.querySelectorAll('.bead').forEach(function(b) {
        b.style.background = '#22c55e';
        b.style.color = '#fff';
        b.style.pointerEvents = 'none';
      });
      pool.querySelectorAll('.bead').forEach(function(b) {
        b.style.pointerEvents = 'none';
      });
      if (hint) hint.textContent = '';

      setTimeout(function() {
        if (state.beads.stage < beadsStages.length) {
          state.beads.stage++;
          renderBeadsStage();
        } else {
          if (feedback) {
            feedback.innerHTML = '🎉 Отлично! Ты собрала все три слова!';
            feedback.style.color = '#a855f7';
          }
          setTimeout(function() {
            showScreen('screen-13');
          }, 1200);
        }
      }, 1000);

    } else {
      if (feedback) {
        feedback.textContent = 'Не то слово, попробуй ещё раз';
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
      }, 800);
    }
  }
}

// ===== Экран 13: Страхи =====
function initFears() {
  var fears = [
    { text: 'Страх быть отвергнутым', icon: '😰' },
    { text: 'Страх показаться навязчивым', icon: '😬' },
    { text: 'Страх не знать, о чём говорить', icon: '🤐' },
    { text: 'Страх провала', icon: '😨' },
    { text: 'Страх оценки окружающих', icon: '👀' },
    { text: 'Страх незнакомых людей', icon: '🙈' }
  ];

  var grid = document.getElementById('fears-grid');
  var btn = document.getElementById('btn-fears-done');
  if (!grid || !btn) return;

  grid.innerHTML = '';
  var selected = [];

  fears.forEach(function(fear, i) {
    var card = document.createElement('div');
    card.className = 'fear-card';
    card.innerHTML = '<span class="fear-icon">' + fear.icon + '</span><span>' + fear.text + '</span>';
    card.addEventListener('click', function() {
      card.classList.toggle('selected');
      if (card.classList.contains('selected')) {
        selected.push(i);
      } else {
        selected = selected.filter(function(x) { return x !== i; });
      }
    });
    grid.appendChild(card);
  });

  btn.addEventListener('click', function() {
    addScore(2);
    showScreen('screen-13-s');
  });
}

// ===== Экран 13-s: Полноэкранный страх =====
function initFears13S() {
  var btn = document.getElementById('btn-fears13s-next');
  if (!btn) return;
  btn.addEventListener('click', function() {
    showScreen('screen-13-1');
  });
}

// ===== Экран 13-1: Карточка Златы 2 =====
function initZlataCard2() {
  var btn = document.getElementById('btn-zlata2-next');
  if (!btn) return;
  btn.addEventListener('click', function() {
    showScreen('screen-14');
  });
}

// ===== Экран 14: Колесо =====
function initWheel() {
  var svg = document.getElementById('wheelSvg');
  var inputsWrap = document.getElementById('wheel-inputs');
  var btnDone = document.getElementById('btn-wheel-done');
  if (!svg || !inputsWrap || !btnDone) return;

  var segments = state.wheel.segments;
  var values = state.wheel.values;
  var importance = state.wheel.importance;
  var N = segments.length;

  renderWheel('wheelSvg', values, -1);

  inputsWrap.innerHTML = '';
  segments.forEach(function(seg, i) {
    var row = document.createElement('div');
    row.className = 'wheel-row';
    row.innerHTML =
      '<label>' + seg + '</label>' +
      '<div class="wheel-sliders">' +
        '<div class="wheel-slider-group">' +
          '<span class="slider-label">Текущий уровень</span>' +
          '<input type="range" min="0" max="10" value="' + values[i] + '" data-idx="' + i + '" class="wheel-range val-range">' +
          '<span class="slider-val val-display">' + values[i] + '</span>' +
        '</div>' +
        '<div class="wheel-slider-group">' +
          '<span class="slider-label">Важность</span>' +
          '<input type="range" min="1" max="10" value="' + importance[i] + '" data-idx="' + i + '" class="wheel-range imp-range">' +
          '<span class="slider-val imp-display">' + importance[i] + '</span>' +
        '</div>' +
      '</div>';
    inputsWrap.appendChild(row);
  });

  inputsWrap.querySelectorAll('.val-range').forEach(function(input) {
    input.addEventListener('input', function() {
      var idx = parseInt(input.dataset.idx);
      values[idx] = parseInt(input.value);
      input.closest('.wheel-slider-group').querySelector('.val-display').textContent = input.value;
      renderWheel('wheelSvg', values, idx);
    });
  });

  inputsWrap.querySelectorAll('.imp-range').forEach(function(input) {
    input.addEventListener('input', function() {
      var idx = parseInt(input.dataset.idx);
      importance[idx] = parseInt(input.value);
      input.closest('.wheel-slider-group').querySelector('.imp-display').textContent = input.value;
    });
  });

  btnDone.addEventListener('click', function() {
    state.wheel.values = values;
    state.wheel.importance = importance;
    addScore(3);
    showScreen('screen-15');
  });
}

function renderWheel(svgId, values, activeIdx) {
  var svg = document.getElementById(svgId);
  if (!svg) return;

  var segments = state.wheel.segments;
  var N = segments.length;
  var cx = 150, cy = 150, R = 120;
  var angleStep = (2 * Math.PI) / N;
  var colors = ['#a855f7','#38bdf8','#22c55e','#f59e0b','#ef4444','#ec4899'];

  svg.setAttribute('viewBox', '0 0 300 300');
  svg.innerHTML = '';

  // Фоновые секторы
  for (var i = 0; i < N; i++) {
    var startAngle = i * angleStep - Math.PI / 2;
    var endAngle = startAngle + angleStep;
    var x1 = cx + R * Math.cos(startAngle);
    var y1 = cy + R * Math.sin(startAngle);
    var x2 = cx + R * Math.cos(endAngle);
    var y2 = cy + R * Math.sin(endAngle);
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M ' + cx + ' ' + cy + ' L ' + x1 + ' ' + y1 + ' A ' + R + ' ' + R + ' 0 0 1 ' + x2 + ' ' + y2 + ' Z');
    path.setAttribute('fill', colors[i % colors.length]);
    path.setAttribute('opacity', '0.15');
    svg.appendChild(path);
  }

  // Концентрические круги
  for (var r = 1; r <= 10; r++) {
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', R * r / 10);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', '#e2e8f0');
    circle.setAttribute('stroke-width', '0.5');
    svg.appendChild(circle);
  }

  // Линии-разделители
  for (var i = 0; i < N; i++) {
    var angle = i * angleStep - Math.PI / 2;
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', cy);
    line.setAttribute('x2', cx + R * Math.cos(angle));
    line.setAttribute('y2', cy + R * Math.sin(angle));
    line.setAttribute('stroke', '#cbd5e1');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
  }

  // Полигон значений
  var points = [];
  for (var i = 0; i < N; i++) {
    var angle = i * angleStep - Math.PI / 2;
    var val = clamp(values[i] || 0, 0, 10);
    var r2 = R * val / 10;
    points.push((cx + r2 * Math.cos(angle)) + ',' + (cy + r2 * Math.sin(angle)));
  }
  var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', points.join(' '));
  polygon.setAttribute('fill', 'rgba(168,85,247,0.25)');
  polygon.setAttribute('stroke', '#a855f7');
  polygon.setAttribute('stroke-width', '2');
  svg.appendChild(polygon);

  // Точки и подписи
  for (var i = 0; i < N; i++) {
    var angle = i * angleStep - Math.PI / 2;
    var val = clamp(values[i] || 0, 0, 10);
    var r2 = R * val / 10;
    var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', cx + r2 * Math.cos(angle));
    dot.setAttribute('cy', cy + r2 * Math.sin(angle));
    dot.setAttribute('r', activeIdx === i ? 6 : 4);
    dot.setAttribute('fill', colors[i % colors.length]);
    dot.setAttribute('stroke', '#fff');
    dot.setAttribute('stroke-width', '2');
    svg.appendChild(dot);

    var labelR = R + 18;
    var lx = cx + labelR * Math.cos(angle);
    var ly = cy + labelR * Math.sin(angle);
    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', lx);
    text.setAttribute('y', ly);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', '9');
    text.setAttribute('fill', '#475569');
    text.textContent = segments[i];
    svg.appendChild(text);
  }
}

// ===== Экран 16: Локации =====
function initLocations() {
  var btns = document.querySelectorAll('.location-btn');
  var info = document.getElementById('location-info');
  var btnNext = document.getElementById('btn-locations-next');
  var visited = {};

  var data = {
    online: {
      title: 'Онлайн',
      text: 'LinkedIn, Telegram-группы, профессиональные форумы — цифровые площадки для знакомств без географических ограничений.'
    },
    events: {
      title: 'Мероприятия',
      text: 'Конференции, форумы, нетворкинг-ивенты — лучшее место для живых знакомств с профессионалами.'
    },
    clubs: {
      title: 'Клубы',
      text: 'Бизнес-клубы, профессиональные сообщества, коворкинги — места с регулярным общением единомышленников.'
    },
    education: {
      title: 'Образование',
      text: 'Курсы, мастер-классы, воркшопы — учишься и знакомишься с людьми со схожими интересами.'
    }
  };

  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var key = btn.dataset.location;
      btns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      visited[key] = true;
      if (info && data[key]) {
        info.innerHTML = '<strong>' + data[key].title + '</strong><p>' + data[key].text + '</p>';
      }
      if (Object.keys(visited).length >= 2 && btnNext) {
        btnNext.style.display = 'block';
      }
    });
  });

  if (btnNext) {
    btnNext.addEventListener('click', function() {
      addScore(2);
      showScreen('screen-16-1');
    });
  }
}

// ===== Экран 17: SMART =====
function initSmartGoal() {
  var fields = document.querySelectorAll('.smart-field');
  var btn = document.getElementById('btn-smart-done');
  if (!btn) return;

  btn.addEventListener('click', function() {
    var allFilled = true;
    fields.forEach(function(f) {
      if (!f.value.trim()) {
        f.style.borderColor = '#ef4444';
        allFilled = false;
        setTimeout(function() { f.style.borderColor = ''; }, 1500);
      }
    });
    if (!allFilled) return;

    localStorage.setItem('laptopGoalDone', '1');
    addScore(3);
    showScreen('screen-17-1');
  });
}

// ===== Экран 17-1: Карточка Златы =====
function initZlataCard17() {
  var btn = document.getElementById('btn-zlata17-next');
  if (!btn) return;
  btn.addEventListener('click', function() {
    showScreen('screen-10');
  });
}

// ===== Экран 19: Визитка =====
function initBizcard() {
  var inputs = document.querySelectorAll('.bizcard-input');
  var preview = document.getElementById('bizcard-preview');
  var btnDone = document.getElementById('btn-bizcard-done');

  function updatePreview() {
    inputs.forEach(function(input) {
      var field = input.dataset.field;
      var el = document.getElementById('bcp-' + field);
      if (el) el.textContent = input.value || el.dataset.placeholder || '';
    });
  }

  inputs.forEach(function(input) {
    input.addEventListener('input', updatePreview);
  });

  if (btnDone) {
    btnDone.addEventListener('click', function() {
      var filled = Array.from(inputs).filter(function(i) { return i.value.trim(); }).length;
      if (filled < 2) {
        alert('Заполни хотя бы 2 поля!');
        return;
      }
      if (!state.bizcardRewarded) {
        addScore(3);
        state.bizcardRewarded = true;
      }
      showScreen('screen-19-1');
    });
  }
}

// ===== Экран 19-1: Карточка Златы =====
function initZlataCard19() {
  var btn = document.getElementById('btn-zlata19-next');
  if (!btn) return;
  btn.addEventListener('click', function() {
    showScreen('screen-20');
  });
}

// ===== Экран 20: Фото =====
function initPhotoGame() {
  var slots = document.querySelectorAll('.photo-slot');
  var items = document.querySelectorAll('.photo-item');
  var btn = document.getElementById('btn-photo-done');
  var feedback = document.getElementById('photo-feedback');

  items.forEach(function(item) {
    item.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', item.dataset.id);
    });
  });

  slots.forEach(function(slot) {
    slot.addEventListener('dragover', function(e) {
      e.preventDefault();
      slot.classList.add('drag-over');
    });
    slot.addEventListener('dragleave', function() {
      slot.classList.remove('drag-over');
    });
    slot.addEventListener('drop', function(e) {
      e.preventDefault();
      slot.classList.remove('drag-over');
      var id = e.dataTransfer.getData('text/plain');
      var item = document.querySelector('.photo-item[data-id="' + id + '"]');
      if (!item) return;
      slot.innerHTML = '';
      var clone = item.cloneNode(true);
      clone.style.width = '100%';
      clone.style.height = '100%';
      clone.style.objectFit = 'cover';
      slot.appendChild(clone);
      slot.dataset.filled = id;
    });
  });

  if (btn) {
    btn.addEventListener('click', function() {
      var filled = Array.from(slots).filter(function(s) { return s.dataset.filled; }).length;
      if (filled < slots.length) {
        if (feedback) feedback.textContent = 'Заполни все слоты!';
        return;
      }
      addScore(3);
      showScreen('screen-21');
    });
  }
}

// ===== Экран 21: Стикеры =====
function initProfileAndSticky() {
  var btn = document.getElementById('btn-sticky-done');
  if (!btn) return;
  btn.addEventListener('click', function() {
    addScore(2);
    showScreen('screen-21-0');
  });
}

// ===== Экран 21-0: Карточка Златы =====
function initZlataCard21() {
  var btn = document.getElementById('btn-zlata21-next');
  if (!btn) return;
  btn.addEventListener('click', function() {
    showScreen('screen-21-1');
  });
}

// ===== Экран 21-1: Сумка =====
function initBag() {
  var items = document.querySelectorAll('.bag-item');
  var btnDone = document.getElementById('btn-bag-done');
  var counter = document.getElementById('bag-counter');
  var selected = [];

  items.forEach(function(item) {
    item.addEventListener('click', function() {
      item.classList.toggle('selected');
      var id = item.dataset.id;
      if (item.classList.contains('selected')) {
        selected.push(id);
      } else {
        selected = selected.filter(function(x) { return x !== id; });
      }
      if (counter) counter.textContent = selected.length;
    });
  });

  if (btnDone) {
    btnDone.addEventListener('click', function() {
      if (selected.length < 3) {
        alert('Выбери хотя бы 3 предмета!');
        return;
      }
      addScore(2);
      showScreen('screen-21-1-1');
    });
  }
}

// ===== Экран 21-1-1: Карточка Златы =====
function initZlataCard211() {
  var btn = document.getElementById('btn-zlata211-next');
  if (!btn) return;
  btn.addEventListener('click', function() {
    showScreen('screen-21-2');
  });
}

// ===== Экран 21-2: Карта =====
function initVenueMap() {
  var pins = document.querySelectorAll('.map-pin');
  var info = document.getElementById('map-venue-info');
  var btn = document.getElementById('btn-map-done');

  var venues = {
    venue1: { name: 'Конференц-зал "Горизонт"', desc: 'Идеально для деловых встреч и презентаций' },
    venue2: { name: 'Коворкинг "Точка роста"', desc: 'Неформальная атмосфера для знакомств' },
    venue3: { name: 'Бизнес-клуб "Капитал"', desc: 'Элитные нетворкинг-ивенты для предпринимателей' }
  };

  pins.forEach(function(pin) {
    pin.addEventListener('click', function() {
      pins.forEach(function(p) { p.classList.remove('active'); });
      pin.classList.add('active');
      var key = pin.dataset.venue;
      if (info && venues[key]) {
        info.innerHTML = '<strong>' + venues[key].name + '</strong><p>' + venues[key].desc + '</p>';
      }
    });
  });

  if (btn) {
    btn.addEventListener('click', function() {
      localStorage.setItem('mapViewed', '1');
      addScore(2);
      showScreen('screen-10');
    });
  }
}

// ===== Экран zlata-ready =====
function initZlataReady() {
  var btn = document.getElementById('btn-zlata-ready-next');
  if (!btn) return;
  btn.addEventListener('click', function() {
    showScreen('screen-final');
  });
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
