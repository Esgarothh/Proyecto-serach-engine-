import re

from sympy import true
# https://stackoverflow.com/questions/57609873/regex-for-finding-http-and-https-url-from-a-string

filenuevo = open("test.txt", 'w')

filetoread = open(
    "/home/esgaroth/Downloads/extracted/AOL-user-ct-collection/user-ct-test-collection-01.txt", 'r')

count = 0
while True:
    regexx = re.compile(
        '((https?|ftp|gopher|telnet|file):((//)|(\\\\))+[\\w\\d:#@%/;$()~_?\\+-=\\\\\\.&]*)')
    texto = filetoread.readline()
    if not texto:
        break
    palabra = regexx.search(texto)
    if palabra != None:
        filenuevo.write(palabra.group()+'\n')
