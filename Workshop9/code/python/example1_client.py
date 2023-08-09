from pythonosc import osc_bundle_builder
from pythonosc import osc_message_builder
from pythonosc import udp_client
from pythonosc import dispatcher
from pythonosc import osc_server
from typing import List, Any
import threading
import time

"""
A p2p client that sends 10 messages to a remote client (PD) and listens, routes and prints OSC messages on the console. 

To be able to listen and send messages at the same time, the client and server run in seperate threads using the threading module.
"""

clientIp = '129.240.238.21'  # remote ip
clientPort = 8001

serverIp = '193.157.182.176'  # local ip
serverPort = 8000


def oscHandler(address: str, *args: List[Any]) -> None:
    # A dispatcher function that handles the OSC messages we recevie on our server
    print(f'{address} {args}')


# Setup different "routes" where we can map different functions to different OSC adressess received.
dispatcher = dispatcher.Dispatcher()
dispatcher.map("/py*", oscHandler)


def startClient(ip, port):
    # create a simple OSC client
    client = udp_client.UDPClient(ip, port)
    print(f'Starting client on {ip}, port {port}.')

    # Send messages from our client in a paralell thread
    thread = threading.Thread(target=sendMessages(client))
    thread.start()


def sendMessages(client):
    # send OSC frames (custom bundles) with a messages to a client
    message = "Hello from python client!"
    osc_address = "/pd"

    print("sending messages..")
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

        # One frame every half second
        time.sleep(.5)

    print("done sending.")


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
