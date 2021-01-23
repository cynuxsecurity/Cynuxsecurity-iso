#!/usr/bin/env bash
#
# SPDX-License-Identifier: GPL-3.0-or-later

set -e -u

# Warning: customize_airootfs.sh is deprecated! Support for it will be removed in a future archiso version.

sed -i 's/#\(en_US\.UTF-8\)/\1/' /etc/locale.gen
locale-gen

sed -i "s/#Server/Server/g" /etc/pacman.d/mirrorlist

systemctl enable NetworkManager
systemctl set-default graphical.target
systemctl enable gdm
systemctl enable vmtoolsd.service
systemctl enable vboxservice.service
systemctl enable bluetooth
mv /root/lsb-release /etc/lsb-release

pacman-key --init
pacman-key --populate archlinux
