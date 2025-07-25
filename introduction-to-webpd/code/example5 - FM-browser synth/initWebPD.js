// SUMMARY
// 1. WEB PAGE INITIALIZATION
// 2. SENDING MESSAGES FROM JAVASCRIPT TO THE PATCH

// ------------- 1. WEB PAGE INITIALIZATION
const loadingDiv = document.querySelector("#loading");
const startButton = document.querySelector("#start");
const audioContext = new AudioContext();

let patch = null;
let stream = null;
let webpdNode = null;

const initApp = async () => {
  // Register the worklet
  await WebPdRuntime.initialize(audioContext);

  // Fetch the patch code
  response = await fetch("patch.js");
  patch = await response.text();

  // Comment this if you don't need audio input
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Hide loading and show start button
  loadingDiv.style.display = "none";
  startButton.style.display = "block";
};

const startApp = async () => {
  // AudioContext needs to be resumed on click to protects users
  // from being spammed with autoplay.
  // See : https://github.com/WebAudio/web-audio-api/issues/345
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  // Setup web audio graph
  webpdNode = await WebPdRuntime.run(
    audioContext,
    patch,
    WebPdRuntime.defaultSettingsForRun("./patch.js")
  );
  webpdNode.connect(audioContext.destination);

  // Comment this if you don't need audio input
  const sourceNode = audioContext.createMediaStreamSource(stream);
  sourceNode.connect(webpdNode);

  // Hide the start button
  startButton.style.display = "none";
};

startButton.onclick = startApp;

initApp().then(() => {
  console.log("App initialized");
});

// ------------- 2. SENDING MESSAGES FROM JAVASCRIPT TO THE PATCH
// Use the function sendMsgToWebPd to send a message from JavaScript to an object inside your patch.
//
// Parameters :
// - nodeId: the ID of the object you want to send a message to.
//          This ID is a string that has been assigned by WebPd at compilation.
//          You can find below the list of available IDs with hints to help you
//          identify the object you want to interact with.
// - portletId : the ID of the object portlet to which the message should be sent.
// - message : the message to send. This must be a list of strings and / or numbers.
//
// Examples :
// - sending a message to a bang node of ID 'n_0_1' :
//          sendMsgToWebPd('n_0_1', '0', ['bang'])
// - sending a message to a number object of ID 'n_0_2' :
//          sendMsgToWebPd('n_0_2', '0', [123])
//
const sendMsgToWebPd = (nodeId, portletId, message) => {
  webpdNode.port.postMessage({
    type: "io:messageReceiver",
    payload: {
      nodeId,
      portletId,
      message,
    },
  });
};
