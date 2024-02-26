const carrierFreq = document.querySelector("#carrierFreq");
const modFreq = document.querySelector("#modFreq");
const modDepth = document.querySelector("#modDepth");
const volume = document.querySelector("#volume");
const noteTrigger = document.querySelector("#noteTrigger");

const check = document.getElementById("myCheck");

check.oninput = function (e) {
  if (e.target.checked) {
    // do something when checked
    // send message to webPD
  }
};

carrierFreqNodeID = "n_0_2";
modFreqNodeID = "n_0_5";
modDepthNodeID = "n_0_7";
volumeNodeID = "n_0_14";
noteTriggerNodeID = "n_0_13";

carrierFreq.oninput = function (e) {
  const value = e.target.value;
  sendMsgToWebPd(carrierFreqNodeID, "0", [Number(value)]);
};

modFreq.oninput = function (e) {
  const value = e.target.value;
  sendMsgToWebPd(modFreqNodeID, "0", [Number(value)]);
};

modDepth.oninput = function (e) {
  const value = e.target.value;
  sendMsgToWebPd(modDepthNodeID, "0", [Number(value)]);
};

volume.oninput = function (e) {
  const value = e.target.value;
  sendMsgToWebPd(volumeNodeID, "0", [Number(value)]);
};

noteTrigger.onclick = function () {
  sendMsgToWebPd(noteTriggerNodeID, "0", ["bang"]);
};

//  - nodeId "n_0_2" portletId "0"
//      * type "floatatom"
//      * position [85,107]
//      * label "carrier"

//  - nodeId "n_0_5" portletId "0"
//      * type "floatatom"
//      * position [136,46]
//      * label "modulator"

//  - nodeId "n_0_7" portletId "0"
//      * type "floatatom"
//      * position [215,82]
//      * label "mod_depth"

//  - nodeId "n_0_9" portletId "0"
//      * type "msg"
//      * position [102,293]

//  - nodeId "n_0_12" portletId "0"
//      * type "msg"
//      * position [163,292]

//  - nodeId "n_0_13" portletId "0"
//      * type "bng"
//      * position [163,267]
//      * label "note_trigger"

//  - nodeId "n_0_14" portletId "0"
//      * type "floatatom"
//      * position [102,236]
//      * label "volume"
