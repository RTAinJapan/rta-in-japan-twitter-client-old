import React from 'react';
import { connect } from 'react-redux';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import * as actions from '../../../actions';
import Modal from '../../molecules/Modal';
import { RootState, DialogState } from '../../../reducers';
import { Button, TextField } from '@material-ui/core';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '80vw',
      padding: 5,
      borderRadius: 5,
    },
    contents: {},
    info: {
      backgroundColor: 'white',
      color: 'black',
    },
    warning: {
      backgroundColor: 'orange',
      color: 'black',
    },
    error: {
      backgroundColor: 'red',
      color: 'black',
    },
    control: {
      marginTop: 10,
      float: 'right',
    },
    button: {
      margin: 5,
    },
  }),
);

type ComponentProps = DialogState;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const App: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles({});

  const label = {
    ok: 'OK',
    yes: 'はい',
    no: 'いいえ',
  };

  const rootClass = classNames({
    [classes.root]: true,
    [classes.info]: props.type === 'info',
    [classes.warning]: props.type === 'warning',
    [classes.error]: props.type === 'error',
  });

  /** ボタンの表示 */
  const controlArea = (isConfirm: boolean) => {
    if (isConfirm) {
      return (
        <>
          <Button className={classes.button} variant={'contained'} color={'default'} onClick={props.clickNo}>
            {label.no}
          </Button>
          <Button className={classes.button} variant={'contained'} color={'primary'} onClick={props.clickYes}>
            {label.yes}
          </Button>
        </>
      );
    } else {
      return (
        <Button className={classes.button} variant={'contained'} color={'primary'} onClick={props.clickYes}>
          {label.ok}
        </Button>
      );
    }
  };

  const detailArea = (detail: string) => {
    if (detail) {
      return <TextField rowsMax={5} variant={'filled'} multiline={true} defaultValue={detail} InputProps={{ readOnly: true }} fullWidth={true} />;
    } else {
      return '';
    }
  };

  return (
    <Modal open={props.show}>
      <div className={rootClass}>
        {/* メッセージ */}
        <div className={classes.contents}>
          <div>{props.message}</div>
          <div>{detailArea(props.detail)}</div>
        </div>
        {/* ボタン */}
        <div className={classes.control}>{controlArea(props.confirm)}</div>
      </div>
    </Modal>
  );
};

// state
const mapStateToProps = (state: RootState): ComponentProps => {
  return {
    ...state.reducer.dialog,
  };
};

// action
const mapDispatchToProps = {
  clickYes: actions.dialogYes,
  clickNo: actions.dialogNo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
