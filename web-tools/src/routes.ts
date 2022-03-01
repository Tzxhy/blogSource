
import StringTools from './pages/string-tools';
import RenameTools from './pages/rename';
import {
    PieChartOutlined,
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
	{
        title: '重命名',
        path: '/rename-tool',
        page: RenameTools,
        icon: PieChartOutlined,
        exact: true,
        menu: true,
    },
]

export default {};
