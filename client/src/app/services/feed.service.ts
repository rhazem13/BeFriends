import { getPost } from './../models/getpost';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getPosts(){
    return this.http.get<getPost[]>(this.baseUrl + 'post');
  }

  createPost(formdata){
    return this.http.post(this.baseUrl + 'post',formdata)
  }
}
