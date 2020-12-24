import { newSpecPage } from '@stencil/core/testing';
import { ZenNotification } from '../zen-notification';

describe('Test parameters rendering', () => {
  it.each(['success', 'info', 'warning', 'error'])('Test variant %s is displayed correctly', async variant => {
    const page = await newSpecPage({
      components: [ZenNotification],
      html: `<zen-notification variant="${variant}" />`,
    });
    expect(page.root.getAttribute('variant')).toEqual(variant);
  });

  it('Test parameters are set correctly', async () => {
    const page = await newSpecPage({
      components: [ZenNotification],
      html: `<zen-notification heading="Test Heading" message="Test Message"></zen-notification>`,
    });

    expect(page.root.shadowRoot.querySelector('.title').textContent).toEqual('Test Heading');
    expect(page.root.shadowRoot.querySelector('.message').textContent).toEqual('Test Message');
  });
});
