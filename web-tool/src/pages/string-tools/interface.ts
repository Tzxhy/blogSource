import React from 'react';

export interface UseAction {
    /** 渲染结果节点 */
    renderResult(s: any): React.ReactNode;

    compute(s: string): Promise<any> | any;

    showCopyButton?: boolean;

    getStringValue(): string;

    renderOtherTool?(): React.ReactNode;

    getMockData(): string;

    renderModal?(): React.ReactNode;
}