import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { Story } from "./Story.service";

export interface Chapter{
  chapterId: number;
  storyId: number;
  chapterTitle?: string;
  chapterContext?: string;
  chapterNumber?: number;
  chapterDateTime?: string;
}
@Injectable({providedIn:'root'})
export class ChapterService{
    private readonly chapterApi = 'https://localhost:7055/api/Chapter';
    constructor(private http: HttpClient, private router: ActivatedRoute ){

    }
    getListChapterOfStory(storyId: Number): Observable<Chapter[]>{
      return this.http.get<Chapter[]>(`${this.chapterApi}/story-${storyId}/get-all-chapter`);
    }
    getChapter(chapterId: Number, storyId: Number): Observable<Chapter>{
      return this.http.get<Chapter>(`${this.chapterApi}/story-${storyId}/chapter-${chapterId}`);
    }
    addChapter(storyId: Number, chapter: Chapter): Observable<Chapter> {
      const headers =  new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      });
      return this.http.post<Chapter>(`${this.chapterApi}/story-${storyId}/add-chapter`, chapter,{headers});
    }
    deleteChapter(chapterId:Number){
      return this.http.delete(`${this.chapterApi}/delete-chapter/${chapterId}`);
    }
    loadWordFile(filWord: File) :Observable<any>{
        const formData = new FormData();
        formData.append('file', filWord, filWord.name);
        return this.http.post<any>(`${this.chapterApi}/read-word`, formData);
    }
    getLastChapter(storyId?: number | null): Observable<number>{
      return this.http.get<number>(`${this.chapterApi}/get-last-${storyId}`);
    } 
   
    getLastChapterId(storyId?: number | null): Observable<number>{
      return this.http.get<number>(`${this.chapterApi}/get-last-chapter-${storyId}`);
    } 
   
}