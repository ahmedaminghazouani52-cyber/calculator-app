
var currentInput = "";
var lastResult = "";
var operatorPressed = false;
var history = [];


function updateDisplay(value) {
  var display = document.getElementById("display");
  display.classList.remove("small", "tiny", "error", "flash");
  var len = String(value).length;
  if (len > 12) {
    display.classList.add("tiny");
  } else if (len > 8) {
    display.classList.add("small");
  }
  display.textContent = value;
}

function updateExpression(value) {
  document.getElementById("expression").textContent = value;
}

function updateHistory() {
  var tape = document.getElementById("history-tape");
  if (history.length === 0) {
    tape.textContent = "";
    return;
  }
  tape.textContent = history[history.length - 1];
}

function createRipple(btn) {
  var ripple = document.createElement("span");
  ripple.classList.add("ripple");
  var size = Math.max(btn.offsetWidth, btn.offsetHeight);
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = (btn.offsetWidth / 2 - size / 2) + "px";
  ripple.style.top = (btn.offsetHeight / 2 - size / 2) + "px";
  btn.appendChild(ripple);
  setTimeout(function() { ripple.remove(); }, 460);
}

function pressBtn(btn, fn) {
  createRipple(btn);
  btn.classList.remove("popping");
  void btn.offsetWidth;
  btn.classList.add("popping");
  fn();
  setTimeout(function() { btn.classList.remove("popping"); }, 250);
}

function appendNum(num) {
  if (operatorPressed) {
    operatorPressed = false;
  }
  if (currentInput === "0" && num !== ".") {
    currentInput = num;
  } else {
    currentInput = currentInput + num;
  }
  updateDisplay(currentInput);
}

function appendOp(op) {
  if (currentInput === "") {
    return;
  }
  var symbole;
  if (op === "+") { symbole = "+"; }
  else if (op === "-") { symbole = "−"; }
  else if (op === "*") { symbole = "×"; }
  else { symbole = "÷"; }

  currentInput = currentInput + op;
  updateExpression(currentInput.replace(/\*/g,"×").replace(/\//g,"÷"));
  operatorPressed = true;
}

function appendDot() {
  var parts = currentInput.split(/[\+\-\*\/]/);
  var lastPart = parts[parts.length - 1];
  if (lastPart.indexOf(".") !== -1) { return; }
  if (lastPart === "") {
    currentInput = currentInput + "0.";
  } else {
    currentInput = currentInput + ".";
  }
  updateDisplay(currentInput);
}
function clearAll() {
  currentInput = "";
  lastResult = "";
  operatorPressed = false;
  updateDisplay("0");
  updateExpression("");
  document.getElementById("history-tape").textContent = "";
}

function deleteLast() {
  if (currentInput.length <= 1) {
    currentInput = "";
    updateDisplay("0");
  } else {
    currentInput = currentInput.slice(0, currentInput.length - 1);
    updateDisplay(currentInput);
  }
  updateExpression(currentInput.replace(/\*/g,"×").replace(/\//g,"÷"));
}


function calculate() {
  if (currentInput === "") { return; }

  var display = document.getElementById("display");
  var lastChar = currentInput[currentInput.length - 1];

  if (lastChar === "+" || lastChar === "-" || lastChar === "*" || lastChar === "/") {
    display.classList.add("error");
    display.textContent = "Erreur";
    updateExpression(currentInput.replace(/\*/g,"×").replace(/\//g,"÷"));
    currentInput = "";
    return;
  }

  if (currentInput.indexOf("/0") !== -1) {
    display.classList.add("error");
    display.textContent = "Div/0 !";
    updateExpression(currentInput.replace(/\*/g,"×").replace(/\//g,"÷"));
    currentInput = "";
    return;
  }

  var exprAffichee = currentInput.replace(/\*/g,"×").replace(/\//g,"÷");
  updateExpression(exprAffichee + " =");

  var resultat = eval(currentInput);

  if (resultat !== Math.floor(resultat)) {
    resultat = parseFloat(resultat.toFixed(8));
  }

  history.push(exprAffichee + " = " + resultat);
  if (history.length > 3) { history.shift(); }
  updateHistory();

  lastResult = String(resultat);
  currentInput = lastResult;
  operatorPressed = false;

  updateDisplay(lastResult);


  void display.offsetWidth;
  display.classList.add("flash");
}


document.addEventListener("keydown", function(event) {
  var key = event.key;
  if (key >= "0" && key <= "9")  { appendNum(key); }
  else if (key === "+")           { appendOp("+"); }
  else if (key === "-")           { appendOp("-"); }
  else if (key === "*")           { appendOp("*"); }
  else if (key === "/")           { event.preventDefault(); appendOp("/"); }
  else if (key === ".")           { appendDot(); }
  else if (key === "Enter" || key === "=") { calculate(); }
  else if (key === "Backspace")   { deleteLast(); }
  else if (key === "Escape")      { clearAll(); }
});
