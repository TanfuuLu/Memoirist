import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { response } from "express";
import { resolve } from "path";
import { writer } from "repl";
import { BehaviorSubject, catchError, map, Observable, ObservableLike, of, tap, throwError } from "rxjs";
export interface Writer {
    writerFullname?: string;
    writerUsername?: string;
    account?: string; // email
    password?: string;
    writerGender?: string;
    writerBirthday?: string;
    writerPhone?: string;
    roles?: string;
    
  }
  export class ResetPasswordRequest {
    email!: string;
    code!: string;
    newPassword!: string;
  }
  
  export class VerifyCodeRequest {
    email!: string;
    code!: string;
  }
@Injectable({
    providedIn:'root',
})
export class AuthService {
   
    private apiBaseUrl = 'https://localhost:7055/api/YarpAuthen';
    private tokenKey = 'authToken';
    private userIdKey = 'userId';
    private currentUserObject = new BehaviorSubject<any>(null);
    currentUser$ = this.currentUserObject.asObservable();
    checkEmail!: string;
    constructor(private http: HttpClient ){
        
    }
    //login function 
    login(account: string, password: string): Observable<any>{
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          });
        return this.http.post<{token: string, user: any}>(`${this.apiBaseUrl}/login`,{account, password},{headers})
        .pipe(
            tap((response)=>{
                sessionStorage.setItem(this.tokenKey, response.token);
                sessionStorage.setItem(this.userIdKey, response.user);
                this.loadCurrentUser();
            }),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if(error.status == 400 && error.error == 'not found account'){
                    errorMessage = 'Không tìm thấy tài khoản';
                }else if(error.error == 'Wrong password'){
                    errorMessage = 'Sai mật khẩu';
                }
                return throwError(errorMessage);
            })
            
        );
    }
    register(writerRegister: Writer): Observable<any>{
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          });
        return this.http.post<Writer>(`${this.apiBaseUrl}/register`,writerRegister,{headers});
        
    }
    loadCurrentUser(): void{
        const token = sessionStorage.getItem(this.tokenKey);
        const userId = sessionStorage.getItem(this.userIdKey);
        if(token && userId){
            this.http.get<any>(`https://localhost:7055/api/Writer/profile/${userId}`)
            .subscribe({
                next: (user) => this.currentUserObject.next(user),
                error:() => this.logout(),
            });

        }else{
            this.currentUserObject.next(null);
        }
    }
    logout():void{
        sessionStorage.removeItem(this.userIdKey);
        sessionStorage.removeItem(this.tokenKey);
        this.currentUserObject.next(null);
    }
    isLogedIn(): boolean{
        return !!sessionStorage.getItem(this.tokenKey);
    }
    getUserId(): string | null{
        return sessionStorage.getItem(this.userIdKey);
    }
    forgetPassword(email: string): Observable<boolean>{
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          });
          const params = new HttpParams().set('writerEmail', email);
        return this.http.post(`${this.apiBaseUrl}/forgot-password`,null,{observe: 'response', headers, params}).pipe(
            map(() => {
                return true;
            }),
            catchError((error) => {
              return of(false);
            })
        );
    }
    verifyCode(request: VerifyCodeRequest): Observable<boolean>{
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          });
          return this.http.post(`${this.apiBaseUrl}/verify-code`, request, {headers}).pipe(
            map((response) => {
                return true;
            }),
            catchError((error) => {
                return of(false);
              })
          )
    }
    resetPassword(request: ResetPasswordRequest): Observable<boolean>{
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          });
          return this.http.post(`${this.apiBaseUrl}/reset-password`, request, {headers}).pipe(
            map((response) => {
                return true;
            }),
            catchError((error) => {
                return of(false);
              })
          )
    }
}