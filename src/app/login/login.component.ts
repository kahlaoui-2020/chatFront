import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ChatService } from '../room/service/chat.service';
import { AuthService } from './service/auth.service';
import { PrimeNGConfig } from 'primeng/api';
import { MatButton } from '@angular/material/button';
import { MatStepper } from '@angular/material/stepper';
import { ErrorStateMatcher } from '@angular/material/core';

export function checkPasswords(control: AbstractControl) {
  const password = control.get('password')!.value;
  const confirmPassword = control.get('confirmPassword')!.value;

  if (password !== confirmPassword) control.get('confirmPassword')?.setErrors({ notSame: true })


}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  isChecked = true;
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  code = new FormControl('');


  @ViewChild('stepper') stepper!: MatStepper;

  display = true;
  matcher: ErrorStateMatcher = new ErrorStateMatcher()
  display_text = true;


  constructor(
    private chatService: ChatService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.chatService.onDisconnect();
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
    this.signupForm = this.formBuilder.group({
      firstName: [null, [Validators.required, Validators.pattern('')]],
      lastName: [null, [Validators.required, Validators.pattern('')]],
      email: [null, [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['']
    },
      {
        validator: checkPasswords
      })
  }

  login(): void {
    this.auth.login(this.loginForm.value);

  }
  signup(col2: HTMLDivElement, col1: HTMLElement): void {
    col2.style.right = '50%';
    col1.style.left = '50%';
    col2.style.borderRadius = '0 25px 25px 0';
    const text = col2.querySelector('#p1');
    const letters = text!.textContent!.split('');
    console.log(letters);
  
    this.display_text = false;
     setTimeout(() => {
      this.display = false;
     }, 1000);
  
  }
  signin(col2: HTMLElement, col1: HTMLElement): void {
    col2.style.right = '0';
    col1.style.left = '0';
    col2.style.borderRadius = '';
  
    this.display_text = true;
    setTimeout(() => {
      this.display = true;
     }, 1000);


  }
  createAccount(): void {

    this.auth.create(this.signupForm.value).subscribe({
      next: async (value) => {
        if (value) this.stepper.next()
      }, error: (err) => {
        throw err

      }
    })
  }
  confirm(): void {

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

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {

    const invalidCtrl = !!(control && control.invalid && control.parent?.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    console.log(invalidCtrl, invalidParent)
    return invalidCtrl;
  }

}
function slowAlert(slowAlert: any, arg1: number) {
  throw new Error('Function not implemented.');
}

