#!/bin/ash
echo 'Running i3 x11 VNC setup script...'
wget -O - https://hujingwen1025.github.io/ish/setups/vnc/i3/i3vncsetup.sh | sh
wget https://hujingwen1025.github.io/ish/setups/vnc/i3/starti3vnc.sh
clear
echo '==i3 x11 VNC SETUP=='
echo 'Installation done!'
echo 'Run i3 x11 VNC by passing "sh starti3vnc.sh"'
echo ' '
echo 'Run this command immediately: '
echo 'x11vnc -storepasswd'
echo 'This command will set a password for your VNC, you will not be able to see the password when you enter it. Choose y when instructed!'
echo ' '
