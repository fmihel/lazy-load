/* eslint-disable no-return-assign */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable array-callback-return */

/** Работа с отложенной загрузкой webpack
 * Пример работы:
 * import imports from 'fmihel-lazy-load';
 *
 * описание модулей (вынести в отдельный файл конфигурации)
 * imports.add({
 *      _() { return import('lodash').then((mod) => mod.default); },
 *      $() { return import('jquery').then((mod) => mod.default); },
 *      myUnit() { return import('../utils/myUnit'); }
 * };
 *
 * отложенный вызов
 * imports('myUnit',_).then( {myUnit,_}=>{
 *      let getFromMyUnit = myUnit.default.main;    // for export default
 *      _.fill(Array(3),'aaa');                     // lodash using
 *  });
*/

class Imports {
    constructor() {
        this.modules = {};
    }

    /** добавление списка модулей, для отложенной загрузки
     *  Ex.
     *  add({
     *      lodash() { return import('lodash').then((mod) => mod.default); },
     * })
    */
    add(mods = {}) {
        const self = this;
        const names = Object.keys(mods);
        names.map((name) => {
            if (!(name in self.modules)) {
                self.modules[name] = mods[name];
            }
        });
    }

    /** загрузка списка модулей, в случае успеха возвращает промис с объектом, свойства которого соотвествуют
     *  указанным к загрузке модулям
     *  Ex:
     *  load('lodash','$').then(({lodash,$})=>{
     *      $('#my').css({color:'red'});
     *  })
     */
    load(...names) {
        const self = this;
        return new Promise((ok, err) => {
            for (let i = 0; i < names.length; i++) {
                if (!(names[i] in self.modules)) {
                    const msg = `lazy module ${names[i]} not defined`;
                    err(msg);
                    return;
                }
            }
            ok();
        })
            .then(() => Promise.all(names.map((name) => self.modules[name]())))
            .then((o) => {
                const out = {};
                names.map((name, i) => out[name] = o[i]);
                return out;
            });
    }
}

const _imports = new Imports();

function imports(...names) {
    return _imports.load(...names);
}

imports.add = (modules) => { _imports.add(modules); };

export default imports;
