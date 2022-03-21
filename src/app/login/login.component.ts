import { Component, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../room/service/chat.service';
import { AuthService } from './service/auth.service';
import { PrimeNGConfig } from 'primeng/api';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  isChecked = true;
  loginForm!: FormGroup;
  signupForm!: FormGroup;

  display = true;
  constructor(
    private chatService: ChatService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.chatService.onDisconnect();
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern('')]],
      password: [null, [Validators.required]]
    });
    this.signupForm = this.formBuilder.group({
      firstname: [null, [Validators.required, Validators.pattern('')]],
      lastname: [null, [Validators.required, Validators.pattern('')]],
      signupEmail: [null, [Validators.required, Validators.pattern('')]],
      signupPassword: [null, [Validators.required]],
      signupSecondPassword: [null, [Validators.required]]
    })
  }

  login(): void {
    this.auth.login(this.loginForm.value);

  }
  signup(col2: HTMLDivElement, col1: HTMLElement): void {
      col2.classList.replace('column-2', 'column-1');
      col1.classList.replace('column-1', 'column-2');

      (col2.querySelector('.singUp')! as HTMLDivElement).style.display = 'none';
      (col2.querySelector('.singIn')! as HTMLElement).style.display = 'flex';
      col2.style.borderRadius = '0 25px 25px 0';

      this.display = false;


  }
  signin(col2: HTMLElement, col1: HTMLElement): void {
    col2.classList.replace('column-1', 'column-2');
    col1.classList.replace('column-2', 'column-1');
    col2.style.borderRadius = '';
    (col2.querySelector('.singUp')! as HTMLElement).style.display = 'flex';
    (col2.querySelector('.singIn')! as HTMLElement).style.display = 'none';

    this.display = true

 
  }

  createAccount(): void {

  }

  switch(theme: string, light: MatButton, dark: MatButton) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      dark._elementRef.nativeElement.style.display = 'none';
      light._elementRef.nativeElement.style.display = 'contents';
    }
    else {
      document.documentElement.setAttribute('data-theme', 'light');
      dark._elementRef.nativeElement.style.display = 'contents';
      light._elementRef.nativeElement.style.display = 'none';
    };

  }

  resetPasswd(): void {

  }

}
