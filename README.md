# lazy-load
Утилиты отложенной загрузки ресурсов web приложения

# Установка 
```bash
$ npm i fmihel-lazy-load
```

# Загрузка CSS в процессе выполнения
```function loadCSS(path:string,param?:object)```\
`path` - путь относительно корня проекта\
`param` - настройки см. load-lazy.config.js

---
#### Пример:
`Структура проекта`
```
root
 |--app
 |   |--client
 |       |--index.js
 |       |--style.scss
 |       |--index.html
 |       |--lazy-load.config.js
 |
 |--dist
     |--style
     |   |--app
     |       |--client 
     |           |--style.HASHSUM1.css   
     |--main.HASHSUM2.js
     |--index.html
```

`index.js`
```js 
import './lazy-load.config.js';
import { loadCSS } from 'fmihel-lazy-load';
// на этапе сборки style.scss будет вырезан из сборки и упакован в в файл
// dist/style/app/client/style.HASHSUM1.css
import './style.scss'; 

// динамически грузим dist/style/app/client/style.HASHSUM1.css в процессе выполнения
loadCSS('style.css'); 

```


`lazy-load.config.js`
```js
import { loadCSS } from 'fmihel-lazy-load';

loadCSS.param = {
    ...loadCSS.param,
    hash: CSS_HASH,         // hash генерируемый в webpack.config.js
    root: CSS_ROOT_PATH,    // путь к папке dist/style/app/client
    enable:true,            // включает/выключает механизм загрузки (по умолчанию = true)
};
```


`webpack.config.js`
```js
const webpack = require('webpack');
// простая ф-ция генерации hash для CSS
const genHash=(count)=>{
    let res = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < count; i++) res += possible.charAt(Math.floor(Math.random() * possible.length));
    return res;
}

let outputPath = path.resolve(__dirname,'dist');
let hash = genHash(20);

module.exports = {
    ...
    plugins: [
        ...
        new webpack.DefinePlugin({
           CSS_ROOT_PATH: JSON.stringify('./style/app/client'),
           CSS_HASH: JSON.stringify(hash),
        }),
        ...        
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                type: "asset/resource",
                generator: {
                    // вырежет и сгенерирует файл в dist/style/app/client
                    filename: "style/[path]/[name]."+hash+".css", 
                },
                use: [
                    'sass-loader'           
                ]
            }
        ],
    },    

```

# Загрузка JSON
```function loadJSON(url:string,param?:object):Promise```\
`url` - путь к json файлу\
`param` - настройки для ф-ции fetch\
```return Promise``` -  Возвращает промис с параметром содержащим загруженный объект.

#### Пример
```js
import { loadJSON } from 'fmihel-lazy-load';
...
loadJSON('http://site.ru/path/file.json')
  .then((o)=>{
    console.log('load',o);
  });

```

# Загрузка скрипта javascript
```function loadScript(url:string, varName: false | string):Promise```
`url` - путь к js файлу\
`varName` - имя глобальной переменной, которая описана через  ```var```\
 ```return Promise``` - если модуль загружен, то возвращает Promise, в случае если varName=false, в промис передается url, 
 если varName !=false то возвращает значение переменной

#### Пример
`for-load.js` ()
```js

...
loadJSON('http://site.ru/path/file.json')
  .then((o)=>{
    console.log('load',o);
  });

```

```js
import { loadJSON } from 'fmihel-lazy-load';
...
loadJSON('http://site.ru/path/file.json')
  .then((o)=>{
    console.log('load',o);
  });

```

# Отложенный импорт модуля

```function imports(...names:string):Promise``` - загрузка модуля\
`names` - имена необходимых к загрузке модулей, регистрация модулей осуществляется через ф-йию ```imports.add```\
 ```return Promise``` - возвращает объект свойствами которого являются ссылки на загруженные модули\
\
```function imports.add(modules:object)``` - регистрация модуля\
`modules` - object { modname1:function, modname2:function,...}\
`modname function` - ф-ция возвращающая результат выполнения ф-ции import для регистрируемого модуля, см. пример

#### Пример

`modForLoad.js` - модуль для отложенной загрузки
```js
const func1=()=>{
    console.log('func1');
}
export default func1;
```

`index.js` 
```js
import { imports } from 'fmihel-lazy-load';

// регистрируем подгружаемый модуль
imports.add({
    _() { return import('lodash').then((mod) => mod.default); },
    $() { return import('jquery').then((mod) => mod.default); },
    modForLoad() { return import('./path/modForLoad')},
})
...
// загружаем модуль и используем его ф-ционал
imports('modForLoad','_')
    .then({ modForLoad , _ } => {
        modForLoad.default.func1();
        _.fill(Array(3),'aaa');// lodash using
    });
```
