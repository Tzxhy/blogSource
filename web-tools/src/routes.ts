
import GongJiJinTools from './pages/gong-ji-jin';
import RenameTools from './pages/rename';
import {
    PieChartOutlined,
	PlusOutlined,
} from '@ant-design/icons';

export const routers = [
    // {
    //     title: '语句类工具',
    //     path: '/string-tool',
    //     page: StringTools,
    //     icon: PieChartOutlined,
    //     exact: true,
    //     menu: true,
    // },
	{
        title: '重命名',
        path: '/rename-tool',
        page: RenameTools,
        icon: PieChartOutlined,
        exact: true,
        menu: true,
    },
	{
        title: '成都公积金测算',
        path: '/gong-ji-jin',
        page: GongJiJinTools,
        icon: PlusOutlined,
        exact: true,
        menu: true,
    },
]
// eslint-disable-next-line
export default {};
