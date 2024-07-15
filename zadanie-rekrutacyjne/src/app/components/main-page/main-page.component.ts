import { Component, Input } from '@angular/core';
import { DataService } from '../../data.service';
import { DataField } from '../../data-field';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {

  constructor(private dataService: DataService) {
    dataService.getDataPageSubject().subscribe({
      next: result => this.thirdBlockData = result,
      complete: () => console.log("aaa"),
      error: (err) => console.log(err)
    });
  }

  public thirdBlockData: Array<DataField> = new Array();
  public loadingOption: number = 0;

  public changeLoadingOption(num: number) {
    this.loadingOption = num;
  }

  public loadData() {
    if (this.loadingOption == 0)
      return;
    let response = this.dataService.loadField(this.loadingOption);

    if (!response.status) {
      alert(response.msg);
    }
  }

  public addData() {
    if (this.loadingOption == 0)
      return;
    let response = this.dataService.addField(this.loadingOption);

    if (!response.status) {
      alert(response.msg);
    }
  }
}
