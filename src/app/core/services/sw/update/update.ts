import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';

@Injectable({ providedIn: 'root' })
export class Update {
  private readonly sw = inject(SwUpdate);
  private readonly snackBar = inject(MatSnackBar);
  private deferredPrompt?: any;

  constructor() {
    this.listenBeforeInstall();
    this.listenUpdates();
  }

  private listenBeforeInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.openSnack();
    });
  }

  private openSnack() {
    const snack = this.snackBar.open(
      'Installation available – app detected',
      '🚀 Install',
      {
        duration: 10000,
      },
    );
    snack.onAction().subscribe(() => {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult: any) => {
          console.log(
            choiceResult.outcome === 'accepted'
              ? 'User accepted'
              : 'User dismissed',
          );
          this.deferredPrompt = undefined;
        });
      }
    });
  }

  private listenUpdates() {
    if (!this.sw.isEnabled) return;

    this.sw.versionUpdates.subscribe((update: any) => {
      if (update.type === 'VERSION_READY') {
        const current = update.currentVersion.hash.substring(0, 7);
        const latest = update.latestVersion.hash.substring(0, 7);
        if (
          confirm(
            `New version available.\nCurrent: ${current}\nLatest: ${latest}\nReload now?`,
          )
        ) {
          window.location.reload();
        }
      }
    });
  }
}
