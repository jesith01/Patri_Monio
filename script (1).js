let patrimonio = 0;
let emergencyFund = 0;
let unexpectedFund = 0;
let investmentFund = 0;
let goals = [];

function formatCOP(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatNumberWithDots(value) {
  const onlyDigits = String(value).replace(/\D/g, "");
  if (!onlyDigits) return "";
  return Number(onlyDigits).toLocaleString("es-CO");
}

function normalizeNumber(value) {
  return Number(String(value).replace(/\D/g, "")) || 0;
}

function formatInput(input) {
  const cursorAtEnd = input.selectionStart === input.value.length;
  input.value = formatNumberWithDots(input.value);
  if (cursorAtEnd) input.setSelectionRange(input.value.length, input.value.length);
}

function saveData() {
  localStorage.setItem("patrimonio", patrimonio);
  localStorage.setItem("emergencyFund", emergencyFund);
  localStorage.setItem("unexpectedFund", unexpectedFund);
  localStorage.setItem("investmentFund", investmentFund);
  localStorage.setItem("goals", JSON.stringify(goals));
}

function loadData() {
  patrimonio = Number(localStorage.getItem("patrimonio")) || 0;
  emergencyFund = Number(localStorage.getItem("emergencyFund")) || 0;
  unexpectedFund = Number(localStorage.getItem("unexpectedFund")) || 0;
  investmentFund = Number(localStorage.getItem("investmentFund")) || 0;
  goals = JSON.parse(localStorage.getItem("goals")) || [];
}

function getGoalsTotal() {
  return goals.reduce((sum, goal) => sum + (Number(goal.amount) || 0), 0);
}

function getTotalGeneral() {
  return patrimonio + emergencyFund + unexpectedFund + investmentFund + getGoalsTotal();
}

function renderAll() {
  document.getElementById("patrimonioValue").textContent = formatCOP(patrimonio);
  document.getElementById("emergencyValue").textContent = formatCOP(emergencyFund);
  document.getElementById("unexpectedValue").textContent = formatCOP(unexpectedFund);
  document.getElementById("investmentValue").textContent = formatCOP(investmentFund);
  document.getElementById("totalValue").textContent = formatCOP(getTotalGeneral());

  const goalsList = document.getElementById("goalsList");
  goalsList.innerHTML = goals
    .map(
      (goal, index) => `
      <div class="goal-item">
        <div class="goal-top">
          <div class="goal-text">
            <strong>${goal.name}</strong>
            <span>${formatCOP(goal.amount)}</span>
          </div>
          <button class="btn small" onclick="toggleGoalEdit(${index})">Editar</button>
        </div>
        <div id="goalEdit-${index}" class="goal-edit hidden">
          <input type="text" id="goalAmountInput-${index}" value="${formatNumberWithDots(goal.amount)}" oninput="formatInput(this)" />
          <button class="btn primary" onclick="saveGoalAmount(${index})">Guardar</button>
          <button class="btn small" onclick="removeGoal(${index})">Eliminar</button>
        </div>
      </div>
    `
    )
    .join("");
}

function toggleEdit(id) {
  document.getElementById(id).classList.toggle("hidden");
}

function toggleGoalEdit(index) {
  document.getElementById(`goalEdit-${index}`).classList.toggle("hidden");
}

function savePatrimonio() {
  patrimonio = normalizeNumber(document.getElementById("patrimonioInput").value);
  document.getElementById("patrimonioInput").value = "";
  document.getElementById("patrimonioEdit").classList.add("hidden");
  saveData();
  renderAll();
}

function saveEmergency() {
  emergencyFund = normalizeNumber(document.getElementById("emergencyInput").value);
  document.getElementById("emergencyInput").value = "";
  document.getElementById("emergencyEdit").classList.add("hidden");
  saveData();
  renderAll();
}

function saveUnexpected() {
  unexpectedFund = normalizeNumber(document.getElementById("unexpectedInput").value);
  document.getElementById("unexpectedInput").value = "";
  document.getElementById("unexpectedEdit").classList.add("hidden");
  saveData();
  renderAll();
}

function saveInvestment() {
  investmentFund = normalizeNumber(document.getElementById("investmentInput").value);
  document.getElementById("investmentInput").value = "";
  document.getElementById("investmentEdit").classList.add("hidden");
  saveData();
  renderAll();
}

function addGoal() {
  const name = document.getElementById("goalName").value.trim();
  const amount = normalizeNumber(document.getElementById("goalAmount").value);

  if (!name || amount <= 0) return;

  goals.push({ name, amount });
  document.getElementById("goalName").value = "";
  document.getElementById("goalAmount").value = "";
  saveData();
  renderAll();
}

function saveGoalAmount(index) {
  const newAmount = normalizeNumber(document.getElementById(`goalAmountInput-${index}`).value);
  goals[index].amount = newAmount;
  document.getElementById(`goalEdit-${index}`).classList.add("hidden");
  saveData();
  renderAll();
}

function removeGoal(index) {
  goals.splice(index, 1);
  saveData();
  renderAll();
}

loadData();
renderAll();