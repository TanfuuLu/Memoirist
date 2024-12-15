import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import path from "path";
import { Observable } from "rxjs";


export interface Comment {
  commentId: number;
  commentWriterId?: number;
  commentLike?: number;
  commentContext?: string;
  commentDateTime?: string;
  storyId: number;
}
export interface AddStoryComment {
  commentContext?: string;
}
@Injectable({ providedIn: 'root' })
export class CommentStoryService {
  private readonly storyApiUrl = 'https://localhost:7055/api/CommentStory';

  constructor(private http: HttpClient) {

  }
  addStoryComment(storyId: number, userAddId: number, comment: AddStoryComment): Observable<Comment> {
     const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              });
    return this.http.post<Comment>(`${this.storyApiUrl}/story-${storyId}/writer-${userAddId}-add-comment`, comment, {headers})
  }
  getListStoryComment(storyId: number): Observable<Comment[]>{
    return this.http.get<Comment[]>(`${this.storyApiUrl}/story-${storyId}/list-comment`);
  }
}