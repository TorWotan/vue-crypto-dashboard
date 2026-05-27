export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
}
