#will open the files called female.txt and male.txt and
#remove everything on each row after the first " " delimited word
#and add qutationmarks around it, and a comma at the end

import os

path = os.getcwd()

def parseFile(raw_, parsed_):
    name = ""
    try:
        parsed = open(parsed_, 'w', encoding="UTF-8")
        with open(raw_, 'r', encoding="UTF-8") as raw:
            for line in raw:
                pLine = line.split(" ")
                name = pLine[0]
                if len(pLine) == 1:
                    parsed.write('"' + name[:-1] + '",\n')
                else:
                    parsed.write('"' + name + '",\n')
    except UnicodeDecodeError as e:
        print(name)
        print(e)
    finally:
        raw.close()
        parsed.close()

#parseFile(path + "/female.txt", path + "/parsedFem.txt")

parseFile(path + "/male.txt", path + "/parsedMal.txt")