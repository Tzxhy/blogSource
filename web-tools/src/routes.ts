
import StringTools from './pages/string-tools';
import {
    AppstoreOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    ContainerOutlined,
    MailOutlined,
} from '@ant-design/icons';

export const routers = [
    {
        title: '语句类工具',
        path: '/string-tool',
        page: StringTools,
        icon: PieChartOutlined,
        exact: true,
        menu: true,
    },
]

export default {};
