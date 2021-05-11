# git-am
# Autogenerated from man page /usr/lib/jvm/default/man/man1/git-am.1.gz
complete -c git-am -s s -l signoff -d 'Add a Signed-off-by trailer to the commit message, using the committer identi…'
complete -c git-am -s k -l keep -d 'Pass -k flag to git mailinfo (see git-mailinfo(1))'
complete -c git-am -l keep-non-patch -d 'Pass -b flag to git mailinfo (see git-mailinfo(1))'
complete -c git-am -l keep-cr -d 'With --keep-cr, call git mailsplit (see git-mailsplit(1)) with the same optio…'
complete -c git-am -s c -l scissors -d 'Remove everything in body before a scissors line (see git-mailinfo(1))'
complete -c git-am -l no-scissors -d 'Ignore scissors lines (see git-mailinfo(1))'
complete -c git-am -s m -l message-id -d 'Pass the -m flag to git mailinfo (see git-mailinfo(1)), so that the Message-I…'
complete -c git-am -l no-message-id -d 'Do not add the Message-ID header to the commit message'
complete -c git-am -s q -l quiet -d 'Be quiet.  Only print error messages'
complete -c git-am -s u -l utf8 -d 'Pass -u flag to git mailinfo (see git-mailinfo(1))'
complete -c git-am -l no-utf8 -d 'Pass -n flag to git mailinfo (see git-mailinfo(1))'
complete -c git-am -s 3 -l 3way -l no-3way -d 'When the patch does not apply cleanly, fall back on 3-way merge if the patch …'
complete -c git-am -l rerere-autoupdate -l no-rerere-autoupdate -d 'Allow the rerere mechanism to update the index with the result of auto-confli…'
complete -c git-am -l ignore-space-change -l ignore-whitespace -l whitespace -o 'C<n>' -o 'p<n>' -l directory -l exclude -l include -l reject -d 'These flags are passed to the git apply (see git-apply(1)) program that appli…'
complete -c git-am -l patch-format -d 'By default the command will try to detect the patch format automatically'
complete -c git-am -s i -l interactive -d 'Run interactively'
complete -c git-am -l committer-date-is-author-date -d 'By default the command records the date from the e-mail message as the commit…'
complete -c git-am -l ignore-date -d 'By default the command records the date from the e-mail message as the commit…'
complete -c git-am -l skip -d 'Skip the current patch'
complete -c git-am -s S -l gpg-sign -l no-gpg-sign -d 'GPG-sign commits'
complete -c git-am -l continue -s r -l resolved -d 'After a patch failure (e. g'
complete -c git-am -l resolvemsg -d 'When a patch failure occurs, <msg> will be printed to the screen before exiti…'
complete -c git-am -l abort -d 'Restore the original branch and abort the patching operation'
complete -c git-am -l quit -d 'Abort the patching operation but keep HEAD and the index untouched'
complete -c git-am -l show-current-patch -d 'Show the message at which git am has stopped due to conflicts'
complete -c git-am -s b -d 'flag to git mailinfo (see git-mailinfo(1))'
complete -c git-am -l no-keep-cr -d 'is useful to override am. keepcr'
complete -c git-am -s n -d 'flag to git mailinfo (see git-mailinfo(1))'

