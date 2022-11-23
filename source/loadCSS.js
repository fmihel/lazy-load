function loadCSS(file, param = {}) {
    const p = { ...loadCSS.param, ...param };
    if (p.enable) {
        const ext = `.${file.split('.').pop()}`;
        const href = p.root + file.replace(ext, `.${p.hash}${ext}`);
        const link = document.createElement('link');
        link.href = href;
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.media = 'screen,print';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
}
loadCSS.param = {
    hash: '',
    root: '',
    enable: true,
};

export default loadCSS;
