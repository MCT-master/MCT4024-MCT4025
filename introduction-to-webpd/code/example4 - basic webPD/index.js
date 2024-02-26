const myRange = document.getElementById("myRange");

// use function sendMsgToWebPd() to send messages to your PD patch!

myRange.oninput = function (e) {
  const value = e.target.value;
  sendMsgToWebPd("n_0_4", "0", [Number(value)]);
};

// this is my range slider!
// ("n_0_3" portletId "0")
