
import {
    Switch,
    Route,
    HashRouter as Router,
    Link,
} from 'react-router-dom';
import React, { useMemo, useRef, useState } from 'react';
import {
    routers,
} from './routes';
import { 
    Menu,
} from 'antd';

import 'antd/dist/antd.css';
import Layout, { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import { SIDEBAR_COLLAPSED } from './constants/key';

function App() {
    const [collapsed, setCollapsed] = useState(localStorage.getItem(SIDEBAR_COLLAPSED) === 'true');
    function toggleCollapsed() {
        setCollapsed(d => !d);
        localStorage.setItem(SIDEBAR_COLLAPSED, '' + !collapsed);
    }
    const defaultSelectedKeys = useRef(['']);
    useMemo(() => {
        defaultSelectedKeys.current = [window.location.hash.replace('#', '')];
        
    }, []);
    return (
        <Router>
            <Layout style={{height: '100vh'}}>
                <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
                    <Menu
                        defaultSelectedKeys={defaultSelectedKeys.current}
                        mode="inline"
                        theme="dark"
                        inlineCollapsed={false}
                        >
                            {
                                routers.map((route, idx) => <Menu.Item key={route.path} icon={React.createElement(route.icon)}>
                                    <Link to={route.path}>{route.title}</Link>
                                </Menu.Item>)
                            }
                    </Menu>
                </Sider>
                <Content style={{flexGrow: 1, padding: 16, overflow: 'auto'}}>
                    <Switch>
                        {
                            routers.map(route => <Route key={route.path} children={React.createElement(route.page)} path={route.path} />)
                        }
                    </Switch>
                </Content>
            </Layout>
        </Router>
    );
}

export default App;
