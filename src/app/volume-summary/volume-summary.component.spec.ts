import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeSummaryComponent } from './volume-summary.component';

describe('VolumeSummaryComponent', () => {
  let component: VolumeSummaryComponent;
  let fixture: ComponentFixture<VolumeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolumeSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VolumeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
