export interface SerializableOptions {
	/**
	 * Default '__type'.
	 */
	aliasProperty?: string;
}

export const DEFAULT_SERIALIZABLE_OPTIONS: SerializableOptions = {
	aliasProperty: '__type',
};
