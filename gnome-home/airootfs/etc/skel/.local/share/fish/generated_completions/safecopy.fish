# safecopy
# Autogenerated from man page /usr/lib/jvm/default/man/man1/safecopy.1.gz
complete -c safecopy -l stage1 -d 'Preset to rescue most of the data fast, using no retries and avoiding bad are…'
complete -c safecopy -l stage2 -d 'Preset to rescue more data, using no retries but searching for exact ends of …'
complete -c safecopy -l stage3 -d 'Preset to rescue everything that can be rescued using maximum retries, head r…'
complete -c safecopy -s f -s r -s R -s Z -s L -s I -s o -d 'PP All stage presets can be overridden by individual options'
complete -c safecopy -s b -d 'Blocksize for default read operations'
complete -c safecopy -l sync -d 'Use synchronized read calls (disable driver buffering)'
complete -c safecopy -l forceopen -d 'Keep trying to reopen the source after a read errer useful for USB drives tha…'
complete -c safecopy -s s -d 'Start position where to start reading'
complete -c safecopy -s l -d 'Maximum length of data to be read'
complete -c safecopy -s i -d 'Blocksize to interpret the badblockfile given with -I'
complete -c safecopy -s c -d 'Continue copying at this position'
complete -c safecopy -s X -d 'Exclusion mode'
complete -c safecopy -s x -d 'Blocksize to interpret the badblockfile given with -X'
complete -c safecopy -s S -d 'Use external script for seeking in input file'
complete -c safecopy -s M -d 'Mark unrecovered data with this string instead of skipping it'
complete -c safecopy -l debug -d 'Enable debug output'
complete -c safecopy -s T -d 'Write sector read timing information into this file for later analysis'
complete -c safecopy -s h -l help -d 'Show the program help text'
complete -c safecopy -o CDRW
complete -c safecopy -o CD
complete -c safecopy -o PC
complete -c safecopy -s A
complete -c safecopy -o Cleaning
complete -c safecopy -o Unless
complete -c safecopy -o Using -d 'rendering the disk unreadable'

