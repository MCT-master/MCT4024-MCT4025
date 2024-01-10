// get the elements I defined in the HTML
const hey = document.getElementById("hey");
const myBtn = document.getElementById("myBtn");
const nyNumb1 = document.getElementById("nyNumb1");

// access the onclick parameter on the object, and tell it what to do when the object is clicked.
myBtn.onclick = function () {
  hey.innerHTML = nyNumb1.value;
};
