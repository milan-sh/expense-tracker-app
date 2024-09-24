// Update balance function
const balanceEl = document.getElementById("balance");
function updateBalance(amount) {
  balanceEl.innerHTML = `${amount}`;
}

// Card container
const recordsEl = document.getElementById("records");

// Input text element
const inputTextEl = document.getElementById("text");

// Input amount element
const inputAmountEl = document.getElementById("input-amount");

// Do empty input values
const emptyInput = () => {
  inputAmountEl.value = "";
  inputTextEl.value = "";
};

// Create card function
function createCard(element, type) {
  return element.innerHTML += `
    <div class="record flex flex-col bg-white font-semibold mb-1">
        <div class="w-full flex upper cursor-pointer">
            <div class="left-div flex w-[90%] justify-between px-2 text-black">
              <p class="clip">${inputTextEl.value}</p>
              <p><span id="sign">${type == "earning" ? "+" : "-"}</span>₹ <span id="amount">${inputAmountEl.value}</span></p>
            </div>
            <div class="right-div text-center w-[10%] px-2 bg-${type == "earning" ? "green-700" : "red-700"}">
              <p>${type == "earning" ? "E" : "D"}</p>
            </div>
        </div>
        <div class="hide flex gap-2 my-3 hidden px-2">
          <img class="enable-editing cursor-pointer" src="./icons8-edit.svg" alt="Edit">
          <img class="delete cursor-pointer" src="./icons8-delete.svg" alt="Delete">
        </div>
    </div>
  `;
}

// Earnings button
const earningButtonEl = document.getElementById("earning");
let editingEnable = false;
let currentEditElement = null;
let currentEditAmount = 0;
let isCurrentEarning = false;
const earningButtonText = document.getElementById('earning-button-text');

earningButtonEl.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputAmountEl.value == "" || inputTextEl.value == "") {
    return;
  } else if (editingEnable && currentEditElement) {
    // Update the card when editing is enabled
    const newAmount = parseInt(inputAmountEl.value);
    const oldAmount = parseInt(currentEditAmount);
    
    // Update the balance by adjusting the difference correctly
    let currentBalance = parseInt(balanceEl.innerText);
    let updatedBalance = isCurrentEarning ? currentBalance - oldAmount + newAmount : currentBalance + oldAmount - newAmount;
    updateBalance(updatedBalance);

    currentEditElement.querySelector(".clip").innerText = inputTextEl.value;
    currentEditElement.querySelector("#amount").innerText = newAmount;

    // Update the button value
    earningButtonText.innerHTML = inputAmountEl.value;

    // Reset edit mode
    editingEnable = false;
    currentEditElement = null;
    emptyInput();
  } else {
    // Add new card
    createCard(recordsEl, "earning");

    // Update the balance
    let currentBalance = parseInt(balanceEl.innerText);
    let inputBalance = parseInt(inputAmountEl.value);
    let total = currentBalance + inputBalance;
    updateBalance(total);

    // Update the button value
    earningButtonText.innerHTML = inputAmountEl.value;

    // Toggle card features
    toggle();
    emptyInput();
  }
});

// Expense button
const expenseButtonEl = document.getElementById("expense");
const expenseButtonText = document.getElementById("expense-button-text");

expenseButtonEl.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputAmountEl.value == "" || inputTextEl.value == "") {
    return;
  } else if (editingEnable && currentEditElement) {
    // Update the card when editing is enabled
    const newAmount = parseInt(inputAmountEl.value);
    const oldAmount = parseInt(currentEditAmount);

    // Update the balance by adjusting the difference correctly
    let currentBalance = parseInt(balanceEl.innerText);
    let updatedBalance = !isCurrentEarning ? currentBalance + oldAmount - newAmount : currentBalance - oldAmount + newAmount;
    updateBalance(updatedBalance);

    currentEditElement.querySelector(".clip").innerText = inputTextEl.value;
    currentEditElement.querySelector("#amount").innerText = newAmount;

    // Update the button value
    expenseButtonText.innerHTML = inputAmountEl.value;

    // Reset edit mode
    editingEnable = false;
    currentEditElement = null;
    emptyInput();
  } else {
    // Add new card
    createCard(recordsEl, "expense");

    // Update the balance
    let currentBalance = parseInt(balanceEl.innerText);
    let inputBalance = parseInt(inputAmountEl.value);
    let total = currentBalance - inputBalance;
    updateBalance(total);

    // Update the button value
    expenseButtonText.innerHTML = inputAmountEl.value;

    // Toggle card features
    toggle();
    emptyInput();
  }
});

// Show and handle edit/delete of cards
function toggle() {
  let cards = Array.from(document.getElementsByClassName("upper"));
  cards.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      e.currentTarget.nextElementSibling.classList.toggle("hidden");
    });
  });

  // Enable deleting
  let deleteButtonArray = Array.from(document.getElementsByClassName('delete'));
  deleteButtonArray.forEach((element) => {
    element.addEventListener('click', (e) => {
      const card = e.currentTarget.parentNode.parentNode;
      const amount = parseInt(card.querySelector("#amount").innerText);
      const isEarning = card.querySelector("#sign").innerText === "+";
      
      let currentBalance = parseInt(balanceEl.innerText);
      let updatedBalance = isEarning ? currentBalance - amount : currentBalance + amount;
      updateBalance(updatedBalance);
      expenseButtonText.innerHTML = "0"      
      earningButtonText.innerHTML = "0"
      card.remove();
    });
  });

  // Enable editing
  let editingButtonArray = Array.from(document.getElementsByClassName('enable-editing'));
  editingButtonArray.forEach((element) => {
    element.addEventListener('click', (e) => {
      editingEnable = true;
      currentEditElement = e.currentTarget.parentNode.parentNode;
      currentEditAmount = currentEditElement.querySelector("#amount").innerText;
      isCurrentEarning = currentEditElement.querySelector("#sign").innerText === "+";
      
      const textValue = currentEditElement.querySelector(".clip").innerText;
      const amountValue = currentEditAmount;

      inputTextEl.value = textValue;
      inputAmountEl.value = amountValue;
    });
  });
}
