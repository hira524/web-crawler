import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

// Define the interface for Article
interface Article {
  title: string;
  description: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [NgIf, NgForOf],
})
export class AppComponent implements OnInit {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  error: string | null = null;
  viewMode: 'title' | 'description' | 'all' = 'title';

  constructor(private http: HttpClient) {} // This is used in loadArticles()

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
      error: (err: unknown) => {
        if (err instanceof HttpErrorResponse) {
          console.error('Error status:', err.status);
          console.error('Error message:', err.message);
          this.error = 'Failed to load articles. Please try again later.';
        } else {
          console.error('An unknown error occurred:', err);
          this.error = 'An unexpected error occurred. Please try again later.';
        }
      },
    });
  }

  changeView(mode: 'title' | 'description' | 'all'): void {
    this.viewMode = mode;

    if (mode === 'title') {
      this.filteredArticles = this.articles.map((article) => ({
        title: article.title,
        description: '',
      }));
    } else if (mode === 'description') {
      this.filteredArticles = this.articles.map((article) => ({
        title: '',
        description: article.description,
      }));
    } else {
      this.filteredArticles = [...this.articles];
    }
  }
}
