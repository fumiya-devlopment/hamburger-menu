// スクロール時、グローバルメニューに対してクラス名を付与
window.addEventListener('scroll', function () {
    if (window.scrollY > 200) {
        document.querySelector('.l-header__menu').classList.add('is-active');
    } else {
        document.querySelector('.l-header__menu').classList.remove('is-active');
    }
});

// スクロール時、ハンバーガーメニューのボタンに対してクラス名を付与
window.addEventListener('scroll', function () {
    if (window.scrollY > 200) {
        document.querySelector('.l-header__trigger').classList.add('is-active');
    } else {
        document.querySelector('.l-header__trigger').classList.remove('is-active');
    }
});

// 変数定義
const active = "is-active";
const fixed = "is-fixed";
let flg = false;
let trigger = document.querySelector(".js-trigger-btn");
let menu = document.querySelector(".js-hamburger");
let header = document.querySelector(".js-header");
let line = document.querySelector(".js-trigger-btn .l-header__triggerLine");
let text = document.querySelector(".js-trigger-btn .l-header__triggerText");
let body = document.querySelector("body");

// ハンバーメニューの開閉
trigger.addEventListener("click", (e) => {
    e.currentTarget.classList.toggle(active);
    menu.classList.toggle(active);
    header.classList.toggle(active);
    line.classList.toggle(active);
    text.classList.toggle(active);
    body.classList.toggle(fixed);
});