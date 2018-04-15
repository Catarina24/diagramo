<p align="center">
  <img src="https://github.com/makeorbreak-io/diagramo/blob/master/diagramo.png" width="300">
  <img src="https://github.com/makeorbreak-io/diagramo/blob/master/logodiagramo.png" width="100">
</p>

<h3 align="center" style="margin: 0 auto">Diagrams made easy<!-- Serve Confidently --></h3>
<p align="center" style="margin: 0 auto">Project developed during Make or Brake 2018</p>

---

# Diagramo

Are you tired of having to use your touchpad to create those annoying diagrams for projects specification? Want to be able to create diagrams as fast as you code? It always takes you `MAX_INT` minutes to get everything perfect?

Then **Diagramo** is *perfect* for you. Its an innovative diagram editor which combines the best of two worlds: programming and diagramming. 

## Features

**Diagramo** features a *customized syntax* which allows you create, visualize and export diagrams rapidly. Diagramo gives you:

- A clean editor for you to *code* your diagrams.
- An *interactive* canvas which displays the diagram you're creating.
- An image upload function.
- The possibility to export and import projects.

But that is not all. Diagramo's syntax is **object-oriented**. This means that you can set multiple elements' definitions with just a couple of keystrokes. Inheritance handles the rest.

The canvas lets you **drag** elements around, changing their properties in the editor accordingly, and it helps you align connected elements with a "snap" function.

You can also **import** code from different files and use **your own** images.

With **Diagramo** you spend less time drawing and more time modelling.

What are you waiting for? Read further and start **DIAGRAMO-ING!**

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run Diagramo you'll need:

- [python3](https://www.python.org/downloads/)
- [bottle.py](https://bottlepy.org/docs/dev/)
- php7.0 `sudo apt-get-install php7.0`
- php7.0-zip `sudo apt-get install php7.0-zip`

Diagramo is tested to run in Ubuntu.

### Installing

To install Diagramo you only have to clone this git repository

```
git clone https://github.com/makeorbreak-io/diagramo
```

### Running

To run Diagramo you'll need to start two diferent servers.

Start the `canvas` server by changing the current directory to the `canvas` folder of the repository and then running.

```
php -S 127.0.0.1:8081
```

Start the `compiler` server by changing the current directory to the `compiler` folder of the repository and then running.

```
python3 server.py
```

Once you visit `localhost:8081` on a browser, you'll see Diagramo.

## Built With

* [bottle.py](https://bottlepy.org/docs/dev/) - Used for the compiler server
* [P5.js](https://p5js.org/) - Javascript framework for graphic visualization used for the canvas
* [AceEditor](https://ace.c9.io/) - Used for the text editor

## Authors

* [Catarina Correia](https://github.com/Catarina24)
* [João Silva](https://github.com/joaosilva22 )
* [José Aleixo](https://github.com/jazzchipc)
* [Margarida Viterbo](https://github.com/margaridaviterbo)
