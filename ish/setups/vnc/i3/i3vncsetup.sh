#!/bin/ash
echo 'Installing required packages...'
apk add x11vnc x11vnc-doc xvfb xterm xorg-server xf86-video-dummy i3wm i3status i3lock xdpyinfo xdpyinfo-doc i3wm-doc i3lock-doc i3status-doc ttf-dejavu
echo 'Creating need files...'
mkdir -p /etc/X11/xorg.conf.d
cat <<HERE > /etc/X11/xorg.conf.d/10-headless.conf
Section "Monitor"
        Identifier "dummy_monitor"
        HorizSync 28.0-80.0
        VertRefresh 48.0-75.0
        DisplaySize  250 174    # In millimeters, iPad gen 7 & 8
EndSection

Section "Device"
        Identifier "dummy_card"
        VideoRam 256000
        Driver "dummy"
EndSection

Section "Screen"
        Identifier "dummy_screen"
        Device "dummy_card"
        Monitor "dummy_monitor"
        SubSection "Display"
           depth 24
           Modes "1024x768"  # Works OK on ~10 inch iPad's
 #          Modes "1280x1024"  # Likely to work on larger iPad
        EndSubSection
EndSection
HERE
if [ ! -e /root/i3logs ]; then
   mkdir /root/i3logs
fi
cat <<THERE > /root/.xinitrc
xrdb -merge ~/.Xresources
xterm -geometry 80x50+494+51 &
xterm -geometry 80x20+494-0 &
exec i3 -V >> /root/i3logs/i3log-$(date +'%F-%k-%M-%S') 2>&1
THERE
cat <<EVERYWHERE > /root/.Xresources
Xft.dpi: 264
xterm*VT100.Translations: #override \
    Ctrl <Key> minus: smaller-vt-font() \n\
    Ctrl <Key> plus: larger-vt-font() \n\
    Ctrl <Key> 0: set-vt-font(d)
EVERYWHERE
echo ' '
echo 'Please set password for VNC SERVER'
echo 'Leave empty for no password'
echo 'You will not see anything when you are entering for security'
echo 'When asked the location of saving password, press y and enter'
echo ' '
x11vnc -storepasswd
echo ' '
echo 'Setup portion 1 success'
