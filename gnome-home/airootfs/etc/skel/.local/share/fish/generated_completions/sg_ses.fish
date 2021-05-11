# sg_ses
# Autogenerated from man page /usr/lib/jvm/default/man/man8/sg_ses.8.gz
complete -c sg_ses -s a -l all -d 'shows (almost) all status dpages, following references and presenting the inf…'
complete -c sg_ses -s b -l byte1 -d 'some modifiable dpages may need byte 1 (i. e.  the second byte) set'
complete -c sg_ses -s C -l clear -d 'Used to clear an element field in the Enclosure Control or Threshold Out dpage'
complete -c sg_ses -s c -l control -d 'will send control information to the DEVICE via a SCSI SEND DIAGNOSTIC command'
complete -c sg_ses -s d -l data -d 'permits a string of comma separated (ASCII) hex bytes to be specified (limit …'
complete -c sg_ses -s D -l descriptor -d 'where DES is a descriptor name (string) as found in the Element Descriptor dp…'
complete -c sg_ses -s x -l dev-slot-num -l dsn -d 'where SN is a device slot number found in the Additional Element Status dpage'
complete -c sg_ses -s E -l eiioe -d 'A_F is either the string \'auto\' or \'force\''
complete -c sg_ses -s e -l enumerate -d 'enumerate all known diagnostic page (dpage) names and SES elements that this …'
complete -c sg_ses -s f -l filter -d 'cuts down on the amount of output from the Enclosure Status dpage and the Add…'
complete -c sg_ses -s G -l get -d 'Used to read a field in a status element'
complete -c sg_ses -s h -l help -d 'output the usage message then exit'
complete -c sg_ses -s H -l hex -d 'If the --get=STR option is given then output the value found (if any) in hexa…'
complete -c sg_ses -s I -l index -d 'where IIA is either an individual index (II) or an Element type abbreviation …'
complete -c sg_ses -s X -l inhex -d 'where FN is a filename'
complete -c sg_ses -s i -l inner-hex -d 'the outer levels of a status dpage are decoded and printed out but the innerm…'
complete -c sg_ses -s j -l join -d 'group elements from the Element Descriptor, Enclosure Status and Additional E…'
complete -c sg_ses -s l -l list -d 'This option is equivalent to --enumerate.  See that option'
complete -c sg_ses -s M -l mask -d 'When modifying elements, the default action is a read (status element), mask,…'
complete -c sg_ses -s m -l maxlen -d 'LEN is placed in the ALLOCATION LENGTH field of the SCSI RECEIVE DIAGNOSTIC R…'
complete -c sg_ses -s n -l nickname -d 'where SEN is the new Subenclosure Nickname'
complete -c sg_ses -s N -l nickid -d 'where SEID is the Subenclosure identifier that the new Nickname (SEN) will be…'
complete -c sg_ses -s p -l page -d 'where PG is a dpage abbreviation or code (a number)'
complete -c sg_ses -s q -l quiet -d 'this suppresses the number of warnings and messages output'
complete -c sg_ses -s r -l raw -d 'outputs the chosen status dpage in ASCII hex in a format suitable for a later…'
complete -c sg_ses -s R -l readonly -d 'open the DEVICE read-only (e. g.  in Unix with the O_RDONLY flag)'
complete -c sg_ses -s A -l sas-addr -d 'this is an indexing method for SAS end devices (e. g.  SAS disks)'
complete -c sg_ses -s S -l set -d 'Used to set an element field in the Enclosure Control or Threshold Out dpage'
complete -c sg_ses -s s -l status -d 'will fetch dpage from the DEVICE via a SCSI RECEIVE DIAGNOSTIC RESULTS comman…'
complete -c sg_ses -s v -l verbose -d 'increase the level of verbosity'
complete -c sg_ses -s V -l version -d 'print the version string and then exit'
complete -c sg_ses -o rr -d stdout
complete -c sg_ses -s w -l warn -d 'warn about certain irregularities with warnings sent to stderr'
complete -c sg_ses -s 1
complete -c sg_ses -o ee -d 'CLEAR, GET, SET The --clear=STR, --get=STR and --set=STR options can be used …'
