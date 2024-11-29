import { Component, CSP_NONCE } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, Writer } from '../../Service/Auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLinkActive,RouterLink, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  registerForm!: FormGroup;
  confirmPassword!: FormControl;
  passwordMismatch: boolean = false;
  constructor(private authService: AuthService, private router: Router){
    this.registerForm = new FormGroup({
      account: new FormControl(null, [Validators.required]),
      writerFullname: new FormControl(null,[Validators.required]),
      writerUsername: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      writerPhone: new FormControl(null,[Validators.required, Validators.pattern("^[0-9]*$")]),
      writerGender: new FormControl(null,[Validators.required]),
      writerBirthday: new FormControl(null,[Validators.required]),
      
    // writerFullname?: string;
    // writerUsername?: string;
    // account?: string; // email
    // password?: string;
    // writerGender?: string;
    // writerBirthday?: string;
    // writerPhone?: string;
    })
    this.confirmPassword = new FormControl(null,[Validators.required])
    //check password
    this.registerForm.get('password')?.valueChanges.subscribe(() => this.checkPasswordMatch());
    this.confirmPassword?.valueChanges.subscribe(() => this.checkPasswordMatch());
  }

  submitForm(){
    if(this.registerForm.valid){
      let writerRegister: Writer = this.registerForm.value;
      writerRegister.roles = "User";
      console.log(writerRegister);
      this.authService.register(writerRegister)
      .subscribe({
        next:() => {
          console.log(writerRegister);
          this.router.navigate(["/login"]);
        }
      })
    }
  }
  checkPasswordMatch(){
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.confirmPassword?.value;
    this.passwordMismatch = password !== confirmPassword;
  }
  

}
