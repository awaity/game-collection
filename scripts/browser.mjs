import { chromium } from "playwright";
export function launchBrowser() {
  return chromium.launch({
    headless: true,
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
      chromium.executablePath(),
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
}
