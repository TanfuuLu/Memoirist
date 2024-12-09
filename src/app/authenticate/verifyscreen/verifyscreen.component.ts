import { Component } from '@angular/core';
import { AuthService } from '../../Service/Auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { response } from 'express';
import { map } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verifyscreen',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './verifyscreen.component.html',
  styleUrl: './verifyscreen.component.scss'
})
export class VerifyscreenComponent {
  emailForm!: FormGroup;
  checkEmail!: boolean;
  constructor(private authService: AuthService, private route: Router){
    this.emailForm = new FormGroup({
      writerEmail: new FormControl(null, Validators.email)
    })
  }
  submitForm(){
    this.authService.forgetPassword(this.emailForm.get('writerEmail')?.value)
    .subscribe({
      next: (response) => {
        if(response === true){
          this.checkEmail= true;
          this.authService.checkEmail = this.emailForm.get('writerEmail')?.value
          this.route.navigate(['/forget-password']);
        }else{
          this.checkEmail= false;
          console.log(this.checkEmail);
        }
      },
      error: (error) => {
        console.error('Error:', error);
      }
    })
   
  }
}
