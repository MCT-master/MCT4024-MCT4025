from pythonosc import udp_client
from pythonosc import dispatcher
from pythonosc import osc_server
from typing import List, Any

# a simple local OSC server that forwards received messages to a remote client.

# the local IP and port are for our server, while the remote IP and port are configured
# on the receiving end (in the PD patch)
localIP = '127.0.0.1'
localPort = 7000
remoteIP = '127.0.0.1'
remotePort = 8000

# create a OSC client where we will send messages to
client = udp_client.SimpleUDPClient(remoteIP, remotePort)


def sendToClient(address: str, *args: List[Any]) -> None:
    # Takes an OSC address and values and sends them to the remoteIP and port specified.
    print(f'sending {args} to {address}')
    client.send_message(address, args)


# the dispatch function catches OSC messages with a specific address and pass them to a specific function.
dispatcher = dispatcher.Dispatcher()
dispatcher.map("/pd*", sendToClient)

# here we define a simple OSC threading server to listen for OSC messages in parallell
server = osc_server.ThreadingOSCUDPServer((localIP, localPort), dispatcher)
print(f'serving on {server.server_address}.')

# we "execute" our server "forever" (until ctrl+c)
server.serve_forever()
