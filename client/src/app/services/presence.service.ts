import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { User } from '../models/user';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private onlineUserSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUserSource.asObservable();

  constructor(private snackBar: MatSnackBar) { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: ()=> user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection
      .start()
      .catch(error=> console.log(error));

    this.hubConnection.on('UserIsOnline', username=> {
      this.snackBar.open(username+' has connected',undefined,{duration:1500})

    })

    this.hubConnection.on('UserIsOffline', username=> {
      this.snackBar.open(username+' has disconnected',undefined,{duration:1500})
    })

    this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
      this.onlineUserSource.next(usernames);
    })
  }

  stopHubConnection() {
    this.hubConnection.stop().catch(error=>console.log(error));
  }
}
