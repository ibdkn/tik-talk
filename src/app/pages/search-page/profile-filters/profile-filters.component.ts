import {Component, inject} from '@angular/core';
import {AvatarUploadComponent} from "../../settings-page/avatar-upload/avatar-upload.component";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {ProfileService} from '../../../data/services/profile.service';
import {debounceTime, startWith, switchMap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile-filters',
    imports: [
        FormsModule,
        ReactiveFormsModule,
    ],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss'
})
export class ProfileFiltersComponent {
  fd = inject(FormBuilder);
  profileService: ProfileService = inject(ProfileService);

  searchForm = this.fd.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  })

  constructor() {
    this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
        switchMap(formValue => {
          return this.profileService.filterProfiles(formValue);
        }),
        takeUntilDestroyed()
      )
      .subscribe()
  }
}
