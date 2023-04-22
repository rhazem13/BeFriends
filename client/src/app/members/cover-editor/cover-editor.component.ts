import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { fromEvent, map } from 'rxjs';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-cover-editor',
  templateUrl: './cover-editor.component.html',
  styleUrls: ['./cover-editor.component.css'],
})
export class CoverEditorComponent {
  @Input() member: Member;
  constructor(private memberService: MembersService) {}
  fileToUpload: File = null;
  @ViewChild('fileInput') fileInput: ElementRef;

  openFileSelector() {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('accept', 'image/*');
    fileSelector.click();

    return fromEvent(fileSelector, 'change').pipe(
      map((event: any) => {
        const files: FileList = event.target.files;
        return files && files.length > 0 ? files[0] : null;
      })
    );
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  updateCover() {
    this.openFileSelector().subscribe((file) => {
      if (file) {
        this.memberService.uploadCover(file).subscribe(
          (response) => {
            // handle successful upload
            window.location.reload();
          },
          (error) => {
            // handle upload error
          }
        );
      }
    });
  }

  deleteCover(){
    this.memberService.deleteCover().subscribe(()=>{
      window.location.reload();
    })
  }
}
