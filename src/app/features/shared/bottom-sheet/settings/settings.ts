import { Component, inject, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheet,
} from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { Network } from '../../../../core/services/network/network';
@Component({
  selector: 'app-settings',
  imports: [MatListModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  protected matBottomSheet = inject(MatBottomSheet);
  protected networkService = inject(Network);

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {}

  /**
   * Sets offline mode, and then dismissed the bottom sheet.
   */
  initOfflineMode() {
    this.networkService.offlineModeSubject.next(true);
    this.matBottomSheet.dismiss();
  }
}
