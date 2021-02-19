import { ClassTransformOptions } from 'class-transformer/types/interfaces';

import { DEFAULT_SERIALIZABLE_OPTIONS, SerializableOptions } from './serializable-options.model';

interface IClassToPlainOptions extends SerializableOptions {
	/**
	 * If true, then add a system property '__type' to the resulting plain object.
	 * Provided that the converted object is marked with a decorator @Serializable.
	 * Default false.
	 */
	exposeClassAlias?: boolean;
}
export type ClassToPlainOptions = IClassToPlainOptions & ClassTransformOptions;

export const DEFAULT_CLASS_TO_PLAIN_OPTIONS: ClassToPlainOptions = {
	...DEFAULT_SERIALIZABLE_OPTIONS,
	exposeClassAlias: false,
	exposeUnsetFields: false,
	excludePrefixes: ['_'],
};
