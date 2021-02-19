import { ClassTransformOptions } from 'class-transformer/types/interfaces';

import { DEFAULT_SERIALIZABLE_OPTIONS, SerializableOptions } from './serializable-options.model';

interface IPlainToClassOptions extends SerializableOptions {
	/**
	 * Default false.
	 */
	ignoreClassAlias?: boolean;
}

export type PlainToClassOptions = IPlainToClassOptions & ClassTransformOptions;

export const DEFAULT_PLAIN_TO_CLASS_OPTIONS: PlainToClassOptions = {
	...DEFAULT_SERIALIZABLE_OPTIONS,
	ignoreClassAlias: false,
};
