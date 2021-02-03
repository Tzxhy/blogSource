import { Button, Input, Layout, Space } from 'antd';
import { ChangeEvent, useRef, useState } from 'react';
import { getMostTypes } from '../../services/getMostTypes';

const { TextArea } = Input;
const {
    Content,
    Sider,
} = Layout;

export default function GetTypes() {


    const v = useRef('');
    const wordsLen = useRef(0);
    const [result, setResult] = useState<{key: string; times: string}[]>([]);
    const [isSendReq, setIsSendReq] = useState(false);

    function changeValue(e: ChangeEvent<HTMLTextAreaElement>) {
        v.current = e.target.value;
    }

    function compute() {
        if (isSendReq) return;
        setResult([]);
        setIsSendReq(true);
        const words = v.current.split('\n');
        wordsLen.current = words.length;
        getMostTypes(words).then((d: any) => {
            setResult(d.data);
            setIsSendReq(false);
        }).catch(_ => {

            setResult([]);
            setIsSendReq(false);
        });
    }

    return <div>
        <Layout>
            <Content style={{marginRight: 100, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <h1>请输入原始数据：</h1>

                <Space direction="vertical" style={{alignItems: 'center'}}>
                    <TextArea style={{width: 300}} rows={4} onChange={changeValue}></TextArea>
                    <Button type='primary' disabled={isSendReq} onClick={compute}>开始计算</Button>
                </Space>
                {
                    result.length > 0 ? <div>
                        <h3>结果(总词数 {wordsLen.current} 个)：</h3>
                        {
                            result.map((r: any, i) => <p key={r.key + i}>
                                {`序号：${i + 1} => 词：`}
                                <span style={{color: 'red'}}>{r.key}</span>，
                                次数：<span style={{color: 'green'}}>{r.times}</span>，
                                占比：<span style={{color: 'blue'}}>{(r.times / wordsLen.current * 100).toFixed(2)}%</span>
                            </p>)
                        }
                    </div> : null
                }
            </Content>
            <Sider theme="light" style={{padding: 16, marginRight: 50, alignSelf: 'flex-start'}}>
                <h3>工具说明</h3>
                <p>该工具用于获取一列数据中出现次数最多的词语，可以用来大致判断词语的行业、细类</p>
            </Sider>
        </Layout>
    </div>
}
