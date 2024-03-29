
import {
  Switch,
  Route,
  HashRouter as Router,
  Link,
  Redirect,
} from 'react-router-dom';
import React, { useMemo, useRef, useState } from 'react';
import {
  routers,
} from './routes';
import { 
  Menu,
} from 'antd';

import 'antd/dist/reset.css';
import Layout, { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import { SIDEBAR_COLLAPSED } from './constants/key';

const BASE_PATH = '/';

function App() {
  const [collapsed, setCollapsed] = useState(localStorage.getItem(SIDEBAR_COLLAPSED) === 'true');
  function toggleCollapsed() {
      setCollapsed(d => !d);
      localStorage.setItem(SIDEBAR_COLLAPSED, '' + !collapsed);
  }
  const defaultSelectedKeys = useRef(['']);
  useMemo(() => {
      defaultSelectedKeys.current = [window.location.hash.replace(BASE_PATH, '')];
  }, []);

  return (
      <Layout style={{height: '100vh'}}>
          <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
              <Menu
                  defaultSelectedKeys={defaultSelectedKeys.current}
                  mode="inline"
                  theme="dark"
                  inlineCollapsed={false}
        items={routers.filter(r => r.menu).map(i => ({
          key: i.title,
          label: <Link to={i.path}>{i.title}</Link>,
          icon: i.icon && React.createElement(i.icon),
        }))}
              />
          </Sider>
          <Content style={{flexGrow: 1, padding: 16, overflow: 'auto'}}>
              <Switch>
                  {
                      routers.map(route => <Route exact={route.exact} key={route.path} children={React.createElement(route.page)} path={route.path} />)
                  }
                  <Redirect from='/' to={routers[0].path} />
              </Switch>
          </Content>
      </Layout>
  );
}

function RouterApp() {
  return <Router basename={BASE_PATH}>
      <App />
  </Router>
}


export default RouterApp;
