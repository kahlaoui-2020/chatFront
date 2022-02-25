import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  
  loginForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null,[Validators.required, Validators.pattern('')]],
      password: [null, [Validators.required]]
    })
  }

  login(): void {
    this.auth.login(this.loginForm.value);

  }

}
