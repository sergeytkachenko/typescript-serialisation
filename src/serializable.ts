import { classToPlain, plainToClass } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import 'reflect-metadata';

import { ClassToPlainOptions, DEFAULT_CLASS_TO_PLAIN_OPTIONS } from './models';
import { DEFAULT_PLAIN_TO_CLASS_OPTIONS, PlainToClassOptions } from './models';

const defaultAliasProperty = '__type';
type Class = Function;
type ClassAlias = string;
const aliases = new Map<Class, ClassAlias>();
const classes = new Map<ClassAlias, Class>();

function getAliasByClass(cls: Class): ClassAlias {
	if (aliases.has(cls)) {
		return aliases.get(cls);
	}
}

function getClassByAlias(classAlias: ClassAlias): Class {
	if (classes.has(classAlias)) {
		return classes.get(classAlias);
	}
}

function _classToPlain(instance: any, options: ClassToPlainOptions): any {
	const plainObject = classToPlain(instance, options);
	if(options.exposeClassAlias) {
		return _addAliasToPlain(instance, options.aliasProperty);
	}
	return plainObject;
}

function _addAliasToPlain(plainObject: Object, aliasProperty: string) {
	for (const [property, value] of Object.entries(plainObject)) {
		const propertyType = typeof value === 'object'; // map, set
		if (propertyType) {
			plainObject[property] = _addAliasToPlain(value, aliasProperty);
		}
	}
	const classAlias = getAliasByClass(plainObject?.constructor);
	if (classAlias) {
		Object.assign(plainObject, { [aliasProperty]: classAlias, });
	}
	return plainObject;
}

function _plainToClass(config: Object, constructor?: any, options?: PlainToClassOptions): any {
	const cls = constructor || getClassByAlias(config[defaultAliasProperty]);
	// todo: if ClassConstructor is undefined -> run plainToClass
	for (const [property, value] of Object.entries(config)) {
		if (typeof value === 'object') {
			config[property] = _plainToClass(value);
		}
	}
	const instance = plainToClass(cls, config, {
		excludeExtraneousValues: false,
		...options,
	}) as any;
	delete instance[defaultAliasProperty];
	return instance;
}

export function convertClassToPlain(instance: any, options?: ClassToPlainOptions): Object {
	return _classToPlain(instance, {
		...DEFAULT_CLASS_TO_PLAIN_OPTIONS,
		...options,
	});
}

export function convertPlainToClass<T>(
	config: any,
	cls?: ClassConstructor<T>,
	options?: PlainToClassOptions
): T {
	return _plainToClass(config, cls, {
		...DEFAULT_PLAIN_TO_CLASS_OPTIONS,
		...options,
	});
}

export function Serializable(config: {alias: string}): any {
	return (constructor: Function) => {
		const classAlias = config.alias;
		if (classes.has(classAlias)) {
			throw new Error(`The '${classAlias}' is already registered.`);
		}
		classes.set(classAlias, constructor);
		aliases.set(constructor, classAlias);
	};
}
