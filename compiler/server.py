import json

from parser import Parser
from bottle import hook, route, request, response, post, run

_allow_origin = '*'
_allow_methods = 'PUT, GET, POST, DELETE, OPTIONS'
_allow_headers = 'Authorization, Origin, Accept, Content-Type, X-Requested-With'

@hook('after_request')
def enable_cors():
    '''Add headers to enable CORS'''

    response.headers['Access-Control-Allow-Origin'] = _allow_origin
    response.headers['Access-Control-Allow-Methods'] = _allow_methods
    response.headers['Access-Control-Allow-Headers'] = _allow_headers

@route('/', method = 'OPTIONS')
@route('/<path:path>', method = 'OPTIONS')
def options_handler(path = None):
    return

@post('/compile')
def compile():
    files = request.json
    for file in files:
        if file.get("entry"):
            entry = file.get("name")
    p = Parser(entry, files)
    root = p.parse_program(files)
    if len(p.errors) > 0:
        return json.dumps(dict(errors=p.errors))
    return json.dumps(root.json())

run()
