export function querySelector<T>(
  selector: string,
  srcElement: HTMLElement | undefined = undefined,
): T {
  let src = srcElement || document;

  const element = src.querySelector(selector);

  if (!element) {
    throw new Error(`Cannot find element with selector ${selector}`);
  }

  // I don't know if there's a different way to make it work
  return element as unknown as T;
}

export function querySelectorAll<T>(
  selector: string,
  srcElement: HTMLElement | undefined = undefined,
): T[] {
  let src = srcElement || document;

  const elements = src.querySelectorAll(selector);

  if (!elements) {
    throw new Error(`Cannot find elements with selector ${selector}`);
  }

  return Array.from(elements) as unknown as T[];
}
