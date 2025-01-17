# ike-scan
# Autogenerated from man page /usr/lib/jvm/default/man/man1/ike-scan.1.gz
complete -c ike-scan -l help -s h -d 'Display this usage message and exit'
complete -c ike-scan -l file -s f -d 'Read hostnames or addresses from the specified file instead of from the comma…'
complete -c ike-scan -l sport -s s -d 'Set UDP source port to <p>, default=500, 0=random'
complete -c ike-scan -l dport -s d -d 'Set UDP destination port to <p>, default=500'
complete -c ike-scan -l retry -s r -d 'Set total number of attempts per host to <n>, default=3'
complete -c ike-scan -l timeout -s t -d 'Set initial per host timeout to <n> ms, default=500'
complete -c ike-scan -l bandwidth -s B -d 'Set desired outbound bandwidth to <n>, default=56000 The value is in bits per…'
complete -c ike-scan -l interval -s i -d 'Set minimum packet interval to <n> ms'
complete -c ike-scan -l backoff -s b -d 'Set timeout backoff factor to <b>, default=1. 50'
complete -c ike-scan -l verbose -s v -d 'Display verbose progress messages'
complete -c ike-scan -l quiet -s q -d 'Don\'t decode the returned packet'
complete -c ike-scan -l multiline -s M -d 'Split the payload decode across multiple lines'
complete -c ike-scan -l lifetime -s l -d 'Set IKE lifetime to <s> seconds, default=28800'
complete -c ike-scan -l lifesize -s z -d 'Set IKE lifesize to <s> Kilobytes, default=0'
complete -c ike-scan -l auth -s m -d 'Set auth.  method to <n>, default=1 (PSK).  RFC defined values are 1 to 5'
complete -c ike-scan -l version -s V -d 'Display program version and exit'
complete -c ike-scan -l vendor -s e -d 'Set vendor id string to hex value <v>'
complete -c ike-scan -l trans -s a -d 'Use custom transform <t> instead of default set'
complete -c ike-scan -l showbackoff -s o -d 'Display the backoff fingerprint table'
complete -c ike-scan -l fuzz -s u -d 'Set pattern matching fuzz to <n> ms, default=500'
complete -c ike-scan -l patterns -s p -d 'Use IKE backoff patterns file <f>, default=/usr/local/share/ike-scan/ike-back…'
complete -c ike-scan -l vidpatterns -s I -d 'Use Vendor ID patterns file <f>, default=/usr/local/share/ike-scan/ike-vendor…'
complete -c ike-scan -l aggressive -s A -d 'Use IKE Aggressive Mode (The default is Main Mode) If you specify --aggressiv…'
complete -c ike-scan -l id -s n -d 'Use <id> as the identification value'
complete -c ike-scan -l idtype -s y -d 'Use identification type <n>.   Default 3 (ID_USER_FQDN)'
complete -c ike-scan -l dhgroup -s g -d 'Use Diffie Hellman Group <n>.   Default 2'
complete -c ike-scan -l gssid -s G -d 'Use GSS ID <n> where <n> is a hex string'
complete -c ike-scan -l random -s R -d 'Randomise the host list'
complete -c ike-scan -l tcp -s T -d 'Use TCP transport instead of UDP'
complete -c ike-scan -l tcptimeout -s O -d 'Set TCP connect timeout to <n> seconds (default=10)'
complete -c ike-scan -l pskcrack -s P -d 'Crack aggressive mode pre-shared keys'
complete -c ike-scan -l nodns -s N -d 'Do not use DNS to resolve names'
complete -c ike-scan -l noncelen -s c -d 'Set the nonce length to <n> bytes'
complete -c ike-scan -l headerlen -s L -d 'Set the length in the ISAKMP header to <n> bytes'
complete -c ike-scan -l mbz -s Z -d 'Use the value <n> for reserved (MBZ) fields, default=0'
complete -c ike-scan -l headerver -s E -d 'Specify the ISAKMP header version'
complete -c ike-scan -l certreq -s C -d 'Add the CertificateRequest payload <c>'
complete -c ike-scan -l doi -s D -d 'Set the SA DOI to <d>, default 1 (IPsec)'
complete -c ike-scan -l situation -s S -d 'Set the SA Situation to <d>, default 1'
complete -c ike-scan -l protocol -s j -d 'Set the Proposal protocol ID to <p>, default 1'
complete -c ike-scan -l transid -s k -d 'Set the Transform ID to <t>, default 1'
complete -c ike-scan -l spisize -d 'Set the proposal SPI size to <n>'
complete -c ike-scan -l hdrflags -d 'Set the ISAKMP header flags to <n>'
complete -c ike-scan -l hdrmsgid -d 'Set the ISAKMP header message ID to <n>'
complete -c ike-scan -l cookie -d 'Set the ISAKMP initiator cookie to <n> The cookie value should be specified i…'
complete -c ike-scan -l exchange -d 'Set the exchange type to <n> This option allows you to change the exchange ty…'
complete -c ike-scan -l nextpayload -d 'Set the next payload in the ISAKMP header to <n> Normally, the next payload i…'
complete -c ike-scan -l randomseed -d 'Use <n> to seed the pseudo random number generator'
complete -c ike-scan -l timestamp -d 'Display timestamps for received packets'
complete -c ike-scan -l sourceip -d 'Set source IP address for outgoing packets to <s>'
complete -c ike-scan -l shownum -d 'Display the host number for received packets'
complete -c ike-scan -l nat-t -d 'Use RFC 3947 NAT-Traversal encapsulation'
complete -c ike-scan -l rcookie -d 'Set the ISAKMP responder cookie to <n>'
complete -c ike-scan -l ikev2 -s 2 -d 'Use IKE version 2 This causes the outgoing packets to use IKEv2 format as def…'

