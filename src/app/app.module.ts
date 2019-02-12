import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { MiniSidebarComponent } from './mini-sidebar/mini-sidebar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomepageComponent } from './homepage/homepage.component';

import { AuthInterceptor } from './auth/auth.interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { TodoListComponent } from './todo-list/todo-list.component';
import { OnlineFriendsComponent } from './online-friends/online-friends.component';
import { HistoryComponent } from './history/history.component';
import { FriendsComponent } from './friends/friends.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AuthModule } from './auth/auth.module';
import { SocketService } from './shared/socket.service';
import { ProfileComponent } from './profile/profile.component';
import { ContactComponent } from './contact/contact.component';
import { ToggleModalDirective } from './shared/toggle-modal.directive';
import { CloseModalDirective } from './shared/close-modal.directive';
import { MessageComponent } from './todo-list/message/message.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SubItemComponent } from './todo-list/message/sub-item/sub-item.component';

@NgModule({
  declarations: [
    AppComponent,
    MiniSidebarComponent,
    SidebarComponent,
    PageNotFoundComponent,
    HomepageComponent,
    TodoListComponent,
    OnlineFriendsComponent,
    HistoryComponent,
    FriendsComponent,
    NotificationsComponent,
    ProfileComponent,
    ContactComponent,
    ToggleModalDirective,
    CloseModalDirective,
    MessageComponent,
    SubItemComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AuthModule,
    ToastrModule.forRoot({
      timeOut: 12000,
      extendedTimeOut: 2000,
      closeButton: true,
      preventDuplicates: true,
      maxOpened: 4,
      toastClass: 'custom-toast toast',
      positionClass: 'toast-top-center'
    }),
    AngularFontAwesomeModule,
    NgxSpinnerModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
              {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
