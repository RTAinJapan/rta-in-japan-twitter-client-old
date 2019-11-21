import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ListItemIcon, Divider, Button } from '@material-ui/core';
import LazyImage from '../../atom/LazyImage';
import { RootState } from '../../../reducers';
import * as actions from '../../../actions';
import { connect } from 'react-redux';

const useStyles = makeStyles({
  root: {},
  logout: {
    marginTop: 100,
  },
});

type ComponentProps = {};
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;

export const OtherInfo: React.SFC<PropsType> = props => {
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
        <Divider />
        <ListItem>
          <div className={classes.logout}>
            <Button color={'secondary'} variant={'contained'} onClick={props.logout}>
              ログアウト
            </Button>
          </div>
        </ListItem>
      </List>
    </div>
  );
};

// state
const mapStateToProps = (state: RootState): ComponentProps => {
  return {};
};

// action
const mapDispatchToProps = {
  logout: actions.logoutDiscord,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OtherInfo);
