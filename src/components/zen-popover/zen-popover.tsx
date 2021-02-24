import { Component, Host, h, Element, Prop, Watch, State, Event, EventEmitter, Method } from '@stencil/core';
import { createPopper, Placement, Offsets } from '@popperjs/core';
import { getComposedPath, waitNextFrame } from '../helpers/helpers';
import { showWithAnimation, hideWithAnimation, showInstantly, hideInstantly } from '../helpers/animations';
import { TriggerEvent } from '../helpers/types';

@Component({
  tag: 'zen-popover',
  styleUrl: 'zen-popover.scss',
  shadow: true,
})
export class ZenPopover {
  private popperInstance = null;
  private targetSlotEl: HTMLElement = null;
  private popup: HTMLElement = null;
  private clickHandler = undefined;
  private showTimer = undefined;
  private hideTimer = undefined;
  private clickHandlerTimer = undefined;
  private showDelay = 0;
  private hideDelay = 0;
  private animate = false;

  @Element() host: HTMLZenPopoverElement;

  @State() actualPosition: Placement;

  /** Show/hide popover */
  @Prop({ mutable: true }) visible = false;

  /** Position */
  @Prop() readonly position: Placement = 'bottom-end';

  /** Triggering event */
  @Prop() readonly triggerEvent: TriggerEvent = 'click';

  /** Close on click outside */
  @Prop() readonly closeOnClickOut: boolean = true;

  /** Close on target click if opened */
  @Prop() readonly closeOnTargetClick: boolean = true;

  /** Popover offset */
  @Prop() readonly offset: Offsets = { x: 0, y: 8 };

  /** User can click content within popover */
  @Prop({ reflect: true }) readonly interactive: boolean = false;

  /** Show and hide delay. Only affects show on hover! Eg. '100' - both show & hide 100ms. '100 500' - show 100ms, hide 500ms. */
  @Prop() readonly delay: string = '0';

  /** Visibility changed */
  @Event() visibilityChange: EventEmitter<void>;

  @Watch('visible')
  async visibleChanged(visible: boolean): Promise<void> {
    const show = async (): Promise<void> => {
      if (this.animate) {
        showInstantly(this.popup); // show it so popper can get dimensions
        await this.createPopper();
        hideInstantly(this.popup);
        // If it isn't visible (prev hide anim has complete), force start position.
        // Otherwise continue from current position, to prevent anim jumping.
        showWithAnimation(this.popup);
      } else {
        await this.createPopper();
        showInstantly(this.popup);
      }

      if (this.closeOnClickOut) {
        this.clickHandler = event => this.closeOnClickOutside(event);
        clearTimeout(this.clickHandlerTimer);
        this.clickHandlerTimer = setTimeout(() => {
          document.addEventListener('mousedown', this.clickHandler);
        }, 50);
      }
    };

    const hide = (): void => {
      if (this.animate) {
        hideWithAnimation(this.popup, () => this.destroyPopper());
      } else {
        hideInstantly(this.popup);
        this.destroyPopper();
      }

      // remove event listener for click outside
      clearTimeout(this.clickHandlerTimer);
      if (this.clickHandler) document.removeEventListener('mousedown', this.clickHandler);
    };

    clearTimeout(this.hideTimer);
    clearTimeout(this.showTimer);
    visible ? show() : hide();
    this.animate = true; // After initial `visible` is set, we can animate
  }

  @Watch('delay')
  async delayPropChanged(delay: string): Promise<void> {
    const values = delay.match(/([0-9]+)/g);
    this.showDelay = values ? parseInt(values[0], 10) || 0 : 0;
    this.hideDelay = values ? parseInt(values[1], 10) || this.showDelay : 0;
  }

  /** Close an opened dropdown menu */
  @Method()
  async toggle(show?: boolean): Promise<void> {
    if (show === undefined) {
      show = !this.visible;
    }
    if (show === this.visible) return;
    this.visible = show;
  }

  addTriggerEvents(): void {
    const show = () => {
      clearTimeout(this.hideTimer);
      clearTimeout(this.showTimer);
      if (!this.showDelay) {
        this.visible = true;
      } else {
        this.showTimer = setTimeout(() => {
          this.visible = true;
        }, this.showDelay);
      }
    };

    const hide = () => {
      clearTimeout(this.hideTimer);
      clearTimeout(this.showTimer);
      const instantHide = (!this.interactive || this.triggerEvent === 'click') && !this.hideDelay;
      if (instantHide) {
        this.visible = false;
        return;
      }

      // If it's interactive, user should have a little time to move
      //  mouse over popover before it closes:
      const timeToMoveMouseOverPopover = 120;
      const delay = Math.max(timeToMoveMouseOverPopover, this.hideDelay);
      this.hideTimer = setTimeout(() => {
        this.visible = false;
      }, delay);
    };

    if (this.triggerEvent === 'click' || this.closeOnTargetClick) {
      this.targetSlotEl.addEventListener('mousedown', () => {
        if (!this.closeOnTargetClick && this.visible) return;
        this.visible = this.triggerEvent === 'click' ? !this.visible : false;
      });
    }

    if (this.triggerEvent === 'hover') {
      this.targetSlotEl.addEventListener('mouseover', () => show());
      this.targetSlotEl.addEventListener('mouseout', () => hide());
      this.targetSlotEl.addEventListener('touchstart', () => show());
      this.targetSlotEl.addEventListener('touchcancel', () => (this.visible = false));
      // Stop hideTimer when mouse is over tooltip:
      this.popup.addEventListener('mouseover', () => show());
      this.popup.addEventListener('mouseout', () => hide());
    }
  }

  async closeOnClickOutside(event: MouseEvent): Promise<void> {
    const path = getComposedPath(event);
    const clickedInPopup = this.interactive && path.find(n => n === this.popup);
    const clickedInTarget = path.find(n => n === this.targetSlotEl);
    if (clickedInPopup || clickedInTarget) return;

    await waitNextFrame(); // prevent race with click-open
    this.visible = false;
  }

  async createPopper(): Promise<void> {
    const popupWrap = this.host.shadowRoot.querySelector('.popup-wrap') as HTMLElement;
    this.popperInstance = createPopper(this.targetSlotEl, popupWrap, {
      placement: this.position,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [this.offset.x, this.offset.y],
          },
        },
      ],
    });
    await waitNextFrame();
    this.actualPosition = this.popperInstance.state.placement;
    this.visibilityChange.emit();
  }

  destroyPopper(): void {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
      this.visibilityChange.emit();
    }
  }

  componentDidLoad(): void {
    this.targetSlotEl = this.host.previousElementSibling as HTMLElement;

    // Throw error if there is no target element specified
    if (!this.targetSlotEl) {
      console.error('No target element specified for the target slot!');
      return;
    }

    this.popup = this.host.shadowRoot.querySelector('.popup');

    this.addTriggerEvents();
    this.visibleChanged(this.visible);
    this.delayPropChanged(this.delay);
  }

  render(): HTMLElement {
    return (
      <Host>
        <div class="popup-wrap" role="tooltip">
          <div class="popup" data-position={this.actualPosition}>
            <div id="arrow" data-popper-arrow></div>
            <slot />
          </div>
        </div>
      </Host>
    );
  }
}
