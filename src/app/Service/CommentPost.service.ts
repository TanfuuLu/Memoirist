import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Comment {
    commentPostId: number;
    commentContext?: string | null;
    commentWriterId: number | null;
    commentWriterAvatar?: string | null;
    commentWriterName?: string | null;
    commentDate?: string | null;
    commentLike?: number | null;
    postId: number;
  }
  export interface AddCommentPost {
    commentContext?: string | null;
    commentWriterId: number;
    commentWriterAvatar?: string | null;
    commentWriterName?: string | null;
    postId: number;
  }
  
@Injectable({providedIn: 'root'})
export class CommentPostService{
    commentApiUrl = 'https://localhost:7055/api/Post';
    constructor(private http: HttpClient){

    }
    addComment(addComment?: AddCommentPost): Observable<Comment>{
        const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                  });
        return this.http.post<Comment>(`${this.commentApiUrl}/add-comment`, addComment, {headers});
    }
    getListCommentOfPost(postId: number): Observable<Comment[]>{
        return this.http.get<Comment[]>(`${this.commentApiUrl}/post-${postId}/get-list-comment`);
    }
    deleteComment(commentId: number): Observable<Comment>{
      return this.http.delete<Comment>(`${this.commentApiUrl}/delete-comment-${commentId}`);
    }

}