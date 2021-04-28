import { Component, Host, h, Event, EventEmitter, Element, Prop } from '@stencil/core';

@Component({
  tag: 'zen-tab',
  styleUrl: 'zen-tab.scss',
  shadow: true,
})
export class ZenTab {
  @Element() host: HTMLZenTabElement;

  /** Set tab selected */
  @Prop({ reflect: true }) readonly selected: boolean = false;

  /** Tab selected event */
  @Event() zenSelect: EventEmitter<void>;

  onClick(): void {
    this.zenSelect.emit();
  }

  render(): HTMLZenTabElement {
    return (
      <Host onClick={() => this.onClick()}>
        <slot></slot>
      </Host>
    );
  }
}
