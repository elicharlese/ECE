describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await expect(element(by.id('welcome'))).toBeVisible();
  });

  it('should connect wallet', async () => {
    await element(by.id('connect-wallet')).tap();
    await expect(element(by.id('wallet-connected'))).toBeVisible();
  });
});
