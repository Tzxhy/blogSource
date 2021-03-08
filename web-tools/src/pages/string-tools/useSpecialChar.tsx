import { Button, message, Modal, Select } from 'antd';
import { useMemo, useRef, useState } from 'react';
import { UseAction } from './interface';
import { SPECIAL_CHAR } from './mockData';

function getColumnData(str: string) {
    const words = str.split('\n');

    let customChars = []
    const storage = localStorage[SPECIAL_CUSTOM_KEY]
    if (storage) {
        try {
            customChars = JSON.parse(storage)
        } catch(e) {
            customChars = []
        }
    }
    const specialChar = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?%~！@#￥……&*（）——|{}【】‘；：”“'。，、？+′" + customChars.map((i: string) => `\\${i}`).join('') + ']');
    const canU: (string | number)[] = [];
    words.forEach(i => {
        
        if (i.length >= 16) {
            canU.push('长度超过16');
            return;
        }

        if (specialChar.test(i)) {
            canU.push('特殊字符');
            return;
        }

        const res = i.match(/(\d+)年|(\d+)(?=字)|(\d+)/);
        if (res && res[1]) {
            const year = Number(res[1]);
            if (year < 21 || year < 2021) {
                canU.push('年' + year);
                return;
            }
        }
        if (res && res[3]) {
            const year = Number(res[3]);
            if (year >= 2000 && year < 2021) {
                canU.push('年' + year);
                return;
            }
        }
        canU.push('ok')
    })
    return canU.map((item, idx) => ({
        o: words[idx],
        t: item,
    }))
}


const useSpecialChar: () => UseAction = function() {

    const v = useRef<{o: string, t: string | number}[]>([])
    const renderResult = (s: {o: string, t: string | number}[]) => (<div style={{
        whiteSpace: 'pre-line',
        maxHeight: 400,
        overflow: 'auto',
    }}>{
        s.map((i, idx) => <p key={idx}>{ i.o }{'\t'}{i.t}</p>)
    }</div>)

    const compute = (s: string) => {
        v.current = getColumnData(s)
        return v.current
    }
    const [showModal, setShowModal] = useState(false)
    const getStringValue = () => v.current.map(i => `${i.o}\t${i.t}`).join('\n')
    const renderOtherTool = () => <>
        <Button type="text" onClick={() => setShowModal(true)}>增加自定义特殊符号</Button>
        <FillModal showModal={showModal} setShowModal={setShowModal} />
    </>
    return {
        renderResult,
        compute,
        showCopyButton: true,
        getStringValue,
        getMockData: () => SPECIAL_CHAR,
        renderOtherTool,
    }
}
interface FillModalProps {
    showModal: boolean
    setShowModal: (_b: boolean) => void
}

const SPECIAL_CUSTOM_KEY = 'special_custom'

function FillModal(props: FillModalProps) {
    const ref = useRef<string[]>([])

    function handleChange(value: any) {
        console.log(`Selected: ${typeof value}`)
        ref.current = value
    }

    const defaultV = useMemo<string[]>(() => {
        let o = localStorage[SPECIAL_CUSTOM_KEY];
        if (o) {
            try {
                o = JSON.parse(o)
            } catch(e) {
                o = []
            }
        } else {
            o = []
        }
        return o
    }, []);

    function handleOk() {
        const newStr = ref.current;
        
        if (newStr) {
            const arr = newStr.filter(i => i.length === 1)
            localStorage[SPECIAL_CUSTOM_KEY] = JSON.stringify(arr)
            message.success('成功写入！')
        }
        props.setShowModal(false)
    }

    return <Modal
        title="录入自定义特殊字符"
        centered
        visible={props.showModal}
        onOk={handleOk}
        onCancel={() => props.setShowModal(false)}
        width={800}
    >
        <Select
            mode="tags"
            size="middle"
            placeholder="输入需要添加的自定义字符，输入一个字符后按回车增加，最后点击 ok"
            defaultValue={defaultV}
            onChange={handleChange}
            style={{ width: '100%' }}
        >
        </Select>
    </Modal>
}


export default useSpecialChar;