# sg_reset
# Autogenerated from man page /usr/lib/jvm/default/man/man8/sg_reset.8.gz
complete -c sg_reset -s b -l bus -d 'attempt a SCSI bus reset'
complete -c sg_reset -s d -l device -d 'attempt a SCSI device reset'
complete -c sg_reset -s z -l help -d 'print the usage message then exit'
complete -c sg_reset -s H -l host -d 'attempt a host reset'
complete -c sg_reset -s N -l no-esc -d 'without this option, if a device reset (--device) fails then it will escalate…'
complete -c sg_reset -l no-escalate -d 'The same as -N, --no-esc'
complete -c sg_reset -s t -l target -d 'attempt a SCSI target reset.  A SCSI target contains one or more LUs'
complete -c sg_reset -s v -l verbose -d 'increase the degree of verbosity (debug messages)'
complete -c sg_reset -s V -l version -d 'prints the version string then exits'

