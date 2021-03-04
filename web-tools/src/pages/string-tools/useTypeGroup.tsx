import { useRef } from 'react';
import { getMostTypes } from '../../services/getMostTypes';
import { UseAction } from './interface';
import { TYPE_GROUP } from './mockData';


const useTypeGroup: () => UseAction = function() {

    const wordsLen = useRef(0)
    const renderResult = (result: {key: string; times: number}[]) => (<div style={{
        whiteSpace: 'pre-line',
        maxHeight: 400,
        overflow: 'auto',
    }}>
        <h3>结果(总词数 {wordsLen.current} 个)：</h3>
        {
            result.map((r: any, i) => <p key={r.key + i}>
                {`序号：${i + 1} => 词：`}
                <span style={{color: 'red'}}>{r.key}</span>，
                次数：<span style={{color: 'green'}}>{r.times}</span>，
                占比：<span style={{color: 'blue'}}>{(r.times / wordsLen.current * 100).toFixed(2)}%</span>
            </p>)
        }
        </div>
    )

    const compute = (v: string) => {
        const words = v.split('\n')
        wordsLen.current = words.length
        return getMostTypes(words).then((d: any) => {
            return d.data
        })
    }

    return {
        renderResult,
        compute,
        showCopyButton: false,
        getStringValue: () => '',
        getMockData: () => TYPE_GROUP,
    }
}

export default useTypeGroup;