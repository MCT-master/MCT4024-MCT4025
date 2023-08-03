from pythonosc import udp_client
from pythonosc import dispatcher
from pythonosc import osc_server
from typing import List, Any

# a simple OSC threading server that listens to OSC
# messages on serverIp and port and simply forwards
# incoming messages to remote clients.

ip = '127.0.0.1'
serverPort = 7001
pdPort = 8888
pyPort = 8889

# create a OSC clients to pd and python
pdClient = udp_client.SimpleUDPClient(ip, pdPort)
pyClient = udp_client.SimpleUDPClient(ip, pyPort)


def forwardToPd(address: str, *args: List[Any]) -> None:
    # print(f'sending {args} to /pd')
    pdClient.send_message(address, args)


def forwardToPy(address: str, *args: List[Any]) -> None:
    # print(f'sending {args} to python')
    pyClient.send_message(address, args)


# setup a dispatch to catch OSC messages with a specific address and pass them to a specific functions.
dispatcher = dispatcher.Dispatcher()
dispatcher.map("/pd*", forwardToPd)
dispatcher.map("/py*", forwardToPy)

# here we define a simple OSC threading server to listen for OSC messages in paralell
server = osc_server.ThreadingOSCUDPServer((ip, serverPort), dispatcher)
print(f'oscServer.py serving on {server.server_address}.')

# we "execute" our server "forever" (until ctrl+c)
server.serve_forever()
