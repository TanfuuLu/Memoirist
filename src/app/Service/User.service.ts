import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { Writer } from "./Auth.service";
export interface UserProfile{
writerId: number;
  writerFullname?: string;
  writerUsername?: string;
  writerAvatar?: string;
  account?: string; // email
  password?: string;
  writerBio?: string;
  writerGender?: string;
  writerBirthday?: string;
  writerPhone?: string;
  writerEmail?: string;

  // Post
  listPostId?: number[];
  listLikesPost?: number[];
  listPostCommented?: number[];

  // Story
  listFollowingStoryId?: number[];
  listStoryId?: number[];
  listStoryCommented?: number[];

  // User
  listFollower?: number[];
  listFollowing?: number[];
}
@Injectable({providedIn:'root'})
export class UserService{
    private readonly apiUrl = 'https://localhost:7055/api/Writer';
    constructor(private http: HttpClient){}
    getUserProfile(userId: Number): Observable<UserProfile>{
        return this.http.get<UserProfile>(`${this.apiUrl}/profile/${userId}`)
        
    }
    followUser(userLoginId: Number, userId: Number){
      return this.http.get<UserProfile>(`${this.apiUrl}/follow-writer-${userLoginId}/${userId}`);
    }
    searchUser(userName: string): Observable<UserProfile[]>{
      const params = new URLSearchParams();
        params.set('writerName', userName);
      return this.http.get<UserProfile[]>(`${this.apiUrl}/search-writer?${params.toString()}`);
    }
    followStory(userId: number, storyId: number): Observable<UserProfile>{
      return this.http.get<UserProfile>(`${this.apiUrl}/writer-${userId}/follow-story-${storyId}`)
    }
}