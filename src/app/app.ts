import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tab } from "./features/shared/navigation/tab/tab";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Tab],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
