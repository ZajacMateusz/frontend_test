import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Output() autorVisibleChangeEvent = new EventEmitter<boolean>();
  @Output() resetSettingsEvent = new EventEmitter();
  
  public authorVisible : boolean = false;

  changeAutorVisible()
  {
    this.authorVisible = !this.authorVisible;
    this.autorVisibleChangeEvent.emit(this.authorVisible);
  }

  resetSettings()
  {
    this.resetSettingsEvent.emit();
  }
}
