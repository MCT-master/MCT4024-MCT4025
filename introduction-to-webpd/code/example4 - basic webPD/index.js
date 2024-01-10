const myRange = document.querySelector("#myRange");

myRange.oninput = function (e) {
  const value = e.target.value;
  sendMsgToWebPd("n_0_4", "0", [Number(value)]);
};

// this is my range slider!
// ("n_0_3" portletId "0")
