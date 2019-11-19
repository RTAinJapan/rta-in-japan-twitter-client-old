/**
 * ドロワーで表示するメニュー
 */
import React from 'react';
import { WithStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';

const styles = (theme: Theme) =>
  createStyles({
    root: {},
    toolbar: {
      maxWidth: '80vw',
    },
  });

type ComponentProps = {
  navigationLabel?: string;
};
type ActionProps = {};
type PropsType = ComponentProps & ActionProps & WithStyles<typeof styles>;
type LocalState = {
  drawerOpen: boolean;
};

class ResponsiveDrawer extends React.Component<PropsType, LocalState> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      drawerOpen: false,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  public handleOpen() {
    this.setState({
      drawerOpen: true,
    });
  }

  public handleClose() {
    this.setState({
      drawerOpen: false,
    });
  }

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar>
          <Toolbar>
            <IconButton color="inherit" onClick={this.handleOpen}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              {this.props.navigationLabel}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer open={this.state.drawerOpen} onClose={this.handleClose} classes={{ paper: classes.toolbar }}>
          <Divider />
          <div onClick={this.handleClose} onKeyDown={this.handleClose}>
            {this.props.children}
          </div>
        </Drawer>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);
