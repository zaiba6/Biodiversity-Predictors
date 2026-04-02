const year = document.getElementById("year");

if (year) {
  year.textContent = `Updated ${new Date().getFullYear()}`;
}

const modelData = [
  {
    name: "Ridge",
    group: "regression",
    r2: 0.765866,
    rmse: 0.568685,
    note: "Best params: alpha = 1",
  },
  {
    name: "Lasso",
    group: "regression",
    r2: 0.765585,
    rmse: 0.569026,
    note: "Best params: alpha = 0.001",
  },
  {
    name: "Elastic Net",
    group: "regression",
    r2: 0.765599,
    rmse: 0.569009,
    note: "Best params: alpha = 0.001, l1_ratio = 0.8",
  },
  {
    name: "Random Forest",
    group: "tree",
    r2: 0.598,
    rmse: 0.755,
    note: "10-fold CV R2 mean: 0.661",
  },
  {
    name: "Sklearn Tree",
    group: "tree",
    r2: 0.529,
    rmse: 0.818,
    note: "DecisionTreeRegressor baseline",
  },
  {
    name: "From-scratch Tree",
    group: "tree",
    r2: 0.394,
    rmse: 0.927,
    note: "Custom tree implementation",
  },
  {
    name: "GAM",
    group: "gam",
    r2: 0.104,
    rmse: 1.111,
    note: "Deviance explained: 0.062",
  },
];

const cvRmse = [0.757, 0.781, 0.681, 0.628, 0.741, 0.738, 0.661, 0.623, 0.722, 0.716];
const cvR2 = [0.566, 0.596, 0.643, 0.738, 0.628, 0.62, 0.722, 0.718, 0.68, 0.701];

const metricSelect = document.getElementById("metricSelect");
const groupSelect = document.getElementById("groupSelect");
const sortToggle = document.getElementById("sortToggle");
const leaderboardCards = document.getElementById("leaderboardCards");
const spotlightName = document.getElementById("spotlightName");
const spotlightStats = document.getElementById("spotlightStats");
const spotlightNote = document.getElementById("spotlightNote");

const foldSlider = document.getElementById("foldSlider");
const foldLabel = document.getElementById("foldLabel");
const foldRmse = document.getElementById("foldRmse");
const foldR2 = document.getElementById("foldR2");
const foldDot = document.getElementById("foldDot");
const sparkline = document.querySelector(".sparkline polyline");

let metric = "r2";
let group = "all";
let bestToWorst = true;
let currentChart;
let selectedModel = "Ridge";

function metricLabel(metricKey) {
  return metricKey === "r2" ? "R²" : "RMSE";
}

function filteredModels() {
  const models = group === "all" ? [...modelData] : modelData.filter((d) => d.group === group);
  return models.sort((a, b) => {
    const direction = bestToWorst ? 1 : -1;
    if (metric === "r2") {
      return (b.r2 - a.r2) * direction;
    }
    return (a.rmse - b.rmse) * direction;
  });
}

function renderSpotlight(model) {
  spotlightName.textContent = model.name;
  spotlightStats.textContent = `R²: ${model.r2.toFixed(3)} | RMSE: ${model.rmse.toFixed(3)}`;
  spotlightNote.textContent = model.note;
}

function renderCards(models) {
  leaderboardCards.innerHTML = models
    .map(
      (m) => `
      <article class="model-card">
        <div class="model-top">
          <strong>${m.name}</strong>
          <span class="badge">${m.group}</span>
        </div>
        <p class="mini-stat">R²: ${m.r2.toFixed(3)}</p>
        <p class="mini-stat">RMSE: ${m.rmse.toFixed(3)}</p>
      </article>
    `
    )
    .join("");
}

function renderChart(models) {
  const ctx = document.getElementById("modelChart");
  if (!ctx) return;

  if (currentChart) currentChart.destroy();

  currentChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: models.map((m) => m.name),
      datasets: [
        {
          label: metricLabel(metric),
          data: models.map((m) => (metric === "r2" ? m.r2 : m.rmse)),
          backgroundColor: models.map((m) =>
            m.name === selectedModel ? "rgba(37, 99, 235, 0.85)" : "rgba(15, 118, 110, 0.65)"
          ),
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(80, 110, 140, 0.15)" },
        },
        x: {
          grid: { display: false },
        },
      },
      onClick: (_, elements) => {
        if (!elements.length) return;
        const idx = elements[0].index;
        selectedModel = models[idx].name;
        renderSpotlight(models[idx]);
        renderAll();
      },
    },
  });
}

function renderAll() {
  const models = filteredModels();
  const selected = models.find((m) => m.name === selectedModel) || models[0];
  selectedModel = selected.name;
  renderChart(models);
  renderCards(models);
  renderSpotlight(selected);
}

function updateFold() {
  const fold = Number(foldSlider.value) - 1;
  foldLabel.textContent = String(fold + 1);
  foldRmse.textContent = cvRmse[fold].toFixed(3);
  foldR2.textContent = cvR2[fold].toFixed(3);

  if (!sparkline || !foldDot) return;
  const points = sparkline.getAttribute("points").trim().split(" ");
  const [cx, cy] = points[fold].split(",");
  foldDot.setAttribute("cx", cx);
  foldDot.setAttribute("cy", cy);
}

if (metricSelect && groupSelect && sortToggle) {
  metricSelect.addEventListener("change", () => {
    metric = metricSelect.value;
    renderAll();
  });

  groupSelect.addEventListener("change", () => {
    group = groupSelect.value;
    renderAll();
  });

  sortToggle.addEventListener("click", () => {
    bestToWorst = !bestToWorst;
    sortToggle.textContent = bestToWorst ? "Sort: Best to worst" : "Sort: Worst to best";
    renderAll();
  });

  renderAll();
}

if (foldSlider) {
  foldSlider.addEventListener("input", updateFold);
  updateFold();
}

const fills = document.querySelectorAll(".bar-fill");
fills.forEach((bar) => {
  const width = getComputedStyle(bar).width;
  bar.style.width = "0px";
  requestAnimationFrame(() => {
    bar.style.transition = "width 900ms ease-out";
    bar.style.width = width;
  });
});
