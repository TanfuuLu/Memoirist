import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, ResetPasswordRequest, VerifyCodeRequest } from '../../Service/Auth.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink,RouterLinkActive, CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent implements OnInit {
  checkEmailRequest!: string ;
  requestModel!: VerifyCodeRequest;
  requestForm!: FormGroup;
  requestResetPasswordModel!: ResetPasswordRequest;
  constructor(private authService: AuthService, private route: Router){
    this.checkEmailRequest = this.authService.checkEmail;
    this.requestModel = new VerifyCodeRequest;
    this.requestResetPasswordModel = new ResetPasswordRequest;
    this.requestForm = new FormGroup({
      email: new FormControl(this.checkEmailRequest, [Validators.required]),
      code: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required])
    })
  }
  ngOnInit(): void {
  }
  submitForm(){ 
    if(this.requestForm.valid){
      this.requestModel.code = this.requestForm.get('code')?.value;
      this.requestModel.email = this.requestForm.get('email')?.value;
      this.requestResetPasswordModel = this.requestForm.value;

    }
    console.log(this.requestModel);
    console.log(this.requestResetPasswordModel);
    this.authService.verifyCode(this.requestModel)
    .subscribe({
      next:(result) =>{ 
        if(result === true){
          this.authService.resetPassword(this.requestResetPasswordModel)
          .subscribe({
            next:(result) =>{
              console.log(result);
              this.route.navigate(['/login']);
            }
          })
        }
      }
    })
  }

}
