export const getEnviroments = () => {
    return {
        VITE_APIKEY: import.meta.env.VITE_APIKEY,
        VITE_APIKEYOPENIA: import.meta.env.VITE_APIKEYOPENIA,
        VITE_AUTHDOMAIN: import.meta.env.VITE_AUTHDOMAIN,
        VITE_PROJECTID: import.meta.env.VITE_PROJECTID,
        VITE_STORAGEBUCKET: import.meta.env.VITE_STORAGEBUCKET,
        VITE_MESSAGINGSENDERID: import.meta.env.VITE_MESSAGINGSENDERID,
        VITE_APPID: import.meta.env.VITE_APPID,
    };
};
