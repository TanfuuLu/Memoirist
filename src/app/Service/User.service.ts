import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { Writer } from "./Auth.service";
export interface UserProfile {
  writerId: number;
  writerFullname?: string | null;
  writerUsername?: string | null;
  writerAvatar?: string | null;
  account?: string; // email
  password?: string;
  writerBio?: string | null;
  writerGender?: string | null;
  writerBirthday?: string | null;
  writerPhone?: string | null;
  writerEmail?: string | null;

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
export interface FollowUserProfile {
  writerId: number;
  writerFullname?: string | null;
  writerUsername?: string | null;
  writerAvatar?: string | null;
}

export interface UpdateUserProfile {
  writerFullname?: string | null;
  writerUsername?: string | null;
  writerBio?: string | null;
  writerAvatar?: string | null;
}
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = 'https://localhost:7055/api/Writer';
  constructor(private http: HttpClient) { }
  getUserProfile(userId: Number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile/${userId}`)

  }
  followUser(userLoginId: Number, userId: Number) {
    return this.http.get<UserProfile>(`${this.apiUrl}/follow-writer-${userLoginId}/${userId}`);
  }
  searchUser(userName: string): Observable<UserProfile[]> {
    const params = new URLSearchParams();
    params.set('writerName', userName);
    return this.http.get<UserProfile[]>(`${this.apiUrl}/search-writer?${params.toString()}`);
  }
  followStory(userId: number, storyId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/writer-${userId}/follow-story-${storyId}`)
  }
  uploadImages(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);  // Chỉ append một file thay vì một mảng
    return this.http.post<string>(`${this.apiUrl}/upload`, formData,{responseType: 'text' as 'json' });
  }
  updateProfile(userId: number, updateUser: UpdateUserProfile  ): Observable<UserProfile>{
     const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            });
    return this.http.put<UserProfile>(`${this.apiUrl}/writer-update-${userId}`, updateUser, {headers});
  }
  getFollowerUser(idUser: number): Observable<FollowUserProfile[]>{
    return this.http.get<FollowUserProfile[]>(`${this.apiUrl}/writer-${idUser}/get-list-follower`);
  }
  getFollowingUser(idUser: number): Observable<FollowUserProfile[]>{
    return this.http.get<FollowUserProfile[]>(`${this.apiUrl}/writer-${idUser}/get-list-following`);
  }
}