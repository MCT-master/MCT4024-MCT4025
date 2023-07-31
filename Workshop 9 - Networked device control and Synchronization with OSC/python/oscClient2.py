from pythonosc import osc_bundle_builder
from pythonosc import osc_message_builder
from pythonosc import udp_client
from datetime import datetime
import calendar

# https://www.geeksforgeeks.org/how-to-convert-datetime-to-unix-timestamp-in-python/
date = datetime.utcnow()
utc_timestamp = calendar.timegm(date.utctimetuple())
print(utc_timestamp)


bundle = osc_bundle_builder.OscBundleBuilder(utc_timestamp)
# https://github.com/attwad/python-osc/blob/master/pythonosc/osc_bundle_builder.py
"""Build a new bundle with the associated timestam
 Args:
   - timestamp: system time represented as a floating point number of
                seconds since the epoch in UTC or IMMEDIATELY.
 """

msg = osc_message_builder.OscMessageBuilder(address="/test")
msg.add_arg(4.0)
msg.add_arg(2)
msg.add_arg("value")

bundle.add_content(msg.build())
bundle = bundle.build()
# You can now send it via a client as described in other examples.

ip = '127.0.0.1'
port = 8888

client = udp_client.SimpleUDPClient(ip, port)
client.send(bundle)
print('Bytes sent from Python!')
