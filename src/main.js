import './style.scss'
/**
 * 慣性追従ボタンアニメーションクラス
 * 特定の要素にホバーした際、マウスカーソルに追従するボタンを生成・制御する。
 */
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
      speed: 0.12,// 慣性の速さ
      label: 'Click',// 表示テキスト
      className: 'follow-button',// チップのクラス
      offset: {
        x: 0,
        y: 0
      }// 中心からのズレ (px)
    }, options);

    this.mouseX = 0;
    this.mouseY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.isActive = false;

    this.init();
  }

  /**
   * 初期化処理：ボタン要素の作成とイベントリスナーの登録を行う
   */
  init() {
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
   * @private
   */
  handleMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  /**
   * ボタンを表示状態にする
   * @public
   */
  activate() {
    this.isActive = true;
    this.follower.classList.add('active');
  }

  /**
   * ボタンを非表示状態にする
   * @public
   */
  deactivate() {
    this.isActive = false;
    this.follower.classList.remove('active');
  }

  /**
   * 慣性アニメーションの更新ループ
   * requestAnimationFrameを使用して座標を滑らかに更新する
   * @private
   */
  animate() {
    // イージング計算
    this.currentX += (this.mouseX - this.currentX) * this.options.speed;
    this.currentY += (this.mouseY - this.currentY) * this.options.speed;

    // 位置の更新
    // 中心座標 (rect.width/2) に options.offset 分を加算
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

// 1. 右下に 60px ずつずらす例
document.querySelectorAll('.target-zone')[0].followButton({
  speed: 0.15,
  label: 'Bottom Right ✨',
  offset: { x: 60, y: 60 }
});

// 2. 真上に 80px ずらす例
document.querySelectorAll('.target-zone')[1].followButton({
  speed: 0.1,
  label: 'On Top 👆',
  offset: { x: 0, y: -80 }
});
