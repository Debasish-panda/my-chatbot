import { Component, signal, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  loading?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class AppComponent {
  title = 'my-chatbot';

  messages = signal<Message[]>([]);
  isLoading = signal(false);
  userInput = '';
  
  @ViewChild('msgContainer') msgContainer!: ElementRef;

    constructor(private http: HttpClient) {}

  send() {
    if (!this.userInput.trim() || this.isLoading()) return;

    // Add user message
    this.messages.update(msgs => [...msgs, 
      { role: 'user', content: this.userInput },
      { role: 'assistant', content: '', loading: true }
    ]);

    this.http.post<any>('/api/chat', {
      messages: this.messages().filter(m => !m.loading),
      model: 'gpt-4o-mini' // swap to 'claude-3-5-sonnet' anytime
    }).subscribe({
      next: (res) => {
        this.messages.update(msgs => {
          const updated = [...msgs];
          updated[updated.length - 1] = { role: 'assistant', content: res.message };
          return updated;
        });
        this.isLoading.set(false);
        this.userInput = '';
      },
      error: () => this.isLoading.set(false)
    });

    this.isLoading.set(true);
  }
}
