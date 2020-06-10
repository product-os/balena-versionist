declare module 'balena-versionist' {
	function runBalenaVersionist(path: string, options: {}): Promise<string>;

	export { runBalenaVersionist };
}
