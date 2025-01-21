import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LinkService } from './linkservice';
import '@dotlottie/player-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Link Manager Pro';
  links: any[] = [];
  selectedLink: any = null;
  newLink = {
    title: '',
    url: '',
    tags: ''
  };
  newComment = '';
  searchTags = '';
  showDetails = false;

  constructor(private linkService: LinkService) {}

  ngOnInit() {
    this.loadLinks();
  }

  loadLinks(tags?: string) {
    this.linkService.getLinks(tags).subscribe(links => {
      this.links = links;
    });
  }

  addLink() {
    const linkData = {
      ...this.newLink,
      tags: this.newLink.tags.split(',').map(tag => tag.trim())
    };

    this.linkService.createLink(linkData).subscribe(link => {
      this.links.push(link);
      this.newLink = { title: '', url: '', tags: '' };
    });
  }

  showLinkDetails(linkId: string) {
    this.linkService.getLink(linkId).subscribe(link => {
      this.selectedLink = link;
      this.showDetails = true;
    });
  }

  vote(linkId: string, voteType: 'up' | 'down') {
    this.linkService.voteLink(linkId, voteType).subscribe(updatedLink => {
      if (this.selectedLink && this.selectedLink._id === linkId) {
        this.selectedLink = updatedLink;
      }
      this.loadLinks();
    });
  }

  addComment(linkId: string) {
    if (!this.newComment.trim()) return;

    this.linkService.addComment(linkId, this.newComment).subscribe(comment => {
      if (this.selectedLink) {
        this.selectedLink.comments.push(comment);
      }
      this.newComment = '';
    });
  }

  search() {
    this.loadLinks(this.searchTags);
  }

  backToHome() {
    this.showDetails = false;
    this.selectedLink = null;
    this.loadLinks();
  }
}
