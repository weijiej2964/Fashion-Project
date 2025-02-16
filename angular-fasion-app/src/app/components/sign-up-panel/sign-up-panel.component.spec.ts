import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpPanelComponent } from './sign-up-panel.component';

describe('SignUpPanelComponent', () => {
  let component: SignUpPanelComponent;
  let fixture: ComponentFixture<SignUpPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
