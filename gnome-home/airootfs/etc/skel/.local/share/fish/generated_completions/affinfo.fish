# affinfo
# Autogenerated from man page /usr/lib/jvm/default/man/man1/affinfo.1.gz
complete -c affinfo -s a -d 'Print ALL segments (normally data segments are suppressed)'
complete -c affinfo -s b -d 'Print how many bad blocks in each segment (implies -a)'
complete -c affinfo -s i -d 'Identify the files; don\'t do info on them'
complete -c affinfo -s w -d 'Wide output; print more than 1 line if necessary'
complete -c affinfo -s s -d 'Just print information about \'segment\' (may be repeated)'
complete -c affinfo -s m -d 'Validate MD5 hash of entire image'
complete -c affinfo -s S -d 'Validate SHA1 hash of entire image'
complete -c affinfo -s v -d 'Validate the hash of each page (if present)'
complete -c affinfo -s y -d 'Don\'t print segments of lengths 16 and 20 as hex'
complete -c affinfo -o 'p<passphrase>' -d 'Specify <passphrase> to decrypt a file'
complete -c affinfo -s l -d 'Just print the segment names and exit'
complete -c affinfo -s V -d 'Just print the version number and exit. RE . PP Preview Options: . RS'
complete -c affinfo -s X -d 'No data preview; just print the segment names'
complete -c affinfo -s x -d 'Print binary values in hex (default is ASCII). RE . PP Misc: . RS'
complete -c affinfo -s d -d Debug
complete -c affinfo -s A -d 'If infile is a device, print the number of sectors and sector size to stdout …'
