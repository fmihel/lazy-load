/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */

// Работа с отложенной загрузкой webpack
// Пример работы:
//    import imports from 'fmihel-browser-lib';
//
// описание модулей
//    const modules = {
//        lazy() { return import(/* webpackChunkName: "lazy" */ './lazy').then((module) => ({ lazy:module })); },
//        lodash() { return import(/* webpackChunkName: "lodash" */ 'lodash').then((module) => ({ _: module })); },
//    };
// добавление модулей
//    imports.add(modules);
//    ...
//    ...
// отложенный вызов
//    imports('lazy','lodash')
//       .then( {lazy,_} =>{
//         lazy.default.main(); // for export default
//         lazy.second();       // for export
//         _.fill(Array(3),'aaa');// lodash using
//    });
//

class Imports {
    constructor() {
        this._private = {
            modules: {},
        };
    }

    params(params = false) {
        if (params === false) {
            return {
                ...this._private,
            };
        }

        const { modules, ...other } = params;

        return {
            ...this._private,
            ...other,
            modules: this.modules(modules),
        };
    }

    modules(list = false) {
        const t = this;
        if (typeof list === 'object') {
            const keys = Object.keys(list);

            keys.map((name) => {
                if (name in t._private.modules) {
                    console.warn(`module ${name} is already added to imports.modules`);
                } else {
                    t._private.modules[name] = list[name];
                }
            });
        }

        return t._private.modules;
    }

    load(...names) {
        const t = this;
        return new Promise((ok, err) => {
            const modules = t.modules();
            const modulesNames = Object.keys(modules);

            // создаем список загружаемых модулей
            const loadingModules = [];

            for (let i = 0; i < names.length; i++) {
                if (modulesNames.indexOf(names[i]) === -1) {
                    const msg = `module ${names[i]} is not added to imports.modules`;
                    err(msg);
                    return;
                }
                loadingModules.push(modules[names[i]]);
            }

            Promise.all(loadingModules.map((mod) => mod()))
                .then((result) => {
                    let out = {};
                    result.map((mod) => {
                        out = { ...out, ...mod };
                    });
                    ok(out);
                }).catch((e) => {
                    err(e);
                });
        });
    }
}

const _imports = new Imports();

function imports(...names) {
    return _imports.load(...names);
}

imports.add = (modules) => { _imports.modules(modules); };

export default imports;
