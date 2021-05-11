# snort
# Autogenerated from man page /usr/lib/jvm/default/man/man8/snort.8.gz
complete -c snort -s A -d 'Alert using the specified  alert-mode'
complete -c snort -s b -d 'Log packets in a  tcpdump (1) formatted file'
complete -c snort -s B -d 'Convert all IP addresses in  home-net to addresses specified by  address-conv…'
complete -c snort -s c -d 'Use the rules located in file  config-file'
complete -c snort -s C -d 'Print the character data from the packet payload only (no hex)'
complete -c snort -s d -d 'Dump the application layer data when displaying packets in verbose or packet …'
complete -c snort -s D -d 'Run Snort in daemon mode'
complete -c snort -s e -d 'Display/log the link layer packet headers'
complete -c snort -s E -d '*WIN32 ONLY* Log alerts to the Windows Event Log'
complete -c snort -s f -d 'Activate PCAP line buffering'
complete -c snort -s F -d 'Read BPF filters from  bpf-file'
complete -c snort -s g -d 'Change the group/GID Snort runs under to  group after initialization'
complete -c snort -s G -d 'Use id as a base event ID when logging events'
complete -c snort -s h -d 'Set the "home network" to  home-net'
complete -c snort -s H -d 'Force hash tables to be deterministic instead of using a random number genera…'
complete -c snort -s i -d 'Sniff packets on  interface'
complete -c snort -s I -d 'Print out the receiving interface name in alerts'
complete -c snort -s k -d 'Tune the internal checksum verification functionality with  alert-mode'
complete -c snort -s K -d 'Select a packet logging mode.   The default is pcap.   logging-mode'
complete -c snort -s l -d 'Set the output logging directory to  log-dir'
complete -c snort -s L -d 'Set the filename of the binary log file to  binary-log-file'
complete -c snort -s m -d 'Set the file mode creation mask to  umask'
complete -c snort -s M -d 'Log console messages to syslog when not running daemon mode'
complete -c snort -s n -d 'Process  packet-count packets and exit'
complete -c snort -s N -d 'Turn off packet logging.   The program still generates alerts normally'
complete -c snort -s O -d 'Obfuscate the IP addresses when in ASCII packet dump mode'
complete -c snort -s p -d 'Turn off promiscuous mode sniffing'
complete -c snort -s P -d 'Set the packet snaplen to  snap-length.  By default, this is set to 1514'
complete -c snort -s q -d 'Quiet operation.  Don\'t display banner and initialization information'
complete -c snort -s Q -d 'Enable inline mode operation'
complete -c snort -s r -d 'Read the tcpdump-formatted file  tcpdump-file'
complete -c snort -s R -d 'Use name as a suffix to the snort pidfile'
complete -c snort -s s -d 'Send alert messages to syslog'
complete -c snort -s S -d 'Set variable name "variable" to value "value"'
complete -c snort -s t -d 'Changes Snort\'s root directory to  chroot after initialization'
complete -c snort -s T -d 'Snort will start up in self-test mode, checking all the supplied command line…'
complete -c snort -s u -d 'Change the user/UID Snort runs under to  user after initialization'
complete -c snort -s U -d 'Changes the timestamp in all logs to be in UTC'
complete -c snort -s v -d 'Be verbose.   Prints packets out to the console'
complete -c snort -s V -d 'Show the version number and exit'
complete -c snort -s w -d 'Show management frames if running on an 802. 11 (wireless) network'
complete -c snort -s W -d '*WIN32 ONLY* Enumerate the network interfaces available'
complete -c snort -s x -d 'Exit if Snort configuration problems occur such as duplicate gid/sid or flowb…'
complete -c snort -s X -d 'Dump the raw packet data starting at the link layer'
complete -c snort -s y -d 'Include the year in alert and log files'
complete -c snort -s Z -d 'Set the perfmonitor preprocessor path/filename to pathname'
complete -c snort -s '?' -d 'Show the program usage statement and exit'
complete -c snort -l logid -d 'Same as -G'
complete -c snort -l perfmon-file -d 'Same as -Z'
complete -c snort -l pid-path -d 'Specify the directory for the Snort PID file'
complete -c snort -l snaplen -d 'Same as -P'
complete -c snort -l help -d 'Same as -?'
complete -c snort -l version -d 'Same as -V'
complete -c snort -l dynamic-engine-lib -d 'Load a dynamic detection engine shared library specified by file'
complete -c snort -l dynamic-engine-lib-dir -d 'Load all dynamic detection engine shared libraries specified from directory'
complete -c snort -l dynamic-detection-lib -d 'Load a dynamic detection rules shared library specified by file'
complete -c snort -l dynamic-detection-lib-dir -d 'Load all dynamic detection rules shared libraries specified from directory'
complete -c snort -l dump-dynamic-rules -d 'Create stub rule files from all loaded dynamic detection rules libraries'
complete -c snort -l dynamic-preprocessor-lib -d 'Load a dynamic preprocessor shared library specified by file'
complete -c snort -l dynamic-preprocessor-lib-dir -d 'Load all dynamic preprocessor shared libraries specified from directory'
complete -c snort -l alert-before-pass -d 'Process alert, drop, sdrop, or reject before pass'
complete -c snort -l treat-drop-as-alert -d 'Converts drop, sdrop, and reject rules into alert rules during startup'
complete -c snort -l treat-drop-as-ignore -d 'Use drop, sdrop, and reject rules to ignore session traffic when not inline'
complete -c snort -l process-all-events -d 'Process all triggered events in group order, per Rule Ordering configuration'
complete -c snort -l enable-inline-test -d 'Enable Inline-Test Mode Operation'
complete -c snort -l create-pidfile -d 'Create PID file, even when not in Daemon mode'
complete -c snort -l nolock-pidfile -d 'Do not try to lock Snort PID file'
complete -c snort -l no-interface-pidfile -d 'Do not include the interface name in Snort PID file'
complete -c snort -l pcap-single -d 'Same as -r.   Added for completeness'
complete -c snort -l pcap-filter -d 'Shell style filter to apply when getting pcaps from file or directory'
complete -c snort -l pcap-list -d 'A space separated list of pcaps to read'
complete -c snort -l pcap-dir -d 'A directory to recurse to look for pcaps.   Sorted in ascii order'
complete -c snort -l pcap-file -d 'File that contains a list of pcaps to read'
complete -c snort -l pcap-no-filter -d 'Reset to use no filter when getting pcaps from file or directory'
complete -c snort -l pcap-reset -d 'If reading multiple pcaps, reset snort to post-configuration state before rea…'
complete -c snort -l pcap-show -d 'Print a line saying what pcap is currently being read'
complete -c snort -l exit-check -d 'Signal termination after <count> callbacks from DAQ_Acquire(), showing the ti…'
complete -c snort -l conf-error-out -d 'Same as -x'
complete -c snort -l require-rule-sid -d 'Require an SID for every rule to be correctly threshold all rules'
complete -c snort -l daq -d 'Select packet acquisition module (default is pcap)'
complete -c snort -l daq-mode -d 'Select the DAQ operating mode'
complete -c snort -l daq-var -d 'Specify extra DAQ configuration variable'
complete -c snort -l daq-dir -d 'Tell Snort where to find desired DAQ'
complete -c snort -l daq-list -d 'List packet acquisition modules available in dir'
complete -c snort -l cs-dir -d 'Tell Snort to use control socket and create the socket in dir'
