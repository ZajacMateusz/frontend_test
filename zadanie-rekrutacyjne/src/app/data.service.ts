import { Injectable } from '@angular/core';
import { catchError, from, Observable, of, Subject, switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { DataField } from './data-field';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private dataMap: Map<number, DataField> = new Map();
  private dataPageMap: Map<number, DataField> = new Map();

  private dataPageSubject = new Subject<Array<DataField>>();

  constructor() {
    this.init();
  }

  init() {

    this.emitDataPageMap();

    if (localStorage.getItem("first_loading") != null) {
      this.readFromLocalStorage();
      return;
    }
    else {
      localStorage.setItem("first_loading", "");
    }

    const data$ = fromFetch('./assets/data.json').pipe(
      switchMap(response => {
        if (response.ok) {
          return response.json();
        } else {
          return of({ error: true, message: `Error ${response.status}` });
        }
      }),
      catchError(err => {
        console.error(err);
        return of({ error: true, message: err.message })
      })
    );

    data$.subscribe({
      next: result => this.parseJson(result),
      complete: () => {
        this.saveToLocalStorage();
      }
    });
  }

  saveToLocalStorage() {
    let array : Array<DataField> = Array.from(this.dataMap, ([id, data]) => (data));
    localStorage.setItem("data", JSON.stringify(array));
  }

  readFromLocalStorage() {
    let json = localStorage.getItem("data");
    if (json != null) {
      let array = JSON.parse(json);
      this.parseJson(array);
    }
  }

  parseJson(data: Array<DataField>) {
    data.map(field => { this.dataMap.set(field.id, field) });
  }

  private emitDataPageMap() {
    this.dataPageSubject.next(Array.from(this.dataPageMap, ([id, data]) => (data)).sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0)));
  }

  public getDataPageSubject() {
    return this.dataPageSubject;
  }

  public loadField(id: number): { status: boolean, msg: string } {

    if (id == -1) {
      this.dataPageMap.clear();
      let array = Array.from(this.dataMap, ([id, data]) => (data));
      let field = array[Math.floor(Math.random() * array.length)];

      this.dataPageMap.set(field.id, field);

      this.emitDataPageMap()
      return { status: true, msg: "OK" };
    }

    let field = this.dataMap.get(id);

    if (field != undefined) {

      this.dataPageMap.clear();
      this.dataPageMap.set(field.id, field);

      this.emitDataPageMap()
      return { status: true, msg: "OK" };
    }

    return { status: false, msg: "Wybrana treść nie istanieje." };
  }

  public addField(id: number): { status: boolean, msg: string } {

    if (this.dataMap.size === this.dataPageMap.size) {
      return { status: false, msg: "Wszystkie treści zostały już załadowane." };
    }

    if (id == -1) {
      let array = Array.from(this.dataMap, ([id, data]) => (data));
      let found: boolean = false;

      do {
        let field = array[Math.floor(Math.random() * array.length)];
        if (!this.dataPageMap.has(field.id)) {
          this.dataPageMap.set(field.id, field);
          found = true;
        }


      } while (!found);

      this.emitDataPageMap()
      return { status: true, msg: "OK" };
    }

    let field = this.dataMap.get(id);

    if (field != undefined) {
      if (this.dataPageMap.has(field.id)) {
        return { status: false, msg: "Wybrana treśćjest już załadowana." };
      }

      this.dataPageMap.set(field.id, field);

      this.emitDataPageMap()
      return { status: true, msg: "OK" };
    }

    return { status: false, msg: "Wybrana treść nie istnieje." };
  }
}
