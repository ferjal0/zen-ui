import { h, Component, Host, Prop, Element } from '@stencil/core';
import { applyPrefix } from '../helpers/helpers';
import { faChevronRight } from '@fortawesome/pro-light-svg-icons';

@Component({
  tag: 'zen-table-cell',
  styleUrl: 'zen-table-cell.scss',
  shadow: true,
})
export class ZenTableCell {
  @Element() host: HTMLZenTableCellElement;

  /** Spanns through whole table */
  @Prop({ reflect: true }) readonly fullSpan: boolean = false;

  /** Can be expanded (read-only) */
  @Prop({ reflect: true, attribute: 'expandable' }) readonly $expandable: boolean = false;

  /** Show checkbox (read-only) */
  @Prop({ reflect: true, attribute: 'selectable' }) readonly $selectable: boolean = false;

  /** Is row selected (read-only) */
  @Prop({ reflect: true, attribute: 'selected' }) readonly $selected: boolean = false;

  /** Is row expanded (read-only) */
  @Prop({ reflect: true, attribute: 'expanded' }) readonly $expanded: boolean = false;

  /** Is row expanded (read-only) */
  @Prop({ reflect: true, attribute: 'depth' }) readonly $depth: number = 0;

  /** Cell is inside header (read-only)  */
  @Prop({ reflect: true, attribute: 'header' }) readonly $header: boolean = false;

  /** Checkbox indeterminate state (read-only)  */
  @Prop() readonly $indeterminate: boolean = false;

  /** Cell remains fixed at the top during scroll (mainly used for headers) */
  @Prop({ reflect: true, attribute: 'sticky' }) readonly $sticky: boolean = false;

  showWidgets(): boolean {
    const isFirstCell = !this.host.previousElementSibling;
    return isFirstCell && (this.$selectable || this.$expandable);
  }

  parentRow(): HTMLZenTableRowElement {
    return this.host.parentElement as HTMLZenTableRowElement;
  }

  onExpandArrowClick(): void {
    this.parentRow().expanded = !this.parentRow().expanded;
  }

  onCheckboxClick(event: Event): void {
    this.parentRow().selected = (event.target as HTMLZenCheckboxElement).checked;
  }

  render(): HTMLTableCellElement {
    const ZenCheckBox = applyPrefix('zen-checkbox', this.host);
    const ZenIcon = applyPrefix('zen-icon', this.host);
    return (
      <Host>
        {this.showWidgets() && (
          <div class="widgets">
            <ZenCheckBox
              indeterminate={this.$indeterminate}
              class={{ checkbox: true, invisible: !this.$selectable }}
              checked={this.$selected}
              onChange={event => this.onCheckboxClick(event)}
            />
            <ZenIcon
              class={{ 'expand-icon': true, invisible: !this.$expandable }}
              size="sm"
              padding="lg"
              icon={faChevronRight}
              onClick={() => this.onExpandArrowClick()}
            />
          </div>
        )}
        <sb-zen-text>
          <slot />
        </sb-zen-text>
      </Host>
    );
  }
}
