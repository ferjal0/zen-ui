import { Component, Prop, Host, h, Watch, Element, Event, EventEmitter } from '@stencil/core';
import { modalsService } from './zen-modals-service';

@Component({
  tag: 'zen-modal',
  styleUrl: 'zen-modal.scss',
  shadow: true,
})

/**
 * @slot header - Put custom content in header
 */
export class ZenModal {
  @Element() hostElement: HTMLZenModalElement;

  /** Set to true to show and false to hide modal */
  @Prop({ mutable: true }) show = false;

  /** Set to true to show and false to hide modal */
  @Prop() readonly label: string = 'Testing label';

  /** Top-right X button clicked */
  @Event() cancelClicked: EventEmitter<undefined>;

  @Watch('show')
  async showChanged(show: boolean): Promise<void> {
    if (show) {
      modalsService.makeTopmost(this.hostElement);
    } else {
      modalsService.modalClosed(this.hostElement);
    }
  }

  closeIt(): void {
    this.show = false;
  }

  onCancelClicked(): void {
    this.cancelClicked.emit();
  }

  render(): HTMLElement {
    return (
      <Host>
        {this.show ? (
          <div>
            <div class="dimmer"></div>
            <div class="window">
              <div class="header">
                <slot name="header">
                  <zen-text class="title" size="2xl">
                    {this.label}
                  </zen-text>
                  <div class="x-button" onClick={() => this.onCancelClicked()}>
                    x
                  </div>
                </slot>
              </div>
              <div class="content">
                <slot>Zen-ui Modal</slot>
              </div>
              <div class="buttons">
                <zen-button onClick={() => this.closeIt()}>Close</zen-button>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </Host>
    );
  }
}
