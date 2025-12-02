(function () {
    const supported = ['en', 'bg'];
    const defaultLang = 'en';
    const langSelectorId = 'langSelector';

    function getSelectedLang() {
        const stored = localStorage.getItem('site-lang');
        if (stored && supported.includes(stored)) return stored;
        const browserLang = (navigator.language || navigator.userLanguage || '').slice(0, 2);
        return supported.includes(browserLang) ? browserLang : defaultLang;
    }

    async function loadLang(lang) {
        try {
            const res = await fetch(`./i18n/${lang}.json`);
            if (!res.ok) throw new Error('Failed to load lang file: ' + lang);
            const json = await res.json();
            return json;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    function applyTranslations(data) {
        if (!data) return;

        // Update document title
        if (data.page && data.page.title) document.title = data.page.title;

        // All elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const attr = el.getAttribute('data-i18n-attr');
            const value = getValueFromKey(data, key);
            if (value == null) return; // no translation
            if (attr) {
                if (attr === 'html') {
                    el.innerHTML = value;
                } else {
                    el.setAttribute(attr, value);
                }
            } else {
                el.textContent = value;
            }
        });
    }

    function getValueFromKey(obj, key) {
        const parts = key.split('.');
        let cur = obj;
        for (let p of parts) {
            if (!cur) return null;
            cur = cur[p];
        }
        return cur;
    }

    function setupLangSelector(current) {
        const sel = document.getElementById(langSelectorId);
        if (!sel) return;
        sel.value = current;
        sel.addEventListener('change', async (e) => {
            const newLang = e.target.value;
            if (!supported.includes(newLang)) return;
            localStorage.setItem('site-lang', newLang);
            const res = await loadLang(newLang);
            applyTranslations(res);
            document.documentElement.setAttribute('lang', newLang);
        });
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', async () => {
        const lang = getSelectedLang();
        setupLangSelector(lang);
        const translations = await loadLang(lang);
        applyTranslations(translations);
        document.documentElement.setAttribute('lang', lang);
    });
})();
