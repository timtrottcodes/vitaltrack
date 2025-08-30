// === SETTINGS ===
const targetWeight = 80; // kg
const targetDate = "2025-12-31"; // yyyy-mm-dd

const form = document.getElementById("logForm");
const dateInput = document.getElementById("date");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const printBtn = document.getElementById("printBtn");
const clearBtn = document.getElementById("clearBtn");

let printChartInstance = null;

// Prefill today's date
dateInput.valueAsDate = new Date();

// Load existing data
let healthData = JSON.parse(localStorage.getItem("healthData")) || [];
sortDataByDate();

// Save new entry
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const entry = {
    date: dateInput.value,
    weight: parseFloat(document.getElementById("weight").value) || null,
    bmi: parseFloat(document.getElementById("bmi").value) || null,
    bmr: parseFloat(document.getElementById("bmr").value) || null,
    muscle: parseFloat(document.getElementById("muscle").value) || null,
    water: parseFloat(document.getElementById("water").value) || null,
    fat: parseFloat(document.getElementById("fat").value) || null,
    bone: parseFloat(document.getElementById("bone").value) || null,
    pulse: parseFloat(document.getElementById("pulse").value) || null,
    bpSys: parseFloat(document.getElementById("bpSys").value) || null,
    bpDia: parseFloat(document.getElementById("bpDia").value) || null,
    steps: parseFloat(document.getElementById("steps").value) || null,
  };

  healthData.push(entry);
  sortDataByDate();
  localStorage.setItem("healthData", JSON.stringify(healthData));
  updateCharts();
  form.reset();
  dateInput.valueAsDate = new Date();
});

// Export JSON
exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(healthData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "healthData.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Import JSON
importBtn.addEventListener("click", () => importFile.click());

importFile.addEventListener("change", () => {
  const file = importFile.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      if (Array.isArray(importedData)) {
        healthData = importedData; // overwrite
        sortDataByDate();
        localStorage.setItem("healthData", JSON.stringify(healthData));
        updateCharts();
        alert("Data imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading JSON: " + err.message);
    }
  };
  reader.readAsText(file);
  importFile.value = ""; // reset input
});

// Clear Data
clearBtn.addEventListener("click", () => {
  if (confirm("Clear all data?")) {
    healthData = [];
    localStorage.removeItem("healthData");
    updateCharts();
  }
});

// Print report
printBtn.addEventListener("click", () => {
  buildPrintTable();
  buildPrintChart();
  setTimeout(() => window.print(), 500);
});

// === CHART CREATION ===
const charts = {
  weight: new Chart(document.getElementById("weightChart"), {
    type: "line",
    data: {
      labels: [],
      datasets: [
        { label: "Weight (kg)", data: [], borderColor: "blue" },
        { label: "Target Path", data: [], borderColor: "red", borderDash: [5, 5] },
      ],
    },
  }),
  bmi: new Chart(document.getElementById("bmiChart"), {
    type: "line",
    data: {
      labels: [],
      datasets: [
        { label: "BMI", data: [], borderColor: "green" },
        { label: "BMI Trend (5-point avg)", data: [], borderColor: "orange", borderDash: [5, 5], fill: false },
      ],
    },
  }),
  bmr: new Chart(document.getElementById("bmrChart"), { type: "line", data: { labels: [], datasets: [{ label: "BMR", data: [], borderColor: "orange" }] } }),
  muscle: new Chart(document.getElementById("muscleChart"), { type: "line", data: { labels: [], datasets: [{ label: "Muscle %", data: [], borderColor: "purple" }] } }),
  water: new Chart(document.getElementById("waterChart"), { type: "line", data: { labels: [], datasets: [{ label: "Water %", data: [], borderColor: "teal" }] } }),
  fat: new Chart(document.getElementById("fatChart"), { type: "line", data: { labels: [], datasets: [{ label: "Fat %", data: [], borderColor: "brown" }] } }),
  bone: new Chart(document.getElementById("boneChart"), { type: "line", data: { labels: [], datasets: [{ label: "Bone Mass", data: [], borderColor: "gray" }] } }),
  pulse: new Chart(document.getElementById("pulseChart"), { type: "line", data: { labels: [], datasets: [{ label: "Pulse", data: [], borderColor: "pink" }] } }),
  bp: new Chart(document.getElementById("bpChart"), {
    type: "line",
    data: {
      labels: [],
      datasets: [
        { label: "Systolic", data: [], borderColor: "red" },
        { label: "Diastolic", data: [], borderColor: "blue" },
      ],
    },
  }),
  steps: new Chart(document.getElementById("stepsChart"), { type: "line", data: { labels: [], datasets: [{ label: "Steps", data: [], borderColor: "black" }] } }),
};

function updateCharts() {
  const labels = healthData.map((e) => e.date);

  charts.weight.data.labels = labels;
  charts.weight.data.datasets[0].data = healthData.map((e) => e.weight);

  // Target path for weight
  if (healthData.length > 0) {
    const startWeight = healthData[0].weight;
    const startDate = new Date(healthData[0].date);
    const endDate = new Date(targetDate);
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

    charts.weight.data.datasets[1].data = labels.map((d) => {
      const currentDate = new Date(d);
      const daysPassed = (currentDate - startDate) / (1000 * 60 * 60 * 24);
      const progress = daysPassed / totalDays;
      return startWeight + (targetWeight - startWeight) * progress;
    });
  }

  const bmis = healthData.map((e) => e.bmi);

  charts.bmi.data.labels = labels;
  charts.bmi.data.datasets[0].data = bmis;
  charts.bmi.data.datasets[1].data = movingAverage(bmis, 5);

  charts.bmr.data.labels = labels;
  charts.bmr.data.datasets[0].data = healthData.map((e) => e.bmr);

  charts.muscle.data.labels = labels;
  charts.muscle.data.datasets[0].data = healthData.map((e) => e.muscle);

  charts.water.data.labels = labels;
  charts.water.data.datasets[0].data = healthData.map((e) => e.water);

  charts.fat.data.labels = labels;
  charts.fat.data.datasets[0].data = healthData.map((e) => e.fat);

  charts.bone.data.labels = labels;
  charts.bone.data.datasets[0].data = healthData.map((e) => e.bone);

  charts.pulse.data.labels = labels;
  charts.pulse.data.datasets[0].data = healthData.map((e) => e.pulse);

  charts.bp.data.labels = labels;
  charts.bp.data.datasets[0].data = healthData.map((e) => e.bpSys);
  charts.bp.data.datasets[1].data = healthData.map((e) => e.bpDia);

  charts.steps.data.labels = labels;
  charts.steps.data.datasets[0].data = healthData.map((e) => e.steps);

  Object.values(charts).forEach((c) => c.update());

  buildDataTable();
}

function movingAverage(data, windowSize) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const subset = data.slice(start, i + 1);
    const avg = subset.reduce((a, b) => a + b, 0) / subset.length;
    result.push(avg);
  }
  return result;
}

function buildPrintChart() {
  const ctx = document.getElementById("printChart").getContext("2d");
  if (printChartInstance) printChartInstance.destroy();
  const labels = healthData.map((e) => e.date);
  const weights = healthData.map((e) => e.weight);
  const sys = healthData.map((e) => e.bpSys);
  const dia = healthData.map((e) => e.bpDia);
  printChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Weight (kg)", data: weights, borderColor: "blue", fill: false },
        { label: "BP Systolic", data: sys, borderColor: "red", fill: false },
        { label: "BP Diastolic", data: dia, borderColor: "green", fill: false },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
      scales: { x: { title: { display: true, text: "Date" } } },
    },
  });
}

function buildPrintTable() {
  const tbody = document.querySelector("#printTable tbody");
  tbody.innerHTML = "";
  healthData.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
          <td>${row.date}</td><td>${row.weight ?? ""}</td><td>${row.bmi ?? ""}</td>
          <td>${row.bmr ?? ""}</td><td>${row.muscle ?? ""}</td><td>${row.water ?? ""}</td>
          <td>${row.fat ?? ""}</td><td>${row.bone ?? ""}</td><td>${row.pulse ?? ""}</td>
          <td>${row.bpSys ?? ""}</td><td>${row.bpDia ?? ""}</td><td>${row.steps ?? ""}</td>
        `;
    tbody.appendChild(tr);
  });
}

function buildDataTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  healthData.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.date}</td>
      <td>${row.weight ?? ""}</td>
      <td>${row.bmi ?? ""}</td>
      <td>${row.bmr ?? ""}</td>
      <td>${row.muscle ?? ""}</td>
      <td>${row.water ?? ""}</td>
      <td>${row.fat ?? ""}</td>
      <td>${row.bone ?? ""}</td>
      <td>${row.pulse ?? ""}</td>
      <td>${row.bpSys ?? ""}</td>
      <td>${row.bpDia ?? ""}</td>
      <td>${row.steps ?? ""}</td>
    `;
    tr.addEventListener("click", () => {
      // Load values back into form for editing
      dateInput.value = row.date;
      document.getElementById("weight").value = row.weight ?? "";
      document.getElementById("bmi").value = row.bmi ?? "";
      document.getElementById("bmr").value = row.bmr ?? "";
      document.getElementById("muscle").value = row.muscle ?? "";
      document.getElementById("water").value = row.water ?? "";
      document.getElementById("fat").value = row.fat ?? "";
      document.getElementById("bone").value = row.bone ?? "";
      document.getElementById("pulse").value = row.pulse ?? "";
      document.getElementById("bpSys").value = row.bpSys ?? "";
      document.getElementById("bpDia").value = row.bpDia ?? "";
      document.getElementById("steps").value = row.steps ?? "";

      // Optional: remove the row being edited
      healthData.splice(index, 1);
      localStorage.setItem("healthData", JSON.stringify(healthData));
      updateCharts();
      buildDataTable();
    });
    tbody.appendChild(tr);
  });
}

// === UTILITY FUNCTIONS ===
function sortDataByDate() {
  healthData.sort((a, b) => new Date(a.date) - new Date(b.date));
}

updateCharts();
