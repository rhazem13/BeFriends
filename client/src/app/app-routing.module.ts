import { FeedComponent } from './feed/feed.component';
import { LoginComponent } from './login/login.component';
import { ChatsComponent } from './chats/chats.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { MemberDetailedResolver } from './resolvers/member-details.resolver';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { AuthGuard } from './guards/auth.guard';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { registerMode: false } },
  { path: 'register', component: HomeComponent, data: { registerMode: true } },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'members', component: MemberListComponent },
      {
        path: 'members/:username',
        component: MemberDetailComponent,
        resolve: { member: MemberDetailedResolver },
      },
      {
        path: 'member/edit',
        component: MemberEditComponent,
        canDeactivate: [PreventUnsavedChangesGuard],
      },
      { path: 'feed', component: FeedComponent },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'chats', component: ChatsComponent },
      {
        path: 'admin',
        component: AdminPanelComponent,
        canActivate: [AdminGuard],
      },
    ],
  },
  { path: 'errors', component: TestErrorsComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
