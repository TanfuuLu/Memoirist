import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { response } from "express";
import { BehaviorSubject, catchError, Observable, ObservableLike, tap, throwError } from "rxjs";
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
@Injectable({
    providedIn:'root',
})
export class AuthService {
   
    private apiBaseUrl = 'https://localhost:7055/api/YarpAuthen';
    private tokenKey = 'authToken';
    private userIdKey = 'userId';
    private currentUserObject = new BehaviorSubject<any>(null);
    currentUser$ = this.currentUserObject.asObservable();
    constructor(private http: HttpClient){

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
}