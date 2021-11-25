import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveReimbursementComponent } from './resolve-reimbursement.component';

describe('ResolveReimbursementComponent', () => {
  let component: ResolveReimbursementComponent;
  let fixture: ComponentFixture<ResolveReimbursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResolveReimbursementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolveReimbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
