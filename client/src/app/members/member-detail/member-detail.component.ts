import { Photo } from './../../models/photo';
import { MembersService } from './../../services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';
import { ActivatedRoute } from '@angular/router';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  member: Member;
  items: GalleryItem[];

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute,
    private gallery: Gallery
  ) {}
  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    this.memberService
      .getMember(this.route.snapshot.paramMap.get('username'))
      .subscribe((member) => {
        this.member = member;
        this.items = this.getImages();
      });
  }

  getImages(): GalleryItem[] {
    return this.member.photos.map(
          (item) => new ImageItem({ src: item.url, thumb: item.url })
        );
  }
}
