# XSSL – eXtended Simple Shell Language

**XSSL** is a custom-designed interpreted shell scripting language with a hybrid structure combining shell commands, dynamic expressions, control flow logic, and custom function support. It includes a built-in REPL and a modular package system.

[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.png)](https://ssh.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https://github.com/Agh0stt/XSSL&cloudshell_working_dir=XSSL&cloudshell_run_script=build.sh)

---

## 🚀 Getting Started

**git clone --depth 1 https://github.com/Agh0stt/XSSL.git**  
**cd XSSL/**
**chmod +x build.sh**
**./build.sh**
**cd xssl/**

## now the installation has been done, now we will run the repl mode!
***node index.js --repl***
## This Starts the XSSL shell 
## now to run a file do:
***node index.js --repl filename.xssl***


## Keywords! :
## Installing A Package:
get pkg <name> -y
## for example:
get pkg test -y
## listing packages:
pkg list
## printing:
print "Hello, World"
print "Value is " + $x + "!"
print "Value is $x"
## Variables 
let x = 5
const pi = 3.14
dec count
x = x + 1
## note: vars are auto inferred 
## input 
input name "Enter your name" 
## loops 
for i 1 5
  print $i
end

while $x < 10
  print $x
  x = x + 1
end

repeat 3
  print "Hello"
end
## Conditions 
if $x == 10
  print "Ten"
elif $x == 5
  print "Five"
else
  print "Other"
end
## Expressions:
## currently supported:
*+ - * / // ** % √*
## functions 
func greet(name)
  print "Hello, $name"
end

greet("Abhi")

func say()
  print "Hello, "
end
say()

func test(name age)
  print "Hello, $name , You are $age years old."
end
## escapes:
* \n \t *
## shell Commands
ls
pwd
mkdir test
touch file.txt
rm file.txt
rmdir test
rmf folder  ## like rm -rf
echo Hello
clear
uname 
down <url>
down -q <url>           # quiet
down -o file.txt <url>  # save as file.txt
clone <repo_url>
 ## clone is just like git clone <url> 

## structure:
.
├── LICENSE
├── START
├── build.sh
├── README.md
├── xssl
│   ├── Read.txt
│   ├── index.js ## main
│   ├── scripts
│   │   ├── getpkg.sh
│   │   └── note.txt
│   └── .pkg/ ## packages are installed here
└── xssl-run

4 directories, 11 files
 ## Created by Abhigyan Ghosh (Agh0stt) on 19/07/2025
 
