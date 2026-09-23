const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const showcase = $(".showcase");
let toastTimer;
function notify(message) {
  const toast = $(".toast");
  clearTimeout(toastTimer);
  $("p", toast).textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 3500);
}
async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    notify("Copied to clipboard.");
  } catch {
    notify("Select the visible command and copy it with your keyboard.");
  }
}
$$("[data-copy]").forEach((button) =>
  button.addEventListener("click", () => copyText(button.dataset.copy)),
);
$$("[data-copy-id]").forEach((button) =>
  button.addEventListener("click", () =>
    copyText(document.getElementById(button.dataset.copyId).textContent),
  ),
);
$("#year").textContent = new Date().getFullYear();
function choose(buttons, selected) {
  buttons.forEach((button) => {
    const active = button === selected;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}
const menu = $("#mobile-nav");
const menuButton = $(".menu-toggle");
function closeMenu() {
  menu.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}
menuButton.addEventListener("click", () => {
  menu.hidden = !menu.hidden;
  menuButton.setAttribute("aria-expanded", String(!menu.hidden));
  menuButton.setAttribute(
    "aria-label",
    menu.hidden ? "Open navigation" : "Close navigation",
  );
});
$$("a", menu).forEach((link) => link.addEventListener("click", closeMenu));
matchMedia("(min-width:561px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});
const searchLinks = [
  [
    "Getting started",
    "Setup",
    "https://rayden-docs.vercel.app/getting-started",
  ],
  [
    "Buttons & actions",
    "Components",
    "https://rayden-docs.vercel.app/components/button",
  ],
  [
    "Inputs & forms",
    "Components",
    "https://rayden-docs.vercel.app/components/input",
  ],
  [
    "Activity feed",
    "Components",
    "https://rayden-docs.vercel.app/components/activity-feed",
  ],
  [
    "Progress bar",
    "Components",
    "https://rayden-docs.vercel.app/components/progress-bar",
  ],
  [
    "Date picker",
    "Components",
    "https://rayden-docs.vercel.app/components/date-picker",
  ],
  [
    "Design tokens",
    "Customization",
    "https://rayden-docs.vercel.app/design-tokens",
  ],
  [
    "Create Rayden App",
    "Starters",
    "https://rayden-docs.vercel.app/getting-started/create-rayden-app",
  ],
  ["AI companion", "MCP", "https://rayden-docs.vercel.app/ai-integration"],
];
function renderSearch() {
  const term = $("#global-search").value.trim().toLowerCase();
  const results = searchLinks.filter(([title, group]) =>
    `${title} ${group}`.toLowerCase().includes(term),
  );
  const list = $("#global-results");
  list.replaceChildren();
  results.forEach(([title, group, url]) => {
    const link = document.createElement("a");
    link.href = url;
    const label = document.createElement("span");
    label.textContent = title;
    const category = document.createElement("span");
    category.textContent = group;
    link.append(label, category);
    list.append(link);
  });
  if (!results.length) {
    const empty = document.createElement("p");
    empty.className = "dialog-hint";
    empty.textContent = "No results. Try “buttons”, “tokens”, or “AI”.";
    list.append(empty);
  }
}
function openSearch() {
  renderSearch();
  $("#search-dialog").showModal();
  $("#global-search").focus();
}
$(".search-open").addEventListener("click", openSearch);
$("#global-search").addEventListener("input", renderSearch);
$("#global-search").addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    $("#global-results a")?.focus();
  }
});
$("#view-code").addEventListener("click", () => $("#code-dialog").showModal());
$$(".dialog-close").forEach((button) =>
  button.addEventListener("click", () => button.closest("dialog").close()),
);
$$("dialog").forEach((dialog) =>
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom)
    )
      dialog.close();
  }),
);
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    const current = $("dialog[open]");
    if (current) current.close();
    openSearch();
  }
  if (event.key === "Escape" && !menu.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
$("#inline-search").addEventListener("input", (event) => {
  const term = event.target.value.trim().toLowerCase();
  let visible = 0;
  $$("[data-search]").forEach((link) => {
    link.hidden = !`${link.dataset.search} ${link.textContent}`
      .toLowerCase()
      .includes(term);
    if (!link.hidden) visible++;
  });
  $("#inline-empty").hidden = visible > 0;
});
const filters = $$("[data-filter]");
filters.forEach((button) =>
  button.addEventListener("click", () => {
    choose(filters, button);
    $(".showcase-grid").classList.toggle(
      "filtered",
      button.dataset.filter !== "all",
    );
    $$("[data-category]").forEach((card) => {
      card.hidden =
        button.dataset.filter !== "all" &&
        card.dataset.category !== button.dataset.filter;
    });
  }),
);
const swatches = $$(".swatch[data-accent]");
swatches.forEach((button) =>
  button.addEventListener("click", () => {
    choose(swatches, button);
    showcase.dataset.accent = button.dataset.accent;
  }),
);
function setLight(light) {
  showcase.classList.toggle("light-previews", light);
  $(".preview-theme").setAttribute("aria-pressed", String(light));
  $(".preview-theme").setAttribute(
    "aria-label",
    `Switch previews to ${light ? "dark" : "light"} theme`,
  );
}
$(".preview-theme").addEventListener("click", () =>
  setLight(!showcase.classList.contains("light-previews")),
);
function setRadius(value) {
  const radius = Math.max(4, Math.min(24, Number(value) || 16));
  showcase.style.setProperty("--demo-radius", `${radius}px`);
  $("#radius").value = radius;
  $("#radius-value").value = `${radius}`;
}
$("#radius").addEventListener("input", (event) =>
  setRadius(event.target.value),
);
function setMotion(enabled) {
  document.body.classList.toggle("motion-off", !enabled);
  $("#motion-switch").setAttribute("aria-checked", String(enabled));
}
$("#motion-switch").addEventListener("click", () =>
  setMotion($("#motion-switch").getAttribute("aria-checked") !== "true"),
);
$("#save-theme").addEventListener("click", () => {
  const settings = {
    accent: showcase.dataset.accent,
    light: showcase.classList.contains("light-previews"),
    radius: $("#radius").value,
    motion: $("#motion-switch").getAttribute("aria-checked") === "true",
  };
  try {
    sessionStorage.setItem("rayden-copper-preview", JSON.stringify(settings));
    notify("Preview preferences saved for this session.");
  } catch {
    notify("Theme applied. Your browser could not save these preferences.");
  }
});
try {
  const settings = JSON.parse(
    sessionStorage.getItem("rayden-copper-preview") || "null",
  );
  if (settings) {
    const swatch = swatches.find(
      (button) => button.dataset.accent === settings.accent,
    );
    if (swatch) {
      choose(swatches, swatch);
      showcase.dataset.accent = settings.accent;
    }
    setLight(settings.light === true);
    setRadius(settings.radius);
    setMotion(settings.motion !== false);
  }
} catch {
  /* The previews still work when storage is unavailable. */
}
$$(".favorite").forEach((button) =>
  button.addEventListener("click", () => {
    const selected = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(selected));
    notify(
      selected
        ? "Added to your favorites for this preview."
        : "Removed from favorites.",
    );
  }),
);
let created = false;
$(".save-demo").addEventListener("click", () => {
  created = !created;
  $(".save-demo span").textContent = created
    ? "Looking good"
    : "Create something";
  $(".save-demo use").setAttribute("href", created ? "#i-check" : "#i-plus");
  notify(
    created
      ? "Your demo is ready. Make something great."
      : "Ready for another idea.",
  );
});
$(".reset-demo").addEventListener("click", () => {
  choose(swatches, swatches[0]);
  showcase.dataset.accent = "orange";
  setRadius(16);
  setLight(false);
  setMotion(true);
  created = false;
  $(".save-demo span").textContent = "Create something";
  $(".save-demo use").setAttribute("href", "#i-plus");
  notify("Preview reset to Rayden defaults.");
});
let progress = 72;
$(".project-advance").addEventListener("click", () => {
  progress = progress >= 100 ? 0 : Math.min(100, progress + 7);
  $("#progress-ring").style.strokeDashoffset = String(
    100.531 * (1 - progress / 100),
  );
  $("#progress-label").textContent = progress;
  $("#project-status").textContent =
    progress === 100
      ? "All the pieces are in place"
      : "Bringing it all together";
  $(".project-advance").setAttribute(
    "aria-label",
    `Demo project ${progress}% complete. Advance progress`,
  );
});
$(".activity-read").addEventListener("click", () => {
  const read = $(".activity-visual").classList.toggle("read");
  $(".activity-read span").textContent = read
    ? "All caught up · Reset"
    : "Mark all as read";
});
const activity = {
  week: {
    total: "1,284",
    change: "18.6%",
    path: "M0 104C20 104 22 84 45 86S72 109 96 74S122 85 145 57S173 72 191 40S220 68 240 28S273 43 300 7",
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  month: {
    total: "5,912",
    change: "24.2%",
    path: "M0 105C18 97 22 110 41 93S67 97 88 76S119 88 140 64S173 61 195 51S218 58 237 31S272 44 300 4",
    labels: ["01", "05", "10", "15", "20", "25", "30"],
  },
};
const periods = $$("[data-period]");
periods.forEach((button) =>
  button.addEventListener("click", () => {
    choose(periods, button);
    const data = activity[button.dataset.period];
    $("#activity-total").textContent = data.total;
    $("#activity-change").textContent = data.change;
    $("#chart-line").setAttribute("d", data.path);
    $("#chart-area").setAttribute("d", `${data.path}V115H0Z`);
    $(".activity-chart").setAttribute(
      "aria-label",
      `Demo interactions increased throughout the ${button.dataset.period}`,
    );
    $$(".chart-labels span").forEach((span, index) => {
      span.textContent = data.labels[index];
    });
  }),
);
const today = new Date();
let calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
let chosenDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
);
function sameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function renderCalendar() {
  $("#calendar-title").textContent = calendarMonth.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
  $("#chosen-day").textContent = chosenDate.getDate();
  $("#chosen-date").textContent = chosenDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const grid = $(".calendar-days");
  grid.replaceChildren();
  const offset = (calendarMonth.getDay() + 6) % 7;
  const count = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0,
  ).getDate();
  const cells = Math.ceil((offset + count) / 7) * 7;
  for (let index = 0; index < cells; index++) {
    const date = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      index - offset + 1,
    );
    const button = document.createElement("button");
    button.textContent = date.getDate();
    button.setAttribute(
      "aria-label",
      date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
    button.setAttribute("aria-pressed", String(sameDate(date, chosenDate)));
    button.classList.toggle(
      "outside",
      date.getMonth() !== calendarMonth.getMonth(),
    );
    button.classList.toggle("today", sameDate(date, today));
    button.classList.toggle("selected", sameDate(date, chosenDate));
    button.addEventListener("click", () => {
      chosenDate = date;
      calendarMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      renderCalendar();
      $(".calendar-days .selected")?.focus({ preventScroll: true });
    });
    grid.append(button);
  }
}
$(".previous-month").addEventListener("click", () => {
  calendarMonth.setMonth(calendarMonth.getMonth() - 1);
  renderCalendar();
});
$(".next-month").addEventListener("click", () => {
  calendarMonth.setMonth(calendarMonth.getMonth() + 1);
  renderCalendar();
});
renderCalendar();
const starterViews = {
  dashboard: `<div class="mini-app"><aside class="mini-sidebar"><div class="mini-brand"><i></i>Orbit</div><span class="active">◈ &nbsp; Overview</span><span>▤ &nbsp; Projects</span><span>↗ &nbsp; Analytics</span><span>☷ &nbsp; Activity</span><span>⚙ &nbsp; Settings</span></aside><div class="mini-main"><div class="mini-title"><div><h4>Welcome back, Alex.</h4><p>Here’s the bigger picture.</p></div><span class="mini-tag">This month ⌄</span></div><div class="mini-kpis"><div class="mini-kpi"><span>Total projects</span><strong>24</strong><small>↗ 12% this month</small></div><div class="mini-kpi"><span>Active members</span><strong>148</strong><small>↗ 8% this month</small></div><div class="mini-kpi"><span>Tasks completed</span><strong>892</strong><small>↗ 24% this month</small></div></div><div class="mini-chart"><div><span>Project activity</span><span>Last 12 months</span></div><div class="mini-bars" aria-hidden="true">${[25, 35, 31, 43, 39, 61, 45, 60, 75, 63, 85, 96].map((height) => `<i style="--bar:${height}%"></i>`).join("")}</div></div></div></div>`,
  landing: `<div class="mini-landing"><div class="mini-nav"><strong>form & field</strong><span>Our approach &nbsp;&nbsp; Work &nbsp;&nbsp; Contact</span></div><p>MADE FOR A MORE CONSIDERED WORLD</p><h4>A little more<br>room to grow.</h4><p class="mini-caption">Thoughtful spaces for whatever comes next.</p><span class="mini-cta">Explore the possibilities ↗</span><div class="mini-landing-lines" aria-hidden="true"></div></div>`,
  ecommerce: `<div class="mini-shop"><div class="mini-nav"><strong>OBJECT / STUDIO</strong><span>Collection &nbsp;&nbsp; About &nbsp;&nbsp; Bag (0)</span></div><h4>Objects of a different kind.</h4><div class="mini-products"><div><div class="mini-product-visual" role="img" aria-label="Copper abstract artwork"></div><div class="mini-product-info"><strong>Copper study — 01</strong><span>Art print</span></div></div><div><div class="mini-product-visual" role="img" aria-label="Monochrome abstract artwork"></div><div class="mini-product-info"><strong>Silver study — 02</strong><span>Art print</span></div></div></div></div>`,
  blog: `<div class="mini-blog"><div class="mini-nav"><strong>THE OBSERVATORY</strong><span>Stories &nbsp;&nbsp; Notes &nbsp;&nbsp; About</span></div><h4>A different perspective.</h4><p>Ideas, experiments, and the space in between.</p><div class="mini-story"><div class="mini-story-image" role="img" aria-label="Folded glass and copper study"></div><div><span>DESIGN · 5 MIN READ</span><h5>The details that change everything.</h5><p>On materials, restraint, and making something worth a second look.</p></div></div></div>`,
};
let template = "dashboard";
let framework = "vite";
function renderStarter() {
  $("#starter-canvas").innerHTML = starterViews[template];
  $("#starter-location").textContent = `your-next-idea / ${template}`;
  $("#starter-command").textContent =
    `npx create-rayden-app my-app -f ${framework} -t ${template} --ts`;
}
const templates = $$("[data-template]");
const frameworks = $$("[data-framework]");
templates.forEach((button) =>
  button.addEventListener("click", () => {
    choose(templates, button);
    template = button.dataset.template;
    renderStarter();
  }),
);
frameworks.forEach((button) =>
  button.addEventListener("click", () => {
    choose(frameworks, button);
    framework = button.dataset.framework;
    renderStarter();
  }),
);
renderStarter();
