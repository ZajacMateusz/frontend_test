import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'zadanie-rekrutacyjne';
  authorVisible : boolean = false;

  changeAutorVisible(event: boolean) {
    this.authorVisible = event;
  }

  resetSettings() {
    window.location.reload();
    localStorage.clear();
  }
}
