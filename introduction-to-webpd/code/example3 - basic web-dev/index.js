// get the elements I defined in the HTML
const text = document.getElementById("text");
const myNumb1 = document.getElementById("myNumb1");
const myNumb2 = document.getElementById("myNumb2");
const plussBtn = document.getElementById("plussBtn");
const minusBtn = document.getElementById("minusBtn");
const timesBtn = document.getElementById("timesBtn");
const divideBtn = document.getElementById("divideBtn");
const resetBtn = document.getElementById("resetBtn");

const times = (first, second) => Number(first) * Number(second);
const divide = (first, second) => Number(first) / Number(second);
const pluss = (first, second) => Number(first) + Number(second);
const minus = (first, second) => Number(first) - Number(second);

plussBtn.onclick = () => {
  text.innerHTML = pluss(myNumb1.value, myNumb2.value);
};

minusBtn.onclick = () => {
  text.innerHTML = minus(myNumb1.value, myNumb2.value);
};

divideBtn.onclick = () => {
  text.innerHTML = divide(myNumb1.value, myNumb2.value);
};

timesBtn.onclick = () => {
  text.innerHTML = times(myNumb1.value, myNumb2.value);
};

resetBtn.onclick = () => {
  myNumb1.value = "";
  myNumb2.value = "";
};
