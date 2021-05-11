# affconvert
# Autogenerated from man page /usr/lib/jvm/default/man/man1/affconvert.1.gz
complete -c affconvert -s q -d 'Quiet mode.  Don\'t ask questions, don\'t print status'
complete -c affconvert -s V -d 'Just print the version number and exit. RE . PP AFF output options: . RS'
complete -c affconvert -o 'a<ext>' -d 'Use \'ext\' for aff files (default is aff; afd for AFD files)'
complete -c affconvert -s L -d 'Use the LZMA compression algorithm (better but slower)'
complete -c affconvert -o Mn -d 'Set maximum size of output file.  Suffix with k, m or g.  Use with -o'
complete -c affconvert -o 'O<dir>' -d 'Use \'dir\' as the output directory.  Example: -Otest'
complete -c affconvert -o 'o<dir>.afd' -d 'Output to \'dir\'. afd (can only convert one at a time)'
complete -c affconvert -o 's<n>' -d 'Set the image_pagesize as \'n\' (default 16777216)'
complete -c affconvert -s x -d 'Don\'t compress the AFF file'
complete -c affconvert -o 'X<n>' -d 'Set compression to \'n\'; default is 7. RE . PP Raw output options: . RS'
complete -c affconvert -o 'e<ext>' -d 'Use \'ext\' for the raw files (default is raw).  Implies in -r'
complete -c affconvert -s r -d 'Generate raw output. RE . PP Dangerous input options: . RS'
complete -c affconvert -s y -d 'Always answer yes/no questions \'yes. \''
complete -c affconvert -s Z -d 'Do not automatically probe for gzip/bzip2 compression'
complete -c affconvert -s z -d 'ZAP (delete) the output file if it already exists.  EXAMPLES Convert file1'
