import Tool1 from './pages/getTypes';
import Tool2 from './pages/tool2';
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
        title: '工具1',
        path: '/tool1',
        page: Tool1,
        icon: PieChartOutlined,
    },
    {
        title: '工具2',
        path: '/tool2',
        page: Tool2,
        icon: PieChartOutlined,
    },
]

export default {};
