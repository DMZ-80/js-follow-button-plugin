import './style.scss'
class FollowButton {
/**
 * @param {Element} element - ホバー判定の対象となる要素
 * @param {Object} [options={}] - カスタマイズオプション
 * @param {number} [options.speed=0.12] - 追従速度（0〜1の範囲、値が小さいほど慣性が強くなる）
 * @param {string} [options.label='Click'] - ボタンに表示するテキスト
 * @param {string} [options.className='follow-button'] - ボタンに付与するCSSクラス名
 * @param {Object} [options.offset={x:0, y:0}] - カーソル中心からの表示位置オフセット
 * @param {number} [options.offset.x] - 横方向のオフセット(px)
 * @param {number} [options.offset.y] - 縦方向のオフセット(px)
 */
constructor(element, options = {}) {
  this.container = element;
  this.options = Object.assign({
    speed: 0.12, // 慣性の速さ
    label: 'Click', // 表示テキスト
    className: 'follow-button', // チップのクラス
    offset: {
      x: 0,
      y: 0
    } // 中心からのズレ (px)
  }, options);

  this.mouseX = 0;
  this.mouseY = 0;
  this.currentX = 0;
  this.currentY = 0;
  this.isActive = false;

  this.init();
}

/**
 * 初期化処理：ボタン要素の作成とイベントリスナーの登録を行う。
 * タッチデバイスの場合は処理をスキップする。
 */
init() {
  // タッチデバイス判定（タッチが有効な場合はボタンを作成せず終了）
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return;

  // 追従用エレメントの作成
  this.follower = document.createElement('div');
  this.follower.className = this.options.className;
  this.follower.innerText = this.options.label || this.container.getAttribute('data-label') || 'Read More';
  document.body.appendChild(this.follower);

  // イベントリスナーの登録
  window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
  this.container.addEventListener('mouseenter', () => this.activate());
  this.container.addEventListener('mouseleave', () => this.deactivate());

  // アニメーションループ開始
  this.animate();
}

/**
 * マウス移動時の座標更新処理
 * @param {MouseEvent} e - マウスイベントオブジェクト
 */
handleMouseMove(e) {
  this.mouseX = e.clientX;
  this.mouseY = e.clientY;
}

/**
 * ボタンを表示状態にする
 */
activate() {
  if (!this.follower) return;
  this.isActive = true;
  this.follower.classList.add('active');
}

/**
 * ボタンを非表示状態にする
 */
deactivate() {
  if (!this.follower) return;
  this.isActive = false;
  this.follower.classList.remove('active');
}

/**
 * 慣性アニメーションの更新ループ
 * requestAnimationFrameを使用して座標を滑らかに更新する
 */
animate() {
  if (!this.follower) return;

  // イージング計算
  this.currentX += (this.mouseX - this.currentX) * this.options.speed;
  this.currentY += (this.mouseY - this.currentY) * this.options.speed;

  // 位置の更新
  const rect = this.follower.getBoundingClientRect();
  const posX = this.currentX - (rect.width / 2) + (this.options.offset.x || 0);
  const posY = this.currentY - (rect.height / 2) + (this.options.offset.y || 0);

  this.follower.style.left = `${posX}px`;
  this.follower.style.top = `${posY}px`;

  requestAnimationFrame(() => this.animate());
}
}

/**
 * プロトタイプ拡張
 * Element, NodeList, HTMLCollection に対して followButton メソッドを追加する
 */
[Element, NodeList, HTMLCollection].forEach((constructor) => {
constructor.prototype.followButton = function (options) {
  if (this instanceof Element) {
    new FollowButton(this, options);
  } else {
    Array.from(this).forEach((el) => {
      if (el instanceof Element) new FollowButton(el, options);
    });
  }
  return this;
};
});

document.querySelectorAll('.target-zone')[0].followButton({
speed: 0.15,
label: 'offset: { x: 60, y: 60 }',
offset: { x: 60, y: 60 }
});

document.querySelectorAll('.target-zone')[1].followButton({
speed: 0.1,
label: 'offset: { x: 0, y: -80 }',
offset: { x: 0, y: -80 }
});
