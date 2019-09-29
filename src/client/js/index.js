'use strict';

const getAll = selector => {
    return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
}

// Modal関係
const rootEl = document.documentElement;
const $modals = getAll('.modal');
const $deleteModalButtons = getAll('.button-delete');
const $executeDeleteButtons = getAll('.executeDelete');
const $modalCloses = getAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .modal-close-button');

const setDeleteModal = (target, $card, id) => {
    const $target = document.getElementById(target);
    const $content = document.querySelector('.modal-card-body');

    $content.textContent = '';
    $content.insertAdjacentElement('afterbegin', $card);

    const $deleteButton = $content.querySelector('.button-delete');
    $deleteButton.parentNode.removeChild($deleteButton);

    $executeDeleteButtons[0].dataset.id = id;

    rootEl.classList.add('is-clipped');
    $target.classList.add('is-active');
}

const closeModals = () => {
    rootEl.classList.remove('is-clipped');
    $modals.forEach(function ($el) {
        $el.classList.remove('is-active');
    });
}

const executeDelete = id => {
    document.getElementById('deleteTweet').value = id;
    document.tweetForm.submit();
}

if ($deleteModalButtons.length > 0) {
    $deleteModalButtons.forEach($el => {
        $el.addEventListener('click', () => {
            const target = $el.dataset.target;
            const $card  = $el.closest('.card').cloneNode(true);
            const id     = $el.dataset.id;
            setDeleteModal(target, $card, id);
        });
    });
}

if ($executeDeleteButtons.length > 0) {
    $executeDeleteButtons.forEach($el => {
        $el.addEventListener('click', () => {
            const id = $el.dataset.id;
            executeDelete(id);
        });
    });
}

if ($modalCloses.length > 0) {
    $modalCloses.forEach($el => {
        $el.addEventListener('click', () => {
            closeModals();
        });
    });
}

// 通知
(document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
    let $notification = $delete.parentNode;
    $delete.addEventListener('click', () => {
        $notification.parentNode.removeChild($notification);
    });
});

// ファイル選択
(document.querySelectorAll('.file .file-input') || []).forEach(($file) => {
    let $fileName = $file.parentNode.querySelector('.file-name');
    $file.addEventListener('change', () => {
        $fileName.textContent = $file.files[0].name;
    });
});

// ツイート入力に対するバリデーション
(document.querySelectorAll('textarea') || []).forEach($dom => {
    const $textarea = $dom.parentNode;
    const $lengthCount = document.getElementById('textLength');
    $textarea.addEventListener('keyup', event => {
        // 文字数カウントのルール
        // アジア圏の表記だとMax140文字。(英語圏だと280文字で、要は280Byte相当)
        //
        // 半角：0.5文字。@hogehogeとかも同様のカウント。
        // 全角：1文字
        // URL：11.5文字
        const baseStr = event.target.value;

        // URLを含んでいる数
        const urlNum = baseStr.match(/https?:\/\/[^ ]+/g) ? baseStr.match(/https?:\/\/[^ ]+/g).length : 0;

        // URLの部分を除外して文字数カウントする
        const pureStr = event.target.value.replace(/https?:\/\/[^ ]+/g, '');

        // TODO: 改行も0.5文字換算だけど以下の正規表現だとほんのちょっと多くカウントされちゃう
        const halfStr = pureStr.match(/[ -~]+/g) ? pureStr.match(/[ -~]+/g).join() : '';
        const fullStr = pureStr.replace(/[ -~]+/g, ''); // 半角を全部除けば全角だけになるはず。たぶん

        // 合計文字数
        const strLen = urlNum * 11.5 + halfStr.length * 0.5 + fullStr.length;

        // 文字数チェック
        if (strLen > 140) {
            document.querySelector('#send').disabled = true;
            $dom.classList.add('is-danger');
        } else {
            document.querySelector('#send').disabled = false;
            $dom.classList.remove('is-danger');
        }

        // 文字数表示
        $lengthCount.textContent = `${strLen}`;
    });
});