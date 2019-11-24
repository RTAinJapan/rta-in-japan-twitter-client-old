import React from 'react';
import { connect } from 'react-redux';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import * as actions from '../../../actions';
import Snackbar from '../../molecules/SnackBar';
import Modal from '../../molecules/Modal';
import { GlobalState, RootState } from '../../../reducers';

import TweetForm from '../../organisms/TweetForm';
import Dialog from '../../organisms/Dialog';
import NavTabs from '../../organisms/NavTabs';
import ChatIcon from '@material-ui/icons/Chat';
import ListIcon from '@material-ui/icons/List';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import OtherInfo from '../../organisms/OtherInfo';
import Footer from '../../organisms/Footer';
import TweetList from '../../organisms/TweetList';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { oauthDiscord } from '../../../sagas/discord';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: 'center',
      display: 'flex',
    },
    content: {
      maxWidth: 1000,
      width: '100%',
      display: 'initial',
    },
    login: {
      padding: 10,
    },
    button: {
      margin: theme.spacing(1),
      float: 'right',
      top: '-60px',
    },
    icon: {},
  }),
);

type ComponentProps = {
  notify: GlobalState['notify'];
  list: GlobalState['list'];
  dialog: GlobalState['dialog'];
  discord: GlobalState['discord'];
};
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const App: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles({});

  const tabs = [
    {
      label: '投稿',
      icon: <ChatIcon />,
    },
    {
      label: 'ツイート一覧',
      icon: <ListIcon />,
    },
    {
      label: 'リンク',
      icon: <BookmarkIcon />,
    },
  ];

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        {props.discord.username ? (
          <>
            <div>
              <NavTabs tabs={tabs}>
                {/* 投稿 */}
                <div style={{ padding: 10 }}>
                  <TweetForm />
                </div>
                {/* ツイート */}
                <div style={{ padding: 10, display: 'flex' }}>
                  <Grid container spacing={3}>
                    <Grid item sm={4}>
                      <div style={{ height: '100%' }}>
                        <Typography variant={'h6'}>運営ツイート</Typography>
                        <div style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
                          <TweetList tweets={props.list.self} deleteTweet={props.deleteTweet} />
                        </div>
                      </div>
                    </Grid>
                    <Grid item sm={4}>
                      <div style={{ height: '100%' }}>
                        <Typography variant={'h6'}>検索</Typography>
                        <div style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
                          <TweetList tweets={props.list.search} />
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
                {/* リンク */}
                <div style={{ padding: 10 }}>
                  <OtherInfo />
                </div>
              </NavTabs>
            </div>
          </>
        ) : (
          <div className={classes.login}>
            <Modal open={true}>
              <Button color={'primary'} variant={'contained'} onClick={oauthDiscord}>
                Discordでログイン
              </Button>
            </Modal>
          </div>
        )}
      </div>
      <Footer />
      {/* 通知系 */}
      <Dialog />
      <Modal open={props.dialog.show} modalClose={props.closeModal}>
        {props.dialog.message}
      </Modal>
      <Snackbar open={props.notify.show} message={props.notify.message} variant={props.notify.type} onClose={props.closeNotify} />
    </div>
  );
};

// state
const mapStateToProps = (state: RootState): ComponentProps => {
  return {
    notify: state.reducer.notify,
    list: state.reducer.list,
    dialog: state.reducer.dialog,
    discord: state.reducer.discord,
  };
};

// action
const mapDispatchToProps = {
  closeNotify: actions.closeNotify,
  closeModal: actions.closeDialog,
  deleteTweet: actions.deleteTweet,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
