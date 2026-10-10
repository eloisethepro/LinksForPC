
"use strict";

const $ = (selector) => document.querySelector(selector);

const bootScreen = $("#bootScreen");
const bootBar = $("#bootBar");
const bootStatus = $("#bootStatus");
const bootLines = $("#bootLines");
const siteShell = $("#siteShell");
const clock = $("#clock");

let bootTimer;
let bootFinished = false;
let effectTimers = [];
let lastChaosIndex = -1;

const chaosMessages = [
  "REALITY.EXE HAS STOPPED RESPONDING.",
  "ACCESS GRANTED. WELCOME TO THE VOID.",
  "404: NORMAL BEHAVIOR NOT FOUND.",
  "TOO MUCH CHAOS. NOT ENOUGH SLEEP.",
  "SYSTEM OVERRIDE: BE YOURSELF.",
  "WARNING: MAIN CHARACTER DETECTED.",
  "SIGNAL LOST. KEEP WANDERING.",
  "NO RULES FOUND. CARRY ON.",
  "UNAUTHORIZED COOLNESS DETECTED.",
  "THE VOID IS LOOKING BACK."
];

// 实时电子时钟
function updateClock() {
  const now = new Date();

  clock.textContent = now.toLocaleTimeString("en-GB", {
    hour12: false
  });
}

updateClock();
setInterval(updateClock, 1000);

// 启动终端动画
function finishBoot() {
  if (bootFinished) return;

  bootFinished = true;
  clearTimeout(bootTimer);

  bootBar.style.width = "100%";
  bootStatus.textContent = "CONNECTION ESTABLISHED.";

  document.body.classList.add("ready");

  bootScreen.classList.add("boot-hidden");

  setTimeout(() => {
    bootScreen.hidden = true;
  }, 600);
}

function runBoot() {
  if (bootFinished) return;

  const messages = [
    "[ SYSTEM ] INITIALIZING...",
    "[ NETWORK ] ESTABLISHING CONNECTION...",
    "[ IDENTITY ] SEARCHING FOR USER...",
    "[ USER ] TODAY IS STILL WANDERING.",
    "[ SYSTEM ] WELCOME TO YOUR OWN WORLD."
  ];

  bootLines.replaceChildren();

  let index = 0;

  function nextLine() {
    if (bootFinished) return;

    if (index >= messages.length) {
      bootTimer = setTimeout(finishBoot, 350);
      return;
    }

    const line = document.createElement("p");
    line.textContent = messages[index];
    bootLines.appendChild(line);

    index++;
    bootBar.style.width = `${index / messages.length * 100}%`;

    bootStatus.textContent =
      index === messages.length ? "READY_" : "LOADING_";

    bootTimer = setTimeout(nextLine, 230);
  }

  nextLine();
}

$("#skipBoot").addEventListener("click", finishBoot);

if (document.readyState === "complete") {
  runBoot();
} else {
  window.addEventListener("load", runBoot, { once: true });
}

// 防止外部字体或资源加载缓慢时卡在启动画面
bootTimer = setTimeout(finishBoot, 3500);

// 随机选择不同特效
function getRandomChaosIndex() {
  if (chaosMessages.length <= 1) return 0;

  let index;

  do {
    index = Math.floor(Math.random() * chaosMessages.length);
  } while (index === lastChaosIndex);

  lastChaosIndex = index;
  return index;
}

// 创建短暂的银色粒子
function burstParticles(x, y, amount = 22) {
  const layer = $("#effectLayer");
  const symbols = ["✳", "✦", "✧", "⋆", "·"];

  for (let i = 0; i < amount; i++) {
    const particle = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 45 + Math.random() * 170;

    particle.className = "effect-particle";
    particle.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.fontSize = `${9 + Math.random() * 20}px`;
    particle.style.setProperty(
      "--dx",
      `${Math.cos(angle) * distance}px`
    );
    particle.style.setProperty(
      "--dy",
      `${Math.sin(angle) * distance}px`
    );

    layer.appendChild(particle);

    setTimeout(() => particle.remove(), 1600);
  }
}

// 随机故障动画
function glitchEffect() {
  document.body.classList.add("glitch-mode");

  const flash = $("#glitchFlash");
  flash.classList.remove("flash");

  // 重新触发 CSS 动画
  void flash.offsetWidth;
  flash.classList.add("flash");

  effectTimers.push(setTimeout(() => {
    document.body.classList.remove("glitch-mode");
    flash.classList.remove("flash");
  }, 800));
}

// CHAOS BUTTON
const chaosButton = $("#chaosButton");
const chaosMessage = $("#chaosMessage");

chaosButton.addEventListener("click", () => {
  const index = getRandomChaosIndex();
  chaosMessage.textContent = chaosMessages[index];

  const rect = chaosButton.getBoundingClientRect();

  burstParticles(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    32
  );

  const effect = Math.floor(Math.random() * 4);

  if (effect === 0) {
    glitchEffect();
  } else if (effect === 1) {
    document.body.classList.add("glitch-mode");

    effectTimers.push(setTimeout(() => {
      document.body.classList.remove("glitch-mode");
    }, 500));
  } else if (effect === 2) {
    const symbols = ["✳", "✦", "✧", "⋆"];

    for (let i = 0; i < 8; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      burstParticles(
        x,
        y,
        4 + Math.floor(Math.random() * 5)
      );
    }

    chaosMessage.textContent += " ✦";
  } else {
    const output = $("#chaosOutput");

    output.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(0)" }
      ],
      {
        duration: 300,
        iterations: 2
      }
    );
  }
});

// 电脑鼠标星尘
const cursorGlow = $("#cursorGlow");
const cursorStar = $("#cursorStar");

const hasFinePointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
);

if (hasFinePointer.matches) {
  document.body.classList.add("has-mouse");

  let cursorFrame = 0;
  let cursorX = 0;
  let cursorY = 0;

  window.addEventListener("pointermove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;

    if (cursorFrame) return;

    cursorFrame = requestAnimationFrame(() => {
      cursorGlow.style.left = `${cursorX}px`;
      cursorGlow.style.top = `${cursorY}px`;

      cursorStar.style.left = `${cursorX}px`;
      cursorStar.style.top = `${cursorY}px`;

      cursorFrame = 0;
    });
  }, { passive: true });

  let lastTrailTime = 0;

  window.addEventListener("pointermove", (event) => {
    const now = performance.now();

    if (now - lastTrailTime < 90) return;
    lastTrailTime = now;

    if (Math.random() > 0.65) return;

    const particle = document.createElement("span");
    particle.className = "effect-particle";
    particle.textContent = Math.random() > 0.5 ? "✧" : "·";
    particle.style.left = `${event.clientX}px`;
    particle.style.top = `${event.clientY}px`;
    particle.style.fontSize = "10px";
    particle.style.setProperty(
      "--dx",
      `${(Math.random() - 0.5) * 35}px`
    );
    particle.style.setProperty(
      "--dy",
      `${(Math.random() - 0.5) * 35}px`
    );

    $("#effectLayer").appendChild(particle);

    setTimeout(() => particle.remove(), 1400);
  }, { passive: true });
}

// 点击页面空白处出现少量星尘
document.addEventListener("click", (event) => {
  if (
    event.target.closest("button") ||
    event.target.closest("a") ||
    event.target.closest("input")
  ) {
    return;
  }

  if (event.target.closest(".hero")) {
    burstParticles(event.clientX, event.clientY, 5);
  }
});

// 重置视觉效果
$("#soundlessReset").addEventListener("click", () => {
  document.body.classList.remove("glitch-mode");

  effectTimers.forEach(clearTimeout);
  effectTimers = [];

  $("#glitchFlash").classList.remove("flash");
  $("#effectLayer").replaceChildren();

  chaosMessage.textContent = "SYSTEM STABLE. FOR NOW.";
  lastChaosIndex = -1;
});
