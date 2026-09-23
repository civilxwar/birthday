const bootOutput = document.getElementById('boot-output');
const bootScreen = document.getElementById('boot-screen');
const recoveryScreen = document.getElementById('recovery-screen');
const restoreScreen = document.getElementById('restore-screen');
const finalScreen = document.getElementById('final-screen');
const cipherInput = document.getElementById('cipher-input');
const decryptButton = document.getElementById('decrypt-button');
const cipherStatus = document.getElementById('cipher-status');
const restoreProgress = document.getElementById('restore-progress');
const restorePercent = document.getElementById('restore-percent');

const bootLines = [
  'DIAGNOSTYKA SYSTEMU',
  '',
  'Inicjalizacja...',
  '✓ System online',
  '✓ Użytkownik wykryty',
  '✓ Moduł urodzin wykryty',
  '',
  'Skanowanie...',
  '...',
  '...',
  '...',
  'System gotowy do przywrócenia protokołu.'
];

function createCursor() {
  const cursor = document.createElement('span');
  cursor.className = 'boot-cursor';
  cursor.textContent = '|';
  return cursor;
}

async function typeLine(line) {
  if (!line) {
    const spacer = document.createElement('div');
    spacer.className = 'boot-line spacer';
    bootOutput.appendChild(spacer);
    await new Promise((resolve) => setTimeout(resolve, 260));
    return;
  }

  const lineEl = document.createElement('div');
  lineEl.className = 'boot-line';
  bootOutput.appendChild(lineEl);

  let visibleText = '';
  for (let i = 0; i <= line.length; i += 1) {
    visibleText = line.slice(0, i);
    lineEl.innerHTML = `${visibleText}<span class="boot-cursor">|</span>`;
    await new Promise((resolve) => setTimeout(resolve, 70));
  }

  lineEl.textContent = line;
  await new Promise((resolve) => setTimeout(resolve, 180));
}

async function typeBootSequence() {
  for (const line of bootLines) {
    await typeLine(line);
  }

  setTimeout(() => {
    bootScreen.classList.add('hidden');
    recoveryScreen.classList.remove('hidden');
  }, 900);
}

const correctAnswer = 'JVQJZAK';

function revealFinalScreen() {
  restoreScreen.classList.add('hidden');
  finalScreen.classList.remove('hidden');
}

function showRestoreScreen() {
  recoveryScreen.classList.add('hidden');
  restoreScreen.classList.remove('hidden');

  let percent = 0;
  restoreProgress.style.width = '0%';
  restorePercent.textContent = '0%';

  const interval = setInterval(() => {
    percent += 2;

    if (percent >= 100) {
      percent = 100;
      clearInterval(interval);
      restoreProgress.style.width = '100%';
      restorePercent.textContent = '100%';

      setTimeout(() => {
        revealFinalScreen();
      }, 700);
      return;
    }

    restoreProgress.style.width = `${percent}%`;
    restorePercent.textContent = `${percent}%`;
  }, 120);
}

decryptButton.addEventListener('click', () => {
  const value = (cipherInput.value || '').trim().toUpperCase();

  if (!value) {
    cipherStatus.textContent = 'Wprowadź odszyfrowaną wiadomość.';
    cipherStatus.className = 'status-text error';
    return;
  }

  if (value === correctAnswer) {
    cipherStatus.textContent = '✓ ODSZYFROWANIE ZAKOŃCZONE POWODZENIEM';
    cipherStatus.className = 'status-text success';

    setTimeout(() => {
      showRestoreScreen();
    }, 1200);
    return;
  }

  cipherStatus.textContent = 'Dostęp zabroniony. Klucz odzyskiwania jest niepoprawny.';
  cipherStatus.className = 'status-text error';
});

cipherInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    decryptButton.click();
  }
});

typeBootSequence();
