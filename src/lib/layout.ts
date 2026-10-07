/**
 * Desktop (lg+) sections fill the viewport and scroll independently.
 * Phones keep normal page scrolling, where the tab bar shows one section at a time.
 * The small padding/negative margin keeps card shadows and focus rings from being clipped.
 */
export const SCROLL_PANE = "lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:-m-1 lg:p-1";
