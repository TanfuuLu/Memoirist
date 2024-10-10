import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from 'express';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink,RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  constructor(){
    this.loginForm = new FormGroup({
      Email: new FormControl(null,Validators.required),
      Password: new FormControl(null,Validators.required)
    })
  }
  submitForm(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value);
    }
  }
}
