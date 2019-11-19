/**
 * Twitterのルールに則り、文字数カウントを行う
 * @param baseStr カウント対象の文字
 */
export const countStr = (baseStr: string): number => {
  // 文字数カウントのルール
  // アジア圏の表記だとMax140文字。(英語圏だと280文字で、要は280Byte相当)
  //
  // 半角：0.5文字。@hogehogeとかも同様のカウント。
  // 全角：1文字
  // URL：11.5文字

  // URLを含んでいる数
  const urls = baseStr.match(/https?:\/\/[^ ]+/g);
  const urlNum = urls ? urls.length : 0;

  // URLの部分を除外して文字数カウントする
  const pureStr = baseStr.replace(/https?:\/\/[^ ]+/g, '');

  // TODO: 改行も0.5文字換算だけど以下の正規表現だとほんのちょっと多くカウントされちゃう
  // 半角文字
  const halfStrMatch = pureStr.match(/[ -~]+/g);
  const halfStr = halfStrMatch ? halfStrMatch.join() : '';

  // 全角文字
  const fullStr = pureStr.replace(/[ -~]+/g, ''); // 半角を全部除けば全角だけになるはず。たぶん

  // 合計文字数
  const strLen = urlNum * 11.5 + halfStr.length * 0.5 + fullStr.length;

  return strLen;
};
