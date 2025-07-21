#!/usr/bin/bash
clear
sleep 2
chmod +x ./START
chmod +x ./xssl-run
# Function to center text
center_text() {
  local termwidth
  termwidth=$(tput cols)
  local padding=$(( (termwidth - ${#1}) / 2 ))
  printf "%*s%s\n" "$padding" "" "$1"
}

# Banner
echo -e "\033[1;33m\033[1m"  # Yellow bold
center_text "THANK YOU FOR INSTALLING XSSL!"
echo -e "\033[0m"

echo -e "\033[1;31m\033[1m"  # Red bold
center_text "XSSL"
echo -e "\033[0m"

echo -e "\033[1;37m"
center_text "Created by Abhigyan Ghosh"
echo -e "\033[0m\n"

# Set permissions
chmod +x xssl/index.js
chmod +x xssl/scripts/getpkg.sh

# Silent package installation
center_text "Installing XSSL;."
pkg install -y wget nodejs > /dev/null 2>&1

# APT-style yellow progress bar (horizontal, tabbed)
bar_length=40

echo -e "\n\033[1;33m"  # Yellow
center_text "Installing XSSL [eXtended Simple Shell Language]..."
echo -e "\033[0m"

echo -ne "\033[1;33m\t["  # Start the bar line with tab
for ((i = 1; i <= bar_length; i++)); do
  sleep 0.08
  echo -ne "#"
done
echo -e "] 100%\033[0m"

echo -e "\n\n\033[1;32m"
center_text "Installation complete."
echo -e "\033[0m"
sleep 1
clear

# Final usage instructions
echo -e "\033[1;34m"
center_text "You can:"
center_text "1) Type: ./START"
center_text "   → To start XSSL REPL mode"
center_text "2) Type: ./xssl-run <FILENAME.XSSL>"
center_text "   → To run an XSSL script file"
echo -e "\033[0m"

sleep 2
echo -e "\033[1;34m"
center_text "Thank you for installing XSSL!"
echo -e "\033[0m"
