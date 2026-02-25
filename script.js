'use strict';

const FLASHLIGHT_RADIUS_PX = 140; // радиус освещения
const FOLLOW_SPEED = 0.18; // скорость фонарика
const ITEMS = [
  {
    id: 'radio',
    name: 'Радио',
    left: 2.5,
    top: 2.0,
    width: 23.0,
    height: 16.0,
  },
  {
    id: 'airplane',
    name: 'Самолёт',
    left: 35.0,
    top: 7.0,
    width: 25.0,
    height: 10.0,
  },
  {
    id: 'chair',
    name: 'Стул',
    left: 50.5,
    top: 50.0,
    width: 16.0,
    height: 30.0,
  },
  {
    id: 'chess',
    name: 'Шахматная доска',
    left: 28.0,
    top: 54.0,
    width: 16.5,
    height: 17.0,
  },
  {
    id: 'hat',
    name: 'Шляпа',
    left: 80.0,
    top: 72.0,
    width: 16.5,
    height: 20.0,
  },
];

const scene = document.getElementById('scene');
const darkness = document.getElementById('darkness');
const itemsList = document.getElementById('itemsList');
const counter = document.getElementById('counter');
const win = document.getElementById('win');
const restartBtn = document.getElementById('restartBtn');

const foundIds = new Set();

// позиция фонарика
let targetX = 0;
let targetY = 0;
let lampX = 0;
let lampY = 0;

init();

function init() {
  darkness.style.setProperty('--lamp-radius', FLASHLIGHT_RADIUS_PX + 'px');

  renderItemsOnScene();
  renderList();
  updateCounter();

  placeLampToCenter();

  scene.addEventListener('mousemove', onMouseMove);
  scene.addEventListener('click', onSceneClick);

  restartBtn.addEventListener('click', restartGame);

  requestAnimationFrame(tick);
}

function renderItemsOnScene() {
  // div для каждого предмета
  for (const item of ITEMS) {
    const el = document.createElement('div');
    el.className = 'scene-item';
    el.dataset.itemId = item.id;

    el.style.left = item.left + '%';
    el.style.top = item.top + '%';
    el.style.width = item.width + '%';
    el.style.height = item.height + '%';
    el.title = item.name;

    scene.appendChild(el);
  }
}

function renderList() {
  itemsList.innerHTML = '';

  for (const item of ITEMS) {
    const li = document.createElement('li');
    li.textContent = item.name;
    li.dataset.itemId = item.id;

    itemsList.appendChild(li);
  }
}

function updateCounter() {
  counter.textContent = foundIds.size + '/' + ITEMS.length;
}

function onMouseMove(event) {
  const rect = scene.getBoundingClientRect();

  // Координаты внутри сцены
  targetX = event.clientX - rect.left;
  targetY = event.clientY - rect.top;
}

function onSceneClick(event) {
  const itemEl = event.target.closest('.scene-item');
  if (!itemEl) return;

  const itemId = itemEl.dataset.itemId;
  if (!isItemInList(itemId)) return;
  if (foundIds.has(itemId)) return;

  foundIds.add(itemId);

  // Отмечаем предмет на сцене
  itemEl.classList.add('found');
  itemEl.style.pointerEvents = 'none';

  // Отмечаем в списке
  const li = itemsList.querySelector('li[data-item-id="' + itemId + '"]');
  if (li) li.classList.add('found');

  updateCounter();

  if (foundIds.size === ITEMS.length) {
    showWin();
  }
}

function isItemInList(itemId) {
  return ITEMS.some((x) => x.id === itemId);
}

function showWin() {
  win.classList.remove('hidden');
  darkness.style.opacity = '0';
}

function restartGame() {
  foundIds.clear();

  const itemElements = scene.querySelectorAll('.scene-item');
  for (const el of itemElements) {
    el.classList.remove('found');
    el.style.pointerEvents = 'auto';
  }

  // Сбрасываем список
  const listElements = itemsList.querySelectorAll('li');
  for (const li of listElements) {
    li.classList.remove('found');
  }

  updateCounter();

  win.classList.add('hidden');
  darkness.style.opacity = '1';

  placeLampToCenter();
}

function placeLampToCenter() {
  const rect = scene.getBoundingClientRect();
  targetX = rect.width / 2;
  targetY = rect.height / 2;
  lampX = targetX;
  lampY = targetY;
  applyLampPosition(lampX, lampY);
}

function tick() {
  lampX = lampX + (targetX - lampX) * FOLLOW_SPEED;
  lampY = lampY + (targetY - lampY) * FOLLOW_SPEED;

  applyLampPosition(lampX, lampY);

  requestAnimationFrame(tick);
}

function applyLampPosition(x, y) {
  darkness.style.setProperty('--lamp-x', x + 'px');
  darkness.style.setProperty('--lamp-y', y + 'px');
}
