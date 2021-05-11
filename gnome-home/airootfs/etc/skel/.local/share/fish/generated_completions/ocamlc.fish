# ocamlc
# Autogenerated from man page /usr/lib/jvm/default/man/man1/ocamlc.1.gz
complete -c ocamlc -s a -d 'Build a library (. cma file) with the object files ('
complete -c ocamlc -o annot -d 'Deprecated since 4. 11.  Please use  -bin-annot instead'
complete -c ocamlc -o bin-annot -d 'Dump detailed information about the compilation (types, bindings, tail-calls,…'
complete -c ocamlc -s c -d 'Compile only.  Suppress the linking phase of the compilation'
complete -c ocamlc -o cc -d 'Use  ccomp as the C linker when linking in "custom runtime" mode (see the  -c…'
complete -c ocamlc -o cclib-l -d 'Pass the  -l libname option to the C linker when linking in "custom runtime" …'
complete -c ocamlc -o ccopt -d 'Pass the given  option to the C compiler and linker, when linking in "custom …'
complete -c ocamlc -o color -d 'Enable or disable colors in compiler messages (especially warnings and errors)'
complete -c ocamlc -o error-style -d 'Control the way error messages and warnings are printed'
complete -c ocamlc -o compat-32 -d 'Check that the generated bytecode executable can run on 32-bit platforms and …'
complete -c ocamlc -o config -d 'Print the version number of  ocamlc (1) and a detailed summary of its configu…'
complete -c ocamlc -o config-var -d 'Print the value of a specific configuration variable from the  -config output…'
complete -c ocamlc -o custom -d 'Link in "custom runtime" mode'
complete -c ocamlc -o dependocamldep-args -d 'Compute dependencies, as ocamldep would do'
complete -c ocamlc -o dllib-l -d 'Arrange for the C shared library  dll libname '
complete -c ocamlc -o dllpath -d 'Adds the directory  dir to the run-time search path for shared C libraries'
complete -c ocamlc -o for-pack -d 'Generate an object file ('
complete -c ocamlc -s g -d 'Add debugging information while compiling and linking'
complete -c ocamlc -s i -d 'Cause the compiler to print all defined names (with their inferred types or t…'
complete -c ocamlc -s I -d 'Add the given directory to the list of directories searched for compiled inte…'
complete -c ocamlc -o impl -d 'Compile the file  filename as an implementation file, even if its extension i…'
complete -c ocamlc -o intf -d 'Compile the file  filename as an interface file, even if its extension is not '
complete -c ocamlc -o intf-suffix -d 'Recognize file names ending with  string as interface files (instead of the d…'
complete -c ocamlc -o keep-docs -d 'Keep documentation strings in generated . cmi files'
complete -c ocamlc -o keep-locs -d 'Keep locations in generated . cmi files'
complete -c ocamlc -o labels -d 'Labels are not ignored in types, labels may be used in applications, and labe…'
complete -c ocamlc -o linkall -d 'Force all modules contained in libraries to be linked in'
complete -c ocamlc -o make-runtime -d 'Build a custom runtime system (in the file specified by option  -o ) incorpor…'
complete -c ocamlc -o match-context-rows -d 'Set number of rows of context used during pattern matching compilation'
complete -c ocamlc -o no-alias-deps -d 'Do not record dependencies for module aliases'
complete -c ocamlc -o no-app-funct -d 'Deactivates the applicative behaviour of functors'
complete -c ocamlc -o noassert -d 'Do not compile assertion checks'
complete -c ocamlc -o noautolink -d 'When linking '
complete -c ocamlc -o nolabels -d 'Ignore non-optional labels in types'
complete -c ocamlc -o nostdlib -d 'Do not automatically add the standard library directory to the list of direct…'
complete -c ocamlc -s o -d 'Specify the name of the output file produced by the linker'
complete -c ocamlc -o opaque -d 'Interface file compiled with this option are marked so that other compilation…'
complete -c ocamlc -o open -d 'Opens the given module before processing the interface or implementation files'
complete -c ocamlc -o output-obj -d 'Cause the linker to produce a C object file instead of a bytecode executable …'
complete -c ocamlc -o pack -d 'Build a bytecode object file ('
complete -c ocamlc -o pp -d 'Cause the compiler to call the given  command as a preprocessor for each sour…'
complete -c ocamlc -o ppx -d 'After parsing, pipe the abstract syntax tree through the preprocessor R comma…'
complete -c ocamlc -o principal -d 'Check information path during type-checking, to make sure that all types are …'
complete -c ocamlc -o rectypes -d 'Allow arbitrary recursive types during type-checking'
complete -c ocamlc -o runtime-variant -d 'Add  suffix to the name of the runtime library that will be used by the progr…'
complete -c ocamlc -o stop-after -d 'Stop compilation after the given compilation pass'
complete -c ocamlc -o safe-string -d 'Enforce the separation between types  string and bytes , thereby making strin…'
complete -c ocamlc -o short-paths -d 'When a type is visible under several module-paths, use the shortest one when …'
complete -c ocamlc -o strict-sequence -d 'Force the left-hand part of each sequence to have type unit'
complete -c ocamlc -o unboxed-types -d 'When a type is unboxable (i. e'
complete -c ocamlc -o no-unboxed-types -d 'When a type is unboxable  it will be boxed unless annotated with  [@@ocaml'
complete -c ocamlc -o unsafe -d 'Turn bound checking off for array and string accesses (the  v. (i) and s'
complete -c ocamlc -o unsafe-string -d 'Identify the types  string and bytes , thereby making strings writable'
complete -c ocamlc -o use-runtime -d 'Generate a bytecode executable file that can be executed on the custom runtim…'
complete -c ocamlc -s v -d 'Print the version number of the compiler and the location of the standard lib…'
complete -c ocamlc -o verbose -d 'Print all external commands before they are executed, in particular invocatio…'
complete -c ocamlc -o vnum -o version -d 'Print the version number of the compiler in short form (e. g.  "3. 11'
complete -c ocamlc -s w -d 'Enable, disable, or mark as fatal the warnings specified by the argument R wa…'
complete -c ocamlc -o warn-error -d 'Mark as errors the warnings specified in the argument R warning-list '
complete -c ocamlc -o warn-help -d 'Show the description of all available warning numbers'
complete -c ocamlc -o where -d 'Print the location of the standard library, then exit'
complete -c ocamlc -o with-runtime -d 'Include the runtime system in the generated program.  This is the default'
complete -c ocamlc -o without-runtime -d 'The compiler does not include the runtime system (nor a reference to it) in t…'
complete -c ocamlc -o cclib -d 'options are passed on the command line, these options are stored in the resul…'
complete -c ocamlc -o absname -d 'Show absolute filenames in error messages'
complete -c ocamlc -s l -d 'Pass the'
complete -c ocamlc -s L -d 'causes the C linker to search for C libraries in directory dir '
complete -c ocamlc -o depend -d 'Compute dependencies, as ocamldep would do'
complete -c ocamlc -o dllib -d 'Arrange for the C shared library dll libname '
complete -c ocamlc -o with-debug-runtime -d 'then the d suffix is supported and gives a debug version of the runtime'
complete -c ocamlc -o a+31 -d '(only warning 31 is fatal)'
complete -c ocamlc -o help -l help -d 'Display a short usage summary and exit'

