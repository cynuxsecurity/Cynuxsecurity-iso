# iodine
# Autogenerated from man page /usr/lib/jvm/default/man/man8/iodine.8.gz
complete -c iodine -s v -d 'Print version info and exit'
complete -c iodine -s h -d 'Print usage info and exit'
complete -c iodine -s f -d 'Keep running in foreground'
complete -c iodine -s u -d 'Drop privileges and run as user \'user\' after setting up tunnel'
complete -c iodine -s t -d 'Chroot to \'chrootdir\' after setting up tunnel'
complete -c iodine -s d -d 'Use the TUN device \'device\' instead of the normal one, which is dnsX on Linux…'
complete -c iodine -s P -d 'Use \'password\' to authenticate.  If not used,   stdin will be used as input'
complete -c iodine -s z -d 'Apply SELinux \'context\' after initialization'
complete -c iodine -s F -d 'Create \'pidfile\' and write process id in it. SS Client Options:'
complete -c iodine -s 4 -d 'Force IPv4 DNS queries'
complete -c iodine -s 6 -d 'Force IPv6 DNS queries'
complete -c iodine -s r -d 'Skip raw UDP mode'
complete -c iodine -s R -d 'Use OpenBSD routing domain \'rdomain\' for the DNS connection'
complete -c iodine -s m -d 'Force maximum downstream fragment size'
complete -c iodine -s M -d 'Maximum length of upstream hostnames, default 255.  Usable range ca'
complete -c iodine -s T -d 'DNS request type override'
complete -c iodine -s O -d 'Force downstream encoding type for all query type responses except NULL'
complete -c iodine -s L -d 'Lazy-mode switch'
complete -c iodine -s I -d 'Maximum interval between requests (pings) so that intermediate DNS servers wi…'
complete -c iodine -s c -d 'Disable checking the client IP address on all incoming requests'
complete -c iodine -s s -d 'Don\'t try to configure IP address or MTU'
complete -c iodine -s D -d 'Increase debug level.  Level 1 prints info about each RX/TX packet'
complete -c iodine -s l -d 'Make the server listen only on \'listen_ip\' for incoming requests'
complete -c iodine -s p -d 'Make the server listen on \'port\' instead of 53 for traffic'
complete -c iodine -s n -d 'The IP address to return in NS responses'
complete -c iodine -s b -d 'If this port is specified, all incoming requests not inside the tunnel domain…'
complete -c iodine -s i -d 'Make the server stop itself after max_idle_time seconds if no traffic have be…'
complete -c iodine -o L1 -d 'A very small minority of DNS relays appears to be unable to handle the lazy m…'
