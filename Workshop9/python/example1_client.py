from pythonosc import osc_bundle_builder
from pythonosc import osc_message_builder
from pythonosc import udp_client
from pythonosc import dispatcher
from pythonosc import osc_server
from typing import List, Any
import threading
import time

# A simple 2-way client that sends some messages to PD and then starts a server that
# receives and prints messages on the console. To be able to listen and send messages
# at the same time, the client and server in seperate threads using the threading module.

clientIp = '129.240.238.21'  # remote ip
clientPort = 30002

serverIp = '129.240.79.193'  # local ip
serverPort = 30001


def pyOscHandler(address: str, *args: List[Any]) -> None:
    # A dispatcher function that handles the OSC messages we recevie on our server
    print(f'{address} {args}')


# Setup different "routes" where we can map different functions to different OSC adressess received.
dispatcher = dispatcher.Dispatcher()
dispatcher.map("/py*", pyOscHandler)


def startClient(ip, port):
    # create a simple OSC client
    client = udp_client.SimpleUDPClient(ip, port)
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
        msg.add_arg(f'{message} nr.{i+1}')

        # build the message and add to current bundle
        bundle.add_content(msg.build())

        # close OSC bundle
        bundle = bundle.build()

        # send the bundle to remote client
        client.send(bundle)

        # wait a litte bit
        time.sleep(1)

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
