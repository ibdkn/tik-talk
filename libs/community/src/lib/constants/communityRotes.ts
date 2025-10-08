import { Routes } from '@angular/router';
import { CommunitySearchPageComponent } from '../feature-community-list/community-search-page/community-search-page.component';
import { provideState } from '@ngrx/store';
import { CommunityEffects, communityFeature } from '@tt/data-access';
import { provideEffects } from '@ngrx/effects';

export const communityRotes: Routes = [
  {
    path: '',
    component: CommunitySearchPageComponent,
    providers: [
      provideState(communityFeature),
      provideEffects(CommunityEffects),
    ],
    children: [],
  },
];
