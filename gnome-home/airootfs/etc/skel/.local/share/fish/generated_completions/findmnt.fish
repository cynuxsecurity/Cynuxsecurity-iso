# findmnt
# Autogenerated from man page /usr/lib/jvm/default/man/man8/findmnt.8.gz
complete -c findmnt -s A -l all -d 'Disable all built-in filters and print all filesystems'
complete -c findmnt -s a -l ascii -d 'Use ascii characters for tree formatting'
complete -c findmnt -s b -l bytes -d 'Print the SIZE, USED and AVAIL columns in bytes rather than in a human-readab…'
complete -c findmnt -s C -l nocanonicalize -d 'Do not canonicalize paths at all'
complete -c findmnt -s c -l canonicalize -d 'Canonicalize all printed paths'
complete -c findmnt -s D -l df -d 'Imitate the output of  df (1)'
complete -c findmnt -s d -l direction -d 'The search direction, either  forward or  backward '
complete -c findmnt -s e -l evaluate -d 'Convert all tags (LABEL, UUID, PARTUUID or PARTLABEL) to the corresponding de…'
complete -c findmnt -s F -l tab-file -d 'Search in an alternative file'
complete -c findmnt -s f -l first-only -d 'Print the first matching filesystem only'
complete -c findmnt -s h -l help -d 'Display help text and exit'
complete -c findmnt -s i -l invert -d 'Invert the sense of matching'
complete -c findmnt -s J -l json -d 'Use JSON output format'
complete -c findmnt -s k -l kernel -d 'Search in R /proc/self/mountinfo .  The output is in the tree-like format'
complete -c findmnt -s l -l list -d 'Use the list output format'
complete -c findmnt -s M -l mountpoint -d 'Explicitly define the mountpoint file or directory.   See also --target'
complete -c findmnt -s m -l mtab -d 'Search in R /etc/mtab '
complete -c findmnt -s N -l task -d 'Use alternative namespace /proc/<tid>/mountinfo rather than the default /proc…'
complete -c findmnt -s n -l noheadings -d 'Do not print a header line'
complete -c findmnt -s O -l options -d 'Limit the set of printed filesystems'
complete -c findmnt -s o -l output -d 'Define output columns'
complete -c findmnt -l output-all -d 'Output almost all available columns'
complete -c findmnt -s P -l pairs -d 'Use key="value" output format'
complete -c findmnt -s p -l poll -d 'Monitor changes in the /proc/self/mountinfo file'
complete -c findmnt -l pseudo -d 'Print only pseudo filesystems'
complete -c findmnt -s R -l submounts -d 'Print recursively all submounts for the selected filesystems'
complete -c findmnt -s r -l raw -d 'Use raw output format'
complete -c findmnt -l real -d 'Print only real filesystems'
complete -c findmnt -s S -l source -d 'Explicitly define the mount source'
complete -c findmnt -s s -l fstab -d 'Search in R /etc/fstab .  The output is in the list format (see --list)'
complete -c findmnt -s T -l target -d 'Define the mount target'
complete -c findmnt -s t -l types -d 'Limit the set of printed filesystems'
complete -c findmnt -l tree -d 'Enable tree-like output if possible'
complete -c findmnt -s U -l uniq -d 'Ignore filesystems with duplicate mount targets, thus effectively skipping ov…'
complete -c findmnt -s u -l notruncate -d 'Do not truncate text in columns'
complete -c findmnt -s v -l nofsroot -d 'Do not print a [/dir] in the SOURCE column for bind mounts or btrfs subvolumes'
complete -c findmnt -s w -l timeout -d 'Specify an upper limit on the time for which --poll will block, in millisecon…'
complete -c findmnt -s x -l verify -d 'Check mount table content'
complete -c findmnt -l verbose

