import {Routes} from '@angular/router';
import {chatsRoutes} from '../../../../libs/chats/src/lib/feature-chats-workspace/chats-page/chatsRoutes';
import {canActivateAuth, LoginPageComponent} from '@tt/auth';
import {
  ProfileEffects,
  profileFeature,
  ProfilePageComponent,
  SearchPageComponent,
  SettingsPageComponent
} from '@tt/profile';
import {LayoutComponent} from '@tt/layout';
import {provideState} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {postFeature} from '../../../../libs/posts/src/lib/data/store/reducer';
import {PostEffects} from '../../../../libs/posts/src/lib/data/store/effects';

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
        component: SearchPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]
      },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
    ],
    canActivate: [canActivateAuth],
  },
  {path: 'login', component: LoginPageComponent},
];
