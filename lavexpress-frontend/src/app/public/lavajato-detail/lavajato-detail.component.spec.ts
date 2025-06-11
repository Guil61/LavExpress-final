import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LavajatoDetailComponent } from './lavajato-detail.component';

describe('LavajatoDetail', () => {
  let component: LavajatoDetailComponent;
  let fixture: ComponentFixture<LavajatoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LavajatoDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LavajatoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
