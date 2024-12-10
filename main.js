// Some Styling
let inputs = document.querySelectorAll(
  ".input-field input"
);
inputs.forEach((input) => {
  input.addEventListener("focus", () => {
    input.parentElement.classList.add("focused");
  });
  input.addEventListener("blur", () => {
    input.parentElement.classList.remove("focused");
  });
});

// Mortgage Calculator

let submitButton = document.querySelector("button");
let formBoxes = document.querySelectorAll(".form__box");
let clear = document.querySelector(".clear");
let emptySection = document.querySelector(
  ".container__main + .container__results"
);
let resultsSection = document.querySelector(
  "section:last-child"
);
let monthlyResult = document.querySelector(".monthly");
let totalResult = document.querySelector(".total");
let loanAmountField = document.forms[0].amount;
let loanTermField = document.forms[0].term;
loanInterestRateField = document.forms[0].rate;
let numberRegex = /^[0-9,.]+$/;

emptySection.classList.add("active");

submitButton.addEventListener("click", handleSubmit);
clear.addEventListener("click", reset);
loanAmountField.addEventListener("input", handleLoanAmount);
loanTermField.addEventListener("input", validateInput);
loanInterestRateField.addEventListener(
  "input",
  validateInput
);

function handleSubmit() {
  // Remove JS Styles
  let inputs = document.querySelectorAll(
    ".input-field input"
  );
  inputs.forEach((input) => {
    input.classList.remove("focused");
  });
  // Reset Errors
  formBoxes.forEach((error) =>
    error.classList.remove("error")
  );

  let errorList = {
    amount: false,
    term: false,
    rate: false,
    type: false,
  };

  // Check inputs
  let loanAmount = +loanAmountField.value
    .split(",")
    .join("");
  if (!loanAmount) {
    errorList["amount"] = true;
  }
  let loanTerm = loanTermField.value;
  if (!loanTerm) {
    errorList["term"] = true;
  }
  let loanInterestRate = loanInterestRateField.value;
  if (!loanInterestRate) {
    errorList["rate"] = true;
  } else {
    loanInterestRate = loanInterestRate / 1200;
  }
  let loanType = document.querySelector(
    "input[type='radio']:checked"
  );
  if (!loanType) {
    errorList["type"] = true;
  } else {
    loanType = loanType.id;
  }

  let ready = Object.values(errorList).every(
    (value) => value == false
  );

  if (ready) {
    let numOfPayments = loanTerm * 12;
    let monthlyPayment, totalRepayment;
    emptySection.classList.remove("active");
    resultsSection.classList.add("active");

    switch (loanType) {
      case "repayment":
        let c = (1 + loanInterestRate) ** numOfPayments;
        monthlyPayment =
          (loanAmount * loanInterestRate * c) / (c - 1);
        totalRepayment = monthlyPayment * numOfPayments;
        break;
      case "interestOnly":
        monthlyPayment = loanAmount * loanInterestRate;
        totalRepayment = monthlyPayment * numOfPayments;
        break;
    }
    monthlyPayment = monthlyPayment.toFixed(2).split(".");
    monthlyResult.innerHTML =
      "$" +
      handleTextNumbers(monthlyPayment[0]) +
      "." +
      handleTextNumbers(monthlyPayment[1]);
    totalRepayment = totalRepayment.toFixed(2).split(".");
    totalResult.innerHTML =
      "$" +
      handleTextNumbers(totalRepayment[0]) +
      "." +
      handleTextNumbers(totalRepayment[1]);
    reset();
  } else {
    emptySection.classList.add("active");
    resultsSection.classList.remove("active");
    Object.entries(errorList).forEach((entry) => {
      if (entry[1] == true) {
        document
          .querySelector(`.${entry[0]}`)
          .classList.add("error");
      }
    });
  }
}

function reset() {
  // Reset Errors
  formBoxes.forEach((error) =>
    error.classList.remove("error")
  );
  document
    .querySelectorAll("input")
    .forEach((input) => (input.value = ""));
  document
    .querySelectorAll("input[type='radio']")
    .forEach((input) => (input.checked = false));
}

function handleLoanAmount(e) {
  let input = e.currentTarget.value;
  input = input.replace(/[^0-9,.]+/g, "");
  e.currentTarget.value = handleTextNumbers(input);
}

loanAmountField.addEventListener("keydown", (e) => {
  if (e.key === "," || e.currentTarget.value.length > 15) {
    e.preventDefault();
  }
});

function validateInput(e) {
  if (e.currentTarget.value > 100) {
    e.currentTarget.value = 100;
  } else if (e.currentTarget.value < 1) {
    e.currentTarget.value = 1;
  } else {
    return false;
  }
}

function handleTextNumbers(number) {
  // Check if th number has a decimal or not?
  if (number.indexOf(".") !== -1) {
    return handleDecimal(number);
  } else {
    number = number.split(",").join("");
    return addCommas(number);
  }

  // Handle big numbers (>999) & add commas
  function addCommas(number) {
    let arr = [...number];
    let result = [];
    let count = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (count == 3) {
        result.unshift(arr[i], ",");
        count = 1;
      } else {
        result.unshift(arr[i]);
        count++;
      }
    }
    return result.join("");
  }

  // Handle the decimal of big numbers
  function handleDecimal(number) {
    let decimalArr = number.split(".");
    decimalArr.length = 2;
    return decimalArr[0] + "." + decimalArr[1];
  }
}
