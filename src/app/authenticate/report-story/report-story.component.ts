import { Component, OnInit } from '@angular/core';
import { Story, StoryReport, StoryService } from '../../Service/Story.service';
import { report } from 'process';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Service/Auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-report-story',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './report-story.component.html',
  styleUrl: './report-story.component.scss'
})
export class ReportStoryComponent implements OnInit {
  listReported!: StoryReport[];
  userRole!: string | null;
  constructor(private storyService: StoryService, private authService: AuthService){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.storyService.getListReported()
    .subscribe({
      next:(result) => {
        this.listReported = result;
        console.log(this.listReported);
      }
    })
    this.userRole = this.authService.getRoleFromToken();
  }
  acceptReportButton(reportId: number){
    this.storyService.acceptReport(reportId)
    .subscribe({
      next: (result) => {
        this.listReported = result;
      }
    });
  }
  rejectReportButton(reportId: number){
    this.storyService.rejectReport(reportId)
    .subscribe({
      next:(result) => {
        this.listReported = result;
      }
    })
  }

}
