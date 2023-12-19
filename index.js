function generateor(data, name) {
    let array = [];
    if (typeof data === 'object') {
        Object.keys(data).map((key) => (array = [...array, ...generateor(data[key], key)]));
    }
    else {
        array = [`${name}:${data}`];
    }
    return array;
}
export function line(json, name) {
    // 確認裝置大小使用的 css
    const deviceWidth = window.innerWidth;
    if (deviceWidth < 768 && json['sm']) {
        json = Object.assign(Object.assign({}, json), json['sm']);
    }
    else if (deviceWidth < 992 && json['md']) {
        json = Object.assign(Object.assign({}, json), json['md']);
    }
    else if (deviceWidth < 1200 && json['lg']) {
        json = Object.assign(Object.assign({}, json), json['lg']);
    }
    else if (deviceWidth > 1200 && json['xl']) {
        json = Object.assign(Object.assign({}, json), json['xl']);
    }
    ['sm', 'md', 'lg', 'xl'].map((size) => delete json[size]);
    // 轉換 css string
    const cssContent = generateor(json, 'json').join(';') + ';';
    // 隨機生成 class name
    const length = 8;
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let className = name && name.length > 0 ? name : possible.charAt(Math.floor(Math.random() * (possible.length - 10)));
    for (let i = 1; i < length; i++)
        className += possible.charAt(Math.floor(Math.random() * possible.length));
    // 建立 <style> 元素
    const styleElement = document.createElement('style');
    // 將 CSS class 內容添加到 <style> 元素中
    styleElement.appendChild(document.createTextNode(`.${className}{ ${cssContent} }`));
    // 將 <style> 元素添加到 <head> 區域
    document.head.appendChild(styleElement);
    return className;
}
export class CssProperty {
}
CssProperty.textAlign = (align) => ({ 'text-align': align });
CssProperty.flex = (justifyContent = 'flex-start', alignItems = 'flex-start', direction = 'row') => ({
    display: 'flex',
    'justify-content': justifyContent,
    'align-items': alignItems,
    'flex-direction': direction,
});
CssProperty.grid = (columns) => {
    const columnArray = [];
    columns.map((column) => {
        columnArray.push(typeof column === 'number' ? `${column}fr` : column);
    });
    return { display: 'grid', 'grid-template-columns': columnArray.join(' ') };
};
CssProperty.margin = (top, right, bottom, left) => {
    const marginArray = [];
    marginArray.push(typeof top === 'string' ? top : `${top}px`);
    marginArray.push(typeof right === 'string' ? right : `${right}px`);
    marginArray.push(typeof bottom === 'string' ? bottom : `${bottom}px`);
    marginArray.push(typeof left === 'string' ? left : `${left}px`);
    return { margin: marginArray.join(' ') };
};
CssProperty.padding = (top, right, bottom, left) => {
    const paddingArray = [];
    paddingArray.push(typeof top === 'string' ? top : `${top}px`);
    paddingArray.push(typeof right === 'string' ? right : `${right}px`);
    paddingArray.push(typeof bottom === 'string' ? bottom : `${bottom}px`);
    paddingArray.push(typeof left === 'string' ? left : `${left}px`);
    return { padding: paddingArray.join(' ') };
};
CssProperty.fontSize = (size) => ({ 'font-size': `${size}px` });
CssProperty.borderRadius = (radius) => ({
    'border-radius': (() => (typeof radius === 'string' ? radius : `${radius}px`))(),
});
CssProperty.letterSpacing = (space) => ({ 'letter-spacing': `${space}px` });
CssProperty.lineHeight = (height) => ({ 'line-height': `${height}px` });
CssProperty.fontWeight = (weight) => ({ 'font-weight': weight });
