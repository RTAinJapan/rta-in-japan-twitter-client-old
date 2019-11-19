import React from 'react';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { WithStyles, withStyles, createStyles, Theme, StyleRules } from '@material-ui/core/styles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles1 = (theme: Theme): StyleRules =>
  createStyles({
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.dark,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
    close: {},
  });

interface SnackProps extends WithStyles<typeof styles1> {
  message: string;
  onClose: any;
  variant: 'success' | 'warning' | 'error' | 'info';
}

const MySnackbarContent: React.FC<SnackProps> = (props: SnackProps) => {
  const { classes, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant])}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="Close" color="inherit" className={classes.close} onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

const styles2 = (theme: Theme): StyleRules =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
  });

type CustomeProps = {
  open: boolean;
  message: string;
  variant: 'success' | 'warning' | 'error' | 'info';
  onClose: (event: React.SyntheticEvent<any>, reason: string) => void;
} & WithStyles<typeof styles2>;

const CustomizedSnackbars: React.FC<CustomeProps> = (props: CustomeProps) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={props.open}
      autoHideDuration={6000}
      onClose={props.onClose}
    >
      <MySnackbarContentWrapper onClose={props.onClose} variant={props.variant} message={props.message} />
    </Snackbar>
  );
};

export default withStyles(styles2)(CustomizedSnackbars);
