import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import DrawerMenu from '.';

const MenuComponent = () => (
  <div>
    <MenuItem onClick={action('メニュークリック')}>メニュー1</MenuItem>
    <MenuItem onClick={action('メニュークリック')}>メニュー2</MenuItem>
    <Divider />
    <MenuItem onClick={action('メニュークリック')}>メニュー3</MenuItem>
    <MenuItem onClick={action('メニュークリック')}>メニュー4</MenuItem>
  </div>
);

storiesOf('DrawerMenu', module).add('normal', () => (
  <DrawerMenu>
    <MenuComponent />
  </DrawerMenu>
));
