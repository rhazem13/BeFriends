import { User } from 'src/app/models/user';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from './../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { PaginatedResult } from '../models/pagination';
import { map, BehaviorSubject, take } from 'rxjs';
import { Group } from '../modals/roles-modal/group';
import { Chat } from '../models/chat';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConnection : HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<
    Message[]
  >();

  constructor(private http: HttpClient) {}

  createHubConnection(user: User, otherUsername: string){
    console.log("creating new connection");

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();
    this.hubConnection.start().catch(error=> console.log(error));

    this.hubConnection.on('ReceiveMessageThread', messages=>{
      this.messageThreadSource.next(messages);
    });

    this.hubConnection.on('NewMessage', message => {
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([...messages,message])
      })
    })

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if(group.connections.some(x=>x.username === otherUsername)){
        this.messageThread$.pipe(take(1)).subscribe(messages=>{
          messages.forEach(message=>{
            if(!message.dateRead){
              message.dateRead=new Date(Date.now())
            }
          })
          this.messageThreadSource.next([...messages]);
        })
      }
    });
  }
  stopHubConnection(){
    if ( this.hubConnection)
      this.hubConnection.stop();
  }

  getMessages(pageNumber, pageSize, container) {
    let params = new HttpParams();
    params = params.append('Container', container);
    if (pageNumber !== null && pageSize !== null) {
      params = params.append('pageNumber', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
    }
    return this.http
      .get<Message[]>(this.baseUrl + 'messages', {
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

  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }

  async sendMessage(username: string, content: string){
    return this.hubConnection.invoke('SendMessage',{recipientUsername: username, content})
    .catch(error=> console.log(error));
  }

  deleteMessage(id: number){
    return this.http.delete(this.baseUrl + 'messages/'+id);
  }

  getChats() {
    return this.http.get<Chat[]>(this.baseUrl + 'messages/chats');
  }
}
