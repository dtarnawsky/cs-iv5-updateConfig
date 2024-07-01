import { Component, OnInit } from '@angular/core';
import { Device, DeviceSecurityType, VaultType } from '@ionic-enterprise/identity-vault';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { VaultService } from '../vault.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public authenticationChange$: Observable<boolean>;
  public plat = '';

  constructor(private authenticationService: AuthenticationService, private vaultService: VaultService) {
    this.authenticationChange$ = authenticationService.authenticationChange$;

  }

  ngOnInit() {
    this.plat = Capacitor.getPlatform() + ' ' + Capacitor.isNativePlatform().toString();
  }

  async login(): Promise<void> {
    // This line is required if iosWebView is shared and we are using Identity Vault. It prevents the privacy screen from displaying
    // Device.setHideScreenOnBackground(false);
    await this.authenticationService.login();
  }

  async logout(): Promise<void> {
    try {
      this.authenticationService.logout();
    } catch (err) {
      console.error(err);
    }
  }

  async testMigrate(): Promise<void> {
    try {
      await this.vaultService.testMigrate();
    } catch (error) {
      console.error(error);
    }
  }

  async testUpdate(): Promise<void> {
    const config = this.vaultService.config;
    config.deviceSecurityType = DeviceSecurityType.Biometrics;
    config.type = VaultType.DeviceSecurity;
    try {
      console.log('Vault change to biometrics...');
      await this.vaultService.updateConfig(config);
      console.log('Vault changed to biometrics.');
    } catch (error) {
      console.log('Failed to update config to biometrics');
      console.error(error);
      console.log('Vault clear...');
      await this.vaultService.clear();
      console.log('Vault cleared');

      console.log('Vault change to InMemory...');
      config.type = VaultType.InMemory;
      config.deviceSecurityType = DeviceSecurityType.Biometrics; // This is technically invalid
      await this.vaultService.updateConfig(config);
      console.log('Vault changed to InMemory');

      //console.log(`Vault is empty: ${await this.vaultService.isEmpty()}`);

      console.log(`Getting Data...`);
      const data = await this.vaultService.getData();
      console.log(`Got Data. Data is ${data}`);
    }
  }

  async refresh() {
    console.log(await this.authenticationService.isRefreshTokenAvailable());
    const token = await this.authenticationService.getAccessToken();
    console.log(token);
    await this.authenticationService.refreshSession();
    const atoken = await this.authenticationService.getAccessToken();
    console.log(atoken);
    if (atoken !== token) {
      alert('Token was refreshed');
    }
  }

  async lock() {
    await this.vaultService.lock();
  }

  async unlock() {
    await this.vaultService.unlock();
  }

  async clear() {
    await this.vaultService.clear();
  }

  async setData(repeats = 1) {

    let count = 0;
    while (count < repeats) {
      count++;
      await this.vaultService.setData(` x${count}`);
      await this.vaultService.delay(Math.random() * 50);
    }
  }

  async getData(repeats = 1) {
    let count = 0;
    while (count < repeats) {
      count++;
      await this.vaultService.getData(` x${count}`);
      await this.vaultService.delay(Math.random() * 50);
    }
  }

  async checkBio() {
    await this.vaultService.hasBiometrics();
  }

  async isEmpty() {
    const isEmpty = await this.vaultService.isEmpty();
    console.log(`isEmpty is ${isEmpty}`);
    alert(`isEmpty is ${isEmpty}`);
  }

  async showPrompt() {
    await this.vaultService.showBiometricPrompt();
  }

  async bioType() {
    const res = await this.vaultService.getBioType();
    alert('Biometrics retured ' + res);
  }

  async useSecure(enabled: boolean) {
    this.vaultService.useSecure(enabled);
  }

  async setToPasscode() {
    this.vaultService.switchPasscode();
  }

  async verifyPasscode() {
    this.vaultService.verifyPasscode();
  }

  async testPasscode() {
    const config = this.vaultService.config;
    try {
      await this.vaultService.clear();
      config.type = VaultType.DeviceSecurity;
      config.deviceSecurityType = DeviceSecurityType.SystemPasscode;
      console.log('Changing vault from cleared to System Passcode...');
      await this.vaultService.updateConfig(config);
      console.log('Vault is System Passcode');
      console.log('Call setData...');
      await this.vaultService.setData();
      this.vaultService.lock();
      await this.vaultService.getData();
    } catch (e) {
      console.error(e);
    }
  }

}
