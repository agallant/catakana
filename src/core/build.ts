declare const __BUILD_SHA__: string;
declare const __BUILD_LABEL__: string;

/** Which build this is: CI's BUILD_LABEL (`main`, `PR #<N>`, `ci`) and short commit SHA. */
export const BUILD_LABEL: string = __BUILD_LABEL__;
export const BUILD_SHA: string = __BUILD_SHA__;
