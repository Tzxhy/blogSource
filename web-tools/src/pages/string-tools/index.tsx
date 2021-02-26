import { Button, Divider, Empty, Form, Input, Layout, message, Radio, RadioChangeEvent, Space } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { ChangeEvent, useRef, useState } from 'react';

import useProvince from './useProvince'
import useTypeGroup from './useTypeGroup'


const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

enum StringToolType {
    GROUP,
    PROVINCE_CITY,
}

export default function StringTools() {
    const v = useRef('')
    const [s, ss] = useState<React.ReactNode>(null)
    const [lines, updateLines] = useState(0)
    const [form] = Form.useForm()
    const resultRef = useRef<HTMLParagraphElement>(null)
    const toolType = useRef<StringToolType>(StringToolType.GROUP)

    // 顺序需要与 StringToolType 保持一致
    const actions = [
        useTypeGroup(),
        useProvince(),
    ]

    function changeValue(e: ChangeEvent<HTMLTextAreaElement>) {
        v.current = e.target.value
        updateLines(v.current.split('\n').length)
    }

    async function compute() {
        if (!v.current) return
        
        const compute = actions[toolType.current].compute
        const renderResult = actions[toolType.current].renderResult
        const value = await compute(v.current)
        const renderRes: React.ReactNode = renderResult(value)
        ss(renderRes)
    }

    function copy() {
        window.getSelection()!.removeAllRanges()

        const input = document.createElement('input')
        input.value = actions[toolType.current].getStringValue()
        
        input.style.position = 'fixed'
        input.style.left = '-9999px'

        document.body.appendChild(input)
        input.select()

        const msg = document.execCommand('copy')
        if (msg) {
            message.success('成功拷贝数据到剪切板')
        }

        window.getSelection()!.removeAllRanges()
        input.remove()
    }

    function clear() {
        form.setFieldsValue({
            originData: '',
        })
        updateLines(0)
        ss('')
    }

    function selectChange(v: RadioChangeEvent) {
        toolType.current = v.target.value;
    }

    const options = [
        { label: '词组分类', value: StringToolType.GROUP, },
        { label: '省市合并', value: StringToolType.PROVINCE_CITY, },
    ]

    return (
        <Layout style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <h1 style={{fontSize: 32}}>语句类工具</h1>
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
                            label="计算类型"
                        >
                            <Radio.Group options={options} onChange={selectChange} defaultValue={toolType.current} />
                        </Form.Item>
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
                                {
                                    s
                                }
                                
                                <Space size="large" style={{display: 'flex', justifyContent: 'center'}}>
                                    {
                                        actions[toolType.current].showCopyButton ? <Button type="primary" onClick={copy}>拷贝数据</Button> : null
                                    }
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
