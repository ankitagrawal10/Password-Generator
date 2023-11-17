const inputslider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copymsg = document.querySelector("[data-copymsg]");
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase"); // Fix typo: "lowecase" to "lowercase"
const numberscheck = document.querySelector("#numbers");
const symbolcheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatorbtn = document.querySelector(".generatebutton");
const allcheckbox = document.querySelectorAll("input[type='checkbox']"); // Fix selector
const symbols = '~`!@#$%^&*(){}[]/";:?/>.<,-=+-_';

let password = "";
let passwordLength = 10; // Use camelCase
let checkCount = 0;

handleslider();
setIndicator("#ccc");

function handleslider() {
  inputslider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min =  inputslider.min;
  const max = inputslider.max;
  inputslider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function geneatelowercase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function geneateuppercase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generatesymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcstrength() {
  let hasupper = false;
  let haslower = false;
  let hassymbol = false;

  if (uppercasecheck.checked) hasupper = true;
  if (lowercasecheck.checked) haslower = true;
  hassymbol = symbolcheck.checked; // Simplified

  if (
    hasupper &&
    haslower &&
    (hassymbol || numberscheck.checked) &&
    passwordLength >= 8
  ) {
    setIndicator("#0f0");
  } else if (
    (haslower || hasupper) &&
    (hassymbol || numberscheck.checked) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copycontent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copymsg.innerText = "copied";
  } catch (e) {
    copymsg.innerText = "failed";
  }

  copymsg.classList.add("active");
  setTimeout(() => {
    copymsg.classList.remove("active");
  }, 2000);
}

function shufflepassword(array) {
  // fisher yates method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    // swap(arr[i],arr[j]);
  }

  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handlecheckboxchange() {
  checkCount = 0;
  allcheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleslider();
  }
}

allcheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", handlecheckboxchange);
});

inputslider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleslider();
});

copybtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copycontent();
  }
});

generatorbtn.addEventListener("click", () => {
  // none of the checkboxes are selected
  if (checkCount == 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleslider();
  }

  console.log("starting the journey");
  // remove old password
  password = "";

  // let's put the stuff mentioned by checkedbox

  let funcarr = [];
  if (uppercasecheck.checked) {
    funcarr.push(geneateuppercase);
  }
  if (lowercasecheck.checked) {
    funcarr.push(geneatelowercase);
  }
  if (numberscheck.checked) {
    funcarr.push(generateRandomNumber);
  }
  if (symbolcheck.checked) {
    funcarr.push(generatesymbol);
  }

  for (let i = 0; i < funcarr.length; i++) {
    password += funcarr[i]();
  }

  for (let i = 0; i < passwordLength - funcarr.length; i++) {
    let randindex = getRndInteger(0, funcarr.length);
    password += funcarr[randindex]();
  }

  // shuffle the password
  password = shufflepassword(Array.from(password));

  // show the ui
  passwordDisplay.value = password;
  // calculate the strength
  calcstrength();
});
