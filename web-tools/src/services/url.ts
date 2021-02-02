
// TODO 添加 https 证书支持
export const DOMAIN = process.env.NODE_ENV === 'production' ? 'http://47.108.196.103' : 'http://localhost:3001';
// export const DOMAIN = 'http://47.108.196.103';

export const urls = {
    GET_MOST_TYPES: '/api/get_most_types',
}
