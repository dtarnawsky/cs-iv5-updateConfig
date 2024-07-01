import { Component } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private notificationService: NotificationsService) {
    this.notificationService.register();
    this.appEvents();
  }

  async appEvents() {
    App.addListener('pause', () => {
      console.log('pause');
    });
    App.addListener('resume', () => {
      console.log('resume');
    });
  }


}
