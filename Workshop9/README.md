# Networked Device Control and Synchronization With OSC

Today, we will continue to explore synchronous online musical collaboration, but this time using Pure Data and Python. The students will learn how to use OSC timetags to synchronize and control audio in networked contexts.

The goal is to learn more about how to set up and configure advanced technologies for networked music systems and synchronous online musical collaboration.

# Dependencies

- In Python:

```
pip install playsound==1.2.2
pip install python-osc
```

- In Pure Data, install the [mrpeach](https://github.com/pd-externals/mrpeach) library from the "Find Externals" tab.

**NB!** It's important that we have the 32-bit version of PD vanilla, not the 64-bit version.

# Workshop Examples

The examples show how we can start building complex OSC audio communication systems that use timetags to mitigate latency and achieve higher precision. The repo has 3 examples, each consisting of a PD and Python file. In class, we will go through each example and do some activities together.

### Example 1 - Connection

What does it show.
How to run? files included.
diagram
Activity: ---

### Example 2 - Temporal Audio Control

...

### Example 3 - Custom Timetagging

python-osc delays OSC messages via timetag by itself.

If manipulate the dispatcher.py source code. lines 41, 59 and 200. add the timed_msg.time to arguments.

...
Activity - Design Forward Synchronization system

# Resources
