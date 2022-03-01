import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Row, Form, Input, message, Checkbox, Col, Button } from 'antd';

const { TextArea } = Input;

const defaultForm = {
	original: '',
	needUnique: true,
	autoCopy: true,
};
type FormType = typeof defaultForm;

const STORAGE_KEY = '__local_search__';
// function updateLocalSearch(v: string) {
// 	const o = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
// 	o.push(v);
// 	localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
// }

// function isDuplicateInLocalSearch(v: string): boolean {
// 	const o = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
// 	if (o.indexOf(v) >= 0) {
// 		return true;
// 	}
// 	return false;
// }
const duplicateTips = '发生重复!!';

export default function RenamePage() {
	const initAllValue: string[] = useMemo(() => {
		const newArr: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		return newArr.sort((a, b) => a > b ? 1 : -1);
	}, []);
	const [convertedValue, setConvertedValue] = useState('');
	const [nowAllValue, setNowAllValue] = useState(initAllValue);
	const updateLocalSearch = (v: string) => {
		const newArr = [...nowAllValue, v];
		newArr.sort((a, b) => a > b ? 1 : -1);
		setNowAllValue(newArr);
	}
	const isDuplicateInLocalSearch = (v: string) => {
		return nowAllValue.includes(v);
	}
	const onValuesChange = (_changedValues: Partial<FormType>, allValues: FormType) => {
		if (allValues.original) {
			const original = allValues.original.trim();
			// 检查是否有重复
			let newValue!: string;
			const needUnique = allValues.needUnique;
			const normalHandle = () => {
				newValue = original.replace(/\s/g, '_');
				newValue = newValue.replace(/[<>/\\|:*?"“”、.()$#&^%,[\]{}=@~`'·!\-;+（）「」，¥。【】]+/g, '_');
			};
			normalHandle();
			let shouldUpdateLocalSearch = true;
			if (needUnique) {
				const check = isDuplicateInLocalSearch(newValue);
				console.log('check: ', check);
				if (check) { // 重复
					newValue = duplicateTips;
					shouldUpdateLocalSearch = false;
				}
			}
			shouldUpdateLocalSearch && updateLocalSearch(newValue);
			setConvertedValue(newValue);
			
			if (allValues.autoCopy && newValue !== duplicateTips) {
				copy(newValue);
			}
		}
	};

	function copy(v: string) {
        window.getSelection()!.removeAllRanges()

        const input = document.createElement('textarea')
        input.value = v
        
        input.style.position = 'fixed'
        input.style.left = '-9999px'

        document.body.appendChild(input)
        input.select()

        const msg = document.execCommand('copy')
        if (msg) {
            message.success('成功拷贝数据到剪切板', .3);
        }

        window.getSelection()!.removeAllRanges()
        input.remove()

		setTimeout(() => {
			inputRef.current?.focus();
			inputRef.current?.select?.();
		}, 300);
    }

	
	useEffect(() => {
		const save = () => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(nowAllValue));
		};
		window.addEventListener('beforeunload', save);
		return () => {
			window.removeEventListener('beforeunload', save);
		}
	}, [nowAllValue]);

	const resetLocalStorage = () => {
		localStorage.setItem(STORAGE_KEY, '[]');
		setNowAllValue([]);
	}

	const inputRef = useRef<Input | null>(null);

	return (
		<div style={{marginTop: 100}}>
			<Form
				name='basic'
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 20 }}
				initialValues={defaultForm}
				onValuesChange={onValuesChange}
				autoComplete='off'
			>
				<Form.Item
					label='原始值'
					name='original'
					rules={[{ required: true, message: '输入原始值' }]}
				>
					<Input ref={inputRef} placeholder='请直接粘贴，不要手动编写' />
				</Form.Item>
				<Form.Item
					label="重复提示"
					name='needUnique'
					valuePropName="checked"
				>
					<Checkbox></Checkbox>
				</Form.Item>
				<Form.Item
					label='自动复制'
					name='autoCopy'
					valuePropName="checked"
				>
					<Checkbox></Checkbox>
				</Form.Item>
			</Form>

			<Row style={{marginTop: 32, display: 'flex', alignItems: 'center'}}>
				<Col span={4} style={{textAlign: 'right'}}>转换后：</Col>
				<Col span={20} style={{ height: 48, padding: 8, backgroundColor: 'white' }}>
					<p style={
						{
							margin: 0,
							lineHeight: '32px',
							color: convertedValue === duplicateTips ? 'red' : '#000',
						}
					}>{convertedValue}</p>
				</Col>
			</Row>
			<Row style={{marginTop: 32, display: 'flex', alignItems: 'center'}}>
				<Col span={4} style={{textAlign: 'right'}}>本地已有：</Col>
				<Col span={20} style={{  }}>
					<TextArea value={nowAllValue.join('\n')} rows={18} readOnly />
				</Col>
			</Row>
			<Row>
				<Col offset={4}>
					<Button type="primary" danger onDoubleClick={resetLocalStorage}>清除本地数据(双击)</Button>
				</Col>
			</Row>
		</div>
	);
}
