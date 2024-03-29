import { PaginatedResult } from '../models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { FollowsCount } from '../models/followscount';
@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();

  constructor(private http: HttpClient) {}
  getMembers(searchName: string,page?: number, itemsPerPage?: number ) {
        console.log('inside getMembers');
        console.log(searchName);
        // if(searchName=='')
        //   var response = this.memberCache.get(page + '-' + itemsPerPage);
        //   if (response) {
        //     return of(response);
        //   }
    let params = new HttpParams();
    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }
    if (searchName != '') params = params.append('Search', searchName);
    return this.http
      .get<Member[]>(this.baseUrl + 'users', { observe: 'response', params })
      .pipe(
        map((response) => {
          this.paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            this.paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          this.memberCache.set(
            page + '-' + itemsPerPage,
            Object.assign({}, this.paginatedResult)
          );
          return this.paginatedResult;
        })
      );
  }

  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.username === username);
    if (member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put<Member>(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId, {});
  }

  uploadCover(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.baseUrl + 'users/set-cover-photo', formData);
  }

  deleteCover(){
    return this.http.delete(this.baseUrl + 'users/delete-cover-photo');
  }

  addFollow(username: string) {
    return this.http.post(this.baseUrl + 'follows/' + username, {});
  }

  removeFollow(username: string) {
    return this.http.delete(this.baseUrl + 'follows/' + username);
  }

  getFollows(predicate: string, pageNumber, pageSize) {
    let params = new HttpParams();
    params = params.append('predicate', predicate);
    if (pageNumber !== null && pageSize !== null) {
      params = params.append('pageNumber', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
    }
    return this.http
      .get<Partial<Member[]>>(this.baseUrl + 'follows', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          this.paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            this.paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return this.paginatedResult;
        })
      );
  }

  getFollowsCount(username: string) {
    return this.http.get<FollowsCount>(
      this.baseUrl + 'follows/' + username + '/followscount'
    );
  }
}
