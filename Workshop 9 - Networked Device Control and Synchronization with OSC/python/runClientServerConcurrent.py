import threading
import time
import os

# run the python OSC server and a client in parallel, using threads.
# enter the filenames of server and client you wish to run:
serverFile = "oscServer.py"
clientFile = "oscClient2.py"
shellComand = f'python ./python/'

if __name__ == "__main__":

    # use os.system to execute the python file.
    def runScript(filename):
        os.system(shellComand + filename)

    # create two threads
    server_t = threading.Thread(target=runScript, args=[serverFile])
    client_t = threading.Thread(target=runScript, args=[clientFile])

    # start the threads with 1 sec inbetween
    server_t.start()
    time.sleep(1)
    client_t.start()
