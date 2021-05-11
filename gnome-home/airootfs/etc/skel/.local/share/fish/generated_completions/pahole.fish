# pahole
# Autogenerated from man page /usr/lib/jvm/default/man/man1/pahole.1.gz
complete -c pahole -s C -l class_name -d 'Show just these classes'
complete -c pahole -s c -l cacheline_size -d 'Set cacheline size to SIZE bytes'
complete -c pahole -l count -d 'Pretty print the first COUNT records from input'
complete -c pahole -l skip -d 'Skip COUNT input records'
complete -c pahole -s E -l expand_types -d 'Expand class members'
complete -c pahole -s F -l format_path -d 'Allows specifying a list of debugging formats to try, in order'
complete -c pahole -l hex -d 'Print offsets and sizes in hexadecimal'
complete -c pahole -s r -l rel_offset -d 'Show relative offsets of members in inner structs'
complete -c pahole -s p -l expand_pointers -d 'Expand class pointer members'
complete -c pahole -s R -l reorganize -d 'Reorganize struct, demoting and combining bitfields, moving members to remove…'
complete -c pahole -s S -l show_reorg_steps -d 'Show the struct layout at each reorganization step'
complete -c pahole -s i -l contains -d 'Show classes that contains CLASS_NAME'
complete -c pahole -s a -l anon_include -d 'Include anonymous classes'
complete -c pahole -s A -l nested_anon_include -d 'Include nested (inside other structs) anonymous classes'
complete -c pahole -s B -l bit_holes -d 'Show only structs at least NR_HOLES bit holes'
complete -c pahole -s d -l recursive -d 'Recursive mode, affects several other flags'
complete -c pahole -s D -l decl_exclude -d 'exclude classes declared in files with PREFIX'
complete -c pahole -s f -l find_pointers_to -d 'Find pointers to CLASS_NAME'
complete -c pahole -s H -l holes -d 'Show only structs with at least NR_HOLES holes'
complete -c pahole -s I -l show_decl_info -d 'Show the file and line number where the tags were defined, if available in th…'
complete -c pahole -l skip_encoding_btf_vars -d 'Do not encode VARs in BTF'
complete -c pahole -s J -l btf_encode -d 'Encode BTF information from DWARF, used in the Linux kernel build process whe…'
complete -c pahole -l btf_encode_force -d 'Ignore those symbols found invalid when encoding BTF'
complete -c pahole -l btf_base -d 'Path to the base BTF file, for instance: vmlinux when encoding kernel module …'
complete -c pahole -l btf_gen_floats -d 'Allow producing BTF_KIND_FLOAT entries in systems where the vmlinux DWARF inf…'
complete -c pahole -l btf_gen_all -d 'Allow using all the BTF features supported by pahole'
complete -c pahole -s l -l show_first_biggest_size_base_type_member -d 'Show first biggest size base_type member'
complete -c pahole -s m -l nr_methods -d 'Show number of methods'
complete -c pahole -s M -l show_only_data_members -d 'Show only the members that use space in the class layout'
complete -c pahole -s n -l nr_members -d 'Show number of members'
complete -c pahole -s N -l class_name_len -d 'Show size of classes'
complete -c pahole -s O -l dwarf_offset -d 'Show tag with DWARF OFFSET'
complete -c pahole -s P -l packable -d 'Show only structs that has holes that can be packed if members are reorganize…'
complete -c pahole -s q -l quiet -d 'Be quieter'
complete -c pahole -s s -l sizes -d 'Show size of classes'
complete -c pahole -s t -l separator -d 'Use SEP as the field separator'
complete -c pahole -s T -l nr_definitions -d 'Show how many times struct was defined'
complete -c pahole -s u -l defined_in -d 'Show CUs where CLASS_NAME (-C) is defined'
complete -c pahole -l flat_arrays -d 'Flatten arrays, so that array[10][2] becomes array[20]'
complete -c pahole -l suppress_aligned_attribute -d 'Suppress forced alignment markers, so that one can compare BTF or CTF output,…'
complete -c pahole -l suppress_force_paddings -d 'Suppress bitfield forced padding at the end of structs, as this requires some…'
complete -c pahole -l suppress_packed -d 'Suppress the output of the inference of __attribute__((__packed__)), so that …'
complete -c pahole -l fixup_silly_bitfields -d 'Converts silly bitfields such as "int foo:32" to plain "int foo"'
complete -c pahole -s V -l verbose -d 'be verbose'
complete -c pahole -s w -l word_size -d 'Change the arch word size to WORD_SIZE'
complete -c pahole -s x -l exclude -d 'Exclude PREFIXed classes'
complete -c pahole -s X -l cu_exclude -d 'Exclude PREFIXed compilation units'
complete -c pahole -s y -l prefix_filter -d 'Include PREFIXed classes'
complete -c pahole -s z -l hole_size_ge -d 'Show only structs with at least one hole greater or equal to HOLE_SIZE'
complete -c pahole -l structs -d 'Show only structs, all the other filters apply, i. e'
complete -c pahole -l packed -d 'Show only packed structs, all the other filters apply, i. e'
complete -c pahole -l unions -d 'Show only unions, all the other filters apply, i. e'
complete -c pahole -l version -d 'Show a traditional string version, i. e. : "v1. 18"'
complete -c pahole -l numeric_version -d 'Show a numeric only version, suitable for use in Makefiles and scripts where …'
complete -c pahole -o rw-rw-r-- -d '$ $ pahole --count 3 -C modversion_info drivers/scsi/sg'

