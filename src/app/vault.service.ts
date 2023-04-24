import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  BrowserVault, Device, DeviceSecurityType,
  IdentityVaultConfig, Vault, VaultErrorCodes, VaultType
} from '@ionic-enterprise/identity-vault';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class VaultService {

  config: IdentityVaultConfig = {
    key: 'io.ionic.iv-test-bio5',
    type: VaultType.DeviceSecurity,
    deviceSecurityType: DeviceSecurityType.Biometrics,
    lockAfterBackgrounded: 2000,
    shouldClearVaultAfterTooManyFailedAttempts: false,
    customPasscodeInvalidUnlockAttempts: 10,
    unlockVaultOnLoad: false,
  };

  vault: Vault | BrowserVault;

  constructor(private platform: Platform) {
    this.init();
  }

  async init() {
    await this.platform.ready();

    this.vault = Capacitor.getPlatform() === 'web' ? new BrowserVault(this.config) : new Vault(this.config);
    this.vault.onConfigChanged(() => {
      console.log('Vault configuration was changed', this.config);
    });
    this.vault.onLock(() => {
      console.log('Vault was locked');
    });
    this.vault.onUnlock(() => {
      console.log('Vault was unlocked');
    });
    this.vault.onError((err) => {
      console.error('Vault error', err);
      if (err.code === VaultErrorCodes.InvalidatedCredential) {
        console.log('Received the expected invalidated credentials');
        this.config.type = VaultType.InMemory;
        this.config.deviceSecurityType = DeviceSecurityType.None;
        console.log('Before update config to in memory')
        this.vault.updateConfig(this.config);
        console.log('Completed update to in memory vault');
      } else {
        console.error(err.code + ': ' + err.message);
      }
    });
    await Device.setHideScreenOnBackground(true);
  }

  async updateConfig(config: IdentityVaultConfig): Promise<void> {
    await this.vault.updateConfig(config);
  }

  // This is used to test the vault migrator
  async testMigrate() {
    const data: any = '{\"_ionicAuth.authResponse.5x95216jDA3rl5NSx4nYEFJ-2fLuKhjl31KIyqy_etY\":{\"token_type\":\"Bearer\",\"scope\":\"membership_entitlements openid email profile\",\"refresh_token\":\"bcVpkO7Uhcyxsdq2YceosoDb5shlE5zrsjz3utpBp4I\",\"created_at\":1633621013,\"id_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlRFMldDOGlzb0UtQTlrNG9uc1NWdERNdlg2bmY3c2V3NjBveU5PNWNaMkkifQ.eyJpc3MiOiJodHRwczovL2F0ay1hdXRoLXN0YWdpbmcuaGVyb2t1YXBwLmNvbS8iLCJzdWIiOiI5NzczMzI2IiwiYXVkIjoiNXg5NTIxNmpEQTNybDVOU3g0bllFRkotMmZMdUtoamwzMUtJeXF5X2V0WSIsImV4cCI6MTYzMzYyMTEzMywiaWF0IjoxNjMzNjIxMDEzLCJub25jZSI6IjdYLlB0LjlRaFFHSS5reFRBNFB-IiwiZW1haWwiOiJhbGV4LnJpbmRvbmVAYW1lcmljYXN0ZXN0a2l0Y2hlbi5jb20iLCJmdWxsX25hbWUiOiJBbGV4IFJpbmRvbmUiLCJtZW1iZXJzaGlwX2VudGl0bGVtZW50cyI6eyJpZCI6OTc3MzMyNiwiZXh0ZXJuYWxfaWQiOm51bGwsImlzX25ldyI6ZmFsc2UsInJvbGUiOiJzdXBlci1hZG1pbiIsInBhY2thZ2VfbmFtZSI6Ik11bHRpLVNpdGUgTWVtYmVyc2hpcCIsInNlZ21lbnQiOiJtdWx0aXNpdGUiLCJhY3RpdmUiOlsiY29va2Jvb2tfY29sbGVjdGlvbiIsImF0ayIsImNjbyIsImNpbyJdfX0.s586aFZ6GLd1D3G3mAI8IxtizuOjSC8S79N-djuWxOJjheggiEirnGZTKVHtHJKpMMWw1GQDzcIM8v_Q9qxJ5ijEkncjhsW-izF_v3yu0O_Sm4PT6Z-bBC62Furr8q5WhBTdWj-a6okz5J0maBl5Qs60zX8a-bNYE6fl9GVudzIwG0UYv_Bf0jlJDgWV2eWS3ha0pmHyp40KvmW1Atsn4F50_VC-RkTJqqAjAWBtQgosY8Ow4rM4JP2Sa1amfxiED8pPg98PDkDBUh-Eki4gFj4ezJbQgwn74K6ybu45mi319ihXsatWb2IjSqU7FN-N6RDrWc21GBhaa7YIOgOdgA\",\"access_token\":\"qIGSWkyN9DZGS2Glvq0Qj85Lvm-i46NGrJSBGu8Or4A\",\"expires_in\":60},\"_ionicAuth.refreshToken.5x95216jDA3rl5NSx4nYEFJ-2fLuKhjl31KIyqy_etY\":\"bcVpkO7Uhcyxsdq2YceosoDb5shlE5zrsjz3utpBp4I\",\"_ionicAuth.accessToken.5x95216jDA3rl5NSx4nYEFJ-2fLuKhjl31KIyqy_etY\":\"qIGSWkyN9DZGS2Glvq0Qj85Lvm-i46NGrJSBGu8Or4A\",\"_ionicAuth.idToken.5x95216jDA3rl5NSx4nYEFJ-2fLuKhjl31KIyqy_etY\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlRFMldDOGlzb0UtQTlrNG9uc1NWdERNdlg2bmY3c2V3NjBveU5PNWNaMkkifQ.eyJpc3MiOiJodHRwczovL2F0ay1hdXRoLXN0YWdpbmcuaGVyb2t1YXBwLmNvbS8iLCJzdWIiOiI5NzczMzI2IiwiYXVkIjoiNXg5NTIxNmpEQTNybDVOU3g0bllFRkotMmZMdUtoamwzMUtJeXF5X2V0WSIsImV4cCI6MTYzMzYyMTEzMywiaWF0IjoxNjMzNjIxMDEzLCJub25jZSI6IjdYLlB0LjlRaFFHSS5reFRBNFB-IiwiZW1haWwiOiJhbGV4LnJpbmRvbmVAYW1lcmljYXN0ZXN0a2l0Y2hlbi5jb20iLCJmdWxsX25hbWUiOiJBbGV4IFJpbmRvbmUiLCJtZW1iZXJzaGlwX2VudGl0bGVtZW50cyI6eyJpZCI6OTc3MzMyNiwiZXh0ZXJuYWxfaWQiOm51bGwsImlzX25ldyI6ZmFsc2UsInJvbGUiOiJzdXBlci1hZG1pbiIsInBhY2thZ2VfbmFtZSI6Ik11bHRpLVNpdGUgTWVtYmVyc2hpcCIsInNlZ21lbnQiOiJtdWx0aXNpdGUiLCJhY3RpdmUiOlsiY29va2Jvb2tfY29sbGVjdGlvbiIsImF0ayIsImNjbyIsImNpbyJdfX0.s586aFZ6GLd1D3G3mAI8IxtizuOjSC8S79N-djuWxOJjheggiEirnGZTKVHtHJKpMMWw1GQDzcIM8v_Q9qxJ5ijEkncjhsW-izF_v3yu0O_Sm4PT6Z-bBC62Furr8q5WhBTdWj-a6okz5J0maBl5Qs60zX8a-bNYE6fl9GVudzIwG0UYv_Bf0jlJDgWV2eWS3ha0pmHyp40KvmW1Atsn4F50_VC-RkTJqqAjAWBtQgosY8Ow4rM4JP2Sa1amfxiED8pPg98PDkDBUh-Eki4gFj4ezJbQgwn74K6ybu45mi319ihXsatWb2IjSqU7FN-N6RDrWc21GBhaa7YIOgOdgA\"}';
    const ob = JSON.parse(data);
    console.log('before import');
    await this.vault.importVault(ob);
    console.log('after import');
  }

  async isEmpty(): Promise<boolean> {
    return await this.vault.isEmpty();
  }

  async switchPasscode() {
    try {
      this.vault = new Vault(
        {
          key: 'io.ionic.iv-test-sysp',
          type: VaultType.SecureStorage,
          deviceSecurityType: DeviceSecurityType.None,
          lockAfterBackgrounded: 2000,
          shouldClearVaultAfterTooManyFailedAttempts: false,
          customPasscodeInvalidUnlockAttempts: 10,
          unlockVaultOnLoad: false,
        }
      );
      await this.vault.setValue('blar', 'stuff');

      // This code blows up on an iOS device without fingerprint/bio and only system passcode
      await this.vault.updateConfig(
        {
          key: 'io.ionic.iv-test-sysp',
          type: VaultType.DeviceSecurity,
          deviceSecurityType: DeviceSecurityType.SystemPasscode,
          lockAfterBackgrounded: 2000,
          shouldClearVaultAfterTooManyFailedAttempts: false,
          customPasscodeInvalidUnlockAttempts: 10,
          unlockVaultOnLoad: false,
        }
      );
    } catch (err) {
      alert(`${err.message} (Error Code: ${err.code})`);
    }
  }

  async lock() {
    try {
      await this.vault.lock();
    } catch (err) {
      console.error('vault.service.ts lock()', err);
    }
  }

  async unlock() {
    try {
      await this.vault.unlock();
    } catch (err) {
      const msg = (typeof err == 'object') ? JSON.stringify(err) : err;
      console.error('vault.service.ts unlock()', msg);
    }
  }

  async useSecure(enabled: boolean) {
    this.config.type = enabled ? VaultType.SecureStorage : VaultType.DeviceSecurity;
    this.config.deviceSecurityType = enabled ? DeviceSecurityType.None : DeviceSecurityType.Biometrics;
    await this.vault.updateConfig(this.config);
    this.setData();

  }

  async getData(): Promise<string> {
    console.log('Get Data....');
    const data = await this.vault.getValue('blar');

    console.log('Get Data', data);
    return data;
  }

  async setData() {
    try {
      console.log('Setting data...');
      await this.vault.setValue('blar', 'test');
      console.log('Data is set');
    } catch (err) {
      console.error('vault.service.ts setData()', err);
    }
  }

  async clear() {
    try {
      await this.vault.clear();
      console.log('Vault was cleared');
    } catch (err) {
      console.error('vault.service.ts clear()', err);
    }
  }

  async hasBiometrics(): Promise<boolean> {
    return await Device.isBiometricsEnabled();
  }
}
