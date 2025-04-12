/// <reference types="vite/client" />
interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	readonly [key: string]: string;
	// add your env variable here...
}
interface ImportMeta {
	readonly env: ImportMetaEnv;
}
