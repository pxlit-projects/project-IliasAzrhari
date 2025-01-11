import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatepickerComponent } from './datepicker.component';
import { AddPostComponent } from '../add-post/add-post.component';
import { SearchbarComponent } from '../searchbar/searchbar.component';

describe('DatepickerComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;
  const addPostComponent = jasmine.createSpyObj('AddPostComponent', ['date', 'datePickerVisible']);
  const searchBarComponent = jasmine.createSpyObj('SearchbarComponent', ['searchValue', 'showDatePicker']);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the correct date and update AddPostComponent', () => {
    component.addPostComponent = addPostComponent;
    component.selectDate(15);
    expect(addPostComponent.date).toBe(`${component.year}-${(component.month + 1).toString().padStart(2, '0')}-15`);
    expect(addPostComponent.datePickerVisible).toBeFalse();
  });

  it('should set the correct date and update SearchbarComponent', () => {
    component.searchBarComponent = searchBarComponent;
    component.selectDate(15);
    expect(searchBarComponent.searchValue).toBe(`${component.year}-${(component.month + 1).toString().padStart(2, '0')}-15`);
    expect(searchBarComponent.showDatePicker).toBeFalse();
  });

  it('should increment month and year correctly', () => {
    component.month = 11; // December
    component.year = 2023;
    component.nextMonth();
    expect(component.month).toBe(12); // January
    expect(component.year).toBe(2024);
  });

  it('should decrement month and year correctly', () => {
    component.month = 0; // January
    component.year = 2024;
    component.previousMonth();
    expect(component.month).toBe(-1); // December
    expect(component.year).toBe(2023);
  });
});
