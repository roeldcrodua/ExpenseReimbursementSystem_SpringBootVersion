import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReimbursementComponent } from './edit-reimbursement.component';

describe('EditReimbursementComponent', () => {
  let component: EditReimbursementComponent;
  let fixture: ComponentFixture<EditReimbursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditReimbursementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditReimbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
