import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {PostInputComponent} from '../post-input/post-input.component';
import {PostComponent} from '../post/post.component';
import {PostService} from '../../../data/services/post.service';
import {Post} from '../../../data/interfaces/post.interface';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-post-feed',
  imports: [
    PostInputComponent,
    PostComponent
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements AfterViewInit {
  postService: PostService = inject(PostService);
  r2: Renderer2 = inject(Renderer2);
  feed: WritableSignal<Post[]> = this.postService.posts;

  @ViewChild('feedWrapper', { static: true, read: ElementRef<HTMLDivElement> })
  feedWrapperRef!: ElementRef<HTMLDivElement>;

  @HostListener('window:resize')
  onWindowResize(): void {
    this.resizeFeed();
  }

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }

  ngAfterViewInit(): void {
    this.resizeFeed();
  }

  resizeFeed(): void {
    const {top} = this.feedWrapperRef.nativeElement.getBoundingClientRect();
    const height: number = window.innerHeight - top - 24;
    this.r2.setStyle(this.feedWrapperRef.nativeElement, 'height', `${height}px`);
  }
}
