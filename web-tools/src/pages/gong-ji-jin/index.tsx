import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Row, Form, Input, message, Checkbox, Col, Button, Typography, Space, DatePicker, Select, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const defaultForm = {
	original: '',
	needUnique: true,
	autoCopy: true,
};
type FormType = typeof defaultForm;


export default function GongJiJinPage() {
	const onFinish = (values: any) => {
		console.log('Received values of form:', values);
	};
	return (<Form onFinish={onFinish} autoComplete="off">
		<Form.List name="users">
			{(fields, { add, remove }) => {
				console.log('fields: ', fields);
				return (
					<>
						{fields.map((field) => (
							<Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">

								<Form.Item
									{...field}
									key={field.key + '0'}
									name={[field.name, 'month']}
									rules={[{ required: true, message: '输入当前项月份' }]}
								>
									<DatePicker placeholder='选择月份' picker="month"/>
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
									<InputNumber placeholder="交易金额" />
								</Form.Item>
								
								<MinusCircleOutlined onClick={() => remove(field.name)} />
							</Space>
						))}
						<Form.Item>
							<Button type="dashed" onClick={() => {
								add({
									money: 7777,
									// month: '2022-01',
								});
							}} block icon={<PlusOutlined />}>
								添加一项（根据最新一项自动填入数据）
							</Button>
						</Form.Item>
					</>)
				
			}}
		</Form.List>
		<Form.Item>
			<Button type="primary" htmlType="submit">
				计算
			</Button>
		</Form.Item>
	</Form>
	);
}
