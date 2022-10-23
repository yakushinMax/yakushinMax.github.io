/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_STUDENT_SURNAME: string;
    readonly VITE_STUDENT_NAME: string;
    readonly VITE_STUDENT_LASTNAME: string;
    readonly VITE_TGBOT_API_KEY: string;
    readonly VITE_TGGROUP_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
