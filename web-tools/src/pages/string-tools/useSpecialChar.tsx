import { useRef } from 'react';
import { UseAction } from './interface';
import { SPECIAL_CHAR } from './mockData';

function getColumnData(str: string) {
    const words = str.split('\n');

    const specialChar = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?%~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    const canU: (string | number)[] = [];
    words.forEach(i => {
        
        if (i.length >= 16) {
            canU.push('长度超过16');
            return;
        }

        if (specialChar.test(i)) {
            canU.push('特殊字符');
            return;
        }

        const res = i.match(/(\d+)年|(\d+)(?=字)|(\d+)/);
        if (res && res[1]) {
            const year = Number(res[1]);
            if (year < 21 || year < 2021) {
                canU.push('年' + year);
                return;
            }
        }
        if (res && res[3]) {
            const year = Number(res[3]);
            if (year >= 2000 && year < 2021) {
                canU.push('年' + year);
                return;
            }
        }
        canU.push('ok')
    })
    return canU.map((item, idx) => ({
        o: words[idx],
        t: item,
    }))
}


const useSpecialChar: () => UseAction = function() {

    const v = useRef<{o: string, t: string | number}[]>([])
    const renderResult = (s: {o: string, t: string | number}[]) => (<div style={{
        whiteSpace: 'pre-line',
        maxHeight: 400,
        overflow: 'auto',
    }}>{
        s.map((i, idx) => <p key={idx}>{ i.o }{'\t'}{i.t}</p>)
    }</div>)

    const compute = (s: string) => {
        v.current = getColumnData(s)
        return v.current
    }

    const getStringValue = () => v.current.map(i => `${i.o}\t${i.t}`).join('\n')

    return {
        renderResult,
        compute,
        showCopyButton: true,
        getStringValue,
        getMockData: () => SPECIAL_CHAR,
    }
}

export default useSpecialChar;