import { Button, Divider, Empty, Form, Input, Layout, message, Space } from 'antd';
import { Content } from 'antd/lib/layout/layout';
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
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
export default function Tool2() {
    const v = useRef('')
    const [s, ss] = useState('')
    const [lines, updateLines] = useState(0)
    const [form] = Form.useForm();
    const resultRef = useRef<HTMLParagraphElement>(null);

    function changeValue(e: ChangeEvent<HTMLTextAreaElement>) {
        v.current = e.target.value
        updateLines(v.current.split('\n').length)
    }
    function compute() {
        if (!v.current) return
        ss(split(v.current))
    }

    function copy() {
        window.getSelection()!.removeAllRanges()

        const range = document.createRange()
        
        range.selectNode(resultRef.current as HTMLParagraphElement)
        window.getSelection()!.addRange(range)

        const msg = document.execCommand('copy')
        if (msg) {
            message.success('成功拷贝数据到剪切板')
        }

        window.getSelection()!.removeAllRanges()
    }

    function clear() {
        form.setFieldsValue({
            originData: '',
        })
        updateLines(0)
        ss('')
    }

    return (
        <Layout style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <h1 style={{fontSize: 32}}>省市合并</h1>
            <Divider />
            <Layout style={{marginTop: 50, display: 'flex', flexDirection: 'row', alignItems: 'stretch'}}>
                <Content style={{flex: 1}}>
                    <h2 style={{marginBottom: 40, textAlign: 'center', fontSize: 28}}>一、数据输入</h2>
                    <Form
                        form={form}
                        {...layout}
                        name="basic"
                        initialValues={{ remember: true }}
                    >
                        <Form.Item
                            label="1-输入数据"
                            name="originData"
                            rules={[{ required: true, message: '请输入原始数据' }]}
                            extra={lines ? <p style={{marginTop: 10,}}>当前数据有 {lines} 行。</p> : null}
                        >
                            <Input.TextArea style={{width: 200}} rows={6} onChange={changeValue} />
                        </Form.Item>
                        
                        <Form.Item {...tailLayout}>
                            <Button type="primary" onClick={compute}>
                            2-点击按钮
                            </Button>
                        </Form.Item>
                    </Form>
                    
                    
                </Content>
                <div style={{marginLeft: 16, marginRight: 16, width: 1, backgroundColor: '#e8e8e8'}} />
                <Content style={{flex: 1}}>
                    <h2 style={{marginBottom: 40, textAlign: 'center', fontSize: 28}}>二、结果输出</h2>
                    <Space direction="vertical" style={{width: '100%'}}>
                        
                        {
                            s ? <div style={{padding: 16, backgroundColor: 'white', borderRadius: 8,}}>
                                <p ref={resultRef}>{s}</p>
                                <Space size="large" style={{display: 'flex', justifyContent: 'center'}}>
                                    <Button type="primary" onClick={copy}>拷贝数据</Button>
                                    <Button type="default" onClick={clear}>清空数据</Button>
                                </Space>
                            </div> : <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Empty description='木有数据' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                <p> {'<=='}   请先在左侧录入数据~</p>
                            </div>
                        }
                    </Space>
                </Content>
            </Layout>
            
            {/* <Sider style={{marginLeft: 20, width: 100, backgroundColor: 'white', padding: 16,}}>
                <p>
                    示例数据：
                </p>
                <p style={{whiteSpace: 'pre-wrap', height: 300, overflow: 'auto'}}>{tip}</p>
            </Sider> */}
        </Layout>
    )
}
