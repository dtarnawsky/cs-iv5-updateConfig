import { Component } from '@angular/core';
import { NotificationsService } from './notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private notificationService: NotificationsService) {
    this.notificationService.register();
  }


}
