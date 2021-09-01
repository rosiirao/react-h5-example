const publicKeyCredentialCreationOptions = {
  challenge: Uint8Array.from('kuuuuuuuuul', c => c.charCodeAt(0)),
  rp: {
    name: 'auth srv',
    id: 'miracle.com',
  },
  user: {
    // user handle, RECOMMENDED a 64 random bytes https://w3c.github.io/webauthn/#sctn-user-handle-privacy
    id: Uint8Array.from('UZSL85T9AFC', c => c.charCodeAt(0)),
    name: 'admin@miracle.com',
    displayName: 'administrator',
  },
  pubKeyCredParams: [{alg: -7, type: 'public-key' as const}],
  authenticatorSelection: {
    authenticatorAttachment: 'cross-platform' as const,
  },
  timeout: 60000,
  attestation: 'direct' as const,
};

const credential = await navigator.credentials.create({
  publicKey: publicKeyCredentialCreationOptions,
});

const randomStringFromServer = 'gph_dap';

const credentialId = 'fin'; // retrieved and saved from registration
const publicKeyCredentialRequestOptions = {
  challenge: Uint8Array.from(randomStringFromServer, c => c.charCodeAt(0)),
  allowCredentials: [
    {
      id: Uint8Array.from(credentialId, c => c.charCodeAt(0)),
      type: 'public-key' as const,
      transports: ['usb' as const, 'ble' as const, 'nfc' as const],
    },
  ],
  timeout: 60000,
};

const assertion = await navigator.credentials.get({
  publicKey: publicKeyCredentialRequestOptions,
});

export default {
  credential,
  assertion,
};
