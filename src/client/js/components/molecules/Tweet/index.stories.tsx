import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Component from '.';
import { Tweets } from '../../../types/global';

const comProps: Tweets = {
  idStr: '0123456789012345678901234567890123456789',
  displayName: 'RTA走り太郎',
  screenName: 'rta_runner',
  icon: 'images/rtainjapan-icon.png',
  dateStr: '2019/10/10 12:10',
  message:
    'あいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこ\nあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこあいうえおかきくけこ',
};

const actionProps = {};

storiesOf('Tweet', module).add('normal', () => <Component {...comProps} {...actionProps} />);
