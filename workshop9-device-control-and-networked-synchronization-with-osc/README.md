# Networked Device Control and Synchronization With OSC

In this workshop, you will learn about the OSC protocol and how symbolic music data can be used to mitigate latency and control musical systems from afar. Specifically, the session concentrates on how we can use OSC timestamps to synchronize audio playback in two remote places at once. Also, since we ourselves cannot physically be in two places at once, we will explore OSC transmission between two different programming environments on our local machine, namely between Pure Data (PD) and Python. The goal is to learn more about how to set up and configure advanced technologies for networked music systems and synchronous online musical collaboration.

In class, we will explore 3 example systems together, with increasing complexity, that demonstrate how we can start to build complex networked audio systems using OSC. With each example, several acitivities follow.

**NB!** This workshop requires an intermediate level of familiarity with OSC for Python and Pure Data.

## Preperation

Schmeder, & Freed, A. (2008). Implementation and applications of open sound control timestamps. ICMC. http://cnmat.berkeley.edu/publications/implementation-and-applications-open-sound-control-timestamps

Andrew Schmeder. (2010). Best Practices for Open Sound Control. Center for New Music and Audio Technologies (CNMAT), UC Berkeley. https://opensoundcontrol.stanford.edu/files/osc-best-practices-final.pdf

## Dependencies

- [ Python 3x](https://www.python.org/downloads/)

  ```
  pip install playsound==1.2.2
  pip install python-osc
  ```

- [Pure Data Vanilla 0.54](https://puredata.info/downloads/pure-data)
  - I recommend that you install the 32-bit version of Pure Data vanilla (if possible) for mrpeach to work best.
  - Download the [mrpeach](https://github.com/pd-externals/mrpeach) library

## Resources

- [Python Speech recognition with OSC network communication (dispatchers, threading server, clients, etc.)](https://www.youtube.com/watch?v=T3jd-894Ar4)
- [OSC Official Homepage](https://opensoundcontrol.stanford.edu/index.html)
- [AbletonOSC](https://github.com/ideoforms/AbletonOSC)
