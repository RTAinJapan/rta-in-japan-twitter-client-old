import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import * as actions from '../../../actions';
import { Tweets } from '../../../types/global';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 5,
      display: 'flex',
    },
    screenName: {
      marginLeft: 5,
      color: 'gray',
    },
  }),
);

type ComponentProps = Tweets;

type ActionProps = {};

type PropsType = ComponentProps & ActionProps;
const Tweet: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles({});

  return (
    <Paper className={classes.root}>
      <Avatar src={props.icon} />
      <div style={{ marginLeft: 5 }}>
        <div>
          <Typography style={{ fontWeight: 'bold' }} variant={'subtitle1'} display={'inline'}>
            {props.displayName}
          </Typography>
          <span className={classes.screenName}>
            <Typography variant={'caption'} display={'inline'}>
              @{props.screenName}
            </Typography>
          </span>
        </div>
        <Typography>{props.message}</Typography>
      </div>
    </Paper>
  );
};

export default Tweet;
