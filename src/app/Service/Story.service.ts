import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";



export interface Story {
  storyId?: number | null;                // Nullable int
  writerStoryId?: number | null;          // Nullable int
  storyName?: string | null;              // Nullable string
  storyIntroduction?: string | null;     // Nullable string
  storyAuthor?: string | null;            // Nullable string
  storyLikes?: number | null;             // Nullable int
  storyPicture?: string | null;           // Nullable string
  storyDateWrited?: string | null;        // Nullable string
  termsAndConditionsCheck: boolean;       // Non-nullable boolean
}
export interface StoryReponse{
    
        storyName?: string | null;            // Nullable string
        storyIntroduction?: string | null;   // Nullable string
        storyAuthor?: string | null;          // Nullable string
        storyLikes?: number | null;           // Nullable string
        storyPicture?: string | null;         // Nullable string
        storyDateWrited?: string | null;      // Nullable string
      
}
@Injectable({providedIn:'root'})
export class StoryService {
    private readonly storyApiUrl = 'https://localhost:7055/api/Story';
    story?: Story;
    constructor(private http: HttpClient, private route: ActivatedRoute){

    }
    getListStoryWriter(userId: number): Observable<StoryReponse[]>{
        return this.http.get<StoryReponse[]>(`${this.storyApiUrl}/writer-${userId}/get-list-story-of-writer`);
    }
    getStoryById(storyId:number): Observable<Story>{
        return this.http.get<Story>(`${this.storyApiUrl}/get-story-${storyId}`);
    }
}