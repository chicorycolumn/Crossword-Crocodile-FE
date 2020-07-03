import { Injectable } from '@angular/core';
import socketIOClient from 'socket.io-client';
import { resultsArray } from '../shared/utils';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket;
  turnOffButtons(startButtonActive, serverIsIndeedWorking) {
    if (startButtonActive.value) {
      startButtonActive.value = false;
    }
    if (serverIsIndeedWorking.value) {
      serverIsIndeedWorking.value = false;
    }
  }

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

    this.socket.on('connect', () => {
      console.log('Connected!', Date.now() / 1000 - 1593360000);
    });

    this.socket.on('disconnect', () => {
      console.log(
        'HEY LAD DISCONNECT OCCURRED',
        Date.now() / 1000 - 1593360000
      );
      this.turnOffButtons(startButtonActive, serverIsIndeedWorking);
    });

    this.socket.on('message', (data) => {
      console.log('Server sent ', data, Date.now() / 1000 - 1593360000);
    });

    this.socket.on('connection confirmed', (data) => {
      console.log('Server sent ', data, Date.now() / 1000 - 1593360000);
      this.turnOffButtons(startButtonActive, serverIsIndeedWorking);
      socketIsReady.value = true;
    });

    this.socket.on('started', (data) => {
      console.log('Server says started.', Date.now() / 1000 - 1593360000);
      if (!startButtonActive.value) {
        console.log('WOAH SALLY');
        this.stop();
      } else if (!serverIsIndeedWorking.value) {
        serverIsIndeedWorking.value = true;
      }
    });

    this.socket.on('terminated', (data) => {
      console.log('Server says terminated.', Date.now() / 1000 - 1593360000);
      this.turnOffButtons(startButtonActive, serverIsIndeedWorking);
    });

    this.socket.on('produced grid', (data) => {
      if (startButtonActive.value) {
        results.array.push(data['result']);
        console.log(data['result']);
      } else {
        console.log('WOAH NELLY');
        this.stop();
      }
    });
  }

  emitGridSpecs(data) {
    console.log('gonna emit', Date.now() / 1000 - 1593360000);
    this.socket.emit('grid specs', data);
  }

  stop() {
    console.log('gonna ask to stop', Date.now() / 1000 - 1593360000);
    this.socket.emit('please terminate', {});
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
