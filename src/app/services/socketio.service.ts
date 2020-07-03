import { Injectable } from '@angular/core';
import socketIOClient from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket;
  startButtonActive;
  serverIsIndeedWorking;

  constructor() {}
  setupSocketConnection(
    shouldEndpointBeHeroku,
    startButtonActive,
    serverIsIndeedWorking,
    results,
    socketIsReady
  ) {
    this.socket = socketIOClient(
      shouldEndpointBeHeroku
        ? 'https://cook-up-a-crossword.herokuapp.com/'
        : 'http://localhost:5000',
      { transports: ['websocket'] }
    );

    this.startButtonActive = startButtonActive;
    this.serverIsIndeedWorking = serverIsIndeedWorking;

    this.socket.on('connect', () => {
      console.log('Connected!', Date.now() / 1000 - 1593360000);
    });

    this.socket.on('disconnect', () => {
      console.log(
        'HEY LAD DISCONNECT OCCURRED',
        Date.now() / 1000 - 1593360000
      );
      this.turnOffButtons();
      this.stop();
    });

    this.socket.on('message', (data) => {
      console.log('Server sent ', data, Date.now() / 1000 - 1593360000);
    });

    this.socket.on('connection confirmed', (data) => {
      console.log(
        'Server connexed, and sent ',
        data,
        Date.now() / 1000 - 1593360000
      );
      // this.turnOffButtons(); //screw?
      socketIsReady.value = true;
    });

    this.socket.on('started', (data) => {
      console.log('---');
      console.log(
        'SERVER STARTED!!!!!!!!!!!!!!!!!',
        Date.now() / 1000 - 1593360000
      );
      console.log(
        'SERVICE says serverIsIndeedWorking.value is',
        serverIsIndeedWorking.value,
        'and startButtonActive.value is',
        startButtonActive.value
      );
      if (!startButtonActive.value) {
        console.log(
          'WOAH SALLY, STARTBUTTON INACTIVE BUT SERVER SENT A STARTED MSG.'
        );
        this.stop();
      } else if (!serverIsIndeedWorking.value) {
        setTimeout(() => {
          serverIsIndeedWorking.value = true;
          console.log(
            'serverIsIndeedWorking.value',
            serverIsIndeedWorking.value
          );
          console.log('---');
        }, 100);
      }
    });

    this.socket.on('terminated', (data) => {
      console.log('Server says terminated.', Date.now() / 1000 - 1593360000);
      this.turnOffButtons();
    });

    this.socket.on('produced grid', (data) => {
      if (startButtonActive.value) {
        results.array.push(data['result']);
        console.log(data['result']);
      } else {
        console.log(
          'WOAH NELLY, STARTBUTTON INACTIVE BUT SERVER SENT A RESULT.'
        );
        this.stop();
      }
    });
  }

  turnOffButtons() {
    if (this.startButtonActive.value) {
      this.startButtonActive.value = false;
    }
    if (this.serverIsIndeedWorking.value) {
      this.serverIsIndeedWorking.value = false;
    }
  }

  stop() {
    console.log('gonna ask to stop', Date.now() / 1000 - 1593360000);
    this.socket.emit('please terminate', {});
  }

  emitGridSpecs(data) {
    console.log('gonna emit', Date.now() / 1000 - 1593360000);
    this.socket.emit('grid specs', data);
  }

  message() {
    console.log('gonna message', Date.now() / 1000 - 1593360000);
    this.socket.emit('message', {
      message: 'I am the client, I am trying to connect to server.',
    });
  }

  verifyOff() {
    console.log('gonna verify off', Date.now() / 1000 - 1593360000);
    this.socket.emit('verify off', {});
  }
}
