from backend.shared.paths import project_path

fichier = open(project_path("default", "simple") / 'run.txt', 'r')
line = 0
sizeArray = []
arrayRunFile = []
for ligne in fichier:
    line += 1
    if line == 2:
        for i in range(len(ligne.split())):
            sizeArray.append(len(ligne.split()[i]))
    elif line > 2:
        tmp = 0
        subArray = []
        for i in range(len(sizeArray)-1):
            tmp += sizeArray[i]+2
            subArray.append(ligne[tmp:tmp+sizeArray[i+1]].strip())
        arrayRunFile.append(subArray)
lineToSend = 0


def getter_line():
    global lineToSend
    return lineToSend


def setter_line(number):
    global lineToSend
    lineToSend = number
