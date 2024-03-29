import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerService } from 'src/app/room/service/peer.service';

@Component({
  selector: 'app-video-room',
  templateUrl: './video-room.component.html',
  styleUrls: ['./video-room.component.scss']
})
export class VideoRoomComponent implements OnInit, AfterViewInit {

  @ViewChild('localVideo') localVideo!: ElementRef;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;
  id: string;
  answer: boolean = false;
  call: any;
  constructor(
    private peerService: PeerService,
    private dialogRef: MatDialogRef<VideoRoomComponent>,
    @Inject(MAT_DIALOG_DATA) private data: VideoRoomComponent) { 
      this.id = this.data.id;
      
      if(data.answer) {
        this.answer = this.data.answer;
        this.call = this.data.call;
      }

      console.log('id: '+ this.id + ' answer: ' + this.answer + ' call: ' + this.call);
      console.log(this.call)
      console.log(typeof this.answer)
    }
  ngAfterViewInit(): void {

    if(this.answer) {
      console.log("%c New  call has been recieved", 'color: blue')
      this.peerService.establishMediaAnswer(this.call, this.localVideo.nativeElement, this.remoteVideo.nativeElement)
    }else {
      console.log("%c Start new call", 'color: red')
      this.peerService.establishMediaCall(this.id, this.localVideo.nativeElement, this.remoteVideo.nativeElement)
    }
  }

  ngOnInit(): void {
  
  }


  endCall() {
    this.peerService.endCall();
    this.dialogRef.close();
  }

}
