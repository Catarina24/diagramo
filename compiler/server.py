from bottle import post, run

from main import Parser

@post("/compile")
def compile():
    return "Hello, world!"

run(host="localhost", port=8080, debug=True)
