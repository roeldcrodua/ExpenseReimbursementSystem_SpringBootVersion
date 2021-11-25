import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteReimbursementComponent } from './delete-reimbursement.component';

describe('DeleteReimbursementComponent', () => {
  let component: DeleteReimbursementComponent;
  let fixture: ComponentFixture<DeleteReimbursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteReimbursementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteReimbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
