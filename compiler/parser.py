import json

from enum import IntEnum

class Tag(IntEnum):
    CLASS = -1,
    ID = -2,
    END = -3,
    OBJECT = -4,
    IS = -5,
    IMAGE = -6,
    LABEL = -7,
    STRING = -8,
    NUM = -9,
    POSITION = -10,
    CONNECTTO = -11,
    EOF = -12,
    IMPORT = -13,
    WIDTH = -14,
    HEIGHT = -15

# tokens    
class Token:
    def __init__(self, tag):
        self.tag = tag
        
class Num(Token):
    def __init__(self, value):
        self.value = value
        super().__init__(Tag.NUM)
        
class String(Token):
    def __init__(self, string):
        self.string = string
        super().__init__(Tag.STRING)

class Identifier(Token):
    def __init__(self, lexeme):
        self.lexeme = lexeme
        super().__init__(Tag.ID)

# lexer
class Lexer:
    stream_cursor = 0
    last_char = ' '

    char_no = 1
    line_no = 0
    file_no = 0
    files = []

    def __init__(self, filepath, content=None):
        self.stream = ""
        self.stream_cursor = 0
        self.last_char = ' '

        self.char_no = 1
        self.line_no = 0
        self.file_no = 0
        self.files = []
        
        self.add_file(filepath, content)

    def add_file(self, filepath, content=None):
        if content == None:
            try:
                file = open(filepath, "r")
                content = file.read() + "\n"
            except FileNotFoundError:
                return False
        start = len(self.stream)
        end = start + len(content)
        self.files.append((filepath, end))
        self.stream += content
        return True
        
    def append_to_stream(self, content):
        self.stream += "\n" + content

    def get_char(self):
        if self.stream_cursor < len(self.stream):
            # oh my...
            if self.stream_cursor > self.files[self.file_no][1]:
                self.file_no += 1
                self.line_no = 0
                self.char_no = 1
            char = self.stream[self.stream_cursor]
            if char == "\n":
                self.line_no += 1
                self.char_no = 1
            else:
                self.char_no += 1
            # ...god
            self.stream_cursor += 1
            return char
        else:
            return None

    def get_file(self):
        return self.files[self.file_no][0]

    def is_white_space(self, char):
        if char == None: return False
        return char.isspace()

    def is_alpha(self, char):
        if char == None: return False
        return char.isalpha()
    
    def is_alnum(self, char):
        if char == None: return False
        return char.isalpha() or char.isdigit()

    def is_digit(self, char):
        if char == None: return False
        return char.isdigit()

    def get_token(self):        
        # skip white space
        while self.is_white_space(self.last_char):
            self.last_char = self.get_char()

        # recognize strings
        if self.last_char == "\"":
            self.last_char = self.get_char()

            str = ""
            while self.last_char != "\"":
                str += self.last_char
                self.last_char = self.get_char()

            self.last_char = self.get_char()
            return String(str)

        # recognize keywords and identifiers
        if self.is_alpha(self.last_char):
            str = self.last_char
            self.last_char = self.get_char()

            while self.is_alnum(self.last_char):
                str += self.last_char
                self.last_char = self.get_char()

            # keywords
            if str == "class":
                return Token(Tag.CLASS)
            elif str == "object":
                return Token(Tag.OBJECT)
            elif str == "end":
                return Token(Tag.END)
            elif str == "is":
                return Token(Tag.IS)
            elif str == "image":
                return Token(Tag.IMAGE)
            elif str == "label":
                return Token(Tag.LABEL)
            elif str == "position":
                return Token(Tag.POSITION)
            elif str == "connect":
                return Token(Tag.CONNECTTO)
            elif str == "import":
                return Token(Tag.IMPORT)
            elif str == "width":
                return Token(Tag.WIDTH)
            elif str == "height":
                return Token(Tag.HEIGHT)

            # identifiers
            return Identifier(str)

        # comments
        if self.last_char == "#":
            self.last_char = self.get_char()
            while self.last_char != None and self.last_char != "\n" and self.last_char != "\r":
                self.last_char = self.get_char()

            if self.last_char != None:
                return self.get_token()

        # recognize numbers
        if self.is_digit(self.last_char):
            str = self.last_char
            self.last_char = self.get_char()
            
            while self.is_digit(self.last_char):
                str += self.last_char
                self.last_char = self.get_char()

            return Num(int(str))

        # check for end of file
        if self.last_char == None:
            return Token(Tag.EOF)

        # otherwise return the character as its ascii value
        this_char = self.last_char
        self.last_char = self.get_char()
        return Token(ord(this_char))

# abstract syntax tree

class LabelAstNode:
    def __init__(self, text):
        self.text = text

class PositionAstNode:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def json(self):
        return self.__dict__

class ImageAstNode:
    def __init__(self, path):
        self.path = path

    def json(self):
        return self.__dict__

class ConnectsAstNode:
    def __init__(self, connections):
        self.connections = connections

class WidthAstNode:
    def __init__(self, width):
        self.width = width

class HeightAstNode:
    def __init__(self, height):
        self.height = height

class ClassAstNode:

    def __init__(self, name):
        self.name = name

    def json(self):
        d = dict(name=self.name)
        if hasattr(self, "label") and self.label != None: d["label"] = self.label.text
        if hasattr(self, "position") and self.position != None: d["position"] = self.position.json()
        if hasattr(self, "image") and self.image != None: d["image"] = self.image.json()
        if hasattr(self, "connects") and self.connects != None: d["connects"] = self.connects.connections
        if hasattr(self, "width") and self.width != None: d["width"] = self.width.width
        if hasattr(self, "height") and self.height != None: d["height"] = self.height.height
        return d

class ObjectAstNode:
    def __init__(self, parent, name):
        self.parent = parent
        self.name = name

    def json(self):
        d = dict(name=self.name, parent=self.parent)
        if hasattr(self, "label") and self.label != None: d["label"] = self.label.text
        if hasattr(self, "position") and self.position != None: d["position"] = self.position.json()
        if hasattr(self, "image") and self.image != None: d["image"] = self.image.json()
        if hasattr(self, "connects") and self.connects != None: d["connects"] = self.connects.connections
        if hasattr(self, "width") and self.width != None: d["width"] = self.width.width
        if hasattr(self, "height") and self.height != None: d["height"] = self.height.height
        return d

class RootAstNode:
    classes = []
    objects = []

    def __init__(self):
        self.classes = []
        self.objects = []

    def json(self):
        classes_json = []
        for class_node in self.classes:
            classes_json.append(class_node.json())
        objects_json = []
        for object_node in self.objects:
            objects_json.append(object_node.json())
        return dict(classes=classes_json, objects=objects_json)

    def export(self, filepath):
        with open(filepath, "w") as text_file:
            text_file.write(json.dumps(self.json(), sort_keys=True, indent=4))
    
# parser
class Parser:
    cur_token = None
    errors = []
    
    def __init__(self, filepath, files=None):
        self.cur_token = None
        self.errors = []

        content = None
        if files != None:
            for file in files:
                if file.get("name") == filepath:
                    content = file.get("content")
        self.lexer = Lexer(filepath, content)
        self.cur_token = self.lexer.get_token()

    def error(self, message):
        self.errors.append("{} line {}: Syntax error - {}".format(self.lexer.get_file(), self.lexer.line_no, message))

    def skip_until_top_level(self):
        while self.cur_token.tag != Tag.OBJECT and self.cur_token.tag != Tag.CLASS:
            if self.cur_token.tag == Tag.EOF: return None # dont get stuck here if the error is at the EOF
            self.cur_token = self.lexer.get_token()

    def parse_program(self, files=None):
        # merge the imported files
        self.parse_imports(files)
        # start the actual parsing
        root_node = RootAstNode()
        child_node = self.parse_top_level()
        while child_node != None:
            if isinstance(child_node, ClassAstNode):
                root_node.classes.append(child_node)
            elif isinstance(child_node, ObjectAstNode):
                root_node.objects.append(child_node)
            child_node = self.parse_top_level()
        return root_node

    def parse_imports(self, files):
        while(self.cur_token.tag == Tag.IMPORT):
            self.cur_token = self.lexer.get_token()
            if self.cur_token.tag == Tag.STRING:
                filepath = self.cur_token.string
                content = None
                if files != None:
                    for file in files:
                        if file["name"] == filepath:
                            content = file["content"]
                success = self.lexer.add_file(filepath, content)
                if success == False:
                    self.error("no such file '" + filepath + "'")
                self.cur_token = self.lexer.get_token()
            else:
                self.error("expected a module name")

    def parse_top_level(self):
        if self.cur_token.tag == Tag.CLASS:
            self.cur_token = self.lexer.get_token()
            return self.parse_class()
        if self.cur_token.tag == Tag.OBJECT:
            self.cur_token = self.lexer.get_token()
            return self.parse_object()
        if self.cur_token.tag == Tag.EOF:
            return None
        self.error("expected a top level expression")
        self.skip_until_top_level()
        return ClassAstNode("");

    def parse_class(self):
        if self.cur_token.tag == Tag.ID:
            class_node = ClassAstNode(self.cur_token.lexeme)
            self.cur_token = self.lexer.get_token()
            while self.cur_token.tag != Tag.END:
                
                if self.cur_token.tag == Tag.LABEL:
                    self.cur_token = self.lexer.get_token()
                    class_node.label = self.parse_label()
                    
                elif self.cur_token.tag == Tag.POSITION:
                    self.cur_token = self.lexer.get_token()
                    class_node.position = self.parse_position()
                    
                elif self.cur_token.tag == Tag.IMAGE:
                    self.cur_token = self.lexer.get_token()
                    class_node.image = self.parse_image()
                    
                elif self.cur_token.tag == Tag.CONNECTTO:
                    self.cur_token = self.lexer.get_token()
                    class_node.connects = self.parse_connects()

                elif self.cur_token.tag == Tag.WIDTH:
                    self.cur_token = self.lexer.get_token()
                    class_node.width = self.parse_width()

                elif self.cur_token.tag == Tag.HEIGHT:
                    self.cur_token = self.lexer.get_token()
                    class_node.height = self.parse_height()

                else:
                    self.error("expected property name (one of label, position, image or connects)")
                    self.cur_token = self.lexer.get_token()
            self.cur_token = self.lexer.get_token()
            return class_node
        return None

    def parse_object(self):
        if self.cur_token.tag == Tag.ID:
            name = self.cur_token.lexeme
            self.cur_token = self.lexer.get_token()
            if self.cur_token.tag == Tag.IS:
                self.cur_token = self.lexer.get_token()
                if self.cur_token.tag == Tag.ID:
                    parent = self.cur_token.lexeme
                    object_node = ObjectAstNode(parent, name)
                    self.cur_token = self.lexer.get_token()
                    while self.cur_token.tag != Tag.END:
                        
                        if self.cur_token.tag == Tag.LABEL:
                            self.cur_token = self.lexer.get_token()
                            object_node.label = self.parse_label()
                            
                        elif self.cur_token.tag == Tag.POSITION:
                            self.cur_token = self.lexer.get_token()
                            object_node.position = self.parse_position()
                            
                        elif self.cur_token.tag == Tag.IMAGE:
                            self.cur_token = self.lexer.get_token()
                            object_node.image = self.parse_image()
                            
                        elif self.cur_token.tag == Tag.CONNECTTO:
                            self.cur_token = self.lexer.get_token()
                            object_node.connects = self.parse_connects()

                        elif self.cur_token.tag == Tag.WIDTH:
                            self.cur_token = self.lexer.get_token()
                            class_node.width = self.parse_width()

                        elif self.cur_token.tag == Tag.HEIGHT:
                            self.cur_token = self.lexer.get_token()
                            class_node.height = self.parse_height()
    
                        else:
                            self.error("expected property name (one of label, position, image or connects)")
                            self.cur_token = self.lexer.get_token()
                    self.cur_token = self.lexer.get_token()
                    return object_node
        return None

    def parse_label(self):
        if self.cur_token.tag == ord(":"):
            self.cur_token = self.lexer.get_token()
            if self.cur_token.tag == Tag.STRING:
                label = self.cur_token.string
                self.cur_token = self.lexer.get_token()
                return LabelAstNode(label)
            else:
                self.error("expected string")
        else:
            self.error("expected ':'")
        return None

    def parse_position(self):
        if self.cur_token.tag == ord(":"):
            self.cur_token = self.lexer.get_token()
            if self.cur_token.tag == Tag.NUM:
                x = self.cur_token.value
                self.cur_token = self.lexer.get_token()
                if self.cur_token.tag == ord(","):
                    self.cur_token = self.lexer.get_token()
                    if self.cur_token.tag == Tag.NUM:
                        y = self.cur_token.value
                        self.cur_token = self.lexer.get_token()
                        return PositionAstNode(x, y)
                    else:
                        self.error("expected a number")
                else:
                    self.error("expected a ','")
            else:
                self.error("expected a number")
        else:
            self.error("expected a ':'")
        return None

    def parse_image(self):
        if self.cur_token.tag == ord(":"):
            self.cur_token = self.lexer.get_token()
            if self.cur_token.tag == Tag.STRING:
                path = self.cur_token.string
                self.cur_token = self.lexer.get_token()
                return ImageAstNode(path)
            else:
                self.error("expected a string")
        else:
            self.error("expected a ':'")
        return None

    def parse_connects(self):
        if self.cur_token.tag == ord(":"):
            self.cur_token = self.lexer.get_token()
            if self.cur_token.tag == ord("["):
                connections = []
                self.cur_token = self.lexer.get_token()
                while self.cur_token.tag != ord("]") and self.cur_token.tag != Tag.END:
                    if len(connections) != 0:
                        if self.cur_token.tag == ord(","):
                            self.cur_token = self.lexer.get_token()
                            if self.cur_token.tag == Tag.ID:
                                connections.append(self.cur_token.lexeme)
                                self.cur_token = self.lexer.get_token()
                            else:
                                self.error("expected an identifier")
                        else:
                            self.cur_token = self.lexer.get_token()
                    else:
                        if self.cur_token.tag == Tag.ID:
                            connections.append(self.cur_token.lexeme)
                            self.cur_token = self.lexer.get_token()
                        else:
                            self.error("expected an identifier")
                if self.cur_token.tag == Tag.END:
                    self.error("expected a ']'")
                self.cur_token = self.lexer.get_token()
                return ConnectsAstNode(connections)
        return None

    def parse_width(self):
        if self.cur_token.tag == ord(":"):
            self.cur_token = self.lexer.get_token()
            if self.cur_token.tag == Tag.NUM:
                width = self.cur_token.value
                self.cur_token = self.lexer.get_token()
                return WidthAstNode(width)
            else:
                self.error("expected number")
        else:
            self.error("expected ':'")
        return None

    def parse_width(self):
        if self.cur_token.tag == ord(":"):
            self.cur_token = self.lexer.get_token()
            if self.cur_token.tag == Tag.NUM:
                height = self.cur_token.value
                self.cur_token = self.lexer.get_token()
                return HeightAstNode(height)
            else:
                self.error("expected number")
        else:
            self.error("expected ':'")
        return None
