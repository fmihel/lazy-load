# lazy-load
Утилиты отложенной загрузки ресурсов web приложения

# Установка 
```bash
$ npm i fmihel-lazy-load -D
```

# Загрузка CSS в процессе выполнения

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
    hash: CSS_HASH,         // hash генерируемый в webpack.config.js
    root: CSS_ROOT_PATH,    // путь к папке dist/style/app/client
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
