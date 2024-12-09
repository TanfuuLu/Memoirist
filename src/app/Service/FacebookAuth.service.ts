import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { rejects } from "assert";
import { Observable } from "rxjs";
declare var FB: any;
@Injectable({
    providedIn: 'root',
})
export class FacebookAuth {
    private apiBaseUrl = 'https://localhost:7055/api/YarpAuthen';
    constructor(private http: HttpClient) {

    }
    initFacebookSDK(): void {
        FB.init({
            appId: '1242008427083667',
            cookie: true,
            xfbml: true,
            version: 'v15.0'
        })
    }
    loginWithFacebook(): Promise<string>{
        return new Promise((resolve, reject) => {
            FB.login((response: any) => {
                if(response.status === 'connected'){
                    resolve(response.authResponse.accessToken);
                }else{
                    reject('Facebook login failed');
                }
            },{scope: 'email,public_profile'});
        });
    }
    sendAccessTokenToAPI(accessToken: string): Observable<any>{
        return this.http.post(`${this.apiBaseUrl}/login-facebook`, {accessToken});
    }

}