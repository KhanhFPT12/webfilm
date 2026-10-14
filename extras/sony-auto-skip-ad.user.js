// ==UserScript==
// @name         Rạp hồng của Sony – Tự bỏ qua quảng cáo
// @namespace    https://github.com/KhanhFPT12/webfilm
// @version      1.0.0
// @description  Khi nút "Bỏ qua quảng cáo" của trình phát xuất hiện, chờ 3 giây; nếu người xem chưa bấm thì tự bấm giúp.
// @match        https://*.streamc.xyz/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  /** Thời gian chờ người xem tự bấm trước khi script bấm giúp (ms). */
  const DELAY_MS = 3000;
  /** Nút bỏ qua chuẩn của JW Player; chỉ có class jw-skippable khi đã được phép bỏ qua. */
  const SKIP_SELECTOR = ".jw-skip.jw-skippable";

  let pending = null;

  function isVisible(el) {
    if (!el || !el.isConnected) return false;
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  }

  function check() {
    const button = document.querySelector(SKIP_SELECTOR);
    if (!isVisible(button)) {
      // Nút biến mất (người xem đã bấm hoặc quảng cáo kết thúc) -> huỷ hẹn giờ.
      if (pending) {
        clearTimeout(pending.timer);
        pending = null;
      }
      return;
    }
    if (pending && pending.button === button) return;
    if (pending) clearTimeout(pending.timer);

    pending = {
      button,
      timer: setTimeout(() => {
        const current = document.querySelector(SKIP_SELECTOR);
        if (current === button && isVisible(current)) {
          current.click();
          console.info("[Rạp hồng] Đã tự bỏ qua quảng cáo.");
        }
        pending = null;
      }, DELAY_MS),
    };
  }

  const start = () => {
    new MutationObserver(check).observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    // Dự phòng khi thay đổi không kích hoạt MutationObserver.
    setInterval(check, 1000);
    check();
  };

  if (document.documentElement) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
