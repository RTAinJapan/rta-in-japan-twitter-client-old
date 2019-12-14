import React from 'react';
import { connect } from 'react-redux';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import TweetList from '../../molecules/TweetList';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: 'center',
      display: 'flex',
    },
  }),
);

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const TweetListPC: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles({});

  return (
    <div style={{ padding: 10, display: 'flex' }}>
      <Grid container spacing={3}>
        <Grid item sm={4}>
          <div style={{ height: '100%' }}>
            <Typography variant={'h6'}>運営ツイート</Typography>
            <div style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
              <TweetList tweets={props.list.user} deleteTweet={props.deleteTweet} />
            </div>
          </div>
        </Grid>
        <Grid item sm={4}>
          <div style={{ height: '100%' }}>
            <Typography variant={'h6'}>返信</Typography>
            <div style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
              <TweetList tweets={props.list.mention} />
            </div>
          </div>
        </Grid>
        <Grid item sm={4}>
          <div style={{ height: '100%' }}>
            <Typography variant={'h6'}>ハッシュタグ</Typography>
            <div style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
              <TweetList tweets={props.list.hash} />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    list: state.reducer.twitterTimeline,
  };
};

// action
const mapDispatchToProps = {
  deleteTweet: actions.deleteTweet,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TweetListPC);
