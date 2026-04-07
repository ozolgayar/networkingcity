// Предупреждение для мобильных
window.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth < 900) {
    var app = document.getElementById('app');
    if (app) app.style.display = 'none';

    var overlay = document.createElement('div');
    overlay.id = 'mobile-warning';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,0.85);display:flex;align-items:center;justify-content:center;padding:24px;';
    overlay.innerHTML =
      '<div style="background:#fff;border-radius:18px;padding:32px 28px;max-width:400px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
        '<div style="font-size:48px;margin-bottom:16px;">💻</div>' +
        '<h2 style="font-size:20px;color:#1e293b;margin-bottom:10px;">Курс доступен только с компьютера</h2>' +
        '<p style="font-size:14px;color:#64748b;line-height:1.5;margin-bottom:20px;">Для прохождения курса необходим экран шириной от 900px. Пожалуйста, открой эту страницу на компьютере или ноутбуке.</p>' +
        '<a href="index.html" style="display:inline-block;padding:10px 24px;border-radius:999px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;text-decoration:none;font-weight:600;font-size:14px;box-shadow:0 8px 24px rgba(34,197,94,0.4);">← На главную</a>' +
      '</div>';
    document.body.appendChild(overlay);

    // Блокируем инициализацию курса
    window.__mobileBlocked = true;
  }
});
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
  'screen-1', 'screen-2', 'screen-3', 'screen-10',
  'screen-11', 'screen-12', 'screen-13', 'screen-13-1', 'screen-14', 'screen-15',
  'screen-16', 'screen-16-1', 'screen-17', 'screen-19',
  'screen-20', 'screen-20-1', 'screen-21', 'screen-21-1', 'screen-21-2',
  'screen-final'
];

// ===== Утилиты =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
   // Ленивая инициализация экрана 16-1
  if (id === 'screen-16-1' && !window._locationsInited) {
    window._locationsInited = true;
    initLocations();
  }
  var screenEl = document.getElementById(id);
  if (screenEl) screenEl.classList.add('active');

  state.screensVisited[id] = true;
  updateHud();

  if (id === 'screen-final') {
    localStorage.setItem('nc_mod1_status', 'complete');
    localStorage.setItem('nc_mod1_progress', '100');
    document.getElementById('final-score').textContent = state.score;
  }

  if (id === 'screen-12') {
    setTimeout(function() { renderBeadsStage(); }, 50);
  }
  if (id === 'screen-13') {
    setTimeout(function() { initFears(); }, 50);
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
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function addScore(delta) {
  state.score = Math.max(0, state.score + delta);
  updateHud();
}

  function updateHud() {
  // Прогресс — по посещённым экранам
  var visited = Object.keys(state.screensVisited).length;
  var total = screenOrder.length;
  var pct = Math.round((visited / total) * 100);
  
  document.getElementById('hud-progress-bar').style.transform = 'scaleX(' + (pct / 100) + ')';
  document.getElementById('hud-progress-value').textContent = pct + '%';
  document.getElementById('hud-score').textContent = state.score;
  document.getElementById('screen-pill').textContent = visited + ' / ' + total;
  
  // Сохраняем в localStorage для хаба
  localStorage.setItem('nc_mod1_progress', String(pct));
}

  function initGlobalNav() {
    document.querySelectorAll('[data-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        const nextId = btn.getAttribute('data-next');
        showScreen(nextId);
      });
    });

    // Кнопки "Назад" — data-prev
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
  // Меню навигации
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

    function showQuestion(idx) {
      if (idx >= questions.length) { showResult(); return; }
      var q = questions[idx];
      progress.textContent = 'Вопрос ' + (idx + 1) + ' из ' + questions.length;

      var html = '<div class="quiz-q">';
      html += '<h3>' + (idx + 1) + '. ' + q.q + '</h3>';
      html += '<div class="quiz-options">';
      q.opts.forEach(function(label, oi) {
        html += '<div class="quiz-opt" data-pts="' + (oi + 1) + '">' + label + '</div>';
      });
      html += '</div></div>';

      area.innerHTML = html;

      var opts = area.querySelectorAll('.quiz-opt');
      opts.forEach(function(opt) {
        opt.addEventListener('click', function() {
          opts.forEach(function(o) { o.style.pointerEvents = 'none'; });
          opt.classList.add('selected');
          answers[idx] = parseInt(opt.getAttribute('data-pts'));
          currentQ = idx + 1;
          setTimeout(function() { showQuestion(currentQ); }, 500);
        });
      });
    }

    function showResult() {
      area.style.display = 'none';
      progress.style.display = 'none';

      var total = answers.reduce(function(a, b) { return a + b; }, 0);
      var msg;
      if (total <= 20) {
        msg = 'Зарядись на эффективный нетворкинг и настройся на полное погружение в курс! Рекомендуем пройти его от А до Я.';
      } else if (total <= 35) {
        msg = 'Кажется, у тебя есть базовые знания. Повысь их до максимума!';
      } else {
        msg = 'Твоих знаний достаточно, чтобы добиться блестящих результатов. Но перед тобой стоит ответственная задача — сделать свой навык нетворкинга ещё более совершенным. Дерзай!';
      }

      result.style.display = 'block';
      result.innerHTML =
        '<h3>Твой результат: ' + total + ' из 50</h3>' +
        '<p style="font-size:13px; line-height:1.5;">' + msg + '</p>' +
        '<div class="actions-row" style="margin-top:12px;">' +
          '<button class="btn" onclick="showScreen(\'screen-3\')">Продолжить →</button>' +
        '</div>';

      localStorage.setItem('nc_quiz_score', total);
    }

    // Наблюдатель — запускает тест когда экран 2 становится активным
    var observer = new MutationObserver(function() {
      if (document.getElementById('screen-2').classList.contains('active') && !quizStarted) {
        startQuiz();
      }
    });
    observer.observe(document.getElementById('screen-2'), {
      attributes: true, attributeFilter: ['class']
    });

    // Если экран 2 уже активен при загрузке
    if (document.getElementById('screen-2').classList.contains('active')) {
      startQuiz();
    }
  }
  // ===== Экран 3: Знакомство со Златой =====
   function initKeysGame() {
    var card = document.getElementById('zlata-card');
    var wrapper = document.getElementById('zlata-card-wrapper');
    var laptop = document.getElementById('inv-laptop');

    // Защита — если элементов нет, выходим
    if (!card || !wrapper || !laptop) {
      console.warn('initKeysGame: элементы карточки Златы не найдены');
      return;
    }

    // Флип карточки
    wrapper.addEventListener('click', function(e) {
      // Если нажали на ноутбук — не флипаем, переходим
      if (e.target.closest('#inv-laptop')) return;
      card.classList.toggle('flipped');
    });

    // Ноутбук — переход на экран 10
    laptop.addEventListener('click', function(e) {
      e.stopPropagation();
      showScreen('screen-10');
    });
  }
  
   // ===== Экран 10: ноутбук =====
function initLaptopHotspot() {
    document.getElementById('folder-goal').addEventListener('click', function() {
      showScreen('screen-11');
    });
    document.getElementById('folder-schedule').addEventListener('click', function() {
      document.getElementById('schedule-modal').classList.add('active');
    });
    document.getElementById('schedule-modal-ok').addEventListener('click', function() {
      document.getElementById('schedule-modal').classList.remove('active');
    });
    document.getElementById('schedule-modal').addEventListener('click', function(e) {
      if (e.target === document.getElementById('schedule-modal')) {
        document.getElementById('schedule-modal').classList.remove('active');
      }
    });
  }

  // ===== Экран 11: цель нетворкинга =====
  function initPurposeScreen() {
  var btn = document.getElementById('btn-purpose-submit');
  var btnSave = document.getElementById('btn-purpose-save');
  var modal = document.getElementById('purpose-modal');
  var cont = document.getElementById('purpose-modal-continue');
  var textarea = document.getElementById('networking-purpose');
  var floatMsg = document.getElementById('purpose-saved-float');

  // Загружаем сохранённый ответ
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

    // Микроанимация
    floatMsg.classList.remove('show');
    void floatMsg.offsetWidth; // сброс анимации
    floatMsg.classList.add('show');
  });

  cont.addEventListener('click', function() {
    // Автосохраняем при переходе
    var text = textarea.value.trim();
    if (text) {
      localStorage.setItem('nc_purpose_text', text);
    }
    modal.classList.remove('active');
    showScreen('screen-12');
  });
}

  // ===== Экран 12: Нити нетворкинга — мини-игра с бусинами =====
  const beadsStages = [
    { word: 'УСТАНОВКА', feedbackOk: 'Установка связей — это первый шаг, смелость начать. Супер! Двигаемся дальше.' },
    { word: 'УДЕРЖАНИЕ', feedbackOk: 'Удержание связей — это забота, искусство поддерживать контакт тёплым.' },
    { word: 'ЦЕННОСТЬ', feedbackOk: 'Ценность связей — это результат, к которому приводят первые два шага.' }
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

  // Обновляем точки этапов
  for (var d = 1; d <= 3; d++) {
    var dot = document.getElementById('dot-' + d);
    if (!dot) continue;
    dot.classList.remove('active', 'done');
    if (d < state.beads.stage) dot.classList.add('done');
    else if (d === state.beads.stage) dot.classList.add('active');
  }

  pool.innerHTML = '';
  target.innerHTML = '';
  if (feedback) {
    feedback.textContent = '';
    feedback.classList.remove('error');
  }

  // Подсказка
  var word = stage.word;
  var hintStr = '';
  var showCount = Math.ceil(word.length * 0.35);
  var showIndexes = [0, word.length - 1];
  for (var s = 1; showIndexes.length < showCount && s < word.length - 1; s += 2) {
    showIndexes.push(s);
  }
  for (var i = 0; i < word.length; i++) {
    hintStr += showIndexes.indexOf(i) !== -1 ? word[i] : ' _';
  }
  if (hint) hint.textContent = hintStr;

  var letters = stage.word.split('');
  var shuffled = shuffleArray(letters);

  shuffled.forEach(function(ch) {
    var el = document.createElement('div');
    el.className = 'bead';
    el.textContent = ch;
    el.draggable = true;
    el.dataset.letter = ch;
    pool.appendChild(el);
  });

  initBeadsDnD();
}
  function initBeadsDnD() {
    const pool = document.getElementById('beads-pool');
    const target = document.getElementById('beads-target');

    function handleDragStart(e) {
      if (!e.target.classList.contains('bead')) return;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', e.target.dataset.letter);
      e.dataTransfer.setDragImage(e.target, 12, 12);
      e.target.classList.add('dragging');
    }

    function handleDragEnd(e) {
      if (e.target.classList.contains('bead')) {
        e.target.classList.remove('dragging');
      }
    }

    function allowDrop(e) {
      e.preventDefault();
    }

    function handleDropToTarget(e) {
      e.preventDefault();
      const dragging = document.querySelector('.bead.dragging');
      if (dragging && dragging.parentElement !== target) {
        target.appendChild(dragging);
      }
    }

    function handleDropToPool(e) {
      e.preventDefault();
      const dragging = document.querySelector('.bead.dragging');
      if (dragging && dragging.parentElement !== pool) {
        pool.appendChild(dragging);
      }
    }

    [pool, target].forEach((el) => {
      el.addEventListener('dragover', allowDrop);
    });
    pool.addEventListener('drop', handleDropToPool);
    target.addEventListener('drop', handleDropToTarget);

    document.querySelectorAll('.bead').forEach((b) => {
      b.addEventListener('dragstart', handleDragStart);
      b.addEventListener('dragend', handleDragEnd);
    });
  }

function initBeadsGame() {
  var resetBtn = document.getElementById('beads-reset');
  var checkBtn = document.getElementById('beads-check');
  var feedback = document.getElementById('beads-feedback');
  var summaryModal = document.getElementById('beads-summary-modal');
  var summaryContinue = document.getElementById('beads-summary-continue');

  if (!resetBtn || !checkBtn) return;

  renderBeadsStage();

  resetBtn.addEventListener('click', function() {
    state.beads.attempts = 0;
    renderBeadsStage();
  });

  checkBtn.addEventListener('click', function() {
    var stageIndex = state.beads.stage - 1;
    var stage = beadsStages[stageIndex];
    if (!stage) return;
    var target = document.getElementById('beads-target');
    if (!target) return;
    var letters = Array.from(target.querySelectorAll('.bead')).map(function(b) { return b.dataset.letter; }).join('');
    if (letters === stage.word) {
      feedback.textContent = stage.feedbackOk;
      feedback.classList.remove('error');
      if (state.beads.stage < 3) {
        state.beads.stage++;
        state.beads.attempts = 0;
        setTimeout(renderBeadsStage, 600);
      } else {
     addScore(2);
          var theory = document.getElementById('beads-theory');
          if (theory) theory.style.display = 'block';
          setTimeout(() => {
            summaryModal.classList.add('active');
          }, 600);
      }
    } else {
      state.beads.attempts++;
      if (state.beads.attempts >= 2) {
        target.innerHTML = '';
        stage.word.split('').forEach(function(ch) {
          var el = document.createElement('div');
          el.className = 'bead';
          el.textContent = ch;
          el.draggable = false;
          target.appendChild(el);
        });
      }
      feedback.textContent = 'Не получилось собрать слово. Попробуй ещё раз.';
      feedback.classList.add('error');
    }
  });

  summaryModal.addEventListener('click', function(e) {
    if (e.target === summaryModal) {
      summaryModal.classList.remove('active');
    }
  });
  if (summaryContinue) {
    summaryContinue.addEventListener('click', function() {
      summaryModal.classList.remove('active');
    });
  }
}
  // ===== Экран 13: страхи =====
var fearsInitialized = false;

function initFears() {
  if (fearsInitialized) return;

  var masks = document.querySelectorAll('#fear-masks-grid .fear-mask');
  var btnUnmask = document.getElementById('btn-unmask');
  var btnNoFear = document.getElementById('btn-no-fear');
  var validationsBox = document.getElementById('fears-validations');
  var validationsList = document.getElementById('fears-validation-list');
  var step2 = document.getElementById('fears-step2');
  var strategyList = document.getElementById('fears-strategy-list');
  var btnSave = document.getElementById('btn-fears-save');
  var btnDone = document.getElementById('btn-fears-done');
  var modal = document.getElementById('fears-modal');

  if (!masks.length || !btnUnmask || !btnNoFear) {
    console.warn('initFears: elements not found');
    return;
  }

  fearsInitialized = true;
  console.log('initFears: initialized with', masks.length, 'masks');

  var fearsData = {
    say:         { label: 'Не знаю, что сказать',      icon: '😶', validation: 'Этот страх — у 90% людей. Серьёзно. Ты не одинок.', placeholder: 'Пример: «Выучу 3 фразы-открывашки из курса и буду держать их в голове»' },
    reject:      { label: 'Меня отвергнут',             icon: '😔', validation: 'Страх отказа — один из самых древних. Ты храбрее, чем думаешь, раз признаёшь его.', placeholder: 'Пример: «Напомню себе: отказ — это не про меня, а про обстоятельства человека»' },
    worth:       { label: 'Я недостаточно важен(на)',    icon: '🥺', validation: 'Синдром самозванца. Он есть даже у спикеров на сцене.', placeholder: 'Пример: «Подготовлю рассказ о себе, в котором мой опыт звучит ценно»' },
    incompetent: { label: 'Покажусь некомпетентным',     icon: '😰', validation: 'Знать всё невозможно. А вот задать умный вопрос — это и есть компетентность.', placeholder: 'Пример: «Разрешу себе говорить "не знаю, но мне интересно узнать"»' },
    pushy:       { label: 'Буду навязчивым',             icon: '😬', validation: 'Тот факт, что ты об этом думаешь, уже означает, что навязчивым ты не будешь.', placeholder: 'Пример: «Буду задавать вопросы, а не рассказывать. Интерес — не навязчивость»' },
    everyone:    { label: 'Все уже знают друг друга',    icon: '👥', validation: 'На любой конференции минимум 30% людей не знают никого. Они просто хорошо притворяются.', placeholder: 'Пример: «Найду одного человека, который тоже стоит один — и подойду к нему»' },
    awkward:     { label: 'Потом будет неловко',         icon: '😳', validation: 'Хорошая новость: есть конкретные формулы, не нужно ничего придумывать.', placeholder: 'Пример: «Напишу follow-up в тот же вечер по формуле из курса»' },
    custom:      { label: 'Свой вариант',                icon: '✏️', validation: 'Ты честен с собой — это уже шаг к преодолению.', placeholder: 'Как ты будешь с этим справляться?' }
  };

  var selected = [];

  masks.forEach(function(mask) {
    mask.addEventListener('click', function(e) {
      if (e.target.tagName === 'INPUT') return;
      var fear = mask.dataset.fear;

      if (mask.classList.contains('selected')) {
        mask.classList.remove('selected');
        selected = selected.filter(function(f) { return f !== fear; });
        if (fear === 'custom') {
          var inp = mask.querySelector('.fear-custom-input');
          if (inp) inp.style.display = 'none';
        }
      } else {
        mask.classList.add('selected');
        selected.push(fear);
        if (fear === 'custom') {
          var inp2 = mask.querySelector('.fear-custom-input');
          if (inp2) {
            inp2.style.display = 'block';
            setTimeout(function() { inp2.focus(); }, 100);
          }
        }
      }

      if (selected.length > 0) {
        btnUnmask.style.display = 'inline-flex';
        showValidations();
      } else {
        btnUnmask.style.display = 'none';
        validationsBox.style.display = 'none';
      }
    });
  });

  function showValidations() {
    validationsList.innerHTML = '';
    selected.forEach(function(fear) {
      var d = fearsData[fear];
      if (!d) return;
      var customInput = document.querySelector('.fear-custom-input');
      var label = (fear === 'custom' && customInput) ? (customInput.value || 'Свой вариант') : d.label;
      var item = document.createElement('div');
      item.className = 'fear-validation-item';
      item.innerHTML =
        '<span class="fear-validation-icon">' + d.icon + '</span>' +
        '<div class="fear-validation-text"><strong>' + label + '</strong> — ' + d.validation + '</div>';
      validationsList.appendChild(item);
    });
    validationsBox.style.display = 'block';
  }

  btnUnmask.addEventListener('click', function() {
    strategyList.innerHTML = '';
    selected.forEach(function(fear) {
      var d = fearsData[fear];
      if (!d) return;
      var customInput = document.querySelector('.fear-custom-input');
      var label = (fear === 'custom' && customInput) ? (customInput.value || 'Свой вариант') : d.label;
      var card = document.createElement('div');
      card.className = 'fear-strategy-card';
      card.innerHTML =
        '<div class="fear-strategy-header">' +
          '<span class="fear-strategy-emoji">' + d.icon + '</span>' +
          '<span class="fear-strategy-title">' + label + '</span>' +
        '</div>' +
        '<div class="fear-strategy-validation">💚 ' + d.validation + '</div>' +
        '<textarea class="fear-strategy-textarea" data-fear="' + fear + '" placeholder="' + d.placeholder + '"></textarea>';
      strategyList.appendChild(card);
    });
    step2.style.display = 'block';
    step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  btnNoFear.addEventListener('click', function() {
    addScore(1);
    showScreen('screen-13-1');
  });

  btnSave.addEventListener('click', function() {
    var data = {};
    strategyList.querySelectorAll('.fear-strategy-textarea').forEach(function(ta) {
      data[ta.dataset.fear] = ta.value;
    });
    localStorage.setItem('nc_fears', JSON.stringify({ selected: selected, strategies: data }));
    var msg = document.getElementById('fears-saved-msg');
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'fears-saved-msg';
      msg.className = 'fear-saved-msg';
      msg.textContent = '💾 Сохранено!';
      btnSave.parentElement.appendChild(msg);
    }
    msg.classList.remove('show');
    void msg.offsetWidth;
    msg.classList.add('show');
  });

  btnDone.addEventListener('click', function() {
    addScore(3);
    modal.classList.add('active');
  });

  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.classList.remove('active');
  });
}
  
// ===== Экран 13-1: карточка Златы с целью =====
var zlataCard2Initialized = false;

function initZlataCard2() {
  if (zlataCard2Initialized) return;

  var card = document.getElementById('zlata-card-2');
  var wrapper = card ? card.closest('.zlata-card-wrapper') : null;
  var goalBtn = document.getElementById('inv-goal-2');

  if (!card || !wrapper || !goalBtn) return;

  zlataCard2Initialized = true;

  wrapper.addEventListener('click', function(e) {
    if (e.target.closest('#inv-goal-2')) return;
    card.classList.toggle('flipped');
  });

  goalBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    showScreen('screen-14');
  });
}

  // ===== Экран 14: колесо баланса =====
  // ===== SVG-колесо: вспомогательные функции =====
const wheelCategories = [
  { name:'Карьера',        color:'#22c55e', emoji:'💼' },
  { name:'Образование',    color:'#38bdf8', emoji:'🏫' },
  { name:'Хобби',          color:'#f97316', emoji:'🎨' },
  { name:'Личные проекты', color:'#a855f7', emoji:'📁' },
  { name:'Финансы',        color:'#facc15', emoji:'💸' },
  { name:'Здоровье',       color:'#e11d48', emoji:'🩺' }
];

function polar(cx, cy, r, angle) {
  const rad = (angle - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function sectorPath(cx, cy, r1, r2, startAngle, endAngle) {
  const p1 = polar(cx, cy, r2, startAngle);
  const p2 = polar(cx, cy, r2, endAngle);
  const p3 = polar(cx, cy, r1, endAngle);
  const p4 = polar(cx, cy, r1, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${r2} ${r2} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${r1} ${r1} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    'Z'
  ].join(' ');
}

function renderWheel(svgId, values, activeIndex) {
  var svg = document.getElementById(svgId);
  if (!svg) return;
  var cx = 280, cy = 280, maxR = 190, innerR = 28;
  var step = (maxR - innerR) / 10;
  svg.innerHTML = '';

  for (let i = 1; i <= 10; i++) {
    const r = innerR + step * i;
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
    c.setAttribute('fill', 'none');
    c.setAttribute('stroke', i === 10 ? '#cbd5e1' : '#e2e8f0');
    c.setAttribute('stroke-width', '1');
    svg.appendChild(c);
  }

  for (let i = 0; i < 6; i++) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const p = polar(cx, cy, maxR + 10, i * 60);
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', p.x); line.setAttribute('y2', p.y);
    line.setAttribute('stroke', '#e2e8f0'); line.setAttribute('stroke-width', '1.5');
    svg.appendChild(line);
  }

  wheelCategories.forEach((cat, i) => {
    const start = i * 60, end = start + 60;
    const value = values[i] || 0;
    const r2 = innerR + step * value;

    if (value > 0) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', sectorPath(cx, cy, innerR, r2, start, end));
      path.setAttribute('fill', cat.color);
      path.setAttribute('fill-opacity', activeIndex === i ? '0.92' : '0.78');
      path.setAttribute('stroke', '#ffffff'); path.setAttribute('stroke-width', '2');
      svg.appendChild(path);
    }

    if (activeIndex === i) {
      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      ring.setAttribute('d', sectorPath(cx, cy, innerR, maxR, start, end));
      ring.setAttribute('fill', 'none'); ring.setAttribute('stroke', cat.color);
      ring.setAttribute('stroke-width', '4'); ring.setAttribute('stroke-dasharray', '8 6');
      svg.appendChild(ring);
    }

    const lp = polar(cx, cy, maxR + 50, start + 30);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', lp.x); text.setAttribute('y', lp.y);
    text.setAttribute('font-size', '13');
    text.setAttribute('font-weight', activeIndex === i ? '800' : '700');
    text.setAttribute('fill', activeIndex === i ? cat.color : '#64748b');
    text.setAttribute('text-anchor', 'middle');
    text.textContent = cat.name;
    svg.appendChild(text);

    if (value > 0) {
      const sp = polar(cx, cy, Math.max(innerR + 14, innerR + step * value - 10), start + 30);
      const st = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      st.setAttribute('x', sp.x); st.setAttribute('y', sp.y);
      st.setAttribute('font-size', '13'); st.setAttribute('font-weight', '800');
      st.setAttribute('fill', '#1e293b'); st.setAttribute('text-anchor', 'middle');
      st.textContent = value;
      svg.appendChild(st);
    }
  });

  const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  center.setAttribute('cx', cx); center.setAttribute('cy', cy); center.setAttribute('r', innerR);
  center.setAttribute('fill', '#ffffff'); center.setAttribute('stroke', '#e2e8f0');
  center.setAttribute('stroke-width', '2');
  svg.appendChild(center);
}

// ===== Экран 14: колесо баланса (новое) =====
var wheelInitialized = false;

function initWheel() {
  if (wheelInitialized) {
    renderWheel('wheelSvg', state.wheel.values, state.wheel.currentIndex);
    return;
  }
  wheelInitialized = true;

  const segBtnContainer = document.getElementById('seg-level-buttons');
  const currentSegName = document.getElementById('current-seg-name');
  const btnFinish = document.getElementById('btn-wheel-finish');
  const btnReset = document.getElementById('btn-wheel-reset');

  function findNextUnfilled() {
    return state.wheel.values.findIndex(v => v === 0);
  }

  segBtnContainer.innerHTML = '';
  for (let i = 1; i <= 10; i++) {
    const b = document.createElement('button');
    b.textContent = i;
    b.dataset.level = i;
    segBtnContainer.appendChild(b);
  }

  function updateUI() {
    const idx = state.wheel.currentIndex;
    const name = wheelCategories[idx].name;
    const value = state.wheel.values[idx];
    currentSegName.textContent = name;
    segBtnContainer.querySelectorAll('button').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.level, 10) === value);
    });
    renderWheel('wheelSvg', state.wheel.values, idx);
    const allFilled = state.wheel.values.every(v => v > 0);
    btnFinish.style.display = allFilled ? 'inline-flex' : 'none';
    btnReset.style.display = allFilled ? 'inline-flex' : 'none';
     }

  segBtnContainer.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    state.wheel.values[state.wheel.currentIndex] = parseInt(e.target.dataset.level, 10);
    const next = findNextUnfilled();
    if (next !== -1) state.wheel.currentIndex = next;
    updateUI();
  });

  // Готово — начисляем очки и переходим на экран 15
  btnFinish.addEventListener('click', () => {
    addScore(2);
    showScreen('screen-15');
  });

  // Оценить заново — сбрасываем все оценки
  btnReset.addEventListener('click', () => {
    state.wheel.values = [0, 0, 0, 0, 0, 0];
    state.wheel.currentIndex = 0;
    updateUI();
  });

  state.wheel.currentIndex = 0;
  updateUI();
}

// ===== Экран 15: результат колеса (новое) =====
function initWheelSummary() {
  const slidersContainer = document.getElementById('importance-sliders');
  const btnCalc = document.getElementById('btn-calc-priority');
  const resultBlock = document.getElementById('priority-result');
  const topSectorsEl = document.getElementById('top-sectors');
  let slidersBuilt = false;

  function buildSliders() {
    if (slidersBuilt) return;
    slidersBuilt = true;
    slidersContainer.innerHTML = '';
    wheelCategories.forEach((cat, i) => {
      const row = document.createElement('div');
      row.className = 'importance-row';
      row.innerHTML = `
        <span class="imp-label">${cat.emoji} ${cat.name}</span>
        <input type="range" min="1" max="10" value="${state.wheel.importance[i]}" data-idx="${i}">
        <span class="imp-value">${state.wheel.importance[i]}</span>
      `;
      const slider = row.querySelector('input[type="range"]');
      const valSpan = row.querySelector('.imp-value');
      slider.addEventListener('input', () => {
        state.wheel.importance[i] = parseInt(slider.value, 10);
        valSpan.textContent = slider.value;
      });
      slidersContainer.appendChild(row);
    });
  }

  btnCalc.addEventListener('click', () => {
    // Формула: score = importance * (11 - wheelValue)
    // Чем выше важность И чем ниже текущий балл контактов — тем выше score
    const scores = wheelCategories.map((cat, i) => ({
      idx: i,
      name: cat.name,
      emoji: cat.emoji,
      importance: state.wheel.importance[i],
      contacts: state.wheel.values[i],
     score: state.wheel.importance[i] * (11 - state.wheel.values[i])
    }));
    document.getElementById('btn-screen15-continue').style.display = 'inline-flex';

    // Сортируем по убыванию score
    scores.sort((a, b) => b.score - a.score);

    // Берём топ — все с максимальным score, или топ-2
    const topScore = scores[0].score;
    const top = scores.filter(s => s.score >= topScore * 0.85); // в пределах 85% от макс.

    topSectorsEl.innerHTML = top.map(s =>
      `<span style="display:inline-flex; align-items:center; gap:4px; padding:3px 8px; border-radius:999px; background:rgba(34,197,94,0.12); border:1px solid rgba(34,197,94,0.4); margin:2px;">${s.emoji} ${s.name} <span style="font-size:11px; color:var(--text-soft);">(важность ${s.importance}, контакты ${s.contacts})</span></span>`
    ).join(' ');

    resultBlock.style.display = 'block';
    addScore(2);
  });

  // Отрисовка при открытии экрана
  const observer = new MutationObserver(() => {
    if (document.getElementById('screen-15').classList.contains('active')) {
      renderWheel('resultWheelSvg', state.wheel.values, -1);
      buildSliders();
    }
  });
  observer.observe(document.getElementById('screen-container'), {
    attributes: true, subtree: true, attributeFilter: ['class']
  });
}
// ===== Экран 16: перетаскивание человечков =====
function initPeopleDrag() {
  var pool = document.getElementById('people-pool');
  var target = document.getElementById('people-target');
  var counter = document.getElementById('people-counter');
  var feedback = document.getElementById('people-feedback');
  var btnPlan = document.getElementById('btn-people-plan');
  var btnContinue = document.querySelector('#screen-16 [data-next="screen-16-1"]');

  if (btnContinue) btnContinue.style.display = 'none';

  var colors = [
    '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899',
    '#14b8a6', '#f97316', '#6366f1', '#84cc16', '#06b6d4'
  ];

  var personImg = 'https://i.ibb.co/cSz3DYGB/1.png';

  var hueRotations = [0, 30, 60, 120, 180, 210, 260, 300, 330, 45];

  function createPeople() {
    pool.innerHTML = '';
    target.innerHTML = '';
    feedback.style.display = 'none';
    btnPlan.style.display = 'inline-flex';
    if (btnContinue) btnContinue.style.display = 'none';

    for (var i = 0; i < 10; i++) {
      var p = document.createElement('div');
      p.className = 'person-avatar';
      p.dataset.idx = i;
      p.innerHTML = '<img src="' + personImg + '" alt="Человек ' + (i + 1) + '" style="filter: hue-rotate(' + hueRotations[i] + 'deg);">';
      p.addEventListener('click', function() {
        if (this.style.pointerEvents === 'none') return;
        var inTarget = this.parentElement === target;
        if (inTarget) {
          pool.appendChild(this);
        } else {
          target.appendChild(this);
        }
        updateCounter();
      });
      pool.appendChild(p);
    }
    updateCounter();
  }
  function updateCounter() {
    var count = target.querySelectorAll('.person-avatar').length;
    counter.textContent = count;
    counter.style.color = count > 0 ? '#16a34a' : '#94a3b8';
  }

  function getCount() {
    return target.querySelectorAll('.person-avatar').length;
  }

  function declension(n) {
    if (n === 1) return 'знакомство';
    if (n >= 2 && n <= 4) return 'знакомства';
    return 'знакомств';
  }

  btnPlan.addEventListener('click', function() {
    var count = getCount();

    if (count === 0) {
      feedback.textContent = '🤔 Ты не выбрал ни одного человека. Добавь хотя бы одного!';
      feedback.style.color = '#ef4444';
      feedback.style.display = 'block';
      return;
    }

  if (count > 6) {
      // Сначала сбрасываем
      createPeople();
// Потом показываем сообщение (после createPeople)
      feedback.innerHTML = 'Это слишком много! На одном мероприятии сложно качественно познакомиться с ' + count + ' людьми.<br>Помни: <strong>качество важнее количества</strong>. Попробуй выбрать от 1 до 6.';
      feedback.style.color = '#ef4444';
      feedback.style.display = 'block';
      return;
    }

    feedback.innerHTML = '🎉 Отличный план! <strong>' + count + ' ' + declension(count) + '</strong> — это реалистичная и достижимая цель!';
    feedback.style.color = '#16a34a';
    feedback.style.display = 'block';

    document.querySelectorAll('#screen-16 .person-avatar').forEach(function(p) {
      p.style.pointerEvents = 'none';
      p.style.opacity = '0.7';
    });

    btnPlan.style.display = 'none';
    if (btnContinue) btnContinue.style.display = 'inline-flex';
    addScore(2);
  });

  createPeople();
}

// ===== Экран 19: визитка =====
var bizcardZones = {};
var bizcardDone = false;

function checkBizcard() {
  if (bizcardDone) return;
  var feedback = document.getElementById('bc-feedback');
  var template = document.getElementById('bc-template');
  var phoneError = document.getElementById('bc-phone-error');

  // Скрываем ошибку телефона
  if (phoneError) phoneError.style.display = 'none';

  // Проверяем поля
  var fields = template.querySelectorAll('.bc-field');
  var allFilled = true;
  for (var i = 0; i < fields.length; i++) {
    fields[i].classList.remove('error');
    if (!fields[i].value.trim()) {
      fields[i].classList.add('error');
      allFilled = false;
    }
  }

  // Проверяем телефон на буквы
  var phoneField = document.getElementById('bc-phone');
  if (phoneField && phoneField.value.trim()) {
    var phoneVal = phoneField.value.trim();
    // Разрешаем цифры, +, -, (, ), пробелы
    if (/[a-zA-Zа-яА-ЯёЁ]/.test(phoneVal)) {
      phoneField.classList.add('error');
      if (phoneError) phoneError.style.display = 'block';
      feedback.textContent = '📞 В поле телефона должны быть только цифры!';
      feedback.className = 'bizcard-feedback err';
      return;
    }
  }

  if (!allFilled) {
    feedback.textContent = 'Заполни все поля, чтобы визитка работала.';
    feedback.className = 'bizcard-feedback err';
    return;
  }

  // Проверяем логотип
  if (!bizcardZones.logo || !bizcardZones.logo.filled) {
    var logoEl = document.getElementById('bc-zone-logo');
    logoEl.classList.add('error-flash');
    setTimeout(function() { logoEl.classList.remove('error-flash'); }, 800);
    feedback.textContent = 'Не забудь добавить логотип компании.';
    feedback.className = 'bizcard-feedback err';
    return;
  }

  // Проверяем остальные зоны
  if (!bizcardZones.qr.filled || !bizcardZones.photo.filled) {
    feedback.textContent = 'Визитка ещё не готова! Перетащи все нужные элементы на свои места.';
    feedback.className = 'bizcard-feedback err';
    return;
  }

  // Всё готово!
  bizcardDone = true;
  template.classList.add('celebrate');
  feedback.textContent = '🎉 Отлично! Твоя визитка готова.';
  feedback.className = 'bizcard-feedback ok';
  addScore(1);
  document.getElementById('btn-bizcard-check').style.display = 'none';
  document.getElementById('btn-bizcard-next').style.display = 'inline-flex';
}

window.checkBizcard = checkBizcard;

function initBizcard() {
  var feedback = document.getElementById('bc-feedback');
  var phoneField = document.getElementById('bc-phone');
  var phoneError = document.getElementById('bc-phone-error');
  var currentDrag = null;

  bizcardZones = {
    logo:  { el: document.getElementById('bc-zone-logo'),  filled: false, emoji: '🏢', ok: '✅ Верно! Логотип помогает понять, откуда ты.' },
    qr:    { el: document.getElementById('bc-zone-qr'),    filled: false, emoji: '📱', ok: '✅ Верно! Человек сможет быстро перейти к твоему блогу.' },
    photo: { el: document.getElementById('bc-zone-photo'), filled: false, emoji: '📸', ok: '✅ Верно! Так человеку будет легче тебя запомнить.' }
  };

  // Валидация телефона в реальном времени
  if (phoneField) {
    phoneField.addEventListener('input', function() {
      var val = this.value;
      if (/[a-zA-Zа-яА-ЯёЁ]/.test(val)) {
        this.classList.add('error');
        if (phoneError) phoneError.style.display = 'block';
      } else {
        this.classList.remove('error');
        if (phoneError) phoneError.style.display = 'none';
      }
    });
  }

  // Кнопка проверки
  var btnCheck = document.getElementById('btn-bizcard-check');
  if (btnCheck) {
    btnCheck.addEventListener('click', function() {
      checkBizcard();
    });
  }

  // Drag start
  document.addEventListener('dragstart', function(e) {
    if (!e.target.classList || !e.target.classList.contains('drag-el')) return;
    currentDrag = e.target;
    e.target.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.el);
  });

  document.addEventListener('dragend', function(e) {
    if (!e.target.classList || !e.target.classList.contains('drag-el')) return;
    e.target.style.opacity = '';
    currentDrag = null;
  });

  // Drop-зоны
  var keys = ['logo', 'qr', 'photo'];
  for (var k = 0; k < keys.length; k++) {
    (function(key) {
      var z = bizcardZones[key];
      if (!z.el) return;

      z.el.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        z.el.classList.add('drag-over');
      });

      z.el.addEventListener('dragleave', function() {
        z.el.classList.remove('drag-over');
      });

      z.el.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        z.el.classList.remove('drag-over');
        if (!currentDrag) return;

        var elType = currentDrag.dataset.el;

        if (elType === key) {
          z.filled = true;
          z.el.classList.add('filled');
         var imgSrc = currentDrag.getAttribute('data-img');
if (imgSrc) {
  z.el.innerHTML = '<img src="' + imgSrc + '" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">';
} else {
  z.el.textContent = z.emoji;
}
          currentDrag.classList.add('placed');
          feedback.textContent = z.ok;
          feedback.className = 'bizcard-feedback ok';
        } else {
          z.el.classList.add('error-flash');
          setTimeout(function() { z.el.classList.remove('error-flash'); }, 800);
          feedback.textContent = 'Это место не подходит. Попробуй ещё раз.';
          feedback.className = 'bizcard-feedback err';
        }
      });
    })(keys[k]);
  }
}

// ===== Экран 20: выбор фото =====
var photoSelected = null;
var photoDone = false;

var photoFeedbacks = {
  '2': '❌ Селфи в лифте — слишком неформально. Лицо закрыто телефоном, свет плохой. На профессиональном фото должно быть хорошо видно лицо.',
  '3': '❌ Фото с бокалом и вечеринки создаёт не тот образ. Для профиля лучше нейтральная, деловая обстановка.',
  '4': '❌ На групповом фото непонятно, кто ты. Для профиля нужно фото, где ты — единственный герой кадра.',
  '5': '❌ Пляжное фото — для личного архива. В профессиональном профиле — деловая или нейтральная одежда.',
  '6': '❌ Лицо почти не видно. Хороший свет — базовое требование. Если тебя не узнать на фото, оно не поможет в нетворкинге.'
};

function initPhotoGame() {
  var grid = document.getElementById('photo-grid');
  if (!grid) return;

  grid.addEventListener('click', function(e) {
    if (photoDone) return;
    var card = e.target.closest('.photo-card');
    if (!card) return;

    grid.querySelectorAll('.photo-card').forEach(function(c) {
      c.classList.remove('selected', 'wrong');
    });
    card.classList.add('selected');
    photoSelected = card.dataset.photo;
  });
}

function checkPhoto() {
  if (photoDone) return;
  var fb = document.getElementById('photo-feedback');
  var grid = document.getElementById('photo-grid');

  if (!photoSelected) {
    fb.textContent = 'Сначала выбери одну фотографию.';
    fb.className = 'photo-feedback err';
    return;
  }

  var card = grid.querySelector('[data-photo="' + photoSelected + '"]');

  if (photoSelected === '1') {
    photoDone = true;
    card.classList.remove('selected');
    card.classList.add('correct');

    grid.querySelectorAll('.photo-card').forEach(function(c) {
      if (c.dataset.photo !== '1') c.classList.add('dimmed');
    });

    var bonus = document.createElement('div');
    bonus.className = 'float-bonus';
    bonus.textContent = '+1 🌟 Узнаваемость';
    card.appendChild(bonus);

    fb.innerHTML = '✅ Верно! Это фото идеально подходит для профиля:<br>• Лицо хорошо видно<br>• Нейтральный фон<br>• Деловая одежда<br>• Естественная улыбка<br>• Хороший свет<br>По такому фото Злату легко узнать и на конференции, и в переписке.';
    fb.className = 'photo-feedback ok';

    addScore(1);
    document.getElementById('btn-photo-check').style.display = 'none';
    document.getElementById('btn-photo-next').style.display = 'inline-flex';
  } else {
    card.classList.add('wrong');
    setTimeout(function() { card.classList.remove('wrong'); }, 500);

    var msg = photoFeedbacks[photoSelected] || '❌ Это фото не подходит.';
    fb.innerHTML = msg + '<br><span style="color:var(--text-soft); font-size:11px;">Попробуй ещё раз!</span>';
    fb.className = 'photo-feedback err';
  }
}

window.checkPhoto = checkPhoto;
// ===== Экран 20-1: статус профиля =====
function setStatus() {
  var role = document.getElementById('status-role').value.trim();
  var spec = document.getElementById('status-spec').value.trim();
  var focus = document.getElementById('status-focus').value.trim();
  var fb = document.getElementById('status-feedback');

  if (!role || !spec || !focus) {
    fb.textContent = 'Заполни все поля, чтобы установить статус.';
    fb.style.color = '#ef4444';
    return;
  }

  var statusLine = role + ' | ' + spec + ' | ' + focus;
  document.getElementById('status-text').textContent = statusLine;
  document.getElementById('status-preview').style.display = 'block';
  document.getElementById('status-form').style.display = 'none';
  fb.textContent = '';

  document.getElementById('btn-status-set').style.display = 'none';
  document.getElementById('btn-status-retry').style.display = 'inline-flex';
  document.getElementById('btn-status-next').style.display = 'inline-flex';

  addScore(1);

  // Показываем модалку внутри сцены
  var overlay = document.getElementById('status-modal');
  if (overlay) {
    overlay.classList.add('active');
  }
}
function retryStatus() {
  document.getElementById('status-role').value = '';
  document.getElementById('status-spec').value = '';
  document.getElementById('status-focus').value = '';
  document.getElementById('status-preview').style.display = 'none';
  document.getElementById('status-form').style.display = 'block';
  document.getElementById('status-feedback').textContent = '';
  document.getElementById('btn-status-set').style.display = 'inline-flex';
  document.getElementById('btn-status-retry').style.display = 'none';
  document.getElementById('btn-status-next').style.display = 'none';
}

window.setStatus = setStatus;
window.retryStatus = retryStatus;
  // ===== Экран 20–21: повышение узнаваемости =====
  // ===== Supabase =====
var SUPABASE_URL = 'https://hdzelembnsoejijvlhzj.supabase.co';
var SUPABASE_KEY = 'sb_publishable_y4va7P8-6stuCGq4b55LuQ_rmM3JUD4';
var supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ===== Экран 20–21: повышение узнаваемости =====
function initProfileAndSticky() {
  var board = document.getElementById('sticky-board');
  var input = document.getElementById('sticky-input');
  var addBtn = document.getElementById('btn-sticky-add');

  // Загрузка стикеров из Supabase
  function loadStickies() {
    if (!supabase) return;
    supabase
      .from('stickies')
      .select('*')
      .eq('screen', 'screen-21')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(function(result) {
        if (result.error) { console.error(result.error); return; }
        board.innerHTML = '';
        result.data.forEach(function(row) {
          board.appendChild(createStickyEl(row));
        });
      });
  }

  // Создание DOM-элемента стикера
  function createStickyEl(row) {
    var sticky = document.createElement('div');
    sticky.className = 'sticky';
    sticky.dataset.id = row.id;
    sticky.innerHTML =
      '<div>' + escapeHtml(row.text) + '</div>' +
      '<div class="sticky-footer">' +
        '<span style="opacity:0.7;">' + escapeHtml(row.author || 'Аноним') + '</span>' +
        '<span class="like-count" data-likes="' + (row.likes || 0) + '">♥ ' + (row.likes || 0) + '</span>' +
      '</div>';
    return sticky;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Добавление стикера
  addBtn.addEventListener('click', function() {
    var text = input.value.trim();
    if (!text) return;

    if (supabase) {
      supabase
        .from('stickies')
        .insert({ screen: 'screen-21', text: text, author: 'Участник', likes: 0 })
        .select()
        .then(function(result) {
          if (result.error) {
            console.error(result.error);
            return;
          }
          if (result.data && result.data.length > 0) {
            var el = createStickyEl(result.data[0]);
            board.insertBefore(el, board.firstChild);
          }
          addScore(1);
          input.value = '';
        });
    } else {
      // Fallback без Supabase
      var fallback = { id: Date.now(), text: text, author: 'Ты', likes: 0 };
      board.insertBefore(createStickyEl(fallback), board.firstChild);
      addScore(1);
      input.value = '';
    }
  });

  // Лайки
  board.addEventListener('click', function(e) {
    var target = e.target.closest('.like-count');
    if (!target) return;
    var sticky = target.closest('.sticky');
    var id = sticky ? sticky.dataset.id : null;
    var likes = parseInt(target.dataset.likes || '0', 10) + 1;

    target.dataset.likes = String(likes);
    target.textContent = '♥ ' + likes;

    if (supabase && id) {
      supabase
        .from('stickies')
        .update({ likes: likes })
        .eq('id', id)
        .then(function(result) {
          if (result.error) console.error(result.error);
        });
    }
  });

  // Realtime подписка — новые стикеры появляются у всех
  if (supabase) {
    supabase
      .channel('stickies-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'stickies',
        filter: 'screen=eq.screen-21'
      }, function(payload) {
        // Не дублируем если уже есть
        if (board.querySelector('[data-id="' + payload.new.id + '"]')) return;
        board.insertBefore(createStickyEl(payload.new), board.firstChild);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'stickies'
      }, function(payload) {
        var el = board.querySelector('[data-id="' + payload.new.id + '"]');
        if (!el) return;
        var lc = el.querySelector('.like-count');
        if (lc) {
          lc.dataset.likes = String(payload.new.likes);
          lc.textContent = '♥ ' + payload.new.likes;
        }
      })
      .subscribe();

    // Загружаем при открытии экрана
    var obs = new MutationObserver(function() {
      if (document.getElementById('screen-21').classList.contains('active')) {
        loadStickies();
      }
    });
    obs.observe(document.getElementById('screen-container'), {
      attributes: true, subtree: true, attributeFilter: ['class']
    });

    loadStickies();
  }
}
 // ===== Экран 21-1: сумочка нетворкера =====
  function initBag() {
    var items = [
      {emoji:'💼',name:'Визитница',text:'Это не та визитница, которая находится в левом внутреннем кармане пиджака или блейзера. Это запасная визитница — неприкосновенный запас, пользоваться которым нужно в случае крайней необходимости.'},
      {emoji:'🖊️',name:'Ручка',text:'Всегда имей при себе запасную ручку, а лучше две. Идеально, если они именные или корпоративные.'},
      {emoji:'📓',name:'Записная книжка',text:'Понадобится для записей мыслей в дороге, во время семинаров или конференций. Не бери в привычку запоминать имена, телефоны, идеи и любые мысли. Забудешь.'},
      {emoji:'🧻',name:'Салфетки',text:'Частые переезды, десятки рукопожатий в день, регулярные кофе-брейки, где еду чаще всего берут руками. Влажные салфетки тут просто незаменимы. Рекомендация: используй антибактериальные жидкости на спиртовой основе.'},
      {emoji:'🧴',name:'Пятновыводитель',text:'Порой случается этот неловкий момент, когда приятный и вкусный кофе-брейк заканчивается пятном на сорочке или брюках. А ведь конференция только началась. Но зачем выдумывать велосипед, когда есть компактные пятновыводители?'},
      {emoji:'💊',name:'Аптечка',text:'Частые переезды и длительные конференции выматывают. Не нужно с собой брать огромную аптечку. Отрежь по 2–4 таблетки от каждой пластины и возьми только средства от головной боли, от давления и для улучшения пищеварения.'},
      {emoji:'🍬',name:'Мятные конфеты',text:'Продолжая тему кофе-брейков, убедись, что после его завершения с тобой приятно общаться. Как говорится: «Свежесть дыхания облегчает понимание».'},
      {emoji:'📖',name:'Книга или журнал',text:'Любой нетворкер должен уделять время развитию своего кругозора. Он помогает поддержать разговор на разные темы. Поэтому возьми в привычку читать книги и журналы в свободную минуту.'},
      {emoji:'🔋',name:'Зарядное устройство',text:'Универсальное зарядное устройство — гаджет размером с визитницу, которое заряжает ваш телефон без подключения к электричеству. Выручает при каждой поездке.'},
      {emoji:'✨',name:'Парфюм',text:'Дело каждого использовать парфюм или нет. Можно держать в сумке парфюм маленькой ёмкости 30 мл или купить пробники.'}
    ];
    var shelf = document.getElementById('bag-shelf');
    var zone = document.getElementById('bag-zone');
    var modal = document.getElementById('bag-modal');
    var mTitle = document.getElementById('bag-modal-title');
    var mText = document.getElementById('bag-modal-text');
    var mTake = document.getElementById('bag-modal-take');
    var btnGo = document.getElementById('btn-bag-go');
    var doneMsg = document.getElementById('bag-done-msg');
    var currentIdx = -1;
    var taken = 0;

    items.forEach(function(item, i) {
      var el = document.createElement('div');
      el.className = 'bag-item';
      el.dataset.idx = i;
      el.innerHTML = '<span class="bag-emoji">' + item.emoji + '</span>' + item.name;
      el.addEventListener('click', function() {
        currentIdx = i;
        mTitle.textContent = item.emoji + ' ' + item.name;
        mText.textContent = item.text;
        modal.classList.add('active');
      });
      shelf.appendChild(el);
    });

    mTake.addEventListener('click', function() {
      if (currentIdx < 0) return;
      var el = shelf.querySelector('[data-idx="' + currentIdx + '"]');
      if (el && !el.classList.contains('taken')) {
        el.classList.add('taken');
        var chip = document.createElement('div');
        chip.className = 'bag-chip';
        chip.textContent = items[currentIdx].emoji + ' ' + items[currentIdx].name;
        zone.appendChild(chip);
        taken++;
        if (taken >= items.length) {
          doneMsg.style.display = 'block';
          btnGo.style.display = 'inline-flex';
        }
      }
      modal.classList.remove('active');
      currentIdx = -1;
    });

    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.classList.remove('active');
    });

  btnGo.addEventListener('click', function() {
      showScreen('screen-21-2');
    });
  }
 

 // ===== Экран 16-1: локации =====
  function initLocations() {
    const pool = document.getElementById('location-pool');
    const modal = document.getElementById('locations-modal');
    const feedbackEl = document.getElementById('locations-feedback');
    const btnDone = document.getElementById('btn-locations-done');
    const btnContinue = document.getElementById('locations-continue');

    const locations = [
      'Бары', 'Ночные клубы', 'Рестораны', 'Домашние вечеринки',
      'Кафе', 'Залы заседаний', 'Спортзал', 'Офисные переговорные',
      'Конференции','Телефонные разговоры',
      'Переписка по электронной почте', 'Видеочаты', 'Мессенджеры',
      'Природа', 'Вечеринки на свежем воздухе', 'Званые ужины',
      'Походы в кино', 'Казино', 'Концерты',
      'Официальные мероприятия с дресс-кодом', 'Коктейльные вечеринки',
      'Тематические парки', 'Фестивали', 'Корпоративные мероприятия',
      'Спортивные мероприятия'
    ];

    // Создаём чипы
    locations.forEach(loc => {
      const chip = document.createElement('div');
      chip.className = 'location-chip';
      chip.textContent = loc;
      chip.draggable = true;
      chip.dataset.location = loc;
      pool.appendChild(chip);
    });

    // Drag & Drop
    let draggedChip = null;

    document.addEventListener('dragstart', e => {
      if (e.target.classList.contains('location-chip')) {
        draggedChip = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      }
    });

    document.addEventListener('dragend', e => {
      if (e.target.classList.contains('location-chip')) {
        e.target.classList.remove('dragging');
        draggedChip = null;
        document.querySelectorAll('.location-drop-zone').forEach(z => z.classList.remove('drag-over'));
      }
    });

    // Разрешаем drop на зонах категорий И на пуле (возврат)
    const allDropZones = document.querySelectorAll('#screen-16-1 .location-drop-zone');
    
    function setupDropZone(zone) {
      zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });
      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        if (draggedChip) {
          zone.appendChild(draggedChip);
          // Обновляем стиль чипа
          draggedChip.classList.remove('in-comfort', 'in-neutral', 'in-avoid');
          const cat = zone.dataset.category;
          if (cat === 'comfort') draggedChip.classList.add('in-comfort');
          else if (cat === 'neutral') draggedChip.classList.add('in-neutral');
          else if (cat === 'avoid') draggedChip.classList.add('in-avoid');
        }
      });
    }

    allDropZones.forEach(setupDropZone);

    // Пул тоже как drop-зона (для возврата)
    pool.addEventListener('dragover', e => e.preventDefault());
    pool.addEventListener('drop', e => {
      e.preventDefault();
      if (draggedChip) {
        pool.appendChild(draggedChip);
        draggedChip.classList.remove('in-comfort', 'in-neutral', 'in-avoid');
      }
    });

    // Кнопка «Готово»
    btnDone.addEventListener('click', () => {
      const comfortZone = document.querySelector('.location-drop-zone[data-category="comfort"]');
      const neutralZone = document.querySelector('.location-drop-zone[data-category="neutral"]');
      const avoidZone = document.querySelector('.location-drop-zone[data-category="avoid"]');

      const comfortItems = Array.from(comfortZone.querySelectorAll('.location-chip')).map(c => c.textContent);
      const neutralItems = Array.from(neutralZone.querySelectorAll('.location-chip')).map(c => c.textContent);
      const avoidItems = Array.from(avoidZone.querySelectorAll('.location-chip')).map(c => c.textContent);

      let html = '';

      if (comfortItems.length > 0) {
        html += `
          <div style="margin-bottom: 8px;">
            <strong style="color: #4ade80;">🐟 Как рыба в воде (${comfortItems.length}):</strong>
            <p style="font-size: 13px; margin-top: 2px;">Это те места, куда ты ходишь с удовольствием и где чувствуешь себя в полной мере собой.</p>
            <p style="font-size: 12px; color: var(--text-soft); margin-top: 2px;">${comfortItems.join(', ')}</p>
          </div>
        `;
      }

      if (neutralItems.length > 0) {
        html += `
          <div style="margin-bottom: 8px;">
            <strong style="color: #facc15;">😐 Нейтрально (${neutralItems.length}):</strong>
            <p style="font-size: 13px; margin-top: 2px;">Ситуации, связанные с общением, могут развиваться по-разному — всё зависит от настроения и от того, кто рядом.</p>
            <p style="font-size: 12px; color: var(--text-soft); margin-top: 2px;">${neutralItems.join(', ')}</p>
          </div>
        `;
      }

      if (avoidItems.length > 0) {
        html += `
          <div style="margin-bottom: 8px;">
            <strong style="color: #f97373;">🚫 Ноги моей тут не будет (${avoidItems.length}):</strong>
            <p style="font-size: 13px; margin-top: 2px;">Тут тебе неуютно, скучно и плохо.</p>
            <p style="font-size: 12px; color: var(--text-soft); margin-top: 2px;">${avoidItems.join(', ')}</p>
          </div>
        `;
      }

      if (comfortItems.length === 0 && neutralItems.length === 0 && avoidItems.length === 0) {
        html = '<p>Ты пока ничего не распределил. Попробуй перетащить хотя бы несколько локаций!</p>';
      }

      feedbackEl.innerHTML = html;
      addScore(2);
      modal.classList.add('active');
    });

    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('active');
    });

 btnContinue.addEventListener('click', () => {
  modal.classList.remove('active');
  showScreen('screen-17');
});
  }

// ===== Экран 17: SMART-цель =====
function initSmartGoal() {
  var fields = {
    s: document.getElementById('smart-s'),
    m: document.getElementById('smart-m'),
    a: document.getElementById('smart-a'),
    r: document.getElementById('smart-r'),
    t: document.getElementById('smart-t')
  };

  var btnSubmit = document.getElementById('btn-smart-submit');
  var btnSave = document.getElementById('btn-smart-save');
  var btnContinue = document.getElementById('btn-smart-continue');
  var warningModal = document.getElementById('smart-warning-modal');
  var warningOk = document.getElementById('smart-warning-ok');
  var feedbackModal = document.getElementById('smart-feedback-modal');
  var feedbackContent = document.getElementById('smart-feedback-content');
  var feedbackContinue = document.getElementById('smart-feedback-continue');
  var exampleToggle = document.getElementById('smart-example-toggle');
  var exampleBody = document.getElementById('smart-example-body');
  var exampleArrow = document.getElementById('smart-example-arrow');
  var toast = document.getElementById('smart-saved-toast');

  if (!btnSubmit || !fields.s) return;

  // Загрузка сохранённых ответов
  var saved = localStorage.getItem('nc_smart_goal');
  if (saved) {
    try {
      var data = JSON.parse(saved);
      Object.keys(data).forEach(function(key) {
        if (fields[key]) fields[key].value = data[key];
      });
    } catch (e) {}
  }

  // Автоподсветка заполненных полей
  Object.keys(fields).forEach(function(key) {
    fields[key].addEventListener('input', function() {
      this.classList.remove('error');
      if (this.value.trim()) {
        this.classList.add('filled');
      } else {
        this.classList.remove('filled');
      }
    });
    // Инициализация при загрузке
    if (fields[key].value.trim()) {
      fields[key].classList.add('filled');
    }
  });

  // Пример Златы — аккордеон
  exampleToggle.addEventListener('click', function() {
    exampleBody.classList.toggle('open');
    exampleArrow.classList.toggle('open');
  });

  // Проверка заполнения
  function getAllFilled() {
    var allFilled = true;
    var values = {};
    Object.keys(fields).forEach(function(key) {
      var val = fields[key].value.trim();
      values[key] = val;
      if (!val) allFilled = false;
    });
    return { allFilled: allFilled, values: values };
  }

  // Кнопка «Ответить»
  btnSubmit.addEventListener('click', function() {
    var result = getAllFilled();

    if (!result.allFilled) {
      // Подсвечиваем пустые
      Object.keys(fields).forEach(function(key) {
        if (!fields[key].value.trim()) {
          fields[key].classList.add('error');
        }
      });
      warningModal.classList.add('active');
      return;
    }

    // Формируем ОС
    var html = '';
    var labels = {
      s: { letter: 'S', name: 'Конкретная', color: '#22c55e' },
      m: { letter: 'M', name: 'Измеримая', color: '#3b82f6' },
      a: { letter: 'A', name: 'Достижимая', color: '#f59e0b' },
      r: { letter: 'R', name: 'Релевантная', color: '#a855f7' },
      t: { letter: 'T', name: 'Ограниченная по времени', color: '#ef4444' }
    };

    Object.keys(labels).forEach(function(key) {
      var l = labels[key];
      html += '<div style="padding:8px 0; border-bottom:1px solid #f1f5f9;">';
      html += '<strong style="color:' + l.color + ';">' + l.letter + ' — ' + l.name + ':</strong> ';
      html += '<span style="color:var(--text);">' + result.values[key] + '</span>';
      html += '</div>';
    });

    feedbackContent.innerHTML = html;
    feedbackModal.classList.add('active');

    // Автосохраняем
    localStorage.setItem('nc_smart_goal', JSON.stringify(result.values));

    addScore(2);
    btnSubmit.style.display = 'none';
    btnContinue.style.display = 'inline-flex';
  });

  // Закрытие предупреждения
  warningOk.addEventListener('click', function() {
    warningModal.classList.remove('active');
    // Фокус на первое пустое поле
    var keys = Object.keys(fields);
    for (var i = 0; i < keys.length; i++) {
      if (!fields[keys[i]].value.trim()) {
        fields[keys[i]].focus();
        break;
      }
    }
  });

  warningModal.addEventListener('click', function(e) {
    if (e.target === warningModal) warningModal.classList.remove('active');
  });

  // Продолжить в модалке ОС
  feedbackContinue.addEventListener('click', function() {
    feedbackModal.classList.remove('active');
  });

  feedbackModal.addEventListener('click', function(e) {
    if (e.target === feedbackModal) feedbackModal.classList.remove('active');
  });

  // Кнопка «Сохранить»
  btnSave.addEventListener('click', function() {
    var result = getAllFilled();
    localStorage.setItem('nc_smart_goal', JSON.stringify(result.values));

    // Тост
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(function() {
      toast.classList.remove('show');
    }, 2500);
  });
}

// ===== Экран 21-2: карта мероприятия =====
function initVenueMap() {
  var objects = [
    { name:'Ресепшен', good:false, text:'❌ Ловушка! Люди у ресепшена только пришли: они нервничают, оглядываются, ищут знакомых. Если подойти к ним сейчас — они будут рассеяны и быстро уйдут «за напитком» или «поздороваться с кем-то». Ты потратишь энергию впустую. Дай им сначала освоиться.' },
    { name:'Гардероб', good:false, text:'❌ Ловушка! Гардероб — транзитная зона. Люди снимают пальто, убирают вещи, они ещё не «включились» в мероприятие. Начинать знакомство здесь — как будить спящего: неловко и малоэффективно.' },
    { name:'Напитки (Бар)', good:true, text:'⭐ Отличное место! Человек с напитком в руке уже расслабился и готов к общению. Встань рядом с баром — и у тебя всегда будет повод начать разговор: «Как вам вино?» или просто «Привет, я Злата…» Люди, которые собирают больше всего контактов, обычно находятся именно здесь.' },
    { name:'Организатор', good:true, text:'⭐ Золотая точка! Подойди к организатору, поблагодари за приглашение и попроси представить тебя кому-нибудь: «Может, среди гостей есть те, с кем мне стоит познакомиться?» Организатор — твой лучший проводник в мир новых контактов.' },
    { name:'Место у бара (слева)', good:true, text:'⭐ Стратегическая позиция! Люди выходят от бара с напитком, они расслаблены и открыты. В этой точке ты — первый человек, которого они встречают. Идеально для лёгкого начала разговора.' },
    { name:'Место у бара (справа)', good:true, text:'⭐ Ещё одна стратегическая позиция! Те же преимущества: люди с напитками, готовые к беседе. Исследования показывают, что нетворкеры, занимающие точки у бара, собирают больше всего контактов за вечер.' },
    { name:'Еда', good:false, text:'❌ Ловушка! У стола с едой сложно знакомиться: руки заняты тарелкой, неудобно жать руку, кто-то говорит с набитым ртом. Ты мешаешь другим гостям добраться до закусок. И есть риск простоять тут весь вечер, так никого и не встретив.' },
    { name:'Туалеты', good:false, text:'❌ Ловушка! Сходить — конечно, можно. Но торчать рядом — плохая идея. Это транзитная зона, людям здесь неловко, и вряд ли кто-то хочет знакомиться у двери в туалет.' },
    { name:'Друзья', good:false, text:'❌ Ловушка! Встав в кружок с друзьями и коллегами, ты почти наверняка проведёшь так весь вечер. Выбраться из уютного круга и пойти знакомиться — невероятно сложно. Лучше помахай друзьям, скажи «скоро вернусь» и иди в зону общения.' }
  ];

  var found = 0;
  var revealed = {};
  var counter = document.getElementById('venue-counter');
  var modal = document.getElementById('venue-modal');
  var mTitle = document.getElementById('venue-modal-title');
  var mText = document.getElementById('venue-modal-text');
  var mOk = document.getElementById('venue-modal-ok');

  document.querySelectorAll('.venue-obj').forEach(function(el) {
    el.addEventListener('click', function() {
      var idx = parseInt(el.dataset.obj);
      var obj = objects[idx];
      if (!obj) return;

      // Подсветка
      if (obj.good) {
        el.classList.add('venue-good');
      } else {
        el.classList.add('venue-bad');
      }

      // Считаем только новые благоприятные
      if (obj.good && !revealed[idx]) {
        revealed[idx] = true;
        found++;
        counter.textContent = 'Найдено: ' + found + ' из 4';
        if (found >= 4) {
          counter.style.background = 'rgba(34,197,94,0.15)';
          counter.style.borderColor = 'rgba(34,197,94,0.6)';
          counter.style.color = '#166534';
          counter.textContent = 'Найдено: 4 из 4 ✅';
          document.getElementById('venue-success').style.display = 'block';
          document.getElementById('venue-lifehack').style.display = 'block';
          document.getElementById('btn-venue-next').style.display = 'inline-flex';
          addScore(3);
        }
      }
      if (!obj.good) revealed[idx] = true;

      // Модалка
      mTitle.textContent = (obj.good ? '⭐ ' : '❌ ') + obj.name;
      mText.textContent = obj.text;
      modal.classList.add('active');
    });
  });

  mOk.addEventListener('click', function() {
    modal.classList.remove('active');
  });
  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.classList.remove('active');
  });
}
document.addEventListener('DOMContentLoaded', function() {
   // Не запускаем на мобилках
  if (window.__mobileBlocked) return;
  initGlobalNav();
  initMainMenu();
  initQuiz();
  initKeysGame();
  initLaptopHotspot();
  initPurposeScreen();
  initBeadsGame();
  initFears();
   initZlataCard2();
  initWheel();
  initWheelSummary();
  initPeopleDrag();
   initSmartGoal();
  initPhotoGame();
  initBizcard();
  initProfileAndSticky();
  initBag();
  initVenueMap();
  updateHud();
});

