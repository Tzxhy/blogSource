import { Button, Input } from 'antd';
import { ChangeEvent, useRef, useState } from 'react';
import { getMostTypes } from '../../services/getMostTypes';

const { TextArea } = Input;


export default function GetTypes() {


    const v = useRef('');
    const [result, setResult] = useState<{key: string; times: string}[]>([]);
    const [isSendReq, setIsSendReq] = useState(false);

    function changeValue(e: ChangeEvent<HTMLTextAreaElement>) {
        v.current = e.target.value;
    }

    function compute() {
        if (isSendReq) return;
        setResult([]);
        setIsSendReq(true);
        getMostTypes(v.current.split('\n')).then((d: any) => {
            setResult(d.data);
            setIsSendReq(false);
        }).catch(_ => {

            setResult([]);
            setIsSendReq(false);
        });
    }

    return <div>
        <h1>请输入原始数据：</h1>
        <TextArea rows={4} onChange={changeValue}></TextArea>
        <Button type='primary' disabled={isSendReq} onClick={compute}>开始计算</Button>
        {
            result.length > 0 ? <div>
                <h3>结果：</h3>
                {
                    result.map((r, i) => <p key={r.key + i}>{`序号：${i + 1}，词：${r.key}，次数：${r.times}`}</p>)
                }
            </div> : null
        }
    </div>
}
