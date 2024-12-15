import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { writer } from "node:repl";
import { Observable, ObservableLike } from "rxjs";
export interface Post{
  postId: number;
  postWriterId?: number | null;
  postWriterAvatar?: string | null;
  postWriterName?: string | null;
  postDateTime?: string | null;
  postContext?: string | null;
  postLike?: number | null;
  listWriterLikePost?: number[] | null;
  postPictureUrl?: string[] | null;
}
export interface AddPost {
    postWriterId?: number | null;
    postWriterAvatar?: string | null;
    postWriterName?: string | null;
    postContext?: string | null;
    postPictureUrl?: string[] | null;
}

@Injectable({providedIn: 'root'})
export class PostService{
    private readonly postApiUrl = 'https://localhost:7055/api/Post';
    constructor(private http: HttpClient){
    }
    getListByWriterId(writerId: number): Observable<Post[]>{
        return this.http.get<Post[]>(`${this.postApiUrl}/get-list-by-writer-${writerId}`)
    }
    getListPost(): Observable<Post[]>{
        return this.http.get<Post[]>(`${this.postApiUrl}/get-all-post`);
    }
    getPost(postId: number): Observable<Post>{
      return this.http.get<Post>(`${this.postApiUrl}/get-post-${postId}`)
    }
    addPost(post: AddPost){
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          });
        return this.http.post<Post>(`${this.postApiUrl}/add-post`,post, {headers});
    }
    uploadImages(files: File[]): Observable<string[]> {
        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        return this.http.post<string[]>(`${this.postApiUrl}/upload`, formData);
      }
    likePost(writerId: number, postId: number): Observable<any> {
        const params = { writerId: writerId.toString(), postId: postId.toString() };
        return this.http.put(`${this.postApiUrl}/like-post`,  null, { params });
      }
      
}
