import {Component, Input} from '@angular/core';
import {AddPostComponent} from '../add-post/add-post.component';
import {SearchbarComponent} from '../searchbar/searchbar.component';

@Component({
  selector: 'app-datepicker',
  imports: [],
  standalone: true,
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.css'
})
export class DatepickerComponent {
  @Input() addPostComponent!: AddPostComponent;
  @Input() searchBarComponent!: SearchbarComponent;
  month: number = new Date().getMonth();
  monthString: string = new Date().toLocaleString('default', {month: 'long'});
  year: number = new Date().getFullYear();
  date: string = '';
  returnMonth!: number;

  selectDate(day: number){
    if(this.month + 1 > 12){
      this.returnMonth = 1;
    }else{
      this.returnMonth = this.month + 1;
    }
    this.date = `${this.year}-${this.returnMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    if(this.addPostComponent != null){
      this.addPostComponent.date = this.date;
      this.addPostComponent.datePickerVisible = false;
    }else if(this.searchBarComponent != null){
      this.searchBarComponent.searchValue = this.date;
      this.searchBarComponent.showDatePicker = false;
    }

    console.log(this.date);
  }

  nextMonth() {
    this.monthString = new Date(this.year, this.month + 1).toLocaleString('default', {month: 'long'});
    this.month = this.month + 1;

    if(this.monthString === 'January') {
      this.year = this.year + 1;
    }
  }

  previousMonth() {
    this.monthString = new Date(this.year, this.month - 1).toLocaleString('default', {month: 'long'});
    this.month = this.month - 1;
    if(this.monthString === 'December') {
      this.year = this.year - 1;
    }
  }
}
