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


"""
Expanding on example1_client.py.

A p2p client that continously sends "tick" messages to a remote client (PD) to control a metronome, and listens for tick pulses to control a local metronome.
"""

clientIp = '127.0.0.1'  # remote ip
clientPort = 8001

serverIp = '127.0.0.1'  # local ip
serverPort = 8000


# find the absolute path to the audio file tick.wav.
path = pathlib.Path(__file__).parent.resolve()
audio = "tick.wav"


# client (sender) code
def startClient(ip, port):
    # create a simple OSC client
    client = udp_client.SimpleUDPClient(ip, port)
    print(f'Starting client on {ip}, port {port}.')

    # Send messages from our client in a paralell thread
    thread = threading.Thread(target=sendMessages(client))
    thread.start()


def sendMessages(client):
    # send OSC frames (custom bundles) with a messages to a client
    message = "tick"
    osc_address = "/pd"

    print("sending messages..")
    while True:
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

        # One frame every half second
        time.sleep(.5)

    print("done sending.")


# server (sender) code
def oscHandler(address: str, *args: List[Any]) -> None:
    # A dispatcher function that handles the OSC messages we recevie on our server
    print(f'{args[0]}')

    # play the tick audio file from the root dir
    playsound(f'{path}/{audio}')


# Setup different "routes" where we can map different functions to different OSC adressess received.
dispatcher = dispatcher.Dispatcher()
dispatcher.map("/py*", oscHandler)


def startServer(ip, port):
    # receive messages from clients (with "/py as OSC address").
    # A simple OSC threading server to listen for OSC messages
    server = osc_server.ThreadingOSCUDPServer((ip, port), dispatcher)
    print(
        f'Starting server on {server.server_address[0]}, port {server.server_address[1]}.')

    # Start our server in a paralell thread
    thread = threading.Thread(target=server.serve_forever)
    thread.start()


# run our code.
startServer(serverIp, serverPort)
startClient(clientIp, clientPort)
