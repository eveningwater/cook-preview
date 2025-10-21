import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class SearchComponent implements OnInit, OnDestroy {
  searchTerm = '';
  @Output() searchChanged = new EventEmitter<string>();
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.searchSubject
      .pipe(
        debounceTime(300), // 300ms防抖
        distinctUntilChanged() // 只在值真正改变时触发
      )
      .subscribe(searchTerm => {
        this.searchChanged.emit(searchTerm);
      });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchSubject.next(this.searchTerm);
  }

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchChanged.emit('');
  }
}
