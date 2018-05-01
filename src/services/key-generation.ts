import Service from '@ember/service';

import { generateNewKeys } from 'emberclear/src/utils/nacl';

// import * as bip39 from 'bip39';

export default class KeyGeneration extends Service {
  newKeyPair(): string {
    // TODO: do the mnenonic myself.
    //       bip39 is too tied to cryptocurrencies...
    // return bip39.generateMnemonic();

    const { publicKey, privateKey } = generateNewKeys();

    // convert to bip-format

    return privateKey;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'key-generation': KeyGeneration;
  }
}