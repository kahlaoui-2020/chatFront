import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/login/service/auth.service';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit {

  code = new FormControl('', [Validators.required]);
  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<ErrorModalComponent>) { }

  ngOnInit(): void { }

  submit(): void {
    if (this.code.valid) {
      this.authService.activate(this.code.value);
      this.dialogRef.close();
    }


  }

}
