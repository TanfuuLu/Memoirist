import { Component, OnInit } from '@angular/core';
import { Story, StoryReport, StoryService } from '../../Service/Story.service';
import { report } from 'process';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-story',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-story.component.html',
  styleUrl: './report-story.component.scss'
})
export class ReportStoryComponent implements OnInit {
  listReported!: StoryReport[];
  constructor(private storyService: StoryService){

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
