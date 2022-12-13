import React, { createRef, useEffect, useMemo, useRef, useState } from 'react';

import moment from 'moment';
import { Row, Form, Input, message, Checkbox, Col, Button, Typography, Space, DatePicker, Select, InputNumber, FormInstance, Switch } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getCacheData, getFactorCacheData, getLoanAmount, isCacheData, setCacheData, setFactorCacheData, setShouldCacheData } from './utils';


export default function GongJiJinPage() {

	const form = createRef<FormInstance>();

	const [cacheData, updateCacheData] = useState(isCacheData());
	const [factor, setFactor] = useState(getFactorCacheData() + '');

	useEffect(() => {
		setShouldCacheData(cacheData);
	}, [cacheData]);
	useEffect(() => {
		setFactorCacheData(Number(factor));
	}, [factor]);

	const onFinish = (values: any) => {
		const list = values.data.slice();

		const targetList = list.map((i: any) => ({
			...i,
			month: i.month.format('YYYY-MM'),
		})).reverse();

		const v = getLoanAmount(targetList, Number(factor));

		setLoan(v);

	};

	useEffect(() => {
		if (cacheData) {
			const list = getCacheData();
			form.current?.setFieldsValue({data: list.map(i => ({
				...i,
				month: i.month ? moment(i.month) : null,
			}))})
		}
	}, []);

	const onChange = (_: any, values: any) => {
		const list = values.data;
		if (cacheData) {
			setCacheData(list.map((i: any) => ({
				...i,
				month: i.month ? i.month.format() : '',
			})));
		}
	}

	const [loan, setLoan] = useState(0);

	return (<Form ref={form} onFinish={onFinish} onValuesChange={onChange} autoComplete="off">
		<Form.List name="data">
			{(fields, { add, remove }) => {
				return (
					<>
						<Form.Item>
							<Button type="dashed" onClick={() => {
								const v = form.current?.getFieldsValue()
								if (!v.data || !v.data.length) {
									add({
										money: 0,
										type: 'push',
										month: moment(),
									});
									return;
								}
								const item = v.data[0];
								const {
									money,
									month,
								} = item;
								const newMonth = (month as moment.Moment).clone().add(1, 'M');
								add({
									money,
									type: 'push',
									month: newMonth,
								}, 0);
							}} block icon={<PlusOutlined />}>
								添加一项（根据最新一项自动填入数据）
							</Button>
						</Form.Item>
						<div style={{
							height: 'calc(100vh - 240px)',
							overflow: 'auto',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}>
							{fields.map((field) => (
								<Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
									<Form.Item
										{...field}
										key={field.key + '0'}
										name={[field.name, 'month']}
										rules={[{ required: true, message: '输入当前项月份' }]}
									>
										<DatePicker placeholder='选择月份' picker="month" format='YYYY-MM' />
									</Form.Item>
									<Form.Item
										{...field}
										key={field.key + '1'}
										name={[field.name, 'type']}
										rules={[{ required: true, message: '输入发生改变的类型' }]}
										initialValue='push'
									>
										<Select style={{ width: 120 }}>
											<Select.Option value="push">存入</Select.Option>
											<Select.Option value="get">提取</Select.Option>
										</Select>
									</Form.Item>
									<Form.Item
										{...field}
										key={field.key + '2'}
										name={[field.name, 'money']}
										
										rules={[{ required: true, message: '输入发生改变的金额' }]}
									>
										<InputNumber style={{
											width: 220,
										}} placeholder="交易金额" />
									</Form.Item>

									<MinusCircleOutlined onClick={() => {
										remove(field.name)
									}} />
								</Space>
							))}
						</div>

					</>)

			}}
		</Form.List>
		
			<Row align='middle' style={{
				paddingTop: 16,
				borderTop: '1px solid #ccc',
			}}>
				<Col span={4} offset={2}>
					
					<Form.Item label='使用本地缓存' labelCol={{
						span: 16,
						offset: 0,
					}}>
						<Switch checked={cacheData} onChange={(e) => {
							updateCacheData(e);
						}} />
					</Form.Item>
					
					<Form.Item label='存贷系数' labelCol={{
						span: 16,
						offset: 0,
					}}>
						<Input value={factor} onChange={e => {
							setFactor(e.target.value)
						}} />
					</Form.Item>
				</Col>
				<Col span={4} offset={2}>
					<Button style={{
						width: 240,
					}} type="primary" htmlType="submit">
						计算
					</Button>
				</Col>
				<Col span={8} offset={2}>
					最近一次存入的次月，可贷款金额：<span style={{
						fontSize: 32,
						color: 'red',
					}}>
						{loan}
					</span>元 <br />(计算方式为成都公积金中心给出算法)
				</Col>
				
			</Row>

	</Form>
	);
}
