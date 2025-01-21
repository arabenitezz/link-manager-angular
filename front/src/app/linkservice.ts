import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Link {
  _id?: string;
  title: string;
  url: string;
  tags: string[];
  votes: number;
  comments: Comment[];
}

interface Comment {
  _id?: string;
  text: string;
  link: string;
}

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  private apiUrl = 'https://link-manager-backend-production.up.railway.app/api';

  constructor(private http: HttpClient) {}

  // Obtener todos los enlaces
  getLinks(tags?: string): Observable<Link[]> {
    const url = tags ? `${this.apiUrl}/links?tags=${tags}` : `${this.apiUrl}/links`;
    return this.http.get<Link[]>(url);
  }

  // Obtener un enlace específico
  getLink(id: string): Observable<Link> {
    return this.http.get<Link>(`${this.apiUrl}/links/${id}`);
  }

  // Crear nuevo enlace
  createLink(link: Partial<Link>): Observable<Link> {
    return this.http.post<Link>(`${this.apiUrl}/links`, link);
  }

  // Votar un enlace
  voteLink(id: string, voteType: 'up' | 'down'): Observable<Link> {
    return this.http.patch<Link>(`${this.apiUrl}/links/${id}/vote`, { voteType });
  }

  // Añadir comentario
  addComment(linkId: string, text: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/comments`, { text, linkId });
  }
}