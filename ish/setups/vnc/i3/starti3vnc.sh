#!/bin/ash
#
# Stupidly simple script to start vnc.  

CHECK=`ps -o args | grep "{startx} /bin/sh /usr/bin/startx" | wc -l`

# Only run once.  The grep causes CHECK to equal 1
if [ $CHECK -eq 1 ]; then # Nothing running, clear stale locks
   rm -rf /tmp/.X* 
else
   echo "$0 is already running.  We're done here."
   exit 1
fi

# See if location services are running already.  
# Having them running reduces the odds of iSH getting
# killed while in the background.
CHECK=`ps -o args | grep "cat /dev/location" | wc -l`

# Only run once.  The grep causes CHECK to equal 1
if [ $CHECK -eq 1 ]; then
   cat /dev/location > /dev/null &
fi

startx &
x11vnc -create -noshm -forever -rfbauth /root/.vnc/passwd & 
