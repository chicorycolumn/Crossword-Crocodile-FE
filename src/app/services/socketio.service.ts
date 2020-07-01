import { Injectable } from '@angular/core';
import socketIOClient from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket;

  constructor() {}
  setupSocketConnection(
    shouldEndpointBeHeroku,
    startButtonActive,
    serverIsIndeedWorking,
    results
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

    this.socket.on('message', (data) => {
      //screw Change this to specific "terminated" event?
      console.log('Server sent ', data, Date.now() / 1000 - 1593360000);
    });

    this.socket.on('started', (data) => {
      console.log('***Server confirms started.');
      if (!serverIsIndeedWorking.value) {
        serverIsIndeedWorking.value = true;
      }
    });

    this.socket.on('terminated', (data) => {
      console.log('***Server confirms terminated.');
      if (startButtonActive.value) {
        startButtonActive.value = false;
      }
      if (serverIsIndeedWorking.value) {
        serverIsIndeedWorking.value = false;
      }
    });

    this.socket.on('produced grid', (data) => {
      results.push(data['result']);
      // console.log(data['mandatory_words']);
      // console.log(results);
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
