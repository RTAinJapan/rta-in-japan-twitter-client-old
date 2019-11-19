import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  hidden: {
    display: 'hidden',
  },
});

type ComponentProps = {
  tabs: {
    label: string;
    icon: React.ReactElement;
  }[];
};

const NavTabs: React.SFC<ComponentProps & React.Props<{}>> = props => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setTabIndex(newValue);
  };

  const createTab = (tabs: ComponentProps['tabs']) => {
    return tabs.map((item, index) => {
      return <Tab key={index} icon={item.icon} label={item.label} />;
    });
  };

  return (
    <>
      <Paper square className={classes.root}>
        <Tabs value={tabIndex} onChange={handleChange} variant="fullWidth" indicatorColor="primary" textColor="primary">
          {createTab(props.tabs)}
        </Tabs>
      </Paper>
      {props.children && props.children[tabIndex] && <div>{props.children[tabIndex]}</div>}
    </>
  );
};

export default NavTabs;
