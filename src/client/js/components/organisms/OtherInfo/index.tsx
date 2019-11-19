import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ListItemIcon, Divider } from '@material-ui/core';
import LazyImage from '../../atom/LazyImage';

const useStyles = makeStyles({
  root: {},
});

type ComponentProps = {};

const OtherInfo: React.SFC<ComponentProps & React.Props<{}>> = props => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <List>
        <ListItem button onClick={() => window.open('https://rtain.jp/')}>
          <ListItemIcon>
            <LazyImage imageUrl={'./images/rtainjapan-icon.png'} height={30} />
          </ListItemIcon>
          <ListItemText>RTA in Japan</ListItemText>
        </ListItem>
        <ListItem button onClick={() => window.open('https://discord.gg/dqpB8y6')}>
          <ListItemIcon>
            <LazyImage imageUrl={'./images/discord-icon.png'} height={30} />
          </ListItemIcon>
          <ListItemText>RTA in Japan Discord</ListItemText>
        </ListItem>
        <Divider />
      </List>
    </div>
  );
};

export default OtherInfo;
