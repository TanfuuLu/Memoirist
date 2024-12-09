import { Injectable } from "@angular/core";
import path from "path";


export interface Comment {
    commentId: number;
    commentWriterId?: number;
    commentLike?: number;
    commentContext?: string;
    commentDateTime?: string;
    storyId: number;
  }
@Injectable({providedIn:'root'})
export class CommentStoryService{
    
}