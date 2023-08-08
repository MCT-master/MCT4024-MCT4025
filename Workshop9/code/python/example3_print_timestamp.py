from datetime import datetime
import calendar
import time

while True:
    # Convert current DateTime to UTC UNIX Timestamp (seconds since epoch).
    # Print the time on the console, once every second.
    # https://www.geeksforgeeks.org/how-to-convert-datetime-to-unix-timestamp-in-python/

    date = datetime.utcnow()
    utc_timestamp = calendar.timegm(date.utctimetuple())
    print(utc_timestamp)

    time.sleep(1)
