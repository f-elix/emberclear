import * as nacl from 'emberclear/../workers/crypto/utils/nacl';
import { module, test } from 'qunit';

module('Workers | Crypto | nacl', function () {
  test('generateAsymmetricKeys | works', async function (assert) {
    const boxKeys = await nacl.generateAsymmetricKeys();

    assert.ok(boxKeys.publicKey);
    assert.ok(boxKeys.privateKey);
  });

  test('generateSigningKeys | works', async function (assert) {
    const signingKeys = await nacl.generateSigningKeys();

    assert.ok(signingKeys.publicSigningKey);
    assert.ok(signingKeys.privateSigningKey);
  });

  test('encryptFor/decryptFrom | works with Uint8Array', async function (assert) {
    const receiver = await nacl.generateAsymmetricKeys();
    const sender = await nacl.generateAsymmetricKeys();

    const msgAsUint8 = Uint8Array.from([104, 101, 108, 108, 111]); // hello
    const ciphertext = await nacl.encryptFor(msgAsUint8, receiver.publicKey, sender.privateKey);
    const decrypted = await nacl.decryptFrom(ciphertext, sender.publicKey, receiver.privateKey);

    assert.deepEqual(msgAsUint8, decrypted);
  });

  test('encryptFor/decryptFrom | works with large data', async function (assert) {
    const receiver = await nacl.generateAsymmetricKeys();
    const sender = await nacl.generateAsymmetricKeys();

    let bigMsg: number[] = [];

    for (let i = 0; i < 128; i++) {
      bigMsg = bigMsg.concat([104, 101, 108, 108, 111]);
    }

    const msgAsUint8 = Uint8Array.from(bigMsg); // hello * 128 = 640 Bytes
    const ciphertext = await nacl.encryptFor(msgAsUint8, receiver.publicKey, sender.privateKey);
    const decrypted = await nacl.decryptFrom(ciphertext, sender.publicKey, receiver.privateKey);

    assert.deepEqual(msgAsUint8, decrypted);
  });

  test('sign/open | works with Uint8Array', async function (assert) {
    const sender = await nacl.generateSigningKeys();

    const msgAsUint8 = Uint8Array.from([104, 101, 108, 108, 111]); // hello
    const signedText = await nacl.sign(msgAsUint8, sender.privateSigningKey);
    const openedText = await nacl.openSigned(signedText, sender.publicSigningKey);

    assert.deepEqual(msgAsUint8, openedText);
  });

  test('sign/open | works with large data', async function (assert) {
    const sender = await nacl.generateSigningKeys();

    let bigMsg: number[] = [];

    for (let i = 0; i < 128; i++) {
      bigMsg = bigMsg.concat([104, 101, 108, 108, 111]);
    }

    const msgAsUint8 = Uint8Array.from(bigMsg); // hello * 128 = 640 Bytes
    const signedText = await nacl.sign(msgAsUint8, sender.privateSigningKey);
    const openedText = await nacl.openSigned(signedText, sender.publicSigningKey);

    assert.deepEqual(msgAsUint8, openedText);
  });

  test('splitNonceFromMessage | separates the nonce', async function (assert) {
    // prettier-ignore
    const msg = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
    ];

    const messageWithNonce = Uint8Array.from([...msg, 25]);

    const [nonce, notTheNonce] = await nacl.splitNonceFromMessage(messageWithNonce);

    assert.deepEqual(nonce, Uint8Array.from(msg));
    assert.deepEqual(notTheNonce, Uint8Array.from([25]));
  });
});
