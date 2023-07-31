from pythonosc import osc_bundle_builder
from pythonosc import osc_message_builder
from pythonosc import udp_client
import time

ip = '127.0.0.1'
sendPort = 7000  # 7000 is python server, 8000 is PD client
send_address = "/pd/1"

# create a osc client for sending messages
client = udp_client.SimpleUDPClient(ip, sendPort)

# send 10 OSC bundles with rising number to sendPort
for i in range(10):
    # open a OSC bundle
    bundle = osc_bundle_builder.OscBundleBuilder(
        osc_bundle_builder.IMMEDIATELY)

    # create a message with an address and some arguments
    msg = osc_message_builder.OscMessageBuilder(address=send_address)
    msg.add_arg(i+1)
    msg.add_arg(i+2)
    msg.add_arg(i+3)

    # build the message and add to current bundle
    bundle.add_content(msg.build())

    # close OSC bundle
    bundle = bundle.build()

    # send the bundle
    client.send(bundle)

    time.sleep(1)
