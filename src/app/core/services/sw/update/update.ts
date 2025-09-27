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
        const current = update.currentVersion.hash.substring(0, 7);
        const latest = update.latestVersion.hash.substring(0, 7);

        const message = `
A new version of this app is available.

Current version: ${current}
New version:     ${latest}

Would you like to load the new version now?
      `;

        if (confirm(message)) {
          window.location.reload();
        }
      }
    });
  }
}
