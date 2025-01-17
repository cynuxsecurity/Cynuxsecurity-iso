# pg_dumpall
# Autogenerated from man page /usr/lib/jvm/default/man/man1/pg_dumpall.1.gz
complete -c pg_dumpall -o 'a
.br
--data-only' -d 'Dump only the data, not the schema (data definitions)'
complete -c pg_dumpall -o 'c
.br
--clean' -d 'Include SQL commands to clean (drop) databases before recreating them'
complete -c pg_dumpall -s E -d 'Create the dump in the specified character set encoding'
complete -c pg_dumpall -s f -d 'Send output to the specified file'
complete -c pg_dumpall -o 'g
.br
--globals-only' -d 'Dump only global objects (roles and tablespaces), no databases'
complete -c pg_dumpall -o 'O
.br
--no-owner' -d 'Do not output commands to set ownership of objects to match the original data…'
complete -c pg_dumpall -o 'r
.br
--roles-only' -d 'Dump only roles, no databases or tablespaces'
complete -c pg_dumpall -o 's
.br
--schema-only' -d 'Dump only the object definitions (schema), not data'
complete -c pg_dumpall -s S -d 'Specify the superuser user name to use when disabling triggers'
complete -c pg_dumpall -o 't
.br
--tablespaces-only' -d 'Dump only tablespaces, no databases or roles'
complete -c pg_dumpall -o 'v
.br
--verbose' -d 'Specifies verbose mode'
complete -c pg_dumpall -o 'V
.br
--version' -d 'Print the pg_dumpall version and exit'
complete -c pg_dumpall -o 'x
.br
--no-privileges
.br
--no-acl' -d 'Prevent dumping of access privileges (grant/revoke commands)'
complete -c pg_dumpall -l binary-upgrade -d 'This option is for use by in-place upgrade utilities'
complete -c pg_dumpall -l 'column-inserts
.br
--attribute-inserts' -d 'Dump data as INSERT commands with explicit column names (INSERT INTO table (c…'
complete -c pg_dumpall -l disable-dollar-quoting -d 'This option disables the use of dollar quoting for function bodies, and force…'
complete -c pg_dumpall -l disable-triggers -d 'This option is relevant only when creating a data-only dump'
complete -c pg_dumpall -l exclude-database -d 'Do not dump databases whose name matches pattern'
complete -c pg_dumpall -l extra-float-digits -d 'Use the specified value of extra_float_digits when dumping floating-point dat…'
complete -c pg_dumpall -l if-exists -d 'Use conditional commands (i. e'
complete -c pg_dumpall -l inserts -d 'Dump data as INSERT commands (rather than COPY)'
complete -c pg_dumpall -l load-via-partition-root -d 'When dumping data for a table partition, make the COPY or INSERT statements t…'
complete -c pg_dumpall -l lock-wait-timeout -d 'Do not wait forever to acquire shared table locks at the beginning of the dump'
complete -c pg_dumpall -l no-comments -d 'Do not dump comments'
complete -c pg_dumpall -l no-publications -d 'Do not dump publications'
complete -c pg_dumpall -l no-role-passwords -d 'Do not dump passwords for roles'
complete -c pg_dumpall -l no-security-labels -d 'Do not dump security labels'
complete -c pg_dumpall -l no-subscriptions -d 'Do not dump subscriptions'
complete -c pg_dumpall -l no-sync -d 'By default, pg_dumpall will wait for all files to be written safely to disk'
complete -c pg_dumpall -l no-tablespaces -d 'Do not output commands to create tablespaces nor select tablespaces for objec…'
complete -c pg_dumpall -l no-unlogged-table-data -d 'Do not dump the contents of unlogged tables'
complete -c pg_dumpall -l on-conflict-do-nothing -d 'Add ON CONFLICT DO NOTHING to INSERT commands'
complete -c pg_dumpall -l quote-all-identifiers -d 'Force quoting of all identifiers'
complete -c pg_dumpall -l rows-per-insert -d 'Dump data as INSERT commands (rather than COPY)'
complete -c pg_dumpall -l use-set-session-authorization -d 'Output SQL-standard SET SESSION AUTHORIZATION commands instead of ALTER OWNER…'
complete -c pg_dumpall -o '?
.br
--help' -d 'Show help about pg_dumpall command line arguments, and exit'
complete -c pg_dumpall -s d -d 'Specifies parameters used to connect to the server, as a connection string; t…'
complete -c pg_dumpall -s h -d 'Specifies the host name of the machine on which the database server is running'
complete -c pg_dumpall -s l -d 'Specifies the name of the database to connect to for dumping global objects a…'
complete -c pg_dumpall -s p -d 'Specifies the TCP port or local Unix domain socket file extension on which th…'
complete -c pg_dumpall -s U -d 'User name to connect as'
complete -c pg_dumpall -o 'w
.br
--no-password' -d 'Never issue a password prompt'
complete -c pg_dumpall -o 'W
.br
--password' -d 'Force pg_dumpall to prompt for a password before connecting to a database'
complete -c pg_dumpall -l role -d 'Specifies a role name to be used to create the dump'
complete -c pg_dumpall -o f/--file -d 'option or shell operators to redirect it into a file'
complete -c pg_dumpall -s a
complete -c pg_dumpall -l data-only
complete -c pg_dumpall -s c
complete -c pg_dumpall -l clean
complete -c pg_dumpall -l encoding
complete -c pg_dumpall -l file
complete -c pg_dumpall -s g
complete -c pg_dumpall -l globals-only
complete -c pg_dumpall -s O
complete -c pg_dumpall -l no-owner
complete -c pg_dumpall -s r
complete -c pg_dumpall -l roles-only
complete -c pg_dumpall -s s
complete -c pg_dumpall -l schema-only
complete -c pg_dumpall -l superuser
complete -c pg_dumpall -s t
complete -c pg_dumpall -l tablespaces-only
complete -c pg_dumpall -s v
complete -c pg_dumpall -l verbose
complete -c pg_dumpall -s V
complete -c pg_dumpall -l version
complete -c pg_dumpall -s x
complete -c pg_dumpall -l no-privileges
complete -c pg_dumpall -l no-acl
complete -c pg_dumpall -l column-inserts
complete -c pg_dumpall -l attribute-inserts
complete -c pg_dumpall -s '?'
complete -c pg_dumpall -l help
complete -c pg_dumpall -l dbname
complete -c pg_dumpall -l host
complete -c pg_dumpall -l database
complete -c pg_dumpall -l port
complete -c pg_dumpall -l username
complete -c pg_dumpall -s w
complete -c pg_dumpall -l no-password
complete -c pg_dumpall -s W
complete -c pg_dumpall -l password

