import json

myfile = open("test.txt", 'r').readlines()

uniq = set()
for p in myfile:
    if p in uniq:
        del p
    else:
        uniq.add(p)

filenuevo = open("nodup.txt", 'w')
str_val = "".join(uniq)
filenuevo.write(str_val)
