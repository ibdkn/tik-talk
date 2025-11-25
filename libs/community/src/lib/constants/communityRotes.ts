import { Routes } from '@angular/router';
import { CommunitySearchPageComponent } from '../feature-community-list/community-search-page/community-search-page.component';
import { provideState } from '@ngrx/store';
import {
  CommunityEffects,
  communityFeature,
  PostEffects,
  postFeature,
} from '@tt/data-access';
import { provideEffects } from '@ngrx/effects';
import { CommunityPageComponent } from '../feature-community-page/community-page/community-page.component';

export const communityRotes: Routes = [
  {
    path: '',
    component: CommunitySearchPageComponent,
    providers: [
      provideState(communityFeature),
      provideEffects(CommunityEffects),
      provideState(postFeature),
      provideEffects(PostEffects),
    ],
    children: [],
  },
  {
    path: ':id',
    component: CommunityPageComponent,
  },
];
