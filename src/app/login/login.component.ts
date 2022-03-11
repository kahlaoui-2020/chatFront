import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../room/service/chat.service';
import { AuthService } from './service/auth.service';
import { PrimeNGConfig } from 'primeng/api';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isChecked = true;
  loginForm!: FormGroup;
  constructor(
    private chatService: ChatService, 
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.chatService.onDisconnect();
    this.loginForm = this.formBuilder.group({
      email: [null,[Validators.required, Validators.pattern('')]],
      password: [null, [Validators.required]]
    })
  }

  login(): void {
    this.auth.login(this.loginForm.value);

  }
  switchTheme(event: MatSlideToggleChange) {
    if (event.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
  }
  else {
      document.documentElement.setAttribute('data-theme', 'light');
  } 
  }

}
