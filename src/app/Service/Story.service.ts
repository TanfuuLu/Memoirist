import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, ObservableLike } from "rxjs";
import { Chapter } from "./Chapter.service";
import { UserProfile } from "./User.service";



export interface Story {
  storyId?: number | null;                // Nullable int
  writerStoryId?: number | null;          // Nullable int
  storyName?: string | null;              // Nullable string
  storyIntroduction?: string | null;     // Nullable string
  storyAuthor?: string | null;            // Nullable string
  storyLikes?: number | null;             // Nullable int
  storyPicture?: string | null;           // Nullable string
  storyDateWrited?: string | null;        // Nullable string
  termsAndConditionsCheck: boolean;     // Non-nullable boolean
}
export interface StoryReponse{
    storyId?: number | null;      
        storyName?: string | null;            // Nullable string
        storyIntroduction?: string | null;   // Nullable string
        storyAuthor?: string | null;          // Nullable string
        storyLikes?: number | null;           // Nullable string
        storyPicture?: string | null;         // Nullable string
        storyDateWrited?: string | null;      // Nullable string   
}
export interface AddStory{
    writerStoryId?: Number | null; // lay tu user 
    storyName?: String | null;
    storyIntroduction?: String | null;
    storyAuthor?: String | null;
    storyPicture?: String | null;
    storyDateWrited?: String |null;
    termsAndConditionsCheck?: boolean;
// public int? WriterStoryId { get; set; }
// public string? StoryName { get; set; }
// public string? StoryIntroduction { get; set; }
// public string? StoryAuthor { get; set; }
// public string? StoryPicture { get; set; }
// public string? StoryDateWrited { get; set; }
// public bool TermsAndConditionsCheck { get; set; }

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
    addStory(story: AddStory): Observable<Story>{
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          });
        return this.http.post<Story>(`${this.storyApiUrl}/add-story`,story,{headers} );
    }
    searchStory(storyName: string): Observable<Story[]>{
            const params = new URLSearchParams();
            params.set('storyName', storyName);
        return this.http.get<Story[]>(`${this.storyApiUrl}/search-story-name?${params.toString()}`);
    }
    getListFollowingByWriter(followingStoryId: number[]): Observable<Story[]>{
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          });
        return this.http.post<Story[]>(`${this.storyApiUrl}/get-list-following-of-writer`,  followingStoryId, { headers });
    }
   
   
}