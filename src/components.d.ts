/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { StringifiedJson } from "./stories/components/color-swatch-group/color-swatch-group";
import { OptionItem } from "./components/zen-dropdown/zen-dropdown";
export namespace Components {
    interface ColorSwatch {
        "color": string;
        /**
          * True if color is considered bright
         */
        "isBrightColor": boolean;
        "varName": string;
    }
    interface ColorSwatchGroup {
        "colors": StringifiedJson;
    }
    interface TextWithDetails {
    }
    interface ZenDropdown {
        /**
          * If true, multiple options can be selected
         */
        "multiselect": boolean;
        /**
          * Array of available options
         */
        "options": Array<OptionItem>;
        "selectedColor": string;
        /**
          * Option key that is unique for each option
         */
        "trackBy": string;
        /**
          * Selected option
         */
        "val": OptionItem;
    }
}
declare global {
    interface HTMLColorSwatchElement extends Components.ColorSwatch, HTMLStencilElement {
    }
    var HTMLColorSwatchElement: {
        prototype: HTMLColorSwatchElement;
        new (): HTMLColorSwatchElement;
    };
    interface HTMLColorSwatchGroupElement extends Components.ColorSwatchGroup, HTMLStencilElement {
    }
    var HTMLColorSwatchGroupElement: {
        prototype: HTMLColorSwatchGroupElement;
        new (): HTMLColorSwatchGroupElement;
    };
    interface HTMLTextWithDetailsElement extends Components.TextWithDetails, HTMLStencilElement {
    }
    var HTMLTextWithDetailsElement: {
        prototype: HTMLTextWithDetailsElement;
        new (): HTMLTextWithDetailsElement;
    };
    interface HTMLZenDropdownElement extends Components.ZenDropdown, HTMLStencilElement {
    }
    var HTMLZenDropdownElement: {
        prototype: HTMLZenDropdownElement;
        new (): HTMLZenDropdownElement;
    };
    interface HTMLElementTagNameMap {
        "color-swatch": HTMLColorSwatchElement;
        "color-swatch-group": HTMLColorSwatchGroupElement;
        "text-with-details": HTMLTextWithDetailsElement;
        "zen-dropdown": HTMLZenDropdownElement;
    }
}
declare namespace LocalJSX {
    interface ColorSwatch {
        "color"?: string;
        /**
          * True if color is considered bright
         */
        "isBrightColor"?: boolean;
        "varName"?: string;
    }
    interface ColorSwatchGroup {
        "colors"?: StringifiedJson;
    }
    interface TextWithDetails {
    }
    interface ZenDropdown {
        /**
          * If true, multiple options can be selected
         */
        "multiselect"?: boolean;
        /**
          * Emitted on any selection change
         */
        "onInput2"?: (event: CustomEvent<OptionItem>) => void;
        /**
          * Array of available options
         */
        "options"?: Array<OptionItem>;
        "selectedColor"?: string;
        /**
          * Option key that is unique for each option
         */
        "trackBy"?: string;
        /**
          * Selected option
         */
        "val"?: OptionItem;
    }
    interface IntrinsicElements {
        "color-swatch": ColorSwatch;
        "color-swatch-group": ColorSwatchGroup;
        "text-with-details": TextWithDetails;
        "zen-dropdown": ZenDropdown;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "color-swatch": LocalJSX.ColorSwatch & JSXBase.HTMLAttributes<HTMLColorSwatchElement>;
            "color-swatch-group": LocalJSX.ColorSwatchGroup & JSXBase.HTMLAttributes<HTMLColorSwatchGroupElement>;
            "text-with-details": LocalJSX.TextWithDetails & JSXBase.HTMLAttributes<HTMLTextWithDetailsElement>;
            "zen-dropdown": LocalJSX.ZenDropdown & JSXBase.HTMLAttributes<HTMLZenDropdownElement>;
        }
    }
}
