// get the elements I defined in the HTML
const hey = document.getElementById("hey");
const myBtn = document.getElementById("myBtn");
const nyNumb1 = document.getElementById("nyNumb1");
const nyNumb2 = document.getElementById("nyNumb2");

myBtn.onclick = function () {
  let val1 = nyNumb1.value;
  let val2 = nyNumb2.value;

  // since the .value of the objects are of type String, I need to convert them to numbers before adding them
  hey.innerHTML = Number(val1) + Number(val2);
};
