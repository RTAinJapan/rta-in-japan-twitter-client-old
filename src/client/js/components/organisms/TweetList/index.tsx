import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tweets } from '../../../types/global';
import Tweet from '../../molecules/Tweet';
import ClearIcon from '@material-ui/icons/Clear';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  root: {
    height: '100%',
    minHeight: 300,
  },
  button: {
    minWidth: '40px',
  },
  tweet: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  tweetContent: {
    width: 'calc(100% - 40px)',
  },
});

type ComponentProps = {
  tweets: Tweets[];
};
type ActionProps = {
  deleteTweet?: any;
};

type PropsType = ComponentProps & ActionProps;

const TweetList: React.SFC<PropsType> = props => {
  const classes = useStyles();

  const handleDeleteButton = (id: string) => () => {
    props.deleteTweet(id);
  };

  const label = {
    delete: 'ツイート削除',
    noTweet: 'ツイートがありません',
  };

  return (
    <Paper className={classes.root}>
      {props.tweets.length === 0 && <div className={classes.tweetContent}>{label.noTweet}</div>}
      {props.tweets.map(item => (
        <div className={classes.tweet} key={item.idStr}>
          <Tooltip title={label.delete}>
            <Fab className={classes.button} color={'secondary'} size={'small'} onClick={handleDeleteButton(item.idStr)} disabled={!props.deleteTweet}>
              <ClearIcon />
            </Fab>
          </Tooltip>
          <div className={classes.tweetContent}>
            <Tweet {...item} />
          </div>
        </div>
      ))}
    </Paper>
  );
};

export default TweetList;
