import time
import threading
from pythonosc import osc_bundle_builder
from pythonosc import osc_message_builder
from pythonosc import udp_client
from pythonosc import dispatcher
from pythonosc import osc_server
from typing import List, Any
import pathlib
from playsound import playsound


# A 2-way client that sends some tick pulses to PD that control a metronome and
# then starts a server that receives tick pulses from pd that control a metronome here.

ip = '127.0.0.1'
serverPort = 7001
clientPort = 8888

# find the absolute path to the audio file tick.wav.
path = pathlib.Path(__file__).parent.resolve()
audio = "tick.wav"


def pyOscHandler(address: str, *args: List[Any]) -> None:
    # A dispatcher function that handles the OSC messages we recevie on our server
    print(f'{args[0]}')

    # play the tick audio file from the root dir
    playsound(f'{path}/{audio}')


# Setup different "routes" where we can map different functions to different OSC adressess received.
dispatcher = dispatcher.Dispatcher()
dispatcher.map("/py*", pyOscHandler)


def startClient(ip, port):
    # create a simple OSC client
    print("Starting example2_client.")
    client = udp_client.SimpleUDPClient(ip, port)

    # Send messages from our client in a paralell thread
    thread = threading.Thread(target=sendMessages(client))
    thread.start()


def sendMessages(client):
    # send OSC frames (custom bundles) with a messages to a client
    message = "tick"
    osc_address = "/pd"

    for i in range(10):
        # open a OSC bundle
        bundle = osc_bundle_builder.OscBundleBuilder(
            osc_bundle_builder.IMMEDIATELY)

        # create a message with an OSC address
        msg = osc_message_builder.OscMessageBuilder(address=osc_address)

        # add arguments to the message
        msg.add_arg(message)

        # build the message and add to current bundle
        bundle.add_content(msg.build())

        # close OSC bundle
        bundle = bundle.build()

        # send the bundle to remote client
        client.send(bundle)

        # One frame every second
        time.sleep(1)


def startServer(ip, port):
    # receive messages from clients (with "/py as OSC address").
    print("Starting Server.")

    # A simple OSC threading server to listen for OSC messages
    server = osc_server.ThreadingOSCUDPServer((ip, port), dispatcher)
    print(
        f'Serving on {server.server_address[0]}, port {server.server_address[1]}.')

    # Start our server in a paralell thread
    thread = threading.Thread(target=server.serve_forever)
    thread.start()


# run our code.
startServer(ip, serverPort)
startClient(ip, clientPort)
