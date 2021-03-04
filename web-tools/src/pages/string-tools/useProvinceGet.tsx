import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import { useEffect, useRef, useState,  } from 'react';
import cityToProvince from '../../constants/province';
import { UseAction } from './interface';
import { PROVINCE_GET } from './mockData';

const CITY_TO_PROVINCE_MAP_KEY = 'CITY_TO_PROVINCE_MAP'

const useTypeGet: () => UseAction = function() {
    
    const [showModal, setShowModal] = useState(false)

    const v = useRef<{city: string, province: undefined | string}[]>([])
    const renderResult = (s: {city: string, province: undefined | string}[]) => (<div style={{
        maxHeight: 400,
        overflow: 'auto',
    }}>{
        s.map(i => {
            return <p>{i.city}{'\t'}{i.province ? i.province : <span style={{color: 'red'}}>未知</span>}</p>
        })
    }</div>)

    const compute = (s: string) => {
        const pairs = s.split('\n')
        
        let local = {}
        try {
            const l = localStorage[CITY_TO_PROVINCE_MAP_KEY]
            if (l) {
                local = JSON.parse(l)
            }
        } catch(e) {
            local = {}
        }
        const map = {
            ...cityToProvince,
            ...local,
        }
        v.current = pairs.map(i => {
            return {
                city: i,
                province: map[i as keyof typeof map],
            }
        })
        
        return v.current
    }

    const getStringValue = () => v.current.map(i => `${i.city}\t${i.province || '未知'}`).join('\n')
    const undefinedProvinceList = v.current.filter(i => !i.province)
    const renderOtherTool = () => undefinedProvinceList.length ? <>
        <Button type="text" onClick={() => setShowModal(true)}>录入未知数据(共{undefinedProvinceList.length}个)</Button>
        <CityProvinceFillModal list={undefinedProvinceList.map(i => i.city)} showModal={showModal} setShowModal={setShowModal} />
    </> : null
    return {
        renderResult,
        compute,
        showCopyButton: true,
        getStringValue,
        renderOtherTool,
        getMockData: () => PROVINCE_GET,
    }
}

interface CityProvinceFillModalProps {
    showModal: boolean;
    setShowModal(_: boolean): void;
    list: string[];
}

interface ItemProps {
    city: string
    province: string    
}
function CityProvinceFillModal(props: CityProvinceFillModalProps) {
    const [form] = useForm()
    useEffect(() => {
        console.log('props.list: ', props.list);
        
        form.setFieldsValue({
            cities: props.list.map(i => ({
                city: i,
                province: '',
            })),
        })
    }, [form, props.list])

    const onFinish = (values: {cities: ItemProps[]}) => {
        const obj: Record<string, string> = {}
        values.cities.forEach(m => {
            if (m.city && m.province) {
                obj[m.city] = m.province;
            }
        })

        let origin = localStorage[CITY_TO_PROVINCE_MAP_KEY]
        if (origin) {
            try {
                origin = JSON.parse(origin)
            } catch(e) {
                origin = {}
            }
        } else {
            origin = {}
        }
        const newMap = {
            ...origin,
            ...obj,
        }
        localStorage[CITY_TO_PROVINCE_MAP_KEY] = JSON.stringify(newMap)

        message.success('保存完成')
        props.setShowModal(false)

    }

    return <Modal
        title="完善省市数据"
        centered
        visible={props.showModal}
        onOk={() => props.setShowModal(false)}
        onCancel={() => props.setShowModal(false)}
        width={800}
    >
        <Form initialValues={{cities: ['123', '123']}} onFinish={onFinish} form={form} name="dynamic_form_nest_item" autoComplete="off" style={{maxHeight: 600, overflow: 'auto'}}>
            <Form.List name="cities">
                {(fields, { add, remove }) => (
                <>
                    {fields.map(field => (
                        <Space style={{width: '100%'}} key={field.key} align="baseline">
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, curValues) =>
                                    prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                                }
                            >
                                {
                                    () => <Form.Item
                                        name={[field.name, 'city']}
                                        label="市名"
                                        rules={[{ required: true, message: 'Missing sight' }]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                }
                            </Form.Item>
                            <Form.Item
                                name={[field.name, 'province']}
                                label="省名"
                                rules={[{ required: true, message: 'Missing price' }]}
                            >
                                <Input />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                        </Space>
                    ))}

                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            添加
                        </Button>
                    </Form.Item>
                </>
                )}
            </Form.List>
            <Form.Item>
                <Button  htmlType="submit" type="primary">保存</Button>
            </Form.Item>
            </Form>
    </Modal>
}

export default useTypeGet;