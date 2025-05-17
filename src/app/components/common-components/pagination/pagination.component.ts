import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '@app/interface/interface';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() pagination!: Pagination;
  @Input() pageSizes!: number[];
  @Input() pageSize!: number;
  @Input() page!: number;
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() incrementPage = new EventEmitter<number>();
  @Output() decrementPage = new EventEmitter<number>();

  setPageSize(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.pageSizeChange.emit(parseInt(target.value));
  }
  decrementPageCount() {
    this.decrementPage.emit(this.pagination.page - 1);
  }
  incrementPageCount() {
    this.incrementPage.emit(this.pagination.page + 1);
  }
}
