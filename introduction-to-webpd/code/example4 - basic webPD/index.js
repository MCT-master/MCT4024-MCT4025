const myNumber = document.querySelector("#myNumber");
const volumeUp = document.querySelector("#volumeUp");
const myRange = document.querySelector("#myRange");

// let volume = 0;

// myNumber.oninput = function (e) {
//   volume = e.target.value;
// };

// volumeUp.onclick = function () {
//   sendMsgToWebPd("n_0_4", "0", [volume]);
// };

myRange.oninput = function (e) {
  const value = e.target.value;
  sendMsgToWebPd("n_0_4", "0", [Number(value)]);
};

// "n_0_3" portletId "0"
