import { PaginatedResult } from './../_models/Pagination';
import { Component, OnInit } from '@angular/core';
import { Pagination } from '../_models/Pagination';
import { Message } from '../_models/message';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
messages: Message[];
pagination: Pagination;
messageContainer = 'Unread';

  constructor(private authService: AuthService,
              private alertify: AlertifyService,
              private userService: UserService,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages() {
    this.userService.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer)
    .subscribe((res: PaginatedResult<Message[]>) => {
      this.messages = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    })
  }

  deleteMessage(id:number){
    this.alertify.confirm("Are you sure you want to delete the message?", () =>{
      this.userService.deleteMessages(id, this.authService.decodedToken.nameid).subscribe(() => {
        this.messages.splice(_.findIndex(this.messages, {id:id}),1);
        this.alertify.success("Message has been deleted");
      }, error => {
        this.alertify.error("Faild to delete a message");
      });
    });
  }

  pageChanged(event:any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

}
