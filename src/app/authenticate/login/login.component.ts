import { Component,  OnInit,  } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Service/Auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginResult: boolean = true;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      account: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    })

  }
  ngOnInit(): void {
  
   
  }
  
  
  submitForm(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
    const { account, password } = this.loginForm.value;
    this.authService.login(account, password).subscribe({
      next: () => {
        const userId = this.authService.getUserId();
        this.authService.loadCurrentUser();
        if (userId) {
          this.router.navigate(['/profile', userId]); // Điều hướng đến trang profile với userId
        }
      },
      error: (err) => {
        this.loginResult = false;
        this.errorMessage = err;
        console.log('Loi dang nhap', this.errorMessage);
      }
    })
  }



}
