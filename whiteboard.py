

with open("smallurl.txt", "r") as f:
    mylist = f.read().splitlines()

for i in range(0, len(mylist)):
    print(mylist.pop(i))
