import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LavajatosListComponent } from './lavajatos-list.component';

describe('LavajatosList', () => {
  let component: LavajatosListComponent;
  let fixture: ComponentFixture<LavajatosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LavajatosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LavajatosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
