# Test App

Test app for Auth Connect (and soon Identity Vault)

## Identity Vault Issue
Comment out `lockAfterBackgrounded` property. When a call is made in Android (eg `lock`) an error occurs.

## Angular Zone Quirk
When Auth Connect events onLoginSuccess and OnLogout are fired they run outside ngZone. In AuthenticationService.ts line 29 a patch was needed: this.ngZone.run(() to ensure that the UI reflects the authenticated state.

Reproduction Steps:
- Comment the lines for this.ngZone.run(() in AuthenticationService.ts
- Run the app, sign in and out several times
- Notice that the state of authenticated doesnt update and buttons do not show/hide as expected
- NgZone.IsInAngularZone() will return false  
