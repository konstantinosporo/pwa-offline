import { inject, Injectable } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class Update {
  private readonly sw = inject(SwUpdate);

  updateApp() {
    this.sw.versionUpdates.subscribe((update) => {
      if (update.type === 'VERSION_READY') {
        if (confirm('New version available. Load new version?')) {
          window.location.reload();
        }
      }
    });
  }
}
