import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token
} from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() { }

  public async register() {
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('pushNotificationActionPerformed', notification);
    });
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Register ' + JSON.stringify(token));
    });
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('registrationError ', error);
    });
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('pushNotificationReceived ', JSON.stringify(notification));
    });
    await PushNotifications.register();
    console.log('Push notifications registered');
  }
}

// Notes: Docs dont mention what to import, addListener should be refactored to remove strings
