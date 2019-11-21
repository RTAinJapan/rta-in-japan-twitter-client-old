import React from 'react';
import { connect } from 'react-redux';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import * as actions from '../../../actions';
import Modal from '../../molecules/Modal';
import { GlobalState, RootState } from '../../../reducers';
import { TextField, Button, Paper, Grid } from '@material-ui/core';
import Dropzone from 'react-dropzone';
import { countStr } from '../../../service/twitterUtil';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    textField: {
      width: '100%',
    },
    upload: {
      backgroundColor: 'lightgray',
      minHeight: 200,
      minWidth: 400,
    },
    control: {
      marginTop: 10,
      float: 'right',
    },
  }),
);

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const TweetForm: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles({});

  // ツイート内容
  const [tweet, setTweet] = React.useState<string>('');
  const [tweetCount, setTweetCount] = React.useState<number>(0);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTweet(event.target.value);
    setTweetCount(countStr(event.target.value));
  };

  // テンプレートの表示・非表示
  const [showTemplate, setShowTemplate] = React.useState<boolean>(false);
  const toggleTemplate = () => setShowTemplate(!showTemplate);

  const handleClickSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.submitTweet(tweet);
  };

  const handleTemplateApply = (value: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowTemplate(false);
    setTweet(value);
    setTweetCount(countStr(value));
  };

  const handleDrop = (accepted: File[], rejected: File[]) => {
    props.uploadMedia(accepted);
  };

  return (
    <div className={classes.root}>
      {/* テキストボックス */}
      <div>
        <TextField
          label="ツイート内容"
          multiline={true}
          rows={'3'}
          rowsMax="6"
          value={tweet}
          onChange={handleChange}
          className={classes.textField}
          margin="normal"
          helperText={`${tweetCount}`}
          variant="outlined"
          error={tweetCount > 140}
        />
      </div>
      {/* アップロード */}
      <div>
        <Paper style={{ padding: 5, textAlign: 'center' }}>
          <Dropzone accept="image/gif,image/jpeg,image/png,image/jpg,video/mp4" onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag here</p>
                </div>
              </section>
            )}
          </Dropzone>
        </Paper>
        {/* プレビュー */}
        <Grid container>
          {props.mediaList.map((item, index) => (
            <Grid item sm={3} key={item.name}>
              <div style={{ width: '100%' }}>
                {item.name}
                {item.type.includes('video') ? <video width={300} controls src={item.preview}></video> : <img width={'100%'} src={item.preview} />}
              </div>
            </Grid>
          ))}
        </Grid>
      </div>

      {/* 投稿 */}
      <div className={classes.control}>
        <Button variant={'contained'} color={'default'} onClick={toggleTemplate}>
          テンプレート
        </Button>

        <Button variant={'contained'} color={'primary'} onClick={handleClickSubmit} disabled={tweetCount > 140}>
          送信
        </Button>
      </div>

      <Modal open={showTemplate} modalClose={toggleTemplate}>
        <div style={{ height: '50vh', width: '80vw', backgroundColor: 'white', padding: 5 }}>
          <div>
            <TextField
              style={{ width: 600 }}
              variant="outlined"
              multiline={true}
              InputProps={{
                readOnly: true,
              }}
              defaultValue={'私の熱いアイドル活動、アイカツ！\n始まります！　＼ﾌﾌｯﾋ／'}
            />
            <Button variant={'contained'} color={'primary'} onClick={handleTemplateApply('私の熱いアイドル活動、アイカツ！\n始まります！　＼ﾌﾌｯﾋ／')}>
              反映
            </Button>
          </div>
          <br />
          <div>
            <TextField
              style={{ width: 600 }}
              variant="outlined"
              multiline={true}
              InputProps={{
                readOnly: true,
              }}
              defaultValue={'第壱話\n使\n徒、襲来'}
            />
            <Button variant={'contained'} color={'primary'} onClick={handleTemplateApply('第壱話\n使\n徒、襲来')}>
              反映
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    mediaList: state.reducer.post.media,
  };
};

// action
const mapDispatchToProps = {
  closeNotify: actions.closeNotify,
  closeModal: actions.closeDialog,
  submitTweet: actions.submitTweet,
  uploadMedia: actions.uploadMedia,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TweetForm);
