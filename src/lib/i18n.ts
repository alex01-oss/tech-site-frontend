const dictionaries = {
    en: () => import('@/locales/en.json').then((module) => module.default),
    uk: () => import('@/locales/uk.json').then((module) => module.default),
}

export const LANGS = {
    uk: {flag: "/ua_flag.svg", name: "Українська"},
    en: {flag: "/uk_flag.svg", name: "English"}
};

export const getDictionary = async (locale: string) => {
    const validLocale = locale in dictionaries ? locale as keyof typeof dictionaries : 'uk';
    return dictionaries[validLocale]();
}

export type Dict = Awaited<ReturnType<typeof getDictionary>>;