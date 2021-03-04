import { useRef } from 'react';
import { UseAction } from './interface';
import { PROVINCE } from './mockData';

function split(str: string) {
    const pairs = str.split('\n')
    const ret: Record<string, string[]> = {}
    pairs.forEach(p => {
        const pair = p.split('	')
        if (pair[0] in ret) {
            ret[pair[0]].push(pair[1])
        } else {
            ret[pair[0]] = [pair[1]]
        }
    })
    let retStr = []
    for (const k in ret) {
        if (ret[k].length === 1 && ret[k][0] === k) { // 直辖市
            retStr.push(k)
        } else {
            retStr.push(`${k}（${ret[k].map(i => `${i}市`).join('；')}）`)
        }
    }
    return retStr.join('，')
}


const useTypeGroup: () => UseAction = function() {

    const v = useRef('')
    const renderResult = (s: string) => (<p style={{
        whiteSpace: 'pre-line',
        maxHeight: 400,
        overflow: 'auto',
    }}>{s}</p>)

    const compute = (s: string) => {
        v.current = split(s)
        return v.current
    }

    const getStringValue = () => v.current

    return {
        renderResult,
        compute,
        showCopyButton: true,
        getStringValue,
        getMockData: () => PROVINCE,
    }
}

export default useTypeGroup;