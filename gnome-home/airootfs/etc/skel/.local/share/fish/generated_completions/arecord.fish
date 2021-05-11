# arecord
# Autogenerated from man page /usr/lib/jvm/default/man/man1/arecord.1.gz
complete -c arecord -s h -l help -d 'Help: show syntax'
complete -c arecord -l version -d 'Print current version'
complete -c arecord -s l -l list-devices -d 'List all soundcards and digital audio devices'
complete -c arecord -s L -l list-pcms -d 'List all PCMs defined'
complete -c arecord -s D -l device -d 'Select PCM by name'
complete -c arecord -s q -l quiet -d 'Quiet mode.  Suppress messages (not sound :))'
complete -c arecord -s t -l file-type -d 'File type (voc, wav, raw or au)'
complete -c arecord -s c -l channels -d 'The number of channels.  The default is one channel'
complete -c arecord -s f -l format -d 'Sample format '
complete -c arecord -s r -l rate -d 'Sampling rate in Hertz.  The default rate is 8000 Hertz'
complete -c arecord -s d -l duration -d 'Interrupt after # seconds.  A value of zero means infinity'
complete -c arecord -s s -l samples -d 'Interrupt after transmission of # PCM frames.  A value of zero means infinity'
complete -c arecord -s M -l mmap -d 'Use memory-mapped (mmap) I/O mode for the audio stream'
complete -c arecord -s N -l nonblock -d 'Open the audio device in non-blocking mode'
complete -c arecord -s F -l period-time -d 'Distance between interrupts is # microseconds'
complete -c arecord -s B -l buffer-time -d 'Buffer duration is # microseconds If no buffer time and no buffer size is giv…'
complete -c arecord -l period-size -d 'Distance between interrupts is # frames If no period size and no period time …'
complete -c arecord -l buffer-size -d 'Buffer duration is # frames If no buffer time and no buffer size is given the…'
complete -c arecord -s A -l avail-min -d 'Min available space for wakeup is # microseconds'
complete -c arecord -s R -l start-delay -d 'Delay for automatic PCM start is # microseconds  (relative to buffer size if …'
complete -c arecord -s T -l stop-delay -d 'Delay for automatic PCM stop is # microseconds from xrun'
complete -c arecord -s v -l verbose -d 'Show PCM structure and setup.  This option is accumulative'
complete -c arecord -s V -l vumeter -d 'Specifies the VU-meter type, either stereo or mono'
complete -c arecord -s I -l separate-channels -d 'One file for each channel'
complete -c arecord -s P -d 'Playback.   This is the default if the program is invoked by typing aplay'
complete -c arecord -s C -d 'Record.   This is the default if the program is invoked by typing arecord'
complete -c arecord -s i -l interactive -d 'Allow interactive operation via stdin'
complete -c arecord -s m -l chmap -d 'Give the channel map to override or follow'
complete -c arecord -l disable-resample -d 'Disable automatic rate resample'
complete -c arecord -l disable-channels -d 'Disable automatic channel conversions'
complete -c arecord -l disable-format -d 'Disable automatic format conversions'
complete -c arecord -l disable-softvol -d 'Disable software volume control (softvol)'
complete -c arecord -l test-position -d 'Test ring buffer position'
complete -c arecord -l test-coef -d 'Test coefficient for ring buffer position; default is 8'
complete -c arecord -l test-nowait -d 'Do not wait for the ring buffer \\(hy eats the whole CPU'
complete -c arecord -l max-file-time -d 'While recording, when the output file has been accumulating sound for this lo…'
complete -c arecord -l process-id-file -d 'aplay writes its process ID here, so other programs can send signals to it'
complete -c arecord -l use-strftime -d 'When recording, interpret %-codes in the file name parameter using the strfti…'
complete -c arecord -l dump-hw-params -d 'Dump hw_params of the device preconfigured status to stderr'
complete -c arecord -o c2 -o r44100
complete -c arecord -o r48000
complete -c arecord -l fatal-errors -d 'Disables recovery attempts when errors (e. g'

