import argparse

from parser import Parser

ap = argparse.ArgumentParser()
ap.add_argument("-i", "--input", required=True, help="The input .dgm file")
ap.add_argument("-o", "--output", required=True, help="The output .json file")
args = vars(ap.parse_args())
        
p = Parser(args["input"])
r = p.parse_program()
r.export(args["output"])
for error in p.errors:
    print(error)
