import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  AndroidBiometricCryptoPreference,
  BrowserVault, Device, DeviceSecurityType,
  IdentityVaultConfig, Vault, VaultErrorCodes, VaultType
} from '@ionic-enterprise/identity-vault';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class VaultService {

  config: IdentityVaultConfig = {
    key: 'io.ionic.iv-test-bio8',
    type: VaultType.DeviceSecurity,
    deviceSecurityType: DeviceSecurityType.Biometrics,
    //androidBiometricsPreferStrongVaultOrSystemPasscode: AndroidBiometricCryptoPreference.StrongVault,
    lockAfterBackgrounded: 2000,
    shouldClearVaultAfterTooManyFailedAttempts: true,
    customPasscodeInvalidUnlockAttempts: 10,
    unlockVaultOnLoad: false,
  };

  vault: Vault | BrowserVault;

  constructor(private platform: Platform) { }

  async init() {
    this.vault = new Vault();
    await this.vault.initialize(this.config);
    this.vault.onConfigChanged(() => {
      console.log('Vault configuration was changed', this.config);
    });
    this.vault.onLock(() => {
      console.log('Vault was locked');
    });
    this.vault.onUnlock(() => {
      console.log('Vault was unlocked');
    });
    this.vault.onError(async (err) => {
      console.error('Vault error', err);
      if (err.code === VaultErrorCodes.InvalidatedCredential) {
        console.log('Received the expected invalidated credentials');
        console.log('vault locked?', await this.vault.isLocked());
        console.log('vault empty?', await this.vault.isEmpty());
        // this.config.type = VaultType.InMemory;
        // this.config.deviceSecurityType = DeviceSecurityType.None;
        // console.log('Before update config to in memory');
        // await this.vault.updateConfig(this.config);
        // console.log('Completed update to in memory vault');
        // await this.vault.setValue('blar', 'changed');
        // console.log('Value was set');
      } else {
        console.error(err.code + ': ' + err.message);
      }
    });

    //await Device.setHideScreenOnBackground(true);
  }

  async updateConfig(config: IdentityVaultConfig): Promise<void> {
    await this.vault.updateConfig(config);
  }

  // This is used to test the vault migrator
  async testMigrate() {
    const data: any = '{\"_ionicAuth.authResponse.5x95216jDA3rl5NSx4nYEFJ-2fLuKhjl31KIyqy_etY\":{\"token_type\":\"Bearer\",\"scope\":\"membership_entitlements openid email profile\",\"refresh_token\":\"bcVpkO7Uhcyxsdq2YceosoDb5shlE5zrsjz3utpBp4I\",\"created_at\":1633621013,\"id_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlRFMldDOGlzb0UtQTlrNG9uc1NWdERNdlg2bmY3c2V3NjBveU5PNWNaMkkifQ.eyJpc3MiOiJodHRwczovL2F0ay1hdXRoLXN0YWdpbmcuaGVyb2t1YXBwLmNvbS8iLCJzdWIiOiI5NzczMzI2IiwiYXVkIjoiNXg5NTIxNmpEQTNybDVOU3g0bllFRkotMmZMdUtoamwzMUtJeXF5X2V0WSIsImV4cCI6MTYzMzYyMTEzMywiaWF0IjoxNjMzNjIxMDEzLCJub25jZSI6IjdYLlB0LjlRaFFHSS5reFRBNFB-IiwiZW1haWwiOiJhbGV4LnJpbmRvbmVAYW1lcmljYXN0ZXN0a2l0Y2hlbi5jb20iLCJmdWxsX25hbWUiOiJBbGV4IFJpbmRvbmUiLCJtZW1iZXJzaGlwX2VudGl0bGVtZW50cyI6eyJpZCI6OTc3MzMyNiwiZXh0ZXJuYWxfaWQiOm51bGwsImlzX25ldyI6ZmFsc2UsInJvbGUiOiJzdXBlci1hZG1pbiIsInBhY2thZ2VfbmFtZSI6Ik11bHRpLVNpdGUgTWVtYmVyc2hpcCIsInNlZ21lbnQiOiJtdWx0aXNpdGUiLCJhY3RpdmUiOlsiY29va2Jvb2tfY29sbGVjdGlvbiIsImF0ayIsImNjbyIsImNpbyJdfX0.s586aFZ6GLd1D3G3mAI8IxtizuOjSC8S79N-djuWxOJjheggiEirnGZTKVHtHJKpMMWw1GQDzcIM8v_Q9qxJ5ijEkncjhsW-izF_v3yu0O_Sm4PT6Z-bBC62Furr8q5WhBTdWj-a6okz5J0maBl5Qs60zX8a-bNYE6fl9GVudzIwG0UYv_Bf0jlJDgWV2eWS3ha0pmHyp40KvmW1Atsn4F50_VC-RkTJqqAjAWBtQgosY8Ow4rM4JP2Sa1amfxiED8pPg98PDkDBUh-Eki4gFj4ezJbQgwn74K6ybu45mi319ihXsatWb2IjSqU7FN-N6RDrWc21GBhaa7YIOgOdgA\",\"access_token\":\"qIGSWkyN9DZGS2Glvq0Qj85Lvm-i46NGrJSBGu8Or4A\",\"expires_in\":60},\"_ionicAuth.refreshToken.5x95216jDA3rl5NSx4nYEFJ-2fLuKhjl31KIyqy_etY\":\"bcVpkO7Uhcyxsdq2YceosoDb5shlE5zrsjz3utpBp4I\",\"_ionicAuth.accessToken.5x95216jDA3rl5NSx4nYEFJ-2fLuKhjl31KIyqy_etY\":\"qIGSWkyN9DZGS2Glvq0Qj85Lvm-i46NGrJSBGu8Or4A\",\"_ionicAuth.idToken.5x95216jDA3rl5NSx4nYEFJ-2fLuKhjl31KIyqy_etY\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlRFMldDOGlzb0UtQTlrNG9uc1NWdERNdlg2bmY3c2V3NjBveU5PNWNaMkkifQ.eyJpc3MiOiJodHRwczovL2F0ay1hdXRoLXN0YWdpbmcuaGVyb2t1YXBwLmNvbS8iLCJzdWIiOiI5NzczMzI2IiwiYXVkIjoiNXg5NTIxNmpEQTNybDVOU3g0bllFRkotMmZMdUtoamwzMUtJeXF5X2V0WSIsImV4cCI6MTYzMzYyMTEzMywiaWF0IjoxNjMzNjIxMDEzLCJub25jZSI6IjdYLlB0LjlRaFFHSS5reFRBNFB-IiwiZW1haWwiOiJhbGV4LnJpbmRvbmVAYW1lcmljYXN0ZXN0a2l0Y2hlbi5jb20iLCJmdWxsX25hbWUiOiJBbGV4IFJpbmRvbmUiLCJtZW1iZXJzaGlwX2VudGl0bGVtZW50cyI6eyJpZCI6OTc3MzMyNiwiZXh0ZXJuYWxfaWQiOm51bGwsImlzX25ldyI6ZmFsc2UsInJvbGUiOiJzdXBlci1hZG1pbiIsInBhY2thZ2VfbmFtZSI6Ik11bHRpLVNpdGUgTWVtYmVyc2hpcCIsInNlZ21lbnQiOiJtdWx0aXNpdGUiLCJhY3RpdmUiOlsiY29va2Jvb2tfY29sbGVjdGlvbiIsImF0ayIsImNjbyIsImNpbyJdfX0.s586aFZ6GLd1D3G3mAI8IxtizuOjSC8S79N-djuWxOJjheggiEirnGZTKVHtHJKpMMWw1GQDzcIM8v_Q9qxJ5ijEkncjhsW-izF_v3yu0O_Sm4PT6Z-bBC62Furr8q5WhBTdWj-a6okz5J0maBl5Qs60zX8a-bNYE6fl9GVudzIwG0UYv_Bf0jlJDgWV2eWS3ha0pmHyp40KvmW1Atsn4F50_VC-RkTJqqAjAWBtQgosY8Ow4rM4JP2Sa1amfxiED8pPg98PDkDBUh-Eki4gFj4ezJbQgwn74K6ybu45mi319ihXsatWb2IjSqU7FN-N6RDrWc21GBhaa7YIOgOdgA\"}';
    const ob = JSON.parse(data);
    console.log('before import');
    console.log('stuff');
    await this.vault.importVault(ob);
    console.log('after import');
  }

  async isEmpty(): Promise<boolean> {
    return await this.vault.isEmpty();
  }

  async switchPasscode() {
    try {
      this.vault = new Vault();
      this.vault.onPasscodeRequested(async (isPasscodeSetRequest: boolean) => {
        console.log('Passcode requested', isPasscodeSetRequest);
        if (isPasscodeSetRequest) {
          await this.vault.setCustomPasscode('1234');
        } else {
          await this.vault.setCustomPasscode('1234');
        }
      })
      this.vault.initialize(
        {
          key: 'io.ionic.iv-test',
          type: VaultType.CustomPasscode,
          deviceSecurityType: DeviceSecurityType.None,
          lockAfterBackgrounded: 2000,
          shouldClearVaultAfterTooManyFailedAttempts: false,
          customPasscodeInvalidUnlockAttempts: 10,
          unlockVaultOnLoad: false,
        }
      );
      console.log('Call clear...');
      this.vault.clear();
      console.log('Call setValue...');
      await this.vault.setValue('encryption_key', 'ccc66ced-f27c-4556-9b6d-3585e9953c29');
      console.log('Called setValue.');
      console.log('Call lock...');
      await this.lock();
      const result = await this.vault.getValue('encryption_key');
      console.log('result', result);


    } catch (err) {
      alert(`${err.message} (Error Code: ${err.code})`);
    }
  }

  async verifyPasscode() {
    await this.lock();
    const result = await this.vault.getValue('encryption_key');
    if (result == 'ccc66ced-f27c-4556-9b6d-3585e9953c29') {
      alert('Expected result is good');
    } else {
      alert(`Error: vault doesnt have expected value. Has ${result}`);
      console.error('result', result);
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

  async getData(info = ''): Promise<string> {
    console.log(`Get Data${info}....`);
    try {
      const data = await this.vault.getValue('blar');

      console.log('Get Data', data);
      return data;
    } catch (err) {
      console.error(`Failed to getData`, err);
    }
  }

  async setPasscode(passcode: string) {
    try {
      await this.vault.setCustomPasscode(passcode);
    } catch (err) {
      console.error('vault.service.ts setPasscode()', err);
    }
  }

  async setData(info = '') {
    try {
      console.log(`Set Data${info}....`);
      await this.vault.setValue('blar', 'test');
      console.log('Data is set');
    } catch (err) {
      console.error('vault.service.ts setData()', err);
    }
  }

  public async delay(ms: number): Promise<void> {
    return new Promise(resolve =>
      setTimeout(resolve, ms)
    );
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

  async getBioType(): Promise<string> {
    const strength = await Device.getBiometricStrengthLevel();
    const securehw = await Device.hasSecureHardware();
    const hw = Device.getAvailableHardware();
    return `${strength} ${securehw} ${JSON.stringify(hw)}`;
  }

  async showBiometricPrompt(): Promise<void> {
    await Device.showBiometricPrompt({
      androidBiometricsNegativeButtonText: 'Cancel',
      androidBiometricsPromptTitle: 'Unlock',
      iosBiometricsLocalizedCancelTitle: 'Cancel',
      iosBiometricsLocalizedReason: 'Unlock',
      //iosBiometricsLocalizedFallbackTitle: 'Use Passcode'
    });
  }
}
