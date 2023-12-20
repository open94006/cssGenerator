export type Align = 'start' | 'center' | 'end' | 'left' | 'right';
export type Display =
    | 'none'
    | 'inline'
    | 'block'
    | 'inline-block'
    | 'table'
    | 'table-caption'
    | 'table-row'
    | 'table-cell'
    | 'inline-table'
    | 'flex'
    | 'inline-flex'
    | 'grid'
    | 'inline-grid';
export type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

function generateor(data: string | number | { [k: string]: any }, name: string) {
    let array: string[] = [];
    if (typeof data === 'object') {
        Object.keys(data).map((key) => (array = [...array, ...generateor(data[key], key)]));
    } else {
        array = [`${name}:${data}`];
    }
    return array;
}

export function line(json: { [k: string]: any }, name?: string) {
    // 確認裝置大小使用的 css
    const deviceWidth = window.innerWidth;
    if (deviceWidth < 768 && json['sm']) {
        json = { ...json, ...json['sm'] };
    } else if (deviceWidth < 992 && json['md']) {
        json = { ...json, ...json['md'] };
    } else if (deviceWidth < 1200 && json['lg']) {
        json = { ...json, ...json['lg'] };
    } else if (deviceWidth > 1200 && json['xl']) {
        json = { ...json, ...json['xl'] };
    }
    ['sm', 'md', 'lg', 'xl'].map((size) => delete json[size]);

    // 轉換 css string
    const cssContent = generateor(json, 'json').join(';') + ';';

    // 隨機生成 class name
    const length = 8;
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let className = '';
    if (name && name.length > 0) {
        className = name;
    } else {
        className = possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
        for (let i = 1; i < length; i++) className += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    // 建立 <style> 元素
    const styleElement = document.createElement('style');

    // 將 CSS class 內容添加到 <style> 元素中
    styleElement.appendChild(document.createTextNode(`.${className.replace(' ', '.')}{ ${cssContent} }`));

    // 將 <style> 元素添加到 <head> 區域
    document.head.appendChild(styleElement);

    return className;
}

export class CssProperty {
    static textAlign = (align: Align) => ({ 'text-align': align });
    static flex = (
        justifyContent: JustifyContent = 'flex-start',
        alignItems: AlignItems = 'flex-start',
        direction: string = 'row'
    ) => ({
        display: 'flex',
        'justify-content': justifyContent,
        'align-items': alignItems,
        'flex-direction': direction,
    });
    static grid = (columns: (number | string)[]) => {
        const columnArray: string[] = [];
        columns.map((column: number | string) => {
            columnArray.push(typeof column === 'number' ? `${column}fr` : column);
        });
        return { display: 'grid', 'grid-template-columns': columnArray.join(' ') };
    };
    static margin = (top: number | string, right: number | string, bottom: number | string, left: number | string) => {
        const marginArray = [];
        marginArray.push(typeof top === 'string' ? top : `${top}px`);
        marginArray.push(typeof right === 'string' ? right : `${right}px`);
        marginArray.push(typeof bottom === 'string' ? bottom : `${bottom}px`);
        marginArray.push(typeof left === 'string' ? left : `${left}px`);
        return { margin: marginArray.join(' ') };
    };
    static padding = (top: number | string, right: number | string, bottom: number | string, left: number | string) => {
        const paddingArray = [];
        paddingArray.push(typeof top === 'string' ? top : `${top}px`);
        paddingArray.push(typeof right === 'string' ? right : `${right}px`);
        paddingArray.push(typeof bottom === 'string' ? bottom : `${bottom}px`);
        paddingArray.push(typeof left === 'string' ? left : `${left}px`);
        return { padding: paddingArray.join(' ') };
    };
    static fontSize = (size: number) => ({ 'font-size': `${size}px` });
    static borderRadius = (radius: number | string) => ({
        'border-radius': (() => (typeof radius === 'string' ? radius : `${radius}px`))(),
    });
    static letterSpacing = (space: number) => ({ 'letter-spacing': `${space}px` });
    static lineHeight = (height: number) => ({ 'line-height': `${height}px` });
    static fontWeight = (weight: number | string) => ({ 'font-weight': weight });
}
