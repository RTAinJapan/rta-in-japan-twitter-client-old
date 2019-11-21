import { select, call, put, take, takeEvery, race } from 'redux-saga/effects';
import * as actions from '../actions';
import { confirmSaga } from './dialog';
import { RootState } from '../reducers';
import { PreviewFile } from '../types/global';
import { loginCheck, logoutDiscord } from '../service/discord';

export default function* rootSaga() {
  yield call(fetchListAndApplyState);
  yield takeEvery(actions.submitTweet, submitTweet);
  yield takeEvery(actions.deleteTweet, deleteTweet);
  yield takeEvery(actions.uploadMedia, uploadMedia);
  yield takeEvery(actions.logoutDiscord, logoutDiscord);
  yield call(loginCheck);
}

function* fetchListAndApplyState() {
  try {
    yield put(actions.changeNotify(true, 'info', 'データ取得中'));

    // const result = yield call(fetchList);
    // yield put(actions.updateList(result));

    yield put(actions.closeNotify());
  } catch (error) {
    yield put(actions.changeNotify(true, 'error', 'データ取得でエラーが発生しました'));
    console.error(error);
  }
}

function* submitTweet(action: ReturnType<typeof actions.submitTweet>) {
  try {
    const result = yield call(confirmSaga, 'ツイートを送信します。よろしいですか？', 'info', `${action.payload}`);
    if (result) {
      alert('送信処理');
    } else {
      alert('キャンセル処理(何もしない)');
    }
  } catch (e) {
    yield put(actions.changeDialog({ show: true, type: 'error', message: '' }));
  }
}

/**
 * ツイート削除
 * @param action
 */
function* deleteTweet(action: ReturnType<typeof actions.deleteTweet>) {
  try {
    alert(`id: ${action.payload} の削除要求を投げる`);
  } catch (e) {
    // エラーハンドリング
  }
}

/**
 * アップロード対象としてメディアが登録された時の動き
 * @param action
 */
function* uploadMedia(action: ReturnType<typeof actions.uploadMedia>) {
  try {
    console.log('アップロードされた');
    console.log(action.payload);

    const nowMedia = action.payload[0];

    const state: RootState = yield select();
    const orgMedia = state.reducer.post.media;

    // チェック
    // 同名のファイルは不可
    for (const media of orgMedia) {
      if (media.name === nowMedia.name) throw new Error('同名のファイルは選択できません。');
    }

    // リストに登録できるのは、動画1 or 画像1～4
    // 動画があるのに何か指定された
    const isOrgMediaIncludeVideo = orgMedia.filter(media => media.type.includes('video')).length > 0;
    if (isOrgMediaIncludeVideo) throw new Error('アップロードできるのは動画1つ、もしくは画像4つまでです。');

    // 何か登録されてるのに動画が指定された
    const isNowMediaIncludeVideo = nowMedia.type.includes('video');
    if (orgMedia.length > 0 && isNowMediaIncludeVideo) throw new Error('アップロードできるのは動画1つ、もしくは画像4つまでです。');

    // なんやかんやで合計が4つ以上になりそう
    if (orgMedia.length === 4) throw new Error('アップロードできるのは動画1つ、もしくは画像4つまでです。');

    (nowMedia as PreviewFile).preview = URL.createObjectURL(nowMedia);

    console.log(nowMedia);

    yield put(actions.storeMedia([...orgMedia, nowMedia as PreviewFile]));
  } catch (e) {
    alert(e.message);
  }
}
