# pg_verifybackup
# Autogenerated from man page /usr/lib/jvm/default/man/man1/pg_verifybackup.1.gz
complete -c pg_verifybackup -o 'e
.br
--exit-on-error' -d 'Exit as soon as a problem with the backup is detected'
complete -c pg_verifybackup -s i -d 'Ignore the specified file or directory, which should be expressed as a relati…'
complete -c pg_verifybackup -s m -d 'Use the manifest file at the specified path, rather than one located in the r…'
complete -c pg_verifybackup -o 'n
.br
--no-parse-wal' -d 'Don\\*(Aqt attempt to parse write-ahead log data that will be needed to recove…'
complete -c pg_verifybackup -o 'q
.br
--quiet' -d 'Don\\*(Aqt print anything when a backup is successfully verified'
complete -c pg_verifybackup -o 's
.br
--skip-checksums' -d 'Do not verify data file checksums'
complete -c pg_verifybackup -s w -d 'Try to parse WAL files stored in the specified directory, rather than in pg_w…'
complete -c pg_verifybackup -o 'V
.br
--version' -d 'Print the pg_verifybackup version and exit'
complete -c pg_verifybackup -o '?
.br
--help' -d 'Show help about pg_verifybackup command line arguments, and exit'
complete -c pg_verifybackup -l quiet -d 'flag will be used, so that pg_waldump will only report errors, without produc…'
complete -c pg_verifybackup -s e
complete -c pg_verifybackup -l exit-on-error
complete -c pg_verifybackup -l ignore
complete -c pg_verifybackup -l manifest-path
complete -c pg_verifybackup -s n
complete -c pg_verifybackup -l no-parse-wal
complete -c pg_verifybackup -s q
complete -c pg_verifybackup -s s
complete -c pg_verifybackup -l skip-checksums
complete -c pg_verifybackup -l wal-directory
complete -c pg_verifybackup -s V
complete -c pg_verifybackup -l version
complete -c pg_verifybackup -s '?'
complete -c pg_verifybackup -l help

