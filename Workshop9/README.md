# Networked Device Control and Synchronization With OSC

Today, we will continue to explore synchronous online musical collaboration, but this time using Pure Data and Python. The students will learn how to use OSC timetags to synchronize and control audio in networked contexts.

The goal is to learn more about how to set up and configure advanced technologies for networked music systems and synchronous online musical collaboration.

# Dependencies

- In Python:

```
pip install playsound==1.2.2
pip install python-osc
```

- In Pure Data, install the [mrpeach](https://github.com/pd-externals/mrpeach) library from the "Find Externals" tab. **NB!** It's important that you have the 32-bit version of Pure Data vanilla.

- Install the [Wireshark](https://www.wireshark.org/download.html) desktop app.

# Workshop Examples

The examples show how we can start building complex OSC audio communication systems that use timetags to mitigate latency and achieve higher precision. The repo has 3 examples, each consisting of a PD and Python file. In class, we will go through each example and do some activities together.

## Example 1 - Simple 2-way Connection

**Files**

- _./python/example1_client.py_
- _./pd/example1_client.pd_

**What**
The first example demonstrates a simple 2-way OSC communication between Python and Pure Data where you can send simple strings between the two machines. Simple and easy.

Diagram

**How to run**:

1. Open the Python and Pure Data examples and fill inn correct IP and port settings.
2. Turn off any Firewall on your machine.
3. Run the python file _example1_client.py_ python file.

**Workshop Acitivity**

1. First, test and explore the connection on your local machine. Use "localhost" or "127.0.0.1" as your client and server IPs.
2. If nr.1 succeeds, connect and assign yourself an IP on the Lola network and test the connection in pairs over the network.

Avaliable ports will depend on the connection you are using. However, if both machines are on the Lola network, you should be able to use any port to connect. This is also true for localhost connections.

## Example 2 - Temporal Audio Control

...

## Example 3 - Custom Timetagging

python-osc delays OSC messages via timetag by itself.

If manipulate the dispatcher.py source code. lines 41, 59 and 200. add the timed_msg.time to arguments.

...
Activity - Design Forward Synchronization system

# Resources
