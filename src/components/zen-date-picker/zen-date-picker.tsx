import { Component, Host, h, Prop, Watch, State, Element, Listen, Method } from '@stencil/core';
import { getDayNumbers, helpers, getMonthName, parseDate } from './date-helpers';
import getYear from 'date-fns/getYear';
import addMonths from 'date-fns/addMonths';
import addYears from 'date-fns/addYears';
import subMonths from 'date-fns/subMonths';
import subYears from 'date-fns/subYears';
import format from 'date-fns/format';
import setDate from 'date-fns/setDate';
import isValid from 'date-fns/isValid';
import {
  faCalendarAlt,
  faChevronDoubleLeft,
  faChevronLeft,
  faChevronRight,
  faChevronDoubleRight,
  faTimes,
} from '@fortawesome/pro-regular-svg-icons';
import { applyPrefix } from '../helpers/helpers';

enum Navigate {
  prevMonth,
  prevYear,
  nextMonth,
  nextYear,
}

/**
 * @event change | Called on date change
 */

@Component({
  tag: 'zen-date-picker',
  styleUrl: 'zen-date-picker.scss',
  shadow: true,
})
export class ZenDatePicker {
  @Element() host: HTMLZenDatePickerElement;

  daysShort = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  dayNums = [];
  popover: HTMLZenPopoverElement = null;
  input: HTMLZenInputElement = null;

  @State() calendarMonthName = '';
  @State() calendarYear = 1970;
  @State() calendarMonth = helpers.today();

  @State() opened = false;

  /** Selected date */
  @Prop({ mutable: true }) formattedDate = '';

  /** Placeholder */
  @Prop() readonly placeholder = 'Select date';

  /** Date format */
  @Prop({ mutable: true }) format = 'MM/dd/yyyy';

  /** Selected date */
  @Prop({ mutable: true }) value: Date = helpers.today();

  /** Close calendar after picking a date */
  @Prop() readonly closeOnClick: boolean = true;

  @Watch('value')
  async dateChanged(value: Date): Promise<void> {
    this.ensureValidFormatString();
    this.formattedDate = isValid(value) ? format(value, this.format) : '';
    if (this.input) {
      this.input.value = this.formattedDate;
    }
    this.calendarMonth = value;
    if (this.popover.visible && this.closeOnClick) {
      this.popover.visible = false;
      this.input.focusInput();
    }
  }

  @Watch('format')
  async formatChanged(_: string, old: string): Promise<void> {
    this.ensureValidFormatString(old);
    this.dateChanged(this.value);
  }

  @Watch('calendarMonth')
  async monthViewedInCalendarChanged(calendarMonth: Date): Promise<void> {
    if (!isValid(calendarMonth)) {
      this.calendarMonth = helpers.today();
    }
    this.dayNums = getDayNumbers(this.calendarMonth);
    this.calendarMonthName = getMonthName(this.calendarMonth);
    this.calendarYear = getYear(this.calendarMonth);
  }

  @Listen('keydown')
  handleKeyDown(ev: KeyboardEvent): boolean {
    if (ev.key === 'Escape') {
      this.popover.toggle(false);
    }

    if (ev.key === ' ') {
      this.popover.toggle();
      ev.preventDefault();
      return false;
    }
  }

  /** Set value to invalid date and formattedDate to empty string. */
  @Method()
  async clearDate(): Promise<void> {
    this.value = new Date(NaN);
    this.host.dispatchEvent(new window.Event('change'));
  }

  ensureValidFormatString(fallback = 'MM/dd/yyyy'): void {
    try {
      format(this.value, this.format);
    } catch (err) {
      this.format = fallback;
    }
  }

  focusChanged(e: Event): void {
    const show = e.target === (this.host as HTMLElement);
    this.popover.toggle(show);
  }

  navigate(type: Navigate): void {
    switch (type) {
      case Navigate.prevMonth:
        this.calendarMonth = subMonths(this.calendarMonth, 1);
        break;
      case Navigate.nextMonth:
        this.calendarMonth = addMonths(this.calendarMonth, 1);
        break;
      case Navigate.prevYear:
        this.calendarMonth = subYears(this.calendarMonth, 1);
        break;
      case Navigate.nextYear:
        this.calendarMonth = addYears(this.calendarMonth, 1);
        break;
    }
  }

  selectDay(day: number): void {
    if (!day) return;
    this.value = setDate(this.calendarMonth, day);
    this.host.dispatchEvent(new window.Event('change'));
  }

  isSelected(day: number): boolean {
    if (!day) return false;

    const itemDate = setDate(this.calendarMonth, day);
    const itemDateFormatted = format(itemDate, this.format);
    if (isValid(this.value)) {
      return itemDateFormatted === this.formattedDate;
    } else {
      const todayFormatted = format(helpers.today(), this.format);
      return itemDateFormatted === todayFormatted;
    }
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      this.clearDate();
      return;
    }

    const date = parseDate(input.value, this.format);

    if (isValid(date)) {
      this.value = date;
      this.host.dispatchEvent(new window.Event('change'));
    } else {
      // revert to old date:
      this.dateChanged(this.value);
    }
  }

  onOpenToggle(popup: HTMLZenPopoverElement): void {
    this.opened = popup.visible;
  }

  componentDidLoad(): void {
    this.dateChanged(this.value);
    this.host.addEventListener('focusin', e => this.focusChanged(e));
  }

  onClearClick(event: Event): void {
    this.clearDate();
    event.stopPropagation();
  }

  render(): HTMLElement {
    const ZenInput = applyPrefix('zen-input', this.host);
    const ZenText = applyPrefix('zen-text', this.host);
    const ZenSpace = applyPrefix('zen-space', this.host);
    const ZenIcon = applyPrefix('zen-icon', this.host);
    const ZenPopover = applyPrefix('zen-popover', this.host);
    return (
      <Host>
        <ZenInput
          id="date-input"
          ref={el => (this.input = el)}
          placeholder={this.placeholder}
          value={this.formattedDate}
          has-focus={this.opened}
          onChange={e => this.onInputChange(e)}
        >
          <ZenIcon slot="leadingSlot" padding="md none md md" class="icon" icon={faCalendarAlt}></ZenIcon>
          <ZenIcon
            slot="trailingSlot"
            padding="md md md none"
            class="icon clear"
            icon={faTimes}
            onMousedown={event => this.onClearClick(event)}
          ></ZenIcon>
        </ZenInput>
        <ZenPopover
          class="calendar"
          tabindex={this.opened ? 0 : -1}
          ref={el => (this.popover = el)}
          interactive
          position="bottom-start"
          close-on-target-click="false"
          onVisibleChange={e => this.onOpenToggle(e.target)}
        >
          <ZenSpace class="navigation" padding="sm lg" horizontal-align="center" vertical-align="stretch">
            <ZenIcon
              class="icon"
              icon={faChevronDoubleLeft}
              size="sm"
              onClick={() => this.navigate(Navigate.prevYear)}
            ></ZenIcon>
            <ZenIcon
              icon={faChevronLeft}
              size="sm"
              class="icon fill"
              onClick={() => this.navigate(Navigate.prevMonth)}
            ></ZenIcon>
            <ZenText align="center" class="date" uppercase bold>
              {this.calendarMonthName} {this.calendarYear}
            </ZenText>
            <ZenIcon
              icon={faChevronRight}
              size="sm"
              class="icon fill"
              onClick={() => this.navigate(Navigate.nextMonth)}
            ></ZenIcon>
            <ZenIcon
              class="icon"
              icon={faChevronDoubleRight}
              size="sm"
              onClick={() => this.navigate(Navigate.nextYear)}
            ></ZenIcon>
          </ZenSpace>
          <div class="days">
            <ZenSpace padding="lg" horizontal-align="space-around">
              {this.daysShort.map(dayName => (
                <ZenText class="day-name">{dayName}</ZenText>
              ))}
            </ZenSpace>
          </div>
          <ZenSpace padding="xs lg lg" spacing="none">
            {this.dayNums.map(num => (
              <ZenText
                class={{
                  'day-num': true,
                  empty: !num,
                  selected: this.isSelected(num),
                }}
                align="center"
                onClick={() => {
                  this.selectDay(num);
                }}
              >
                {num || ''}
              </ZenText>
            ))}
          </ZenSpace>
        </ZenPopover>
      </Host>
    );
  }
}
