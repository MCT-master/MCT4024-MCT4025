from pythonosc import osc_bundle_builder
from pythonosc import osc_message_builder
from pythonosc import udp_client
from pythonosc import dispatcher
from pythonosc import osc_server
from typing import List, Any
import time

# A client that sends messages to the server and
# print messages that it receives.

ip = '127.0.0.1'


def sendMessage(mess):
    # Sends 10 OSC frames (bundles), with a single number as value, to a remote OSC client
    serverPort = 7001
    # send messages to Pd
    osc_address = "/pd"  # or "/py"

    # create a simple OSC client
    client = udp_client.SimpleUDPClient(ip, serverPort)

    # open a OSC bundle
    bundle = osc_bundle_builder.OscBundleBuilder(
        osc_bundle_builder.IMMEDIATELY)

    # create a message with an OSC address
    msg = osc_message_builder.OscMessageBuilder(address=osc_address)

    # add arguments to the message
    msg.add_arg(mess)

    # build the message and add to current bundle
    bundle.add_content(msg.build())

    # close OSC bundle
    bundle = bundle.build()

    # send the bundle to remote client
    client.send(bundle)


def receiveMessages(dispatcher):
    # receive messages from OSC clients on localPort (with "/python as address") and print them to the console.
    localPort = 8889

    def printMess(address: str, *args: List[Any]) -> None:
        print(f'oscClient1.py: {address} {args}')

    dispatcher = dispatcher.Dispatcher()
    dispatcher.map("/py*", printMess)

    # here we define a simple OSC threading server to listen for OSC messages in paralell
    server = osc_server.ThreadingOSCUDPServer(
        (ip, localPort), dispatcher)

    # we "execute" our server "forever" (until ctrl+c)
    print(f'oscClient1.py listening on port {localPort}')
    server.serve_forever()


sendMessage("sent from python client!")
receiveMessages(dispatcher)
