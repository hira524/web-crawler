import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

interface Article {
  title: string;
  description: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    NgIf,
    NgForOf
  ]
})
export class AppComponent implements OnInit {
  articles: Article[] = []; // All articles fetched from the server
  filteredArticles: Article[] = []; // Articles to display based on view mode
  error: string | null = null; // To store error messages
  viewMode: 'title' | 'description' | 'all' = 'title'; // Current display mode
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.loadArticles();
  }

loadArticles(): void {
  this.http.get<Article[]>('http://localhost:3000/fetch-bbc').subscribe({
    next: (data: Article[]) => {
      this.articles = data;
      this.filteredArticles = data;
      this.error = null;
    },
    error: (err: HttpErrorResponse) => {
      console.error('Error status:', err.status); // Log the HTTP status code
      console.error('Error message:', err.message); // Log the error message
      this.error = 'Failed to load articles. Please try again later.';
    },
  });
}

// Change the view mode
  changeView(mode: 'title' | 'description' | 'all'): void {
    this.viewMode = mode;
    this.filteredArticles = this.articles; // Refresh articles when view changes
  }
}
