const reasonInputEl = document.querySelector("#input-reason");
const amountInputEl = document.querySelector("#input-amount");
const clearButtonEl = document.querySelector("#button-clear");
const addButtonEl = document.querySelector("#button-add");
const expensesListEl = document.querySelector("#expenses-list");
const totalExpensesEl = document.querySelector("#total-expenses");
const alertCtrl = document.querySelector("ion-alert-controller");

let totalExpensesValue = 0.0;

async function presentAlert() {
  const alert = document.createElement("ion-alert");
  alert.header = "Invalid inputs";
  alert.message = "Please enter valid reason and amount!";
  alert.buttons = ["Beleza"];

  document.body.appendChild(alert);
  await alert.present();
}

addButtonEl.addEventListener("click", () => {
  const enteredReason = reasonInputEl.value;
  const enteredAmount = amountInputEl.value;

  if (
    enteredAmount <= 0 ||
    enteredReason.trim().length <= 0 ||
    enteredAmount.trim().length <= 0
  ) {
    presentAlert();
    return;
  }

  const newItem = document.createElement("ion-item");
  newItem.textContent = `${enteredReason} - R$${enteredAmount}`;

  expensesListEl.appendChild(newItem);
  totalExpensesEl.textContent = `R$${(totalExpensesValue += +enteredAmount)}`;
  clear();
});

function clear() {
  reasonInputEl.value = "";
  amountInputEl.value = "";
}

clearButtonEl.addEventListener("click", clear);
