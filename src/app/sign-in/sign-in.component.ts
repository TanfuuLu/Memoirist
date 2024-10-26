import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLinkActive,RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  loginForm!: FormGroup;
  constructor(){
    this.loginForm = new FormGroup({
      Email: new FormControl(null, [Validators.required]),
      Username: new FormControl(null, [Validators.required]),
      Password: new FormControl(null, [Validators.required]),
      ConfirmPassword: new FormControl(null,[Validators.required]),
      PhoneNumber: new FormControl(null,[Validators.required, Validators.pattern("^[0-9]*$")]),
      FirstName: new FormControl(null, [Validators.required]),
      LastName: new FormControl(null,[Validators.required])
    })
  }

  submitForm(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value);
    }
  }
}
