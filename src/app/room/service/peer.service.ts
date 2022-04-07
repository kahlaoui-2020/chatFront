import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
declare var Peer: any;

@Injectable({
  providedIn: 'root'
})
export class PeerService {

  public peer!: any;
  private call: any;
  private mediaCall!: any;

  mediaStreamingSender!: MediaStream;
  mediaStreamingReciever!: MediaStream;
  constructor(private dialog: MatDialog) { }

  initPeer(id: string): any {

    if (!this.peer || this.peer.disconnected) {

      try {
        this.peer = new Peer(id, {
          host: 'localhost',
          port: 9000,
          key: 'peer'
        });


        //  localStorage.setItem("label", this.peer);

        this.peer.on('open', (id: string) => {
          console.log('My peer ID is: ' + id)
        })
        this.peer.on('connection', (conn: any) => {
          conn.on('data', (data: any) => {
            console.log(data, conn);
          });
        })
        return id;
      } catch (error) {
        throw new Error('error');
      }
    }
  }

  async establishConnection(remotePeerId: string) {
    try {

      let conn = this.peer.connect(remotePeerId)
      conn.on('open', function () {
        console.log('conn: ', conn)
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
      this.mediaStreamingSender = localVideo.srcObject
    }
    // make the call
    const call = this.peer.call(remotePererId, stream);
    this.call = call
    call.on('stream', async (stream: MediaStream) => {
      remoteVideo.muted = true;
      remoteVideo.srcObject = stream;
      remoteVideo.play().then(() => {})
    });

    call.on("error", (err: any) => {
      console.log('error streaming', err);
    })
  }

  async establishMediaAnswer(call: any, localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) {




    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideo) {
          localVideo.muted = true;
          localVideo.srcObject = stream;
          localVideo.play();
          this.mediaStreamingSender = localVideo.srcObject;
        }
        call.answer(stream);
        call.on('stream', async (stream: MediaStream) => {
          remoteVideo.muted = true;
          remoteVideo.srcObject = stream;
          this.mediaStreamingReciever = remoteVideo.srcObject;
           remoteVideo.play().then(() => {});
        });
        call.on("error", (err: any) => {
          console.log('error streaming', err);
        })

        call.on("close", () => {
          console.log('Media streaming was closed, call')
        })
        this.peer.on("close", () => {
          console.log('Media streaming was closed, peer')

        })
      })

  }


 
  endCall() {
    if (this.call)
      this.call.close();
    if (this.mediaStreamingSender)
      this.mediaStreamingSender.getTracks().forEach((track) => {
        track.stop()
      })
    if (this.mediaStreamingReciever)
      this.mediaStreamingReciever.getTracks().forEach((track) => {
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
