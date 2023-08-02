from pythonosc import dispatcher
from pythonosc import osc_server
from typing import List, Any
from playsound import playsound

# A client receives tick pulses from pd and use them to control
# a metronome.

ip = '127.0.0.1'


def receiveMessages(dispatcher):
    localPort = 8889

    def printMess(address: str, *args: List[Any]) -> None:
        print(f'oscClient1.py playing {args}')
        # play the tick audio file from the root dir
        playsound("./python/tick.wav")

    dispatcher = dispatcher.Dispatcher()
    dispatcher.map("/py*", printMess)

    # here we define a simple OSC threading server to listen for OSC messages in paralell
    server = osc_server.ThreadingOSCUDPServer(
        (ip, localPort), dispatcher)

    # we "execute" our server "forever" (until ctrl+c)
    print(f'oscClient1.py listening on port {localPort}')
    server.serve_forever()


receiveMessages(dispatcher)
