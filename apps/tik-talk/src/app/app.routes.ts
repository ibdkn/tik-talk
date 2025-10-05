import {Routes} from '@angular/router';
import {canActivateAuth, LoginPageComponent} from '@tt/auth';
import {
  CommunityEffects,
  communityFeature, PostEffects, postFeature,
  ProfileEffects,
  profileFeature
} from '@tt/data-access';
import {
  ProfilePageComponent,
  ProfileSearchPageComponent,
  SettingsPageComponent
} from '@tt/profile';
import {LayoutComponent} from '@tt/layout';
import {provideState} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import { CommunitySearchPageComponent } from '@tt/community';
import { chatsRoutes } from '@tt/chats';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', redirectTo: 'profile/me', pathMatch: 'full'},
      {
        path: 'profile/:id', component: ProfilePageComponent,
        providers: [
          provideState(postFeature),
          provideEffects(PostEffects)
        ]
      },
      {path: 'settings', component: SettingsPageComponent},
      {
        path: 'search',
        component: ProfileSearchPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]
      },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
      {
        path: 'community',
        component: CommunitySearchPageComponent,
        providers: [
          provideState(communityFeature),
          provideEffects(CommunityEffects)
        ]
      },
    ],
    canActivate: [canActivateAuth],
  },
  {path: 'login', component: LoginPageComponent},
];
