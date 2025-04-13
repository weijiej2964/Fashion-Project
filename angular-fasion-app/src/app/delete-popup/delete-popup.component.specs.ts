import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DeletePopupComponent } from './delete-popup.component';

describe('DeletePopupComponent', () => {
  let component: DeletePopupComponent;
  let fixture: ComponentFixture<DeletePopupComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  const mockDialogData = {
    message: 'Test delete confirmation message'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePopupComponent, MatDialogTitle, MatDialogContent, MatDialogActions ],
      imports: [ MatButtonModule, NoopAnimationsModule ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the provided message', () => {
    const contentElement = fixture.nativeElement.querySelector('[mat-dialog-content] p');
    expect(contentElement.textContent).toContain(mockDialogData.message);
  });

  it('should close the dialog with false when onNoClick is called', () => {
    component.onNoClick();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should close the dialog with true when onYesClick is called', () => {
    component.onYesClick();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });
});