import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Peer, { MediaConnection } from 'peerjs';
import { VideoRoomComponent } from 'src/app/shared/video-room/video-room.component';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class PeerService {

  public peer!: Peer;
  private call: any;
  private mediaCall!: Peer.MediaConnection;

  mediaStreaming!: MediaStream;
  constructor(private dialog: MatDialog) { }

  initPeer(id: string): any {

    if (!this.peer || this.peer.disconnected) {

      try {
        this.peer = new Peer(id, {
          host: 'localhost',
          port: 9000,
          key: 'peer'
        });

        console.log(this.peer);

        //  localStorage.setItem("label", this.peer);

        this.peer.on('open', (id) => {
          console.log('My peer ID is: ' + id)
        })
        this.peer.on('connection', (conn) => {
          console.log('conn: ', conn)
        })
        return id;
      } catch (error) {
        throw new Error('error');
      }
    }
  }
  async onListening() {
    this.peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        console.log('data: ', data, conn.peer)
      })
      // console.log('conn: ', conn)
    });

  }
  async establishConnection(remotePeerId: string) {
    try {

      console.log(this.peer)
      let conn = this.peer.connect(remotePeerId, { label: localStorage.getItem('label')! })
      conn.on('open', function () {
        conn.send('Message from that');
      });
    } catch (error) {
      console.log(error);
    }

  }
  async establishMediaCall(remotePererId: string, localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) {

    
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    if (localVideo) {
      localVideo.muted = true;
      localVideo.srcObject = stream;
      localVideo.play();
      this.mediaStreaming = localVideo.srcObject
    }
    // make the call
    const call = this.peer.call(remotePererId, stream);
    this.call = call
    call.on("stream", (stream: MediaStream) => {
      remoteVideo.muted = true;
      remoteVideo.srcObject = stream;
      remoteVideo.play();
      
    });

    call.on("error", (err) => {
      console.log('error streaming', err);
    })
  }

  async establishMediaAnswer(call: MediaConnection, localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })


    call.answer(stream);
    this.call = call

    if (localVideo) {
      localVideo.muted = true
      localVideo.srcObject = stream;
      localVideo.play();
      this.mediaStreaming = localVideo.srcObject
    }


    

    call.on("stream", (remoteStream: MediaStream) => {
      console.log(remoteStream)
      remoteVideo.srcObject = remoteStream;
      remoteVideo.play();
    })

  }



  endCall() {
    if (this.call)
      this.call.close();
    if (this.mediaStreaming)
      this.mediaStreaming.getTracks().forEach((track) => {
        console.log(track)
        track.stop()
      })


  }
  addVideoStream(video: HTMLVideoElement, stream: any) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
  }
  send() {
    this.peer.on('connection', (conn: any) => {
      conn.on('data', (data: any) => {
        console.log(data, conn);
      });
      conn.on('open', () => {
        conn.send('hello!');
      });
    })
  }




}
