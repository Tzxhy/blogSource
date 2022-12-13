type Action = {
	month: string; // 2022-01
	type: 'push' | 'get';
	money: number;
}

export function getLoanAmount(
	list: Action[],
	factor = 0.9, // 存贷系数
) {
	const handleGet = (idx: number) => {
		const money = list[idx].money;
		const month = list[idx].month;

		// eslint-disable-next-line
		list.splice(idx, 1)[0];
		let rest = money;
		const _i = list.findIndex(i => i.month === month);
		let nowIdx =  _i >= 0 ? _i : idx;
		if (nowIdx >= list.length - 1) {
			nowIdx = list.length - 1;
		}
		while (rest > 0 && nowIdx >= 0) {
			if (list[nowIdx].month <= month) {
				const now = list[nowIdx];
				if (now.money >= rest) {
					now.money -= rest;
					rest = 0;
				} else {
					rest = rest - now.money;
					now.money = 0;
				}
			}
			--nowIdx;
		}

	}
	// 将提取的钱先往前扣除
	list.forEach((i, idx) => {
		if (i.type === 'get') {
			handleGet(idx);
		}
	});

	let amount = 0;
	const newList = list.reverse();
	console.log('newList: ', newList);
	newList.forEach((i, idx) => {
		const monthNum = idx + 1;
		const money = i.money;
		amount += monthNum * money * factor;
	});
	return Math.floor(amount);
}

const CACHE_DATA_KEY = '_CACHE_DATA_KEY';
export function isCacheData(): boolean {
	const item = localStorage.getItem(CACHE_DATA_KEY) || 'true';
	try {
		const v = JSON.parse(item);
		if (typeof v === 'boolean') {
			return v;
		}
	}catch(e) {

	}
	return true;
}

export function setShouldCacheData(v: boolean) {
	localStorage.setItem(CACHE_DATA_KEY, JSON.stringify(v));
}


type CacheListData = {
	month: string;
	money: number;
	type: 'get' | 'push';
}[]
const LIST_KEY = '_LIST_KEY';
export function getCacheData(): CacheListData {
	const item = localStorage.getItem(LIST_KEY) || '[]';
	try {
		const v = JSON.parse(item);
		return v;
	}catch(e) {

	}
	return [];
}

export function setCacheData(v: CacheListData) {
	localStorage.setItem(LIST_KEY, JSON.stringify(v));
}


const FACTOR_KEY = '_FACTOR_KEY';
export function getFactorCacheData(): number {
	const item = localStorage.getItem(FACTOR_KEY) || '0.9';
	try {
		const v = JSON.parse(item);
		return v;
	}catch(e) {

	}
	return 0.9;
}

export function setFactorCacheData(v: number) {
	localStorage.setItem(FACTOR_KEY, JSON.stringify(v));
}
