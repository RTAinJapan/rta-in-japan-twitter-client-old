import { createAction } from 'typesafe-actions';
import { Tweets, PreviewFile } from '../types/global';
import { DialogState } from '../reducers';

const OPEN_NOTIFY = 'OPEN_NOTIFY';
const CLOSE_NOTIFY = 'CLOSE_NOTIFY';
const OPEN_DIALOG = 'OPEN_DIALOG';
const CLOSE_DIALOG = 'CLOSE_DIALOG';

const UPDATE_TWEET_LIST = 'UPDATE_TWEET_LIST';
const SUBMIT_TWEET = 'SUBMIT_TWEET';
const DELETE_TWEET = 'DELETE_TWEET';

const DIALOG_YES = 'DIALOG_YES';
const DIALOG_NO = 'DIALOG_NO';

const UPLOAD_MEDIA = 'UPLOAD_MEDIA';
const STORE_MEDIA = 'STORE_MEDIA';

/** 通知欄表示 */
export const changeNotify = createAction(OPEN_NOTIFY, action => {
  return (show: boolean, type: 'info' | 'warning' | 'error', message: string) => action({ show, type, message });
});
/** 通知欄閉じる */
export const closeNotify = createAction(CLOSE_NOTIFY);

/** ダイアログ表示 */
export const changeDialog = createAction(OPEN_DIALOG, action => {
  return (args: Partial<DialogState>) => action(args);
});
/** ダイアログ閉じる */
export const closeDialog = createAction(CLOSE_DIALOG);

export const dialogYes = createAction(DIALOG_YES, action => {
  return (args: any) => action(args);
});
export const dialogNo = createAction(DIALOG_NO, action => {
  return (args: any) => action(args);
});

/** ツイート取得結果更新 */
export const updateTweetList = createAction(UPDATE_TWEET_LIST, action => {
  return (list: Tweets[], type: 'self' | 'hash' | 'search') => action({ list, type });
});

/** ツイート送信 */
export const submitTweet = createAction(SUBMIT_TWEET, action => {
  return (message: string) => action(message);
});

/** ツイート削除 */
export const deleteTweet = createAction(DELETE_TWEET, action => {
  return (id: string) => action(id);
});

/** アップロードするファイルを受け取ってチェックとか */
export const uploadMedia = createAction(UPLOAD_MEDIA, action => {
  return (file: File[]) => action(file);
});

/** アップロードするファイルをリストに登録 */
export const storeMedia = createAction(STORE_MEDIA, action => {
  return (file: PreviewFile[]) => action(file);
});
