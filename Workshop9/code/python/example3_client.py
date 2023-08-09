from pythonosc import osc_bundle_builder
from pythonosc import osc_message_builder
from pythonosc import udp_client
from pythonosc import dispatcher
from pythonosc import osc_server
from playsound import playsound
from datetime import datetime
from typing import List, Any
import threading
import calendar
import pathlib
import time

"""
A p2p client that sends "tick" messages to a remote client (PD) continously with timetags to control a metronome, and listens for tick pulses with timetags to control a local metronome.

Edit the timetagOffset variable to control how many seconds to offset the utc_timestamp (line 72) added to each outgoing OSC message.
"""

clientIp = '129.240.238.21'  # remote ip
clientPort = 8001

serverIp = '193.157.182.176'  # local ip
serverPort = 8000

# how many seconds to offset utc_timetag on line 72
timetagOffset = 0


# find the absolute path to the audio file tick.wav.
path = pathlib.Path(__file__).parent.resolve()
audio = "tick.wav"


def oscHandler(address: str, *args: List[Any]) -> None:
    # A dispatcher function that handles the OSC messages we recevie on our server
    print(f'{args[0]}')

    # play the tick audio file from the root dir
    playsound(f'{path}/{audio}')


# Setup different "routes" where we can map different functions to different OSC adressess received.
dispatcher = dispatcher.Dispatcher()
dispatcher.map("/py*", oscHandler)


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

    print("sending messages...")
    while True:
        # Convert current DateTime to UTC UNIX Timestamp (seconds since epoch).
        date = datetime.utcnow()
        utc_timestamp = calendar.timegm(date.utctimetuple())

        # open a OSC bundle and use the "custom" UTC timestamp instead of IMMEDIATLY
        bundle = osc_bundle_builder.OscBundleBuilder(
            utc_timestamp+timetagOffset)

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
        time.sleep(0.5)

    print("done sending...")


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
