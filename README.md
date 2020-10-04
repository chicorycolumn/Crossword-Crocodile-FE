# Crossword Crocodile frontend

## Description

A custom crossword maker. Enter your word into an elegant and verdant interface, and millions of calculations will check against a word bank of thousands to create complete crossword grids to your specifications.

I took this opportunity to learn a new programming language - Python - and a new frontend framework - Angular. I chose Python for being one of the most widely used languages in data science, as well as further diversification of my coding knowledge. Its extensive range of modules and libraries would also come in useful.

## Instructions

This frontend is live on [Netlify](https://crossword-crocodile.netlify.app/).
<br/>
The backend counterpart repository can be found [here](https://github.com/chicorycolumn/Cook-Up-A-Crossword-BE).
<br/>
You can also download this repository and run the project locally by following these steps:

1. Fork this repository by clicking the button labelled 'Fork' on the [project page](https://github.com/chicorycolumn/Crossword-Crocodile-FE).
   <br/>
   Copy the url of your forked copy of the repository, and run `git clone the_url_of_your_forked_copy` in a Terminal window on your computer, replacing the long underscored word with your url.
   <br/>
   If you are unsure, instructions on forking can be found [here](https://guides.github.com/activities/forking/) or [here](https://www.toolsqa.com/git/git-fork/), and cloning [here](https://www.wikihow.com/Clone-a-Repository-on-Github) or [here](https://www.howtogeek.com/451360/how-to-clone-a-github-repository/).

2. Open the project in a code editor, and run `npm install` to install necessary packages. You may also need to install [Node.js](https://nodejs.org/en/) by running `npm install node.js`.

3. Run `ng build --prod` and then `ng serve --open` to open the project in development mode.
   <br/>
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

## Deploy

General instructions for taking an **Angular project** and hosting it on **Netlify** for **automatic deployment** are as follows:

0. Ensure the project is initialised in a Git repository. If you are unsure what this means, instructions can be found [here](https://medium.com/@JinnaBalu/initialize-local-git-repository-push-to-the-remote-repository-787f83ff999) and [here](https://www.theserverside.com/video/How-to-create-a-local-repository-with-the-git-init-command).

1. Add `src/_redirects` to (both) assets key in _angular.json_. Also create _\_redirects_ file in _/src_ and write `/* /index.html 200` in there.

2. Run `ng build --prod` in your project. This makes the dist.

3. Login to Netlify and click _New Site from Git_, then select _Github_. Set command as `ng build --prod` and directory as _dist/my-awesome-project_. Make sure the directory name is exactly the same as the dist held folder in your project, which should have appeared after step 2.

Now when you commit and push to Github, Netlify will deploy the latest version of the project automatically.

## Built with

- [Python](https://www.python.org/) - The backend coding language
- [PyCharm](https://www.jetbrains.com/pycharm/) - The backend code editor
- [TypeScript](https://www.typescriptlang.org/) - The frontend coding language
- [VisualStudioCode](https://code.visualstudio.com/) - The frontend code editor

- [Heroku](https://www.heroku.com/) - The cloud application platform used for the backend
- [Netlify](https://www.netlify.com/) - The hosting service used for the frontend

- [Eventlet](http://eventlet.net/) - The networking library
- [Flask](https://flask.palletsprojects.com/) - The microframework
- [Flask-SocketIO](https://flask-socketio.readthedocs.io/en/latest/) - The backend realtime librar
- [Gunicorn](https://gunicorn.org/) - The Python server

- [Angular](https://angular.io/) - The frontend framework
- [Socket.IO](https://socket.io/) - The frontend realtime library
