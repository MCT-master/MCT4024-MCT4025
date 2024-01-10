
        let F = 0
let FRAME = 0
let BLOCK_SIZE = 0
let SAMPLE_RATE = 0
let NULL_SIGNAL = 0
function SND_TO_NULL(m) {}
        
                const i32 = (v) => v
                const f32 = i32
                const f64 = i32
                
function toInt(v) {
                    return v
                }
function toFloat(v) {
                    return v
                }
function createFloatArray(length) {
                    return new Float64Array(length)
                }
function setFloatDataView(dataView, position, value) {
                    dataView.setFloat64(position, value)
                }
function getFloatDataView(dataView, position) {
                    return dataView.getFloat64(position)
                }
const SKED_ID_NULL = -1
const SKED_ID_COUNTER_INIT = 1
const _SKED_WAIT_IN_PROGRESS = 0
const _SKED_WAIT_OVER = 1
const _SKED_MODE_WAIT = 0
const _SKED_MODE_SUBSCRIBE = 1


function sked_create(isLoggingEvents) {
            return {
                eventLog: new Set(),
                events: new Map(),
                requests: new Map(),
                idCounter: SKED_ID_COUNTER_INIT,
                isLoggingEvents,
            }
        }
function sked_wait(skeduler, event, callback) {
            if (skeduler.isLoggingEvents === false) {
                throw new Error("Please activate skeduler's isLoggingEvents")
            }

            if (skeduler.eventLog.has(event)) {
                callback(event)
                return SKED_ID_NULL
            } else {
                return _sked_createRequest(skeduler, event, callback, _SKED_MODE_WAIT)
            }
        }
function sked_wait_future(skeduler, event, callback) {
            return _sked_createRequest(skeduler, event, callback, _SKED_MODE_WAIT)
        }
function sked_subscribe(skeduler, event, callback) {
            return _sked_createRequest(skeduler, event, callback, _SKED_MODE_SUBSCRIBE)
        }
function sked_emit(skeduler, event) {
            if (skeduler.isLoggingEvents === true) {
                skeduler.eventLog.add(event)
            }
            if (skeduler.events.has(event)) {
                const skedIds = skeduler.events.get(event)
                const skedIdsStaying = []
                for (let i = 0; i < skedIds.length; i++) {
                    if (skeduler.requests.has(skedIds[i])) {
                        const request = skeduler.requests.get(skedIds[i])
                        request.callback(event)
                        if (request.mode === _SKED_MODE_WAIT) {
                            skeduler.requests.delete(request.id)
                        } else {
                            skedIdsStaying.push(request.id)
                        }
                    }
                }
                skeduler.events.set(event, skedIdsStaying)
            }
        }
function sked_cancel(skeduler, id) {
            skeduler.requests.delete(id)
        }
function _sked_createRequest(skeduler, event, callback, mode) {
            const id = _sked_nextId(skeduler)
            const request = {
                id, 
                mode, 
                callback,
            }
            skeduler.requests.set(id, request)
            if (!skeduler.events.has(event)) {
                skeduler.events.set(event, [id])    
            } else {
                skeduler.events.get(event).push(id)
            }
            return id
        }
function _sked_nextId(skeduler) {
            return skeduler.idCounter++
        }
const _commons_ENGINE_LOGGED_SKEDULER = sked_create(true)
const _commons_FRAME_SKEDULER = sked_create(false)
function _commons_emitEngineConfigure() {
            sked_emit(_commons_ENGINE_LOGGED_SKEDULER, 'configure')
        }
function _commons_emitFrame(frame) {
            sked_emit(_commons_FRAME_SKEDULER, frame.toString())
        }
const MSG_FLOAT_TOKEN = "number"
const MSG_STRING_TOKEN = "string"
function msg_create(template) {
                    const m = []
                    let i = 0
                    while (i < template.length) {
                        if (template[i] === MSG_STRING_TOKEN) {
                            m.push('')
                            i += 2
                        } else if (template[i] === MSG_FLOAT_TOKEN) {
                            m.push(0)
                            i += 1
                        }
                    }
                    return m
                }
function msg_getLength(message) {
                    return message.length
                }
function msg_getTokenType(message, tokenIndex) {
                    return typeof message[tokenIndex]
                }
function msg_isStringToken(message, tokenIndex) {
                    return msg_getTokenType(message, tokenIndex) === 'string'
                }
function msg_isFloatToken(message, tokenIndex) {
                    return msg_getTokenType(message, tokenIndex) === 'number'
                }
function msg_isMatching(message, tokenTypes) {
                    return (message.length === tokenTypes.length) 
                        && message.every((v, i) => msg_getTokenType(message, i) === tokenTypes[i])
                }
function msg_writeFloatToken(message, tokenIndex, value) {
                    message[tokenIndex] = value
                }
function msg_writeStringToken(message, tokenIndex, value) {
                    message[tokenIndex] = value
                }
function msg_readFloatToken(message, tokenIndex) {
                    return message[tokenIndex]
                }
function msg_readStringToken(message, tokenIndex) {
                    return message[tokenIndex]
                }
function msg_floats(values) {
                    return values
                }
function msg_strings(values) {
                    return values
                }
function msg_display(message) {
                    return '[' + message
                        .map(t => typeof t === 'string' ? '"' + t + '"' : t.toString())
                        .join(', ') + ']'
                }
function msg_isBang(message) {
            return (
                msg_isStringToken(message, 0) 
                && msg_readStringToken(message, 0) === 'bang'
            )
        }
function msg_bang() {
            const message = msg_create([MSG_STRING_TOKEN, 4])
            msg_writeStringToken(message, 0, 'bang')
            return message
        }
function msg_emptyToBang(message) {
            if (msg_getLength(message) === 0) {
                return msg_bang()
            } else {
                return message
            }
        }
const MSG_BUSES = new Map()
function msgBusPublish(busName, message) {
            let i = 0
            const callbacks = MSG_BUSES.has(busName) ? MSG_BUSES.get(busName): []
            for (i = 0; i < callbacks.length; i++) {
                callbacks[i](message)
            }
        }
function msgBusSubscribe(busName, callback) {
            if (!MSG_BUSES.has(busName)) {
                MSG_BUSES.set(busName, [])
            }
            MSG_BUSES.get(busName).push(callback)
        }
function msgBusUnsubscribe(busName, callback) {
            if (!MSG_BUSES.has(busName)) {
                return
            }
            const callbacks = MSG_BUSES.get(busName)
            const found = callbacks.indexOf(callback) !== -1
            if (found !== -1) {
                callbacks.splice(found, 1)
            }
        }
function msg_copyTemplate(src, start, end) {
            const template = []
            for (let i = start; i < end; i++) {
                const tokenType = msg_getTokenType(src, i)
                template.push(tokenType)
                if (tokenType === MSG_STRING_TOKEN) {
                    template.push(msg_readStringToken(src, i).length)
                }
            }
            return template
        }
function msg_copyMessage(src, dest, srcStart, srcEnd, destStart) {
            let i = srcStart
            let j = destStart
            for (i, j; i < srcEnd; i++, j++) {
                if (msg_getTokenType(src, i) === MSG_STRING_TOKEN) {
                    msg_writeStringToken(dest, j, msg_readStringToken(src, i))
                } else {
                    msg_writeFloatToken(dest, j, msg_readFloatToken(src, i))
                }
            }
        }
function msg_slice(message, start, end) {
            if (msg_getLength(message) <= start) {
                throw new Error('message empty')
            }
            const template = msg_copyTemplate(message, start, end)
            const newMessage = msg_create(template)
            msg_copyMessage(message, newMessage, start, end, 0)
            return newMessage
        }
function msg_concat(message1, message2) {
            const newMessage = msg_create(msg_copyTemplate(message1, 0, msg_getLength(message1)).concat(msg_copyTemplate(message2, 0, msg_getLength(message2))))
            msg_copyMessage(message1, newMessage, 0, msg_getLength(message1), 0)
            msg_copyMessage(message2, newMessage, 0, msg_getLength(message2), msg_getLength(message1))
            return newMessage
        }
function msg_shift(message) {
            switch (msg_getLength(message)) {
                case 0:
                    throw new Error('message empty')
                case 1:
                    return msg_create([])
                default:
                    return msg_slice(message, 1, msg_getLength(message))
            }
        }
function commons_waitEngineConfigure(callback) {
            sked_wait(_commons_ENGINE_LOGGED_SKEDULER, 'configure', callback)
        }

function n_control_setReceiveBusName(state, busName) {
        if (state.receiveBusName !== "empty") {
            msgBusUnsubscribe(state.receiveBusName, state.messageReceiver)
        }
        state.receiveBusName = busName
        if (state.receiveBusName !== "empty") {
            msgBusSubscribe(state.receiveBusName, state.messageReceiver)
        }
    }
function n_control_setSendReceiveFromMessage(state, m) {
        if (
            msg_isMatching(m, [MSG_STRING_TOKEN, MSG_STRING_TOKEN])
            && msg_readStringToken(m, 0) === 'receive'
        ) {
            n_control_setReceiveBusName(state, msg_readStringToken(m, 1))
            return true

        } else if (
            msg_isMatching(m, [MSG_STRING_TOKEN, MSG_STRING_TOKEN])
            && msg_readStringToken(m, 0) === 'send'
        ) {
            state.sendBusName = msg_readStringToken(m, 1)
            return true
        }
        return false
    }
function n_control_defaultMessageHandler(m) {}
function n_floatatom_receiveMessage(state, m) {
                    if (msg_isBang(m)) {
                        state.messageSender(state.value)
                        if (state.sendBusName !== "empty") {
                            msgBusPublish(state.sendBusName, state.value)
                        }
                        return
                    
                    } else if (
                        msg_getTokenType(m, 0) === MSG_STRING_TOKEN
                        && msg_readStringToken(m, 0) === 'set'
                    ) {
                        const setMessage = msg_slice(m, 1, msg_getLength(m))
                        if (msg_isMatching(setMessage, [MSG_FLOAT_TOKEN])) { 
                                state.value = setMessage    
                                return
                        }
        
                    } else if (n_control_setSendReceiveFromMessage(state, m) === true) {
                        return
                        
                    } else if (msg_isMatching(m, [MSG_FLOAT_TOKEN])) {
                    
                        state.value = m
                        state.messageSender(state.value)
                        if (state.sendBusName !== "empty") {
                            msgBusPublish(state.sendBusName, state.value)
                        }
                        return
        
                    }
                }

function commons_waitFrame(frame, callback) {
            return sked_wait_future(_commons_FRAME_SKEDULER, frame.toString(), callback)
        }
function commons_cancelWaitFrame(id) {
            sked_cancel(_commons_FRAME_SKEDULER, id)
        }
function n_bang_receiveMessage(state, m) {
                if (n_control_setSendReceiveFromMessage(state, m) === true) {
                    return
                }
                
                const outMessage = msg_bang()
                state.messageSender(outMessage)
                if (state.sendBusName !== "empty") {
                    msgBusPublish(state.sendBusName, outMessage)
                }
                return
            }


function interpolateLin(x, p0, p1) {
            return p0.y + (x - p0.x) * (p1.y - p0.y) / (p1.x - p0.x)
        }

function computeSlope(p0, p1) {
            return p1.x !== p0.x ? (p1.y - p0.y) / (p1.x - p0.x) : 0
        }
function removePointsBeforeFrame(points, frame) {
            const newPoints = []
            let i = 0
            while (i < points.length) {
                if (frame <= points[i].x) {
                    newPoints.push(points[i])
                }
                i++
            }
            return newPoints
        }
function insertNewLinePoints(points, p0, p1) {
            const newPoints = []
            let i = 0
            
            // Keep the points that are before the new points added
            while (i < points.length && points[i].x <= p0.x) {
                newPoints.push(points[i])
                i++
            }
            
            // Find the start value of the start point :
            
            // 1. If there is a previous point and that previous point
            // is on the same frame, we don't modify the start point value.
            // (represents a vertical line).
            if (0 < i - 1 && points[i - 1].x === p0.x) {

            // 2. If new points are inserted in between already existing points 
            // we need to interpolate the existing line to find the startValue.
            } else if (0 < i && i < points.length) {
                newPoints.push({
                    x: p0.x,
                    y: interpolateLin(p0.x, points[i - 1], points[i])
                })

            // 3. If new line is inserted after all existing points, 
            // we just take the value of the last point
            } else if (i >= points.length && points.length) {
                newPoints.push({
                    x: p0.x,
                    y: points[points.length - 1].y,
                })

            // 4. If new line placed in first position, we take the defaultStartValue.
            } else if (i === 0) {
                newPoints.push({
                    x: p0.x,
                    y: p0.y,
                })
            }
            
            newPoints.push({
                x: p1.x,
                y: p1.y,
            })
            return newPoints
        }
function computeFrameAjustedPoints(points) {
            if (points.length < 2) {
                throw new Error('invalid length for points')
            }

            const newPoints = []
            let i = 0
            let p = points[0]
            let frameLower = 0
            let frameUpper = 0
            
            while(i < points.length) {
                p = points[i]
                frameLower = Math.floor(p.x)
                frameUpper = frameLower + 1

                // I. Placing interpolated point at the lower bound of the current frame
                // ------------------------------------------------------------------------
                // 1. Point is already on an exact frame,
                if (p.x === frameLower) {
                    newPoints.push({ x: p.x, y: p.y })

                    // 1.a. if several of the next points are also on the same X,
                    // we find the last one to draw a vertical line.
                    while (
                        (i + 1) < points.length
                        && points[i + 1].x === frameLower
                    ) {
                        i++
                    }
                    if (points[i].y !== newPoints[newPoints.length - 1].y) {
                        newPoints.push({ x: points[i].x, y: points[i].y })
                    }

                    // 1.b. if last point, we quit
                    if (i + 1 >= points.length) {
                        break
                    }

                    // 1.c. if next point is in a different frame we can move on to next iteration
                    if (frameUpper <= points[i + 1].x) {
                        i++
                        continue
                    }
                
                // 2. Point isn't on an exact frame
                // 2.a. There's a previous point, the we use it to interpolate the value.
                } else if (newPoints.length) {
                    newPoints.push({
                        x: frameLower,
                        y: interpolateLin(frameLower, points[i - 1], p),
                    })
                
                // 2.b. It's the very first point, then we don't change its value.
                } else {
                    newPoints.push({ x: frameLower, y: p.y })
                }

                // II. Placing interpolated point at the upper bound of the current frame
                // ---------------------------------------------------------------------------
                // First, we find the closest point from the frame upper bound (could be the same p).
                // Or could be a point that is exactly placed on frameUpper.
                while (
                    (i + 1) < points.length 
                    && (
                        Math.ceil(points[i + 1].x) === frameUpper
                        || Math.floor(points[i + 1].x) === frameUpper
                    )
                ) {
                    i++
                }
                p = points[i]

                // 1. If the next point is directly in the next frame, 
                // we do nothing, as this corresponds with next iteration frameLower.
                if (Math.floor(p.x) === frameUpper) {
                    continue
                
                // 2. If there's still a point after p, we use it to interpolate the value
                } else if (i < points.length - 1) {
                    newPoints.push({
                        x: frameUpper,
                        y: interpolateLin(frameUpper, p, points[i + 1]),
                    })

                // 3. If it's the last point, we dont change the value
                } else {
                    newPoints.push({ x: frameUpper, y: p.y })
                }

                i++
            }

            return newPoints
        }
function computeLineSegments(points) {
            const lineSegments = []
            let i = 0
            let p0
            let p1

            while(i < points.length - 1) {
                p0 = points[i]
                p1 = points[i + 1]
                lineSegments.push({
                    p0, p1, 
                    dy: computeSlope(p0, p1),
                    dx: 1,
                })
                i++
            }
            return lineSegments
        }
function computeUnitInSamples(sampleRate, amount, unit) {
        if (unit === 'msec' || unit === 'millisecond') {
            return amount / 1000 * sampleRate
        } else if (unit === 'sec' || unit === 'seconds' || unit === 'second') {
            return amount * sampleRate
        } else if (unit === 'min' || unit === 'minutes' || unit === 'minute') {
            return amount * 60 * sampleRate
        } else if (unit === 'samp' || unit === 'samples' || unit === 'sample') {
            return amount
        } else {
            throw new Error("invalid time unit : " + unit)
        }
    }
function msg_isAction(message, action) {
            return msg_isMatching(message, [MSG_STRING_TOKEN])
                && msg_readStringToken(message, 0) === action
        }

function n_vline_t_setNewLine(state, targetValue) {
        state.points = removePointsBeforeFrame(state.points, toFloat(FRAME))
        const startFrame = toFloat(FRAME) + state.nextDelaySamp
        const endFrame = startFrame + state.nextDurationSamp
        if (endFrame === toFloat(FRAME)) {
            state.currentValue = targetValue
            state.lineSegments = []
        } else {
            state.points = insertNewLinePoints(
                state.points, 
                {x: startFrame, y: state.currentValue},
                {x: endFrame, y: targetValue}
            )
            state.lineSegments = computeLineSegments(
                computeFrameAjustedPoints(state.points))
        }
        state.nextDurationSamp = 0
        state.nextDelaySamp = 0
    }
function n_vline_t_setNextDuration(state, durationMsec) {
        state.nextDurationSamp = computeUnitInSamples(SAMPLE_RATE, durationMsec, 'msec')
    }
function n_vline_t_setNextDelay(state, delayMsec) {
        state.nextDelaySamp = computeUnitInSamples(SAMPLE_RATE, delayMsec, 'msec')
    }

function n_div_setLeft(state, value) {
                    state.leftOp = value
                }
function n_div_setRight(state, value) {
                    state.rightOp = value
                }

const n_line_t_defaultLine = {
        p0: {x: -1, y: 0},
        p1: {x: -1, y: 0},
        dx: 1,
        dy: 0,
    }
function n_line_t_setNewLine(state, targetValue) {
        const startFrame = toFloat(FRAME)
        const endFrame = toFloat(FRAME) + state.nextDurationSamp
        if (endFrame === toFloat(FRAME)) {
            state.currentLine = n_line_t_defaultLine
            state.currentValue = targetValue
            state.nextDurationSamp = 0
        } else {
            state.currentLine = {
                p0: {
                    x: startFrame, 
                    y: state.currentValue,
                }, 
                p1: {
                    x: endFrame, 
                    y: targetValue,
                }, 
                dx: 1,
                dy: 0,
            }
            state.currentLine.dy = computeSlope(state.currentLine.p0, state.currentLine.p1)
            state.nextDurationSamp = 0
        }
    }
function n_line_t_setNextDuration(state, durationMsec) {
        state.nextDurationSamp = computeUnitInSamples(SAMPLE_RATE, durationMsec, 'msec')
    }
function n_line_t_stop(state) {
        state.currentLine.p1.x = -1
        state.currentLine.p1.y = state.currentValue
    }

function n_osc_t_setPhase(state, phase) {
            state.phase = phase % 1.0 * 2 * Math.PI
        }
        
function n_0_2_RCVS_0(m) {
                                
                n_floatatom_receiveMessage(n_0_2_STATE, m)
                return
            
                                throw new Error('[floatatom], id "n_0_2", inlet "0", unsupported message : ' + msg_display(m))
                            }

function m_n_0_3_0__routemsg_RCVS_0(m) {
                                
            if (msg_isMatching(m, [MSG_FLOAT_TOKEN])) {
                m_n_0_3_0_sig_RCVS_0(m)
                return
            } else {
                SND_TO_NULL(m)
                return
            }
        
                                throw new Error('[_routemsg], id "m_n_0_3_0__routemsg", inlet "0", unsupported message : ' + msg_display(m))
                            }

function m_n_0_3_0_sig_RCVS_0(m) {
                                
        if (msg_isMatching(m, [MSG_FLOAT_TOKEN])) {
            m_n_0_3_0_sig_STATE.currentValue = msg_readFloatToken(m, 0)
            return
        }
    
                                throw new Error('[sig~], id "m_n_0_3_0_sig", inlet "0", unsupported message : ' + msg_display(m))
                            }

function n_0_5_RCVS_0(m) {
                                
                n_floatatom_receiveMessage(n_0_5_STATE, m)
                return
            
                                throw new Error('[floatatom], id "n_0_5", inlet "0", unsupported message : ' + msg_display(m))
                            }

function m_n_0_4_0__routemsg_RCVS_0(m) {
                                
            if (msg_isMatching(m, [MSG_FLOAT_TOKEN])) {
                m_n_0_4_0_sig_RCVS_0(m)
                return
            } else {
                SND_TO_NULL(m)
                return
            }
        
                                throw new Error('[_routemsg], id "m_n_0_4_0__routemsg", inlet "0", unsupported message : ' + msg_display(m))
                            }

function m_n_0_4_0_sig_RCVS_0(m) {
                                
        if (msg_isMatching(m, [MSG_FLOAT_TOKEN])) {
            m_n_0_4_0_sig_STATE.currentValue = msg_readFloatToken(m, 0)
            return
        }
    
                                throw new Error('[sig~], id "m_n_0_4_0_sig", inlet "0", unsupported message : ' + msg_display(m))
                            }

function n_0_7_RCVS_0(m) {
                                
                n_floatatom_receiveMessage(n_0_7_STATE, m)
                return
            
                                throw new Error('[floatatom], id "n_0_7", inlet "0", unsupported message : ' + msg_display(m))
                            }

function m_n_0_6_1__routemsg_RCVS_0(m) {
                                
            if (msg_isMatching(m, [MSG_FLOAT_TOKEN])) {
                m_n_0_6_1_sig_RCVS_0(m)
                return
            } else {
                SND_TO_NULL(m)
                return
            }
        
                                throw new Error('[_routemsg], id "m_n_0_6_1__routemsg", inlet "0", unsupported message : ' + msg_display(m))
                            }

function m_n_0_6_1_sig_RCVS_0(m) {
                                
        if (msg_isMatching(m, [MSG_FLOAT_TOKEN])) {
            m_n_0_6_1_sig_STATE.currentValue = msg_readFloatToken(m, 0)
            return
        }
    
                                throw new Error('[sig~], id "m_n_0_6_1_sig", inlet "0", unsupported message : ' + msg_display(m))
                            }

function n_0_13_RCVS_0(m) {
                                
            n_bang_receiveMessage(n_0_13_STATE, m)
            return
        
                                throw new Error('[bang], id "n_0_13", inlet "0", unsupported message : ' + msg_display(m))
                            }

function n_0_12_RCVS_0(m) {
                                
            if (
                msg_isStringToken(m, 0) 
                && msg_readStringToken(m, 0) === 'set'
            ) {
                n_0_12_STATE.outTemplates = [[]]
                for (let i = 1; i < msg_getLength(m); i++) {
                    if (msg_isFloatToken(m, i)) {
                        n_0_12_STATE.outTemplates[0].push(MSG_FLOAT_TOKEN)
                    } else {
                        n_0_12_STATE.outTemplates[0].push(MSG_STRING_TOKEN)
                        n_0_12_STATE.outTemplates[0].push(msg_readStringToken(m, i).length)
                    }
                }

                const message = msg_create(n_0_12_STATE.outTemplates[0])
                for (let i = 1; i < msg_getLength(m); i++) {
                    if (msg_isFloatToken(m, i)) {
                        msg_writeFloatToken(
                            message, i - 1, msg_readFloatToken(m, i)
                        )
                    } else {
                        msg_writeStringToken(
                            message, i - 1, msg_readStringToken(m, i)
                        )
                    }
                }
                n_0_12_STATE.outMessages[0] = message
                n_0_12_STATE.messageTransferFunctions.splice(0, n_0_12_STATE.messageTransferFunctions.length - 1)
                n_0_12_STATE.messageTransferFunctions[0] = function (m) {
                    return n_0_12_STATE.outMessages[0]
                }
                return

            } else {
                for (let i = 0; i < n_0_12_STATE.messageTransferFunctions.length; i++) {
                    n_0_11_RCVS_0(n_0_12_STATE.messageTransferFunctions[i](m))
                }
                return
            }
        
                                throw new Error('[msg], id "n_0_12", inlet "0", unsupported message : ' + msg_display(m))
                            }
let n_0_11_OUTS_0 = 0
function n_0_11_RCVS_0(m) {
                                
    if (
        msg_isMatching(m, [MSG_FLOAT_TOKEN])
        || msg_isMatching(m, [MSG_FLOAT_TOKEN, MSG_FLOAT_TOKEN])
        || msg_isMatching(m, [MSG_FLOAT_TOKEN, MSG_FLOAT_TOKEN, MSG_FLOAT_TOKEN])
    ) {
        switch (msg_getLength(m)) {
            case 3:
                n_vline_t_setNextDelay(n_0_11_STATE, msg_readFloatToken(m, 2))
            case 2:
                n_vline_t_setNextDuration(n_0_11_STATE, msg_readFloatToken(m, 1))
            case 1:
                n_vline_t_setNewLine(n_0_11_STATE, msg_readFloatToken(m, 0))
        }
        return

    } else if (msg_isAction(m, 'stop')) {
        n_0_11_STATE.points = []
        n_0_11_STATE.lineSegments = []
        return
    }
    
                                throw new Error('[vline~], id "n_0_11", inlet "0", unsupported message : ' + msg_display(m))
                            }

function n_0_14_RCVS_0(m) {
                                
                n_floatatom_receiveMessage(n_0_14_STATE, m)
                return
            
                                throw new Error('[floatatom], id "n_0_14", inlet "0", unsupported message : ' + msg_display(m))
                            }

function n_0_15_RCVS_0(m) {
                                
                if (msg_isMatching(m, [MSG_FLOAT_TOKEN])) {
                    n_div_setLeft(n_0_15_STATE, msg_readFloatToken(m, 0))
                    n_0_9_RCVS_0(msg_floats([n_0_15_STATE.rightOp !== 0 ? n_0_15_STATE.leftOp / n_0_15_STATE.rightOp: 0]))
                    return
                
                } else if (msg_isBang(m)) {
                    n_0_9_RCVS_0(msg_floats([n_0_15_STATE.rightOp !== 0 ? n_0_15_STATE.leftOp / n_0_15_STATE.rightOp: 0]))
                    return
                }
            
                                throw new Error('[/], id "n_0_15", inlet "0", unsupported message : ' + msg_display(m))
                            }

function n_0_9_RCVS_0(m) {
                                
            if (
                msg_isStringToken(m, 0) 
                && msg_readStringToken(m, 0) === 'set'
            ) {
                n_0_9_STATE.outTemplates = [[]]
                for (let i = 1; i < msg_getLength(m); i++) {
                    if (msg_isFloatToken(m, i)) {
                        n_0_9_STATE.outTemplates[0].push(MSG_FLOAT_TOKEN)
                    } else {
                        n_0_9_STATE.outTemplates[0].push(MSG_STRING_TOKEN)
                        n_0_9_STATE.outTemplates[0].push(msg_readStringToken(m, i).length)
                    }
                }

                const message = msg_create(n_0_9_STATE.outTemplates[0])
                for (let i = 1; i < msg_getLength(m); i++) {
                    if (msg_isFloatToken(m, i)) {
                        msg_writeFloatToken(
                            message, i - 1, msg_readFloatToken(m, i)
                        )
                    } else {
                        msg_writeStringToken(
                            message, i - 1, msg_readStringToken(m, i)
                        )
                    }
                }
                n_0_9_STATE.outMessages[0] = message
                n_0_9_STATE.messageTransferFunctions.splice(0, n_0_9_STATE.messageTransferFunctions.length - 1)
                n_0_9_STATE.messageTransferFunctions[0] = function (m) {
                    return n_0_9_STATE.outMessages[0]
                }
                return

            } else {
                for (let i = 0; i < n_0_9_STATE.messageTransferFunctions.length; i++) {
                    n_0_8_RCVS_0(n_0_9_STATE.messageTransferFunctions[i](m))
                }
                return
            }
        
                                throw new Error('[msg], id "n_0_9", inlet "0", unsupported message : ' + msg_display(m))
                            }
let n_0_8_OUTS_0 = 0
function n_0_8_RCVS_0(m) {
                                
        if (
            msg_isMatching(m, [MSG_FLOAT_TOKEN])
            || msg_isMatching(m, [MSG_FLOAT_TOKEN, MSG_FLOAT_TOKEN])
        ) {
            switch (msg_getLength(m)) {
                case 2:
                    n_line_t_setNextDuration(n_0_8_STATE, msg_readFloatToken(m, 1))
                case 1:
                    n_line_t_setNewLine(n_0_8_STATE, msg_readFloatToken(m, 0))
            }
            return

        } else if (msg_isAction(m, 'stop')) {
            n_line_t_stop(n_0_8_STATE)
            return

        }
    
                                throw new Error('[line~], id "n_0_8", inlet "0", unsupported message : ' + msg_display(m))
                            }
let n_0_4_OUTS_0 = 0





let n_0_10_OUTS_0 = 0



let n_0_1_OUTS_0 = 0



























        

        function ioRcv_n_0_2_0(m) {n_0_2_RCVS_0(m)}
function ioRcv_n_0_5_0(m) {n_0_5_RCVS_0(m)}
function ioRcv_n_0_7_0(m) {n_0_7_RCVS_0(m)}
function ioRcv_n_0_9_0(m) {n_0_9_RCVS_0(m)}
function ioRcv_n_0_12_0(m) {n_0_12_RCVS_0(m)}
function ioRcv_n_0_13_0(m) {n_0_13_RCVS_0(m)}
function ioRcv_n_0_14_0(m) {n_0_14_RCVS_0(m)}
        

        
            const n_0_2_STATE = {
                value: msg_floats([0]),
                receiveBusName: "empty",
                sendBusName: "empty",
                messageReceiver: n_control_defaultMessageHandler,
                messageSender: n_control_defaultMessageHandler,
            }
        
            commons_waitEngineConfigure(() => {
                n_0_2_STATE.messageReceiver = function (m) {
                    n_floatatom_receiveMessage(n_0_2_STATE, m)
                }
                n_0_2_STATE.messageSender = m_n_0_3_0__routemsg_RCVS_0
                n_control_setReceiveBusName(n_0_2_STATE, "empty")
            })
        


            const m_n_0_3_0_sig_STATE = {
                currentValue: 0
            }
        

            const n_0_5_STATE = {
                value: msg_floats([0]),
                receiveBusName: "empty",
                sendBusName: "empty",
                messageReceiver: n_control_defaultMessageHandler,
                messageSender: n_control_defaultMessageHandler,
            }
        
            commons_waitEngineConfigure(() => {
                n_0_5_STATE.messageReceiver = function (m) {
                    n_floatatom_receiveMessage(n_0_5_STATE, m)
                }
                n_0_5_STATE.messageSender = m_n_0_4_0__routemsg_RCVS_0
                n_control_setReceiveBusName(n_0_5_STATE, "empty")
            })
        


            const m_n_0_4_0_sig_STATE = {
                currentValue: 440
            }
        

            const n_0_7_STATE = {
                value: msg_floats([0]),
                receiveBusName: "empty",
                sendBusName: "empty",
                messageReceiver: n_control_defaultMessageHandler,
                messageSender: n_control_defaultMessageHandler,
            }
        
            commons_waitEngineConfigure(() => {
                n_0_7_STATE.messageReceiver = function (m) {
                    n_floatatom_receiveMessage(n_0_7_STATE, m)
                }
                n_0_7_STATE.messageSender = m_n_0_6_1__routemsg_RCVS_0
                n_control_setReceiveBusName(n_0_7_STATE, "empty")
            })
        


            const m_n_0_6_1_sig_STATE = {
                currentValue: 0
            }
        

        const n_0_13_STATE = {
            value: msg_create([]),
            receiveBusName: "empty",
            sendBusName: "empty",
            messageReceiver: n_control_defaultMessageHandler,
            messageSender: n_control_defaultMessageHandler,
        }
    
        commons_waitEngineConfigure(() => {
            n_0_13_STATE.messageReceiver = function (m) {
                n_bang_receiveMessage(n_0_13_STATE, m)
            }
            n_0_13_STATE.messageSender = n_0_12_RCVS_0
            n_control_setReceiveBusName(n_0_13_STATE, "empty")
        })

        
    

        const n_0_12_STATE = {
            outTemplates: [],
            outMessages: [],
            messageTransferFunctions: [],
        }

        
            
            
            
            n_0_12_STATE.outTemplates[0] = []
            
                n_0_12_STATE.outTemplates[0].push(MSG_FLOAT_TOKEN)
            

                n_0_12_STATE.outTemplates[0].push(MSG_FLOAT_TOKEN)
            
            n_0_12_STATE.outMessages[0] = msg_create(n_0_12_STATE.outTemplates[0])
            
                msg_writeFloatToken(n_0_12_STATE.outMessages[0], 0, 1)
            

                msg_writeFloatToken(n_0_12_STATE.outMessages[0], 1, 10)
            
        

            
            
            
            n_0_12_STATE.outTemplates[1] = []
            
                n_0_12_STATE.outTemplates[1].push(MSG_FLOAT_TOKEN)
            

                n_0_12_STATE.outTemplates[1].push(MSG_FLOAT_TOKEN)
            

                n_0_12_STATE.outTemplates[1].push(MSG_FLOAT_TOKEN)
            
            n_0_12_STATE.outMessages[1] = msg_create(n_0_12_STATE.outTemplates[1])
            
                msg_writeFloatToken(n_0_12_STATE.outMessages[1], 0, 0)
            

                msg_writeFloatToken(n_0_12_STATE.outMessages[1], 1, 600)
            

                msg_writeFloatToken(n_0_12_STATE.outMessages[1], 2, 50)
            
        
        
        n_0_12_STATE.messageTransferFunctions = [
            function (inMessage) {
                    
                    return n_0_12_STATE.outMessages[0]
                }
,
function (inMessage) {
                    
                    return n_0_12_STATE.outMessages[1]
                }
,
        ]
    

        const n_0_11_STATE = {
            points: [],
            lineSegments: [],
            currentValue: 0,
            nextDurationSamp: 0,
            nextDelaySamp: 0,
        }
    

            const n_0_14_STATE = {
                value: msg_floats([0]),
                receiveBusName: "empty",
                sendBusName: "empty",
                messageReceiver: n_control_defaultMessageHandler,
                messageSender: n_control_defaultMessageHandler,
            }
        
            commons_waitEngineConfigure(() => {
                n_0_14_STATE.messageReceiver = function (m) {
                    n_floatatom_receiveMessage(n_0_14_STATE, m)
                }
                n_0_14_STATE.messageSender = n_0_15_RCVS_0
                n_control_setReceiveBusName(n_0_14_STATE, "empty")
            })
        

        const n_0_15_STATE = {
                leftOp: 0,
                rightOp: 0,
            }
            n_div_setLeft(n_0_15_STATE, 0)
            n_div_setRight(n_0_15_STATE, 100)
        

        const n_0_9_STATE = {
            outTemplates: [],
            outMessages: [],
            messageTransferFunctions: [],
        }

        
        
        n_0_9_STATE.messageTransferFunctions = [
            function (inMessage) {
                    
            
            
            let stringMem = []
            n_0_9_STATE.outTemplates[0] = []
            
                n_0_9_STATE.outTemplates[0].push(msg_getTokenType(inMessage, 0))
                if (msg_isStringToken(inMessage, 0)) {
                    stringMem[0] = msg_readStringToken(inMessage, 0)
                    n_0_9_STATE.outTemplates[0].push(stringMem[0].length)
                }
            

                n_0_9_STATE.outTemplates[0].push(MSG_FLOAT_TOKEN)
            
            n_0_9_STATE.outMessages[0] = msg_create(n_0_9_STATE.outTemplates[0])
            
                if (msg_isFloatToken(inMessage, 0)) {
                    msg_writeFloatToken(n_0_9_STATE.outMessages[0], 0, msg_readFloatToken(inMessage, 0))
                } else if (msg_isStringToken(inMessage, 0)) {
                    msg_writeStringToken(n_0_9_STATE.outMessages[0], 0, stringMem[0])
                }
            

                msg_writeFloatToken(n_0_9_STATE.outMessages[0], 1, 50)
            
        
                    return n_0_9_STATE.outMessages[0]
                }
,
        ]
    

        const n_0_8_STATE = {
            currentLine: n_line_t_defaultLine,
            currentValue: 0,
            nextDurationSamp: 0,
        }
    

            const n_0_4_STATE = {
                phase: 0,
                J: 0,
            }
            
            commons_waitEngineConfigure(() => {
                n_0_4_STATE.J = 2 * Math.PI / SAMPLE_RATE
            })
        



            const n_0_10_STATE = {
                phase: 0,
                J: 0,
            }
            
            commons_waitEngineConfigure(() => {
                n_0_10_STATE.J = 2 * Math.PI / SAMPLE_RATE
            })
        




        const exports = {
            metadata: {"libVersion":"0.1.0","audioSettings":{"channelCount":{"in":2,"out":2},"bitDepth":64,"sampleRate":0,"blockSize":0},"compilation":{"io":{"messageReceivers":{"n_0_2":{"portletIds":["0"],"metadata":{"group":"control:float","type":"floatatom","label":"carrier","position":[85,107]}},"n_0_5":{"portletIds":["0"],"metadata":{"group":"control:float","type":"floatatom","label":"modulator","position":[136,46]}},"n_0_7":{"portletIds":["0"],"metadata":{"group":"control:float","type":"floatatom","label":"mod_depth","position":[215,82]}},"n_0_9":{"portletIds":["0"],"metadata":{"group":"control","type":"msg","position":[102,293]}},"n_0_12":{"portletIds":["0"],"metadata":{"group":"control","type":"msg","position":[163,292]}},"n_0_13":{"portletIds":["0"],"metadata":{"group":"control","type":"bng","label":"note_trigger","position":[163,267]}},"n_0_14":{"portletIds":["0"],"metadata":{"group":"control:float","type":"floatatom","label":"volume","position":[102,236]}}},"messageSenders":{}},"variableNamesIndex":{"io":{"messageReceivers":{"n_0_2":{"0":"ioRcv_n_0_2_0"},"n_0_5":{"0":"ioRcv_n_0_5_0"},"n_0_7":{"0":"ioRcv_n_0_7_0"},"n_0_9":{"0":"ioRcv_n_0_9_0"},"n_0_12":{"0":"ioRcv_n_0_12_0"},"n_0_13":{"0":"ioRcv_n_0_13_0"},"n_0_14":{"0":"ioRcv_n_0_14_0"}},"messageSenders":{}}}}},
            configure: (sampleRate, blockSize) => {
                exports.metadata.audioSettings.sampleRate = sampleRate
                exports.metadata.audioSettings.blockSize = blockSize
                SAMPLE_RATE = sampleRate
                BLOCK_SIZE = blockSize
                _commons_emitEngineConfigure()
            },
            loop: (INPUT, OUTPUT) => {
                
        for (F = 0; F < BLOCK_SIZE; F++) {
            _commons_emitFrame(FRAME)
            
        n_0_4_OUTS_0 = Math.cos(n_0_4_STATE.phase)
        n_0_4_STATE.phase += (n_0_4_STATE.J * m_n_0_4_0_sig_STATE.currentValue)
    

        n_0_10_OUTS_0 = Math.cos(n_0_10_STATE.phase)
        n_0_10_STATE.phase += (n_0_10_STATE.J * (m_n_0_3_0_sig_STATE.currentValue * (n_0_4_OUTS_0 * m_n_0_6_1_sig_STATE.currentValue)))
    

    n_0_8_OUTS_0 = n_0_8_STATE.currentValue
    if (toFloat(FRAME) < n_0_8_STATE.currentLine.p1.x) {
        n_0_8_STATE.currentValue += n_0_8_STATE.currentLine.dy
        if (toFloat(FRAME + 1) >= n_0_8_STATE.currentLine.p1.x) {
            n_0_8_STATE.currentValue = n_0_8_STATE.currentLine.p1.y
        }
    }


    if (n_0_11_STATE.lineSegments.length) {
        if (toFloat(FRAME) < n_0_11_STATE.lineSegments[0].p0.x) {

        // This should come first to handle vertical lines
        } else if (toFloat(FRAME) === n_0_11_STATE.lineSegments[0].p1.x) {
            n_0_11_STATE.currentValue = n_0_11_STATE.lineSegments[0].p1.y
            n_0_11_STATE.lineSegments.shift()

        } else if (toFloat(FRAME) === n_0_11_STATE.lineSegments[0].p0.x) {
            n_0_11_STATE.currentValue = n_0_11_STATE.lineSegments[0].p0.y

        } else if (toFloat(FRAME) < n_0_11_STATE.lineSegments[0].p1.x) {
            n_0_11_STATE.currentValue += n_0_11_STATE.lineSegments[0].dy

        }
    }
    n_0_11_OUTS_0 = n_0_11_STATE.currentValue

n_0_1_OUTS_0 = n_0_10_OUTS_0 * (n_0_8_OUTS_0 + n_0_11_OUTS_0)
OUTPUT[0][F] = n_0_1_OUTS_0
OUTPUT[1][F] = n_0_1_OUTS_0
            FRAME++
        }
    
            },
            io: {
                messageReceivers: {
                    n_0_2: {
                            "0": ioRcv_n_0_2_0,
                        },
n_0_5: {
                            "0": ioRcv_n_0_5_0,
                        },
n_0_7: {
                            "0": ioRcv_n_0_7_0,
                        },
n_0_9: {
                            "0": ioRcv_n_0_9_0,
                        },
n_0_12: {
                            "0": ioRcv_n_0_12_0,
                        },
n_0_13: {
                            "0": ioRcv_n_0_13_0,
                        },
n_0_14: {
                            "0": ioRcv_n_0_14_0,
                        },
                },
                messageSenders: {
                    
                },
            }
        }

        

    