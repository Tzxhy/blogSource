import { Button, Input, Layout, Space } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import React, { ChangeEvent, useRef, useState } from 'react';
import { tip } from './tips';
const { TextArea } = Input;



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

export default function Tool2() {
    const v = useRef('')
    const [s, ss] = useState('')

    function changeValue(e: ChangeEvent<HTMLTextAreaElement>) {
        v.current = e.target.value
    }
    function compute() {
        if (!v.current) return
        ss(split(v.current))
    }
    return (
        <Layout style={{display: 'flex', flexDirection: 'row'}}>
            <Space direction="vertical" style={{alignItems: 'center', flex: 1}}>
                <h1>省市合并</h1>
                <TextArea style={{width: 100}} rows={4} onChange={changeValue}></TextArea>
                <Button type='primary' onClick={compute}>开始计算</Button>

                {
                    s ? <div>
                        <p>结果：</p>
                        <p>{s}</p>
                    </div> : null
                }
            </Space>
            <Sider style={{marginLeft: 20, width: 100, backgroundColor: 'white', padding: 16,}}>
                <p>
                    示例数据：
                </p>
                <p style={{whiteSpace: 'pre-wrap', height: 300, overflow: 'auto'}}>{tip}</p>
            </Sider>
        </Layout>
    )
}
